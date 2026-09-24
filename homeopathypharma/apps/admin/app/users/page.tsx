import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";
import { listUsers } from "@/lib/api";

export const metadata: Metadata = { title: "Users & roles" };

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>Users &amp; roles</h1>
          <table className="stub-table">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Roles</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ color: "var(--hp-color-text-muted)" }}>
                    Users from <code>GET /v1/admin/users</code>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.roles.join(", ")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <p className="role-note">Role assignment is enforced by the API — UI reflects permitted menu items only.</p>
        </div>
      </Container>
    </Section>
  );
}
