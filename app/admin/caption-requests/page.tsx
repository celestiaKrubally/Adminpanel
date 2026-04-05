import { createDbClient } from "@/utils/supabase/server";
export default async function CaptionRequestsPage() {
  const supabase = await createDbClient();
  const { data } = await supabase.from("caption_requests").select("*").order("created_at", { ascending: false });
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">Caption Requests</h1><p className="page-subtitle">{data?.length ?? 0} total</p></div></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>ID</th><th>Image ID</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            {(data ?? []).map(r => (
              <tr key={r.id}>
                <td className="mono" style={{ fontSize: "0.75rem" }}>{r.id}</td>
                <td className="mono" style={{ fontSize: "0.75rem" }}>{r.image_id ?? "—"}</td>
                <td>{r.status ? <span className="badge badge-green">{r.status}</span> : "—"}</td>
                <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length === 0) && <div className="empty-state">No caption requests found.</div>}
      </div>
    </div>
  );
}
