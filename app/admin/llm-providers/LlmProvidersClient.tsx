"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
type Row = { id: string; name?: string; api_base_url?: string; created_at?: string; [k: string]: unknown };
export default function LlmProvidersClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ name: "", api_base_url: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const openCreate = () => { setEditing(null); setForm({ name: "", api_base_url: "" }); setShowModal(true); };
  const openEdit = (r: Row) => { setEditing(r); setForm({ name: r.name ?? "", api_base_url: r.api_base_url ?? "" }); setShowModal(true); };
  const handleSave = async () => {
    setLoading(true);
    if (editing) {
      const { data } = await supabase.from("llm_providers").update(form).eq("id", editing.id).select().single();
      if (data) setRows(rows.map(r => r.id === editing.id ? data : r));
    } else {
      const { data } = await supabase.from("llm_providers").insert(form).select().single();
      if (data) setRows([data, ...rows]);
    }
    setLoading(false); setShowModal(false);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("llm_providers").delete().eq("id", id);
    setRows(rows.filter(r => r.id !== id));
  };
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">LLM Providers</h1><p className="page-subtitle">{rows.length} total</p></div><button className="btn btn-primary" onClick={openCreate}>+ Add Provider</button></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>API Base URL</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.id}>
              <td style={{ color: "var(--text)", fontWeight: 600 }}>{r.name ?? "—"}</td>
              <td className="mono" style={{ fontSize: "0.75rem" }}>{r.api_base_url ?? "—"}</td>
              <td>{r.created_at ? new Date(r.created_at as string).toLocaleDateString() : "—"}</td>
              <td><div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => openEdit(r)}>Edit</button>
                <button className="btn btn-danger" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => handleDelete(r.id)}>Delete</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {rows.length === 0 && <div className="empty-state">No providers found.</div>}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>{editing ? "Edit Provider" : "Add Provider"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Name *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Anthropic" /></div>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>API Base URL</label><input className="input" value={form.api_base_url} onChange={e => setForm({ ...form, api_base_url: e.target.value })} placeholder="https://api.anthropic.com" /></div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading || !form.name}>{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
