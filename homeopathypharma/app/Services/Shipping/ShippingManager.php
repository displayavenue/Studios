<?php

namespace App\Services\Shipping;

use App\Models\Order;
use App\Models\Shipment;
use App\Services\AuditLogger;

class ShippingManager
{
    public function __construct(
        private ShiprocketProvider $shiprocket,
        private ManualShippingProvider $manual,
        private AuditLogger $audit,
    ) {}

    public function provider(): ShippingProvider
    {
        return $this->shiprocket->isConfigured() ? $this->shiprocket : $this->manual;
    }

    public function createForOrder(Order $order): Shipment
    {
        $provider = $this->provider();
        $shipment = Shipment::query()->create([
            'order_id' => $order->id,
            'provider' => $provider->name(),
            'status' => 'pending',
            'shipping_paise' => $order->shipping_paise,
        ]);

        $result = $provider->createShipment($order, $shipment);
        $shipment->update([
            'provider_shipment_id' => $result['provider_shipment_id'] ?? null,
            'tracking_number' => $result['tracking_number'] ?? null,
            'courier' => $result['courier'] ?? null,
            'status' => $result['status'] ?? 'pending',
            'meta' => $result['meta'] ?? [],
        ]);

        $this->audit->log('shipment.created', $shipment, [
            'order_id' => $order->id,
            'provider' => $provider->name(),
        ]);

        return $shipment->fresh();
    }
}
