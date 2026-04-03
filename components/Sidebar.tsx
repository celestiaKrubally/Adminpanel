"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { section: "Overview" },
  { href: "/admin", label: "Dashboard", icon: "◈" },

  { section: "Content" },
  { href: "/admin/users", label: "Users", icon: "◉" },
  { href: "/admin/images", label: "Images", icon: "⬡" },
  { href: "/admin/captions", label: "Captions", icon: "◫" },
  { href: "/admin/caption-requests", label: "Caption Requests", icon: "◌" },
  { href: "/admin/caption-examples", label: "Caption Examples", icon: "◧" },
  { href: "/admin/terms", label: "Terms", icon: "◷" },

  { section: "Humor" },
  { href: "/admin/humor-flavors", label: "Humor Flavors", icon: "◈" },
  { href: "/admin/humor-mix", label: "Humor Mix", icon: "◉" },

  { section: "AI / LLM" },
  { href: "/admin/llm-providers", label: "LLM Providers", icon: "⬡" },
  { href: "/admin/llm-models", label: "LLM Models", icon: "◫" },
  { href: "/admin/llm-responses", label: "LLM Responses", icon: "◌" },
  { href: "/admin/llm-prompt-chains", label: "Prompt Chains", icon: "◌" },

  { section: "Access Control" },
  { href: "/admin/allowed-domains", label: "Allowed Domains", icon: "◧" },
  { href: "/admin/whitelisted-emails", label: "Whitelisted Emails", icon: "◷" },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "var(--accent)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1rem", flexShrink: 0,
          }}>⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text)" }}>Caption Admin</div>
            <div style={{ fontSize: "0.65rem", color: "var(--text3)", fontFamily: "Space Mono, monospace" }}>superadmin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflow: "auto", padding: "0.5rem 0" }}>
        {navItems.map((item, i) => {
          if ("section" in item && !("href" in item)) {
            return <div key={i} className="nav-section">{item.section}</div>;
          }
          if ("href" in item) {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href!);
            return (
              <Link key={i} href={item.href!} className={`nav-link ${isActive ? "active" : ""}`}>
                <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          }
          return null;
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "1rem", borderTop: "1px solid var(--border)" }}>
        <div style={{
          fontSize: "0.75rem", color: "var(--text3)", fontFamily: "Space Mono, monospace",
          marginBottom: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{userEmail}</div>
        <button onClick={handleSignOut} className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem" }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
