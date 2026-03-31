import { createClient } from "@/utils/supabase/server";
export default async function CaptionsPage() {
  const supabase = await createClient();
  const { data: captions } = await supabase.from("captions").select("*").order("created_at", { ascending: false });
  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Captions</h1><p className="page-subtitle">{captions?.length ?? 0} total</p></div>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Text</th><th>Score</th><th>Image ID</th><th>User ID</th><th>Created</th></tr></thead>
          <tbody>
            {(captions ?? []).map(c => (
              <tr key={c.id}>
                <td style={{ color: "var(--text)", maxWidth: 300 }}>{c.text ?? c.content ?? "—"}</td>
                <td><span className="badge badge-purple">{c.score ?? 0}</span></td>
                <td className="mono" style={{ fontSize: "0.7rem" }}>{c.image_id ?? "—"}</td>
                <td className="mono" style={{ fontSize: "0.7rem" }}>{c.user_id ?? c.profile_id ?? "—"}</td>
                <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!captions || captions.length === 0) && <div className="empty-state">No captions found.</div>}
      </div>
    </div>
  );
}
