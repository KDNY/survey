import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://YOUR-SUPABASE-PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR-ANON-KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;

