

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

//fetches supabase key from server
async function getSupabaseConfig() {
    const response = await fetch('http://localhost:3000/api/supabase-config');
    const config = await response.json();
    return config;
}

const config = await getSupabaseConfig();
const supabaseURL = config.SUPABASE_URL;
const supabaseANON = config.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseURL, supabaseANON);