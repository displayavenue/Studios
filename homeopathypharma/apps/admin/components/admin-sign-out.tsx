"use client";

import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/api";

export function AdminSignOut() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        void (async () => {
          await logoutAdmin();
          router.push("/login");
          router.refresh();
        })();
      }}
      style={{
        background: "transparent",
        border: "none",
        color: "var(--hp-color-amber-400)",
        cursor: "pointer",
        font: "inherit",
        textDecoration: "underline",
        padding: 0,
      }}
    >
      Sign out
    </button>
  );
}
