import { z } from "zod";

export const appointmentBookingSchema = z.object({
  doctorId: z.string().uuid(),
  slotId: z.string().uuid(),
  consultationType: z.enum(["video", "audio", "chat", "in_clinic"]),
  /** Patient or pet profile id — validated against ownership server-side. */
  patientProfileId: z.string().uuid(),
  chiefComplaint: z.string().trim().min(10).max(2000),
  symptoms: z.array(z.string().trim().max(120)).max(20).optional(),
  preferredLanguage: z.string().min(2).max(10).optional(),
  timezone: z.string().min(1).max(64),
  /** Pet consultation flag — gated by FEATURE_PET_CONSULTATIONS. */
  isPetConsultation: z.boolean().default(false),
  consentTelemedicine: z.literal(true, {
    errorMap: () => ({ message: "Telemedicine consent is required" }),
  }),
});

export type AppointmentBookingInput = z.infer<typeof appointmentBookingSchema>;

export const appointmentRescheduleSchema = z.object({
  appointmentId: z.string().uuid(),
  newSlotId: z.string().uuid(),
  reason: z.string().trim().max(500).optional(),
});

export type AppointmentRescheduleInput = z.infer<typeof appointmentRescheduleSchema>;

export const appointmentCancelSchema = z.object({
  appointmentId: z.string().uuid(),
  reason: z.string().trim().min(3).max(500),
});

export type AppointmentCancelInput = z.infer<typeof appointmentCancelSchema>;

export const doctorAvailabilityQuerySchema = z.object({
  doctorId: z.string().uuid(),
  from: z.string().datetime({ offset: true }),
  to: z.string().datetime({ offset: true }),
  consultationType: z.enum(["video", "audio", "chat", "in_clinic"]).optional(),
});

export type DoctorAvailabilityQuery = z.infer<typeof doctorAvailabilityQuerySchema>;
