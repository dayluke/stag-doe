"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export function PasswordModal({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        // If Supabase is not configured, just let them through (demo mode)
        setIsAuthenticated(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        // Check if password is in the URL
        const params = new URLSearchParams(window.location.search);
        const pwdFromUrl = params.get("pwd") || params.get("code");

        if (pwdFromUrl) {
          const { error } = await supabase.auth.signInWithPassword({
            email: "guest@wedding.com",
            password: pwdFromUrl,
          });

          if (!error) {
            // Clean up the URL so the password isn't visible in the address bar
            window.history.replaceState({}, document.title, window.location.pathname);
            setIsAuthenticated(true);
          } else {
            setError("The link is invalid. Please enter the password manually.");
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });

      return () => subscription.unsubscribe();
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) return;

    // Use a generic guest email that you will create in your Supabase Auth dashboard
    const { error } = await supabase.auth.signInWithPassword({
      email: "guest@wedding.com",
      password: password,
    });

    if (error) {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    } else {
      // The onAuthStateChange listener will automatically update the state
      // and hide the modal.
    }
  };

  // While checking auth state, show a loading overlay
  if (isAuthenticated === null) {
    return (
      <>
        {children}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      {children}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border border-border">
            <h2 className="text-2xl font-display font-semibold mb-6 text-center">
              Please enter the password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Enter"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
