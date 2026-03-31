"use client";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "1rem",
    }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.3,
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px" }}>
        {/* Logo / title */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "14px",
            background: "var(--accent)", marginBottom: "1.25rem",
            fontSize: "1.5rem",
          }}>⚡</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)" }}>
            Caption Admin
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginTop: "0.4rem", fontFamily: "Space Mono, monospace" }}>
            superadmin access only
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "2rem" }}>
          {error === "unauthorized" && (
            <div style={{
              background: "#ff5c5c18", border: "1px solid #ff5c5c44",
              borderRadius: "8px", padding: "0.85rem 1rem",
              color: "var(--red)", fontSize: "0.85rem", marginBottom: "1.5rem",
              fontFamily: "Space Mono, monospace",
            }}>
              ✗ Account not authorized. You need is_superadmin = true.
            </div>
          )}
          {error === "auth" && (
            <div style={{
              background: "#ff5c5c18", border: "1px solid #ff5c5c44",
              borderRadius: "8px", padding: "0.85rem 1rem",
              color: "var(--red)", fontSize: "0.85rem", marginBottom: "1.5rem",
            }}>
              Authentication failed. Please try again.
            </div>
          )}

          <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Sign in with your Google account. Access is restricted to superadmin users only.
          </p>

          <button onClick={handleGoogleLogin} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", fontSize: "0.95rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p style={{ textAlign: "center", color: "var(--text3)", fontSize: "0.75rem", marginTop: "1.5rem", fontFamily: "Space Mono, monospace" }}>
          Caption Rating App · Admin Area
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <LoginContent />
    </Suspense>
  );
}
