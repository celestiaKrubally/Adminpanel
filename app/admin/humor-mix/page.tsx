import { createClient } from "@/utils/supabase/server";
export default async function HumorMixPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("humor_mix").select("*").order("created_at", { ascending: false });
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">Humor Mix</h1><p className="page-subtitle">{data?.length ?? 0} entries</p></div></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>ID</th><th>Flavor</th><th>Weight</th><th>Updated</th></tr></thead>
          <tbody>
            {(data ?? []).map(m => (
              <tr key={m.id}>
                <td className="mono" style={{ fontSize: "0.75rem" }}>{m.id}</td>
                <td style={{ color: "var(--text)" }}>{m.humor_flavor ?? m.flavor ?? "—"}</td>
                <td><span className="badge badge-cyan">{m.weight ?? m.value ?? "—"}</span></td>
                <td>{m.updated_at ? new Date(m.updated_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length === 0) && <div className="empty-state">No humor mix data found.</div>}
      </div>
    </div>
  );
}
