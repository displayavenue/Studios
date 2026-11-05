"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ceo@displayavenue.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Login failed");
      const role = json.data.user.globalRole as string;
      if (role === "CLIENT_OWNER" || role === "CLIENT_USER") router.push("/portal");
      else router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form className="panel fade-up" onSubmit={onSubmit} style={{ width: "min(420px,100%)", padding: "1.5rem" }}>
        <div className="display" style={{ color: "var(--navy)", fontWeight: 700, marginBottom: ".25rem" }}>DisplayAvenue OS</div>
        <h1 style={{ marginTop: 0, fontSize: "1.4rem" }}>Sign in</h1>
        <label style={{ display: "grid", gap: ".35rem", marginBottom: ".75rem" }}>
          <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Email</span>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </label>
        <label style={{ display: "grid", gap: ".35rem", marginBottom: "1rem" }}>
          <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Password</span>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        <p style={{ marginTop: "1rem" }}><Link href="/">← Back</Link></p>
      </form>
    </main>
  );
}
