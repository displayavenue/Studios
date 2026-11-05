import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";

type AvailabilityConfig = {
  timezone: string;
  days: number[]; // 1=Mon .. 7=Sun (ISO)
  startHour: number;
  endHour: number;
  slotMinutes: number;
};

const DEFAULT_AVAILABILITY: AvailabilityConfig = {
  timezone: "Asia/Kolkata",
  days: [1, 2, 3, 4, 5],
  startHour: 10,
  endHour: 18,
  slotMinutes: 30,
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const daysAhead = Math.min(Number(url.searchParams.get("days") || 14), 60);
    const fromParam = url.searchParams.get("from");

    const setting = await prisma.setting.findUnique({ where: { key: "booking_availability" } });
    const cfg: AvailabilityConfig = {
      ...DEFAULT_AVAILABILITY,
      ...(setting?.value && typeof setting.value === "object"
        ? (setting.value as Partial<AvailabilityConfig>)
        : {}),
    };

    const start = fromParam ? new Date(fromParam) : new Date();
    // Normalize to start of day in a simple UTC-offset-aware way for IST (+05:30)
    const slots: { start: string; end: string; timezone: string }[] = [];

    const booked = await prisma.booking.findMany({
      where: {
        status: { in: ["scheduled", "confirmed"] },
        slotStart: {
          gte: start,
          lte: new Date(start.getTime() + daysAhead * 86400_000),
        },
      },
      select: { slotStart: true, slotEnd: true },
    });

    for (let d = 0; d < daysAhead; d++) {
      const day = new Date(start.getTime() + d * 86400_000);
      const isoDow = ((day.getUTCDay() + 6) % 7) + 1; // Mon=1
      // Prefer IST weekday: approximate by UTC+5:30
      const ist = new Date(day.getTime() + (5 * 60 + 30) * 60_000);
      const istDow = ((ist.getUTCDay() + 6) % 7) + 1;
      if (!cfg.days.includes(istDow) && !cfg.days.includes(isoDow)) continue;

      const y = ist.getUTCFullYear();
      const m = ist.getUTCMonth();
      const dd = ist.getUTCDate();

      for (let hour = cfg.startHour; hour < cfg.endHour; hour++) {
        for (let min = 0; min < 60; min += cfg.slotMinutes) {
          if (hour === cfg.endHour - 1 && min + cfg.slotMinutes > 60) continue;
          // Build IST local wall time as UTC then subtract offset
          const slotStartUtc = Date.UTC(y, m, dd, hour, min, 0) - (5 * 60 + 30) * 60_000;
          const slotEndUtc = slotStartUtc + cfg.slotMinutes * 60_000;
          if (slotStartUtc < Date.now()) continue;

          const overlaps = booked.some((b) => {
            const bs = b.slotStart.getTime();
            const be = b.slotEnd.getTime();
            return slotStartUtc < be && slotEndUtc > bs;
          });
          if (overlaps) continue;

          slots.push({
            start: new Date(slotStartUtc).toISOString(),
            end: new Date(slotEndUtc).toISOString(),
            timezone: cfg.timezone,
          });
        }
      }
    }

    return jsonOk({
      availability: cfg,
      slots,
      count: slots.length,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
