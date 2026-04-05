import { createClient } from "@/utils/supabase/server";
import { createDbClient } from "@/utils/supabase/server";

export default async function AdminDashboard() {
  const supabase = createDbClient();

  const [
    { count: userCount },
    { count: imageCount },
    { count: captionCount },
    { count: captionRequestCount },
    { count: termCount },
    { count: llmResponseCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase.from("caption_requests").select("*", { count: "exact", head: true }),
    supabase.from("terms").select("*", { count: "exact", head: true }),
    supabase.from("llm_responses").select("*", { count: "exact", head: true }),
  ]);

  const { data: topCaptions } = await supabase
    .from("captions")
    .select("id, text, score")
    .order("score", { ascending: false })
    .limit(5);

  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("id, email, created_at, is_superadmin")
    .order("created_at", { ascending: false })
    .limit(5);

  const statCards = [
    { label: "Total Users", value: userCount ?? 0, color: "", icon: "◉" },
    { label: "Images", value: imageCount ?? 0, color: "green", icon: "⬡" },
    { label: "Captions", value: captionCount ?? 0, color: "yellow", icon: "◫" },
    { label: "Caption Requests", value: captionRequestCount ?? 0, color: "cyan", icon: "◌" },
    { label: "Terms", value: termCount ?? 0, color: "red", icon: "◷" },
    { label: "LLM Responses", value: llmResponseCount ?? 0, color: "", icon: "◈" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">caption rating app · admin overview</p>
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text3)", fontFamily: "Space Mono, monospace" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {statCards.map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{s.value.toLocaleString()}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: "0.4rem", fontFamily: "Space Mono, monospace" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "1rem" }}>Top Rated Captions</h2>
          {(topCaptions ?? []).length === 0 ? (
            <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>No captions yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(topCaptions ?? []).map((c, i) => (
                <div key={c.id} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.7rem", color: "var(--text3)", paddingTop: "2px", minWidth: "20px" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text2)", flex: 1, lineHeight: 1.5 }}>{c.text ?? "—"}</span>
                  <span className="badge badge-purple">{c.score ?? 0}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "1rem" }}>Recent Users</h2>
          {(recentUsers ?? []).length === 0 ? (
            <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>No users yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(recentUsers ?? []).map((u) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text)" }}>{u.email ?? "—"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text3)", fontFamily: "Space Mono, monospace" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</div>
                  </div>
                  {u.is_superadmin && <span className="badge badge-yellow">admin</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}