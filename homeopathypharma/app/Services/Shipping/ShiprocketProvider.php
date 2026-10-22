<?php

namespace App\Services\Shipping;

use App\Models\Order;
use App\Models\Shipment;
use RuntimeException;

/**
 * Shiprocket adapter stub — activates only when credentials exist.
 * Does not invent tracking numbers.
 */
class ShiprocketProvider implements ShippingProvider
{
    public function name(): string
    {
        return 'shiprocket';
    }

    public function isConfigured(): bool
    {
        return filled(config('services.shiprocket.email'))
            && filled(config('services.shiprocket.password'));
    }

    public function createShipment(Order $order, Shipment $shipment): array
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Shiprocket is not configured.');
        }

        // Live API wiring belongs in a later ops pass with real credentials.
        throw new RuntimeException('Shiprocket API credentials are present but live shipment creation is not enabled in this build. Use manual fulfilment or complete the API integration.');
    }
}
