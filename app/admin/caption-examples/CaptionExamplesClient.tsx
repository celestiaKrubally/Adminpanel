"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
type Row = { id: string; text?: string; image_id?: string; is_good?: boolean; created_at?: string; [k: string]: unknown };
export default function CaptionExamplesClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ text: "", image_id: "", is_good: "true" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const openCreate = () => { setEditing(null); setForm({ text: "", image_id: "", is_good: "true" }); setShowModal(true); };
  const openEdit = (r: Row) => { setEditing(r); setForm({ text: r.text ?? "", image_id: r.image_id ?? "", is_good: String(r.is_good ?? true) }); setShowModal(true); };
  const handleSave = async () => {
    setLoading(true);
    const payload = { text: form.text, image_id: form.image_id || null, is_good: form.is_good === "true" };
    if (editing) {
      const { data } = await supabase.from("caption_examples").update(payload).eq("id", editing.id).select().single();
      if (data) setRows(rows.map(r => r.id === editing.id ? data : r));
    } else {
      const { data } = await supabase.from("caption_examples").insert(payload).select().single();
      if (data) setRows([data, ...rows]);
    }
    setLoading(false); setShowModal(false);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("caption_examples").delete().eq("id", id);
    setRows(rows.filter(r => r.id !== id));
  };
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">Caption Examples</h1><p className="page-subtitle">{rows.length} total</p></div><button className="btn btn-primary" onClick={openCreate}>+ Add Example</button></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Text</th><th>Good?</th><th>Image ID</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.id}>
              <td style={{ color: "var(--text)", maxWidth: 300 }}>{r.text ?? "—"}</td>
              <td>{r.is_good ? <span className="badge badge-green">good</span> : <span className="badge badge-red">bad</span>}</td>
              <td className="mono" style={{ fontSize: "0.75rem" }}>{r.image_id ?? "—"}</td>
              <td>{r.created_at ? new Date(r.created_at as string).toLocaleDateString() : "—"}</td>
              <td><div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => openEdit(r)}>Edit</button>
                <button className="btn btn-danger" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => handleDelete(r.id)}>Delete</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {rows.length === 0 && <div className="empty-state">No caption examples found.</div>}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>{editing ? "Edit Example" : "Add Example"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Text *</label><textarea className="input" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} /></div>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Image ID</label><input className="input" value={form.image_id} onChange={e => setForm({ ...form, image_id: e.target.value })} /></div>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Quality</label>
                <select className="input" value={form.is_good} onChange={e => setForm({ ...form, is_good: e.target.value })}>
                  <option value="true">Good example</option><option value="false">Bad example</option>
                </select></div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading || !form.text}>{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
