"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
type Row = { id: string; name?: string; model_id?: string; provider_id?: string; created_at?: string; [k: string]: unknown };
export default function LlmModelsClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ name: "", model_id: "", provider_id: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const openCreate = () => { setEditing(null); setForm({ name: "", model_id: "", provider_id: "" }); setShowModal(true); };
  const openEdit = (r: Row) => { setEditing(r); setForm({ name: r.name ?? "", model_id: r.model_id ?? "", provider_id: r.provider_id ?? "" }); setShowModal(true); };
  const handleSave = async () => {
    setLoading(true);
    const payload = { name: form.name, model_id: form.model_id, provider_id: form.provider_id || null };
    if (editing) {
      const { data } = await supabase.from("llm_models").update(payload).eq("id", editing.id).select().single();
      if (data) setRows(rows.map(r => r.id === editing.id ? data : r));
    } else {
      const { data } = await supabase.from("llm_models").insert(payload).select().single();
      if (data) setRows([data, ...rows]);
    }
    setLoading(false); setShowModal(false);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("llm_models").delete().eq("id", id);
    setRows(rows.filter(r => r.id !== id));
  };
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">LLM Models</h1><p className="page-subtitle">{rows.length} total</p></div><button className="btn btn-primary" onClick={openCreate}>+ Add Model</button></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Model ID</th><th>Provider</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.id}>
              <td style={{ color: "var(--text)", fontWeight: 600 }}>{r.name ?? "—"}</td>
              <td className="mono" style={{ fontSize: "0.75rem" }}>{r.model_id ?? "—"}</td>
              <td className="mono" style={{ fontSize: "0.75rem" }}>{r.provider_id ?? "—"}</td>
              <td>{r.created_at ? new Date(r.created_at as string).toLocaleDateString() : "—"}</td>
              <td><div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => openEdit(r)}>Edit</button>
                <button className="btn btn-danger" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => handleDelete(r.id)}>Delete</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {rows.length === 0 && <div className="empty-state">No models found.</div>}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>{editing ? "Edit Model" : "Add Model"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Name *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Claude 3.5 Sonnet" /></div>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Model ID</label><input className="input" value={form.model_id} onChange={e => setForm({ ...form, model_id: e.target.value })} placeholder="e.g. claude-3-5-sonnet-20241022" /></div>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Provider ID</label><input className="input" value={form.provider_id} onChange={e => setForm({ ...form, provider_id: e.target.value })} /></div>
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
