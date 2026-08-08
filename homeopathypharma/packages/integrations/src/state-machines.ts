/**
 * Payment and shipment state machines — SERVER-SIDE ONLY.
 * Enforce transitions in the API service; do not expose transition helpers to clients.
 */

export enum PaymentStatus {
  PENDING = "PENDING",
  AUTHORIZED = "AUTHORIZED",
  CAPTURED = "CAPTURED",
  FAILED = "FAILED",
  REFUND_PENDING = "REFUND_PENDING",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum ShipmentStatus {
  NOT_CREATED = "NOT_CREATED",
  PENDING_PICKUP = "PENDING_PICKUP",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  RTO_INITIATED = "RTO_INITIATED",
  RTO_DELIVERED = "RTO_DELIVERED",
  CANCELLED = "CANCELLED",
  LOST = "LOST",
}

const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  [PaymentStatus.PENDING]: [PaymentStatus.AUTHORIZED, PaymentStatus.FAILED, PaymentStatus.CANCELLED],
  [PaymentStatus.AUTHORIZED]: [PaymentStatus.CAPTURED, PaymentStatus.FAILED, PaymentStatus.CANCELLED],
  [PaymentStatus.CAPTURED]: [PaymentStatus.REFUND_PENDING, PaymentStatus.PARTIALLY_REFUNDED],
  [PaymentStatus.FAILED]: [],
  [PaymentStatus.REFUND_PENDING]: [PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED],
  [PaymentStatus.REFUNDED]: [],
  [PaymentStatus.PARTIALLY_REFUNDED]: [PaymentStatus.REFUND_PENDING, PaymentStatus.REFUNDED],
  [PaymentStatus.CANCELLED]: [],
};

const SHIPMENT_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  [ShipmentStatus.NOT_CREATED]: [ShipmentStatus.PENDING_PICKUP, ShipmentStatus.CANCELLED],
  [ShipmentStatus.PENDING_PICKUP]: [ShipmentStatus.PICKED_UP, ShipmentStatus.CANCELLED],
  [ShipmentStatus.PICKED_UP]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.CANCELLED],
  [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.RTO_INITIATED, ShipmentStatus.LOST],
  [ShipmentStatus.OUT_FOR_DELIVERY]: [ShipmentStatus.DELIVERED, ShipmentStatus.RTO_INITIATED],
  [ShipmentStatus.DELIVERED]: [],
  [ShipmentStatus.RTO_INITIATED]: [ShipmentStatus.RTO_DELIVERED],
  [ShipmentStatus.RTO_DELIVERED]: [],
  [ShipmentStatus.CANCELLED]: [],
  [ShipmentStatus.LOST]: [],
};

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  return PAYMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionShipment(from: ShipmentStatus, to: ShipmentStatus): boolean {
  return SHIPMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export class InvalidStateTransitionError extends Error {
  constructor(
    public readonly domain: "payment" | "shipment",
    public readonly from: string,
    public readonly to: string,
  ) {
    super(`Invalid ${domain} transition: ${from} → ${to}`);
    this.name = "InvalidStateTransitionError";
  }
}

export function assertPaymentTransition(from: PaymentStatus, to: PaymentStatus): void {
  if (!canTransitionPayment(from, to)) {
    throw new InvalidStateTransitionError("payment", from, to);
  }
}

export function assertShipmentTransition(from: ShipmentStatus, to: ShipmentStatus): void {
  if (!canTransitionShipment(from, to)) {
    throw new InvalidStateTransitionError("shipment", from, to);
  }
}
