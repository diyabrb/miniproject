import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jujxoskixfadyvrxlaru.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1anhvc2tpeGZhZHl2cnhsYXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzODIyOTUsImV4cCI6MjA1Nzk1ODI5NX0.WcDFgHAMGbsksGUto44U4ke33yz_hONETzQX3U6-VcQ"; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Function to get the current user session
export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }
  return data.session;
};
