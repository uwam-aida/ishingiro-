<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DeliveryNoteService
{
    /**
     * Read public/logo.png once per request and return it as a base64 data
     * URI. DomPDF can't reliably resolve relative paths (and remote URLs are
     * disabled by default), so embedding the bytes directly is the only
     * approach that works regardless of server/path configuration.
     */
    private function getLogoBase64(): string
    {
        static $cached = null;

        if ($cached !== null) {
            return $cached;
        }

        $path = public_path('logo.png');

        if (!file_exists($path)) {
            return $cached = '';
        }

        $mime = mime_content_type($path) ?: 'image/png';
        $data = base64_encode(file_get_contents($path));

        return $cached = "data:{$mime};base64,{$data}";
    }

    /**
     * Generate a PDF delivery note and return the raw PDF bytes.
     *
     * @param  Collection  $orders      — Order models with items.product eager-loaded
     * @param  Collection  $cakeOrders  — CakeOrder models
     * @param  string      $recipient   — Printed as "CUSTOM NAME" on the note
     * @param  Carbon      $deliveredAt — Date/time printed on the note
     * @return string  Raw PDF content
     */
    public function generate(
        Collection $orders,
        Collection $cakeOrders,
        string $recipient,
        Carbon $deliveredAt,
    ): string {
        // Flatten everything into a single line-item list
        $items = collect();

        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $items->push([
                    'name'       => optional($item->product)->name ?? 'Unknown',
                    'qty'        => $item->quantity,
                    'unit_price' => $item->price,
                    'total'      => $item->quantity * $item->price,
                ]);
            }
        }

        foreach ($cakeOrders as $cake) {
            $items->push([
                'name'       => $cake->cake_type . ' — ' . $cake->customer_name,
                'qty'        => $cake->quantity,
                'unit_price' => $cake->price,
                'total'      => $cake->quantity * $cake->price,
            ]);
        }

        $pdf = Pdf::loadView('pdf.delivery-note', [
            'recipient'   => strtoupper($recipient),
            'date'        => $deliveredAt->format('n/j/Y'),
            'time'        => $deliveredAt->format('g:i A'),
            'items'       => $items,
            'grand_total' => $items->sum('total'),
            'logo'        => $this->getLogoBase64(),
        ])->setPaper('a5', 'portrait');

        return $pdf->output();
    }

    /**
     * Generate PDF from stored items array (for regenerating existing notes)
     *
     * @param  Collection  $items       — Array of items with name, qty, unit_price, total
     * @param  string      $recipient   — Printed as "CUSTOM NAME" on the note
     * @param  Carbon      $deliveredAt — Date/time printed on the note
     * @return string  Raw PDF content
     */
    public function generateFromArray(
    Collection $items,
    string $recipient,
    Carbon $deliveredAt,
    ): string {
        // Transform items to have consistent keys
        $transformedItems = $items->map(function ($item) {
            return [
                'name'       => $item['product_name'] ?? $item['name'] ?? 'Unknown',
                'qty'        => $item['quantity'] ?? $item['qty'] ?? 0,
                'unit_price' => $item['unit_price'] ?? 0,
                'total'      => $item['total'] ?? 0,
            ];
        });
        
        $pdf = Pdf::loadView('pdf.delivery-note', [
            'recipient'   => strtoupper($recipient),
            'date'        => $deliveredAt->format('n/j/Y'),
            'time'        => $deliveredAt->format('g:i A'),
            'items'       => $transformedItems,
            'grand_total' => $transformedItems->sum('total'),
            'logo'        => $this->getLogoBase64(),
        ])->setPaper('a5', 'portrait');

        return $pdf->output();
    }
}