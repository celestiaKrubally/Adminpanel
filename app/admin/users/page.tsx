import { createClient } from "@/utils/supabase/server";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{users?.length ?? 0} total profiles</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>ID</th>
              <th>Superadmin</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id}>
                <td style={{ color: "var(--text)" }}>{u.email ?? "—"}</td>
                <td className="mono" style={{ fontSize: "0.75rem" }}>{u.id}</td>
                <td>
                  {u.is_superadmin
                    ? <span className="badge badge-yellow">yes</span>
                    : <span className="badge badge-red">no</span>}
                </td>
                <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <div className="empty-state">No users found.</div>
        )}
      </div>
    </div>
  );
}
