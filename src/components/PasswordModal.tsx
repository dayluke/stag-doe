"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Doodle, Sparkle } from "@/components/ui/doodle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WavyFrame } from "@/components/ui/wavy-frame";
import { siteConfig } from "@/lib/site-config";

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
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-rose border-t-transparent" />
        </div>
      </>
    );
  }

  return (
    <>
      {children}
      {!isAuthenticated && (
        <div className="paper fixed inset-0 z-50 flex items-center justify-center bg-background px-5">
          <div className="relative z-10 w-full max-w-md px-6 py-12 sm:px-10">
            <WavyFrame
              color="var(--brand-rose)"
              amplitude={8}
              period={84}
              radius={48}
              strokeWidth={5}
            />
            <Sparkle size={30} className="right-[8%] top-[6%]" />
            <Sparkle size={34} twin className="left-[7%] top-[9%]" />

            <div className="relative flex flex-col items-center text-center">
              <Doodle name="cocktail" size={78} />
              <h2 className="mt-4 font-display uppercase text-3xl leading-none text-brand-blue">
                {siteConfig.groomFirstName} {siteConfig.ampersand}{" "}
                {siteConfig.brideFirstName}
              </h2>
              <p className="eyebrow mt-3 text-brand-rose-ink">
                Invitation only
              </p>

              <form onSubmit={handleSubmit} className="mt-7 w-full space-y-3">
                <Label htmlFor="site-password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="site-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="text-center"
                  required
                />
                {error ? (
                  <p className="text-sm font-semibold text-brand-red-ink">{error}</p>
                ) : null}
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Come on in"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
