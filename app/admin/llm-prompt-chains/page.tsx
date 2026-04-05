import { createDbClient } from "@/utils/supabase/server";

export default async function LlmPromptChainsPage() {
  const supabase = await createDbClient();
  const { data } = await supabase
    .from("llm_prompt_chains")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">LLM Prompt Chains</h1><p className="page-subtitle">{data?.length ?? 0} chains</p></div>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Description</th><th>Steps</th><th>Created</th></tr></thead>
          <tbody>
            {(data ?? []).map(c => (
              <tr key={c.id}>
                <td style={{ color: "var(--text)", fontWeight: 600 }}>{c.name ?? "—"}</td>
                <td style={{ maxWidth: 300 }}>{c.description ?? "—"}</td>
                <td><span className="badge badge-cyan">{c.steps ?? c.step_count ?? "—"}</span></td>
                <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length === 0) && <div className="empty-state">No prompt chains found.</div>}
      </div>
    </div>
  );
}