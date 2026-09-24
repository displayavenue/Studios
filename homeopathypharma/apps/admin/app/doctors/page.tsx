"use client";

import { useEffect, useState } from "react";
import { Container, Section, Button } from "@homeopathypharma/ui";

type DoctorRow = {
  id: string;
  fullName: string;
  locality: string;
  city: string;
  consultationFeeInr: number;
  acceptingPatients: boolean;
  verificationStatus: "LISTED" | "VERIFIED";
  specialties: string[];
};

export default function DoctorsAdminPage() {
  const [items, setItems] = useState<DoctorRow[]>([]);
  const [status, setStatus] = useState("Loading doctors…");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/cms/doctors");
    const data = (await res.json()) as { items: DoctorRow[] };
    setItems(data.items ?? []);
    setStatus(`${data.items?.length ?? 0} listed doctors`);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(doctor: DoctorRow, patch: Record<string, unknown>) {
    setSavingId(doctor.id);
    await fetch("/api/cms/doctors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: doctor.id, patch }),
    });
    await load();
    setSavingId(null);
  }

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>
            Doctor directory
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>{status}</p>
          <p style={{ color: "var(--hp-color-text-muted)", fontSize: "0.9rem" }}>
            Fee, acceptance, and verification status write to <code>data/cms/doctor-overrides.json</code>. Only mark
            VERIFIED after credential review.
          </p>

          <div style={{ overflowX: "auto", marginTop: "1.25rem" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Fee (₹)</th>
                  <th>Accepting</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong>{d.fullName}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--hp-color-text-muted)" }}>
                        {d.locality}, {d.city} · {d.specialties.slice(0, 2).join(", ")}
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        defaultValue={d.consultationFeeInr}
                        className="admin-input"
                        id={`fee-${d.id}`}
                      />
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked={d.acceptingPatients} id={`acc-${d.id}`} />
                    </td>
                    <td>
                      <select defaultValue={d.verificationStatus} className="admin-input" id={`ver-${d.id}`}>
                        <option value="LISTED">LISTED</option>
                        <option value="VERIFIED">VERIFIED</option>
                      </select>
                    </td>
                    <td>
                      <Button
                        variant="accent"
                        size="sm"
                        disabled={savingId === d.id}
                        onClick={() => {
                          const consultationFeeInr = Number(
                            (document.getElementById(`fee-${d.id}`) as HTMLInputElement).value,
                          );
                          const acceptingPatients = (document.getElementById(`acc-${d.id}`) as HTMLInputElement)
                            .checked;
                          const verificationStatus = (document.getElementById(`ver-${d.id}`) as HTMLSelectElement)
                            .value;
                          void save(d, { consultationFeeInr, acceptingPatients, verificationStatus });
                        }}
                      >
                        {savingId === d.id ? "Saving…" : "Save"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Section>
  );
}
