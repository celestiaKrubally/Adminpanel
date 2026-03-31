"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url";
  readOnly?: boolean;
  hideInTable?: boolean;
};

type Props = {
  table: string;
  title: string;
  fields: FieldDef[];
  readOnly?: boolean;
  orderBy?: string;
  orderAsc?: boolean;
};

export default function CrudTable({ table, title, fields, readOnly = false, orderBy = "created_at", orderAsc = false }: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "create" | "edit">(null);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const q = supabase.from(table).select("*");
    try { q.order(orderBy, { ascending: orderAsc }); } catch {}
    const { data } = await q;
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [table]);

  const emptyForm = () => Object.fromEntries(fields.filter(f => !f.readOnly).map(f => [f.key, ""]));

  const openCreate = () => { setForm(emptyForm()); setSelected(null); setModal("create"); };
  const openEdit = (row: Record<string, unknown>) => {
    setSelected(row);
    setForm(Object.fromEntries(fields.filter(f => !f.readOnly).map(f => [f.key, String(row[f.key] ?? "")])));
    setModal("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));
    if (modal === "create") {
      await supabase.from(table).insert([payload]);
    } else if (modal === "edit" && selected) {
      await supabase.from(table).update(payload).eq("id", selected.id as string);
    }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id: unknown) => {
    if (!confirm(`Delete this ${title.slice(0, -1)}?`)) return;
    await supabase.from(table).delete().eq("id", id as string);
    load();
  };

  const visibleFields = fields.filter(f => !f.hideInTable);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{rows.length} total records</p>
        </div>
        {!readOnly && <button className="btn btn-primary" onClick={openCreate}>+ New</button>}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><div className="loading-spinner" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                {visibleFields.map(f => <th key={f.key}>{f.label}</th>)}
                {!readOnly && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={(row.id as string) ?? i}>
                  {visibleFields.map(f => (
                    <td key={f.key} style={{ color: "var(--text)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {String(row[f.key] ?? "—")}
                    </td>
                  ))}
                  {!readOnly && (
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem" }} onClick={() => openEdit(row)}>Edit</button>
                        <button className="btn btn-danger" style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem" }} onClick={() => handleDelete(row.id)}>Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="empty-state">No records found.</div>}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              {modal === "create" ? `New ${title.replace(/s$/, "")}` : `Edit ${title.replace(/s$/, "")}`}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {fields.filter(f => !f.readOnly).map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea className="input" value={form[f.key] ?? ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  ) : (
                    <input className="input" type={f.type ?? "text"} value={form[f.key] ?? ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
