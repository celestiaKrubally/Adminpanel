"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
type Row = { id: string; email?: string; created_at?: string; [k: string]: unknown };
export default function WhitelistedEmailsClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const openCreate = () => { setEditing(null); setForm({ email: "" }); setShowModal(true); };
  const openEdit = (r: Row) => { setEditing(r); setForm({ email: r.email ?? "" }); setShowModal(true); };
  const handleSave = async () => {
    setLoading(true);
    if (editing) {
      const { data } = await supabase.from("whitelisted_emails").update(form).eq("id", editing.id).select().single();
      if (data) setRows(rows.map(r => r.id === editing.id ? data : r));
    } else {
      const { data } = await supabase.from("whitelisted_emails").insert(form).select().single();
      if (data) setRows([data, ...rows]);
    }
    setLoading(false); setShowModal(false);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this email?")) return;
    await supabase.from("whitelisted_emails").delete().eq("id", id);
    setRows(rows.filter(r => r.id !== id));
  };
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">Whitelisted Emails</h1><p className="page-subtitle">{rows.length} emails</p></div><button className="btn btn-primary" onClick={openCreate}>+ Add Email</button></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Email</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.id}>
              <td style={{ color: "var(--text)", fontFamily: "Space Mono, monospace", fontSize: "0.85rem" }}>{r.email ?? "—"}</td>
              <td>{r.created_at ? new Date(r.created_at as string).toLocaleDateString() : "—"}</td>
              <td><div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => openEdit(r)}>Edit</button>
                <button className="btn btn-danger" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => handleDelete(r.id)}>Delete</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {rows.length === 0 && <div className="empty-state">No whitelisted emails found.</div>}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>{editing ? "Edit Email" : "Add Email"}</h2>
            <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Email *</label><input className="input" type="email" value={form.email} onChange={e => setForm({ email: e.target.value })} placeholder="user@example.com" /></div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading || !form.email}>{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
