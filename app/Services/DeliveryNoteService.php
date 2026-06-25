<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DeliveryNoteService
{
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
                // FIX: Carry the cake's sample image through to the PDF.
                'image'      => $this->resolveImageForPdf($cake->inspo_image_url),
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
                // FIX: Pick up the stored image (saved on the delivery
                // note's items JSON at creation time) and resolve it to a
                // PDF-safe base64 data URI.
                'image'      => $this->resolveImageForPdf($item['image'] ?? null),
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

    /**
     * FIX: the template's image src was a relative path, which DomPDF can't
     * always resolve (it has no "current page" to resolve relative to, unlike
     * a browser) — that's what was rendering as a broken/grey placeholder.
     * Embedding the logo as a base64 data URI sidesteps path resolution
     * entirely and is the most reliable option for DomPDF.
     *
     * Drop your logo file at public/images/logo.png (or storage/app/public/logo.png)
     * and it will be picked up automatically. Falls back to no logo (the
     * template's placeholder circle) if neither file exists yet.
     */
    private function resolveImageForPdf(?string $url): ?string
    {
        if (!$url) {
            return null;
        }
        if (str_starts_with($url, 'data:')) {
            return $url;
        }
        try {
            $path = parse_url($url, PHP_URL_PATH);
            $relative = $path ? preg_replace('#^/storage/#', '', $path) : null;
            $localPath = $relative ? storage_path('app/public/' . $relative) : null;
            if ($localPath && is_file($localPath)) {
                $extension = pathinfo($localPath, PATHINFO_EXTENSION) ?: 'png';
                return 'data:image/' . $extension . ';base64,' . base64_encode(file_get_contents($localPath));
            }
            $contents = @file_get_contents($url);
            if ($contents !== false) {
                $extension = pathinfo($path ?? '', PATHINFO_EXTENSION) ?: 'png';
                return 'data:image/' . $extension . ';base64,' . base64_encode($contents);
            }
        } catch (\Exception $e) {
            return null;
        }
        return null;
    }

    private function getLogoBase64(): ?string
    {
        $candidates = [
            public_path('images/logo.png'),
            storage_path('app/public/logo.png'),
        ];

        foreach ($candidates as $path) {
            if (is_file($path)) {
                $extension = pathinfo($path, PATHINFO_EXTENSION) ?: 'png';
                return 'data:image/' . $extension . ';base64,' . base64_encode(file_get_contents($path));
            }
        }

        return null;
    }
}