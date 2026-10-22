<?php

namespace App\Services\Shipping;

use App\Models\Order;
use App\Models\Shipment;

interface ShippingProvider
{
    public function name(): string;

    public function isConfigured(): bool;

    /** @return array{tracking_number:?string,courier:?string,provider_shipment_id:?string,status:string,meta?:array} */
    public function createShipment(Order $order, Shipment $shipment): array;
}
