"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Row = { id: string; humor_flavor?: string; flavor?: string; weight?: number; value?: number; updated_at?: string; [k: string]: unknown };

export default function HumorMixClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const startEdit = (r: Row) => {
    setEditing(r.id);
    setEditValue(String(r.weight ?? r.value ?? ""));
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("humor_mix")
      .update({ weight: parseFloat(editValue) })
      .eq("id", id)
      .select()
      .single();
    if (data) setRows(rows.map(r => r.id === id ? data : r));
    setEditing(null);
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Humor Mix</h1><p className="page-subtitle">{rows.length} entries</p></div>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Flavor</th><th>Weight</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={{ color: "var(--text)" }}>{r.humor_flavor ?? r.flavor ?? "—"}</td>
                <td>
                  {editing === r.id ? (
                    <input
                      className="input"
                      style={{ width: 100, padding: "0.3rem 0.6rem" }}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      type="number"
                      step="0.01"
                    />
                  ) : (
                    <span className="badge badge-cyan">{r.weight ?? r.value ?? "—"}</span>
                  )}
                </td>
                <td>{r.updated_at ? new Date(r.updated_at as string).toLocaleDateString() : "—"}</td>
                <td>
                  {editing === r.id ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn btn-success" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => handleUpdate(r.id)} disabled={loading}>Save</button>
                      <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => startEdit(r)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="empty-state">No humor mix data found.</div>}
      </div>
    </div>
  );
}