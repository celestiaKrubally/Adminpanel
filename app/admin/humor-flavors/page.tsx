import { createDbClient } from "@/utils/supabase/server";

export default async function HumorFlavorsPage() {
  const supabase = await createDbClient();
  const { data: flavors } = await supabase
    .from("humor_flavors")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: steps } = await supabase
    .from("humor_flavor_steps")
    .select("*")
    .order("step_order", { ascending: true });

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Humor Flavors</h1><p className="page-subtitle">{flavors?.length ?? 0} flavors</p></div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "2rem" }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Description</th><th>Created</th></tr></thead>
          <tbody>
            {(flavors ?? []).map(f => (
              <tr key={f.id}>
                <td style={{ color: "var(--text)", fontWeight: 600 }}>{f.name ?? "—"}</td>
                <td style={{ maxWidth: 300 }}>{f.description ?? "—"}</td>
                <td>{f.created_at ? new Date(f.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!flavors || flavors.length === 0) && <div className="empty-state">No humor flavors found.</div>}
      </div>

      <div className="page-header">
        <div><h1 className="page-title">Humor Flavor Steps</h1><p className="page-subtitle">{steps?.length ?? 0} steps</p></div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Order</th><th>Flavor ID</th><th>Prompt</th><th>Created</th></tr></thead>
          <tbody>
            {(steps ?? []).map(s => (
              <tr key={s.id}>
                <td><span className="badge badge-purple">{s.step_order ?? s.order ?? "—"}</span></td>
                <td className="mono" style={{ fontSize: "0.75rem" }}>{s.humor_flavor_id ?? s.flavor_id ?? "—"}</td>
                <td style={{ maxWidth: 350 }}>{s.prompt ?? s.content ?? s.instruction ?? "—"}</td>
                <td>{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!steps || steps.length === 0) && <div className="empty-state">No humor flavor steps found.</div>}
      </div>
    </div>
  );
}