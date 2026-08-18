import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client. Only the anon (public) key is used — never the
 * service-role key. Row Level Security must be configured on the tables
 * (see `supabase/schema.sql`) so that access is safe.
 *
 * Both env vars are injected at build time by Next.js. If they are missing
 * (e.g. when developing the UI without a Supabase project yet) the client
 * returns `null` and the RSVP flow falls into a graceful "demo" mode.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Supabase renamed the client key from "anon" to "publishable" — accept
// either so existing docs and newer dashboards both work.
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (_client) return _client;
  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true },
  });
  return _client;
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/* -------------------- Types matching supabase/schema.sql -------------------- */

export type AttendingStatus = "yes" | "no" | null;
export type MenuChoice = "traditional" | "vegetarian" | null;

export type GuestRow = {
  id: string;
  party_id: string;
  full_name: string;
  attending: AttendingStatus;
  menu_choice: MenuChoice;
  dietary_notes: string | null;
  responded_at: string | null;
};

export type PartyRow = {
  id: string;
  party_name: string;
  guests: GuestRow[];
};

/**
 * Case-insensitive search for any guest whose name matches the query, then
 * load every guest in the same party so the user can RSVP for the whole group.
 */
export async function findPartyByGuestName(
  rawQuery: string
): Promise<PartyRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const query = rawQuery.trim();
  if (query.length < 2) return [];

  const { data: matches, error } = await supabase
    .from("guests")
    .select("party_id")
    .ilike("full_name", `%${query}%`)
    .limit(25);

  if (error) throw error;
  if (!matches || matches.length === 0) return [];

  const partyIds = Array.from(new Set(matches.map((m) => m.party_id)));

  const { data: parties, error: partiesError } = await supabase
    .from("parties")
    .select("id, party_name, guests(*)")
    .in("id", partyIds)
    .order("party_name", { ascending: true });

  if (partiesError) throw partiesError;
  return (parties ?? []) as unknown as PartyRow[];
}

export type RsvpSubmission = {
  guestId: string;
  attending: Exclude<AttendingStatus, null>;
  menuChoice: MenuChoice;
  dietaryNotes: string | null;
};

/** Submit RSVP responses for one or more guests in a single party. */
export async function submitRsvps(submissions: RsvpSubmission[]) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");
  const now = new Date().toISOString();

  const results = await Promise.all(
    submissions.map((s) =>
      supabase
        .from("guests")
        .update({
          attending: s.attending,
          menu_choice: s.menuChoice,
          dietary_notes: s.dietaryNotes,
          responded_at: now,
        })
        .eq("id", s.guestId)
        .select()
        .single()
    )
  );

  const firstError = results.find((r) => r.error)?.error;
  if (firstError) throw firstError;
  return results.map((r) => r.data);
}
