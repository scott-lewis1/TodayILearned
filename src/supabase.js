import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://knkbfdfaukjmrxcgmdpb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtua2JmZGZhdWtqbXJ4Y2dtZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDg4NTAsImV4cCI6MjA2ODgyNDg1MH0.r2pWsvZYhe-giN6jaz_IDUu_cQon521kD9Ptxip0j9E";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
