import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";
import { listPatients } from "@/lib/api";

export const metadata: Metadata = { title: "Patients" };

export default async function PatientsPage() {
  const patients = await listPatients();

  return (
    <Section>
      <Container>
        <h1 className="font-display" style={{ fontSize: "var(--hp-text-3xl)", marginBottom: "var(--hp-space-6)" }}>
          Patients
        </h1>
        <table className="stub-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Last visit</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ color: "var(--hp-color-text-muted)" }}>
                  Patient list from <code>GET /v1/doctor/patients</code>
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.lastVisit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Container>
    </Section>
  );
}
