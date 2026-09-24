/**
 * Doctor portal API stubs — role: doctor only. Auth enforced server-side at API_URL/v1.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:4000";
export const API_V1 = `${API_BASE.replace(/\/$/, "")}/v1`;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function doctorFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_V1}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError(`API ${res.status}`, res.status);
  return res.json() as Promise<T>;
}

export interface DoctorSession {
  id: string;
  name: string;
  verified: boolean;
}

export interface ScheduleBlock {
  id: string;
  time: string;
  patientName: string;
  type: "video" | "chat" | "follow-up";
  status: "scheduled" | "in-progress" | "completed";
}

export interface DashboardData {
  todaySchedule: ScheduleBlock[];
  upcomingConsults: ScheduleBlock[];
  verificationStatus: "verified" | "pending" | "action-required";
}

export interface PatientSummary {
  id: string;
  name: string;
  lastVisit: string;
}

export interface EarningsSummary {
  period: string;
  total: string;
  pending: string;
}

export async function getSession(): Promise<DoctorSession | null> {
  try {
    return await doctorFetch<DoctorSession>("/doctor/session");
  } catch {
    return null;
  }
}

export async function getDashboard(): Promise<DashboardData> {
  try {
    return await doctorFetch<DashboardData>("/doctor/dashboard");
  } catch {
    return {
      todaySchedule: [],
      upcomingConsults: [],
      verificationStatus: "pending",
    };
  }
}

export async function listPatients(): Promise<PatientSummary[]> {
  try {
    return await doctorFetch<PatientSummary[]>("/doctor/patients");
  } catch {
    return [];
  }
}

export async function getEarnings(): Promise<EarningsSummary> {
  try {
    return await doctorFetch<EarningsSummary>("/doctor/earnings");
  } catch {
    return { period: "This month", total: "—", pending: "—" };
  }
}

export interface VerificationDocument {
  id: string;
  label: string;
  status: "uploaded" | "missing" | "under-review";
}

export async function listVerificationDocuments(): Promise<VerificationDocument[]> {
  try {
    return await doctorFetch<VerificationDocument[]>("/doctor/documents");
  } catch {
    return [
      { id: "license", label: "Medical license", status: "missing" },
      { id: "registration", label: "Homeopathy registration", status: "missing" },
    ];
  }
}

export async function loginDoctor(email: string, password: string): Promise<{ ok: boolean }> {
  try {
    await doctorFetch("/doctor/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
