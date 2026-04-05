import { createDbClient } from "@/utils/supabase/server";
export default async function LlmResponsesPage() {
  const supabase = await createDbClient();
  const { data } = await supabase.from("llm_responses").select("*").order("created_at", { ascending: false }).limit(100);
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">LLM Responses</h1><p className="page-subtitle">{data?.length ?? 0} recent responses</p></div></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Model</th><th>Response (preview)</th><th>Tokens</th><th>Created</th></tr></thead>
          <tbody>
            {(data ?? []).map(r => (
              <tr key={r.id}>
                <td><span className="badge badge-purple">{r.model ?? r.llm_model ?? "—"}</span></td>
                <td style={{ maxWidth: 350, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.response ?? r.content ?? r.output ?? "—"}</td>
                <td className="mono" style={{ fontSize: "0.75rem" }}>{r.tokens ?? r.total_tokens ?? "—"}</td>
                <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length === 0) && <div className="empty-state">No LLM responses found.</div>}
      </div>
    </div>
  );
}
