"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@displayavenue.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Login failed");
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form className="panel" onSubmit={onSubmit} style={{ width: "min(420px, 100%)", padding: "1.5rem" }}>
        <h1 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Growth360 Admin</h1>
        <input className="option" style={{ marginBottom: "0.7rem", fontWeight: 500 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="option" style={{ marginBottom: "0.7rem", fontWeight: 500 }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        {error && <p style={{ color: "#b42318" }}>{error}</p>}
      </form>
    </main>
  );
}
