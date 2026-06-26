<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DeliveryNoteService
{
    public function generate(
        Collection $orders,
        Collection $cakeOrders,
        string $recipient,
        Carbon $deliveredAt,
    ): string {
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

    public function generateFromArray(
        Collection $items,
        string $recipient,
        Carbon $deliveredAt,
    ): string {
        $transformedItems = $items->map(function ($item) {
            return [
                'name'       => $item['product_name'] ?? $item['name'] ?? 'Unknown',
                'qty'        => $item['quantity'] ?? $item['qty'] ?? 0,
                'unit_price' => $item['unit_price'] ?? 0,
                'total'      => $item['total'] ?? 0,
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

    private function resolveImageForPdf(?string $url): ?string
    {
        if (!$url) {
            return null;
        }
        if (str_starts_with($url, 'data:')) {
            return $url;
        }
        try {
            $path      = parse_url($url, PHP_URL_PATH);
            $relative  = $path ? preg_replace('#^/storage/#', '', $path) : null;
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
            public_path('logo.png'),
            public_path('logo.jpg'),
            public_path('logo.jpeg'),
            public_path('images/logo.png'),
            public_path('images/logo.jpg'),
            public_path('images/logo.jpeg'),
            storage_path('app/public/logo.png'),
            storage_path('app/public/logo.jpg'),
            storage_path('app/public/logo.jpeg'),
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