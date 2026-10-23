<?php

namespace App\Services\Shipping;

use App\Models\Order;
use App\Models\Shipment;

/**
 * Manual fulfilment mode when Shiprocket (or another provider) is not configured.
 */
class ManualShippingProvider implements ShippingProvider
{
    public function name(): string
    {
        return 'manual';
    }

    public function isConfigured(): bool
    {
        return true;
    }

    public function createShipment(Order $order, Shipment $shipment): array
    {
        return [
            'tracking_number' => null,
            'courier' => null,
            'provider_shipment_id' => null,
            'status' => 'pending',
            'meta' => [
                'notice' => 'Manual fulfilment mode. Tracking will be added when a courier is assigned.',
            ],
        ];
    }
}
