import { createClient } from "@/utils/supabase/server";
export default async function HumorFlavorsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("humor_flavors").select("*").order("created_at", { ascending: false });
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">Humor Flavors</h1><p className="page-subtitle">{data?.length ?? 0} total</p></div></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Description</th><th>Created</th></tr></thead>
          <tbody>
            {(data ?? []).map(f => (
              <tr key={f.id}>
                <td style={{ color: "var(--text)", fontWeight: 600 }}>{f.name ?? "—"}</td>
                <td style={{ maxWidth: 300 }}>{f.description ?? "—"}</td>
                <td>{f.created_at ? new Date(f.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length === 0) && <div className="empty-state">No humor flavors found.</div>}
      </div>
    </div>
  );
}
