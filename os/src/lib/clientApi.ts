export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number; notReady?: boolean };

/** Client fetch for `{ ok, data }` APIs. Treats HTTP 404 as "Module API not ready". */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, init);
    if (res.status === 404) {
      return { ok: false, error: "Module API not ready", status: 404, notReady: true };
    }
    const json = (await res.json().catch(() => null)) as
      | { ok?: boolean; data?: T; error?: string }
      | null;
    if (!json || typeof json !== "object") {
      return { ok: false, error: "Invalid response", status: res.status };
    }
    if (!json.ok) {
      return {
        ok: false,
        error: json.error || "Request failed",
        status: res.status,
        notReady: res.status === 404,
      };
    }
    return { ok: true, data: json.data as T, status: res.status };
  } catch {
    return { ok: false, error: "Network error", status: 0 };
  }
}

export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
