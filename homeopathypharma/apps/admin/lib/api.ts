/**
 * Admin command-center API stubs — RBAC enforced at API_URL/v1.
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

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
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

export type AdminRole = "super-admin" | "catalog-manager" | "support" | "medical-reviewer";

export interface AdminSession {
  email: string;
  roles: AdminRole[];
  mfaVerified: boolean;
}

export interface QueueItem {
  id: string;
  title: string;
  submittedAt: string;
  priority: "low" | "normal" | "high";
}

export interface DashboardMetrics {
  pendingVerifications: number;
  contentReviews: number;
  openOrders: number;
  flaggedReviews: number;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    return await adminFetch<AdminSession>("/admin/session");
  } catch {
    return null;
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    return await adminFetch<DashboardMetrics>("/admin/dashboard");
  } catch {
    return {
      pendingVerifications: 0,
      contentReviews: 0,
      openOrders: 0,
      flaggedReviews: 0,
    };
  }
}

export async function getQueue(queue: string): Promise<QueueItem[]> {
  try {
    return await adminFetch<QueueItem[]>(`/admin/queues/${encodeURIComponent(queue)}`);
  } catch {
    return [];
  }
}

export async function loginAdmin(
  email: string,
  password: string,
  mfaCode?: string,
): Promise<{ ok: boolean; mfaRequired?: boolean }> {
  try {
    await adminFetch("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, mfaCode }),
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError && err.status === 428) {
      return { ok: false, mfaRequired: true };
    }
    return { ok: false };
  }
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
}

export async function listAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    return await adminFetch<AuditLogEntry[]>("/admin/audit-logs");
  } catch {
    return [];
  }
}

export async function listUsers(): Promise<{ id: string; email: string; roles: AdminRole[] }[]> {
  try {
    return await adminFetch("/admin/users");
  } catch {
    return [];
  }
}
