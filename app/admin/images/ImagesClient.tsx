"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Image = { id: string; url: string; title?: string; description?: string; created_at?: string; };

export default function ImagesClient({ initial }: { initial: Image[] }) {
  const [images, setImages] = useState<Image[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Image | null>(null);
  const [form, setForm] = useState({ url: "", title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const openCreate = () => { setEditing(null); setForm({ url: "", title: "", description: "" }); setShowModal(true); };
  const openEdit = (img: Image) => { setEditing(img); setForm({ url: img.url ?? "", title: img.title ?? "", description: img.description ?? "" }); setShowModal(true); };

  const handleSave = async () => {
    setLoading(true);
    if (editing) {
      const { data } = await supabase.from("images").update({ url: form.url, title: form.title, description: form.description }).eq("id", editing.id).select().single();
      if (data) setImages(images.map(i => i.id === editing.id ? data : i));
    } else {
      const { data } = await supabase.from("images").insert({ url: form.url, title: form.title, description: form.description }).select().single();
      if (data) setImages([data, ...images]);
    }
    setLoading(false); setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("images").delete().eq("id", id);
    setImages(images.filter(i => i.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Images</h1><p className="page-subtitle">{images.length} total</p></div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Image</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead><tr><th>Preview</th><th>Title</th><th>URL</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {images.map(img => (
              <tr key={img.id}>
                <td>{img.url ? <img src={img.url} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} /> : "—"}</td>
                <td style={{ color: "var(--text)" }}>{img.title ?? "—"}</td>
                <td className="mono" style={{ fontSize: "0.7rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.url}</td>
                <td>{img.created_at ? new Date(img.created_at).toLocaleDateString() : "—"}</td>
                <td><div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => openEdit(img)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => handleDelete(img.id)}>Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {images.length === 0 && <div className="empty-state">No images found.</div>}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>{editing ? "Edit Image" : "Add Image"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Image URL *</label>
                <input className="input" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Title</label>
                <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Image title" /></div>
              <div><label style={{ fontSize: "0.8rem", color: "var(--text3)", display: "block", marginBottom: "0.4rem" }}>Description</label>
                <textarea className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description..." /></div>
              {form.url && <img src={form.url} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading || !form.url}>{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
