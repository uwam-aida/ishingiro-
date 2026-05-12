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
            ]);
        }

        $pdf = Pdf::loadView('pdf.delivery-note', [
            'recipient'   => strtoupper($recipient),
            'date'        => $deliveredAt->format('n/j/Y'),
            'time'        => $deliveredAt->format('g:i A'),
            'items'       => $items,
            'grand_total' => $items->sum('total'),
        ])->setPaper('a5', 'portrait');

        return $pdf->output();
    }
}