
/*import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
//const dotenv = require('dotenv');
//dotenv.config({ path: '../.env' });

//dotenv.config({path: '../.env'});
//const SUPABASE_URL = 'https://wjstuuntrdknmqhzuigr.supabase.co';
//const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqc3R1dW50cmRrbm1xaHp1aWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0ODY2NTMsImV4cCI6MjA1MTA2MjY1M30.vm_E0EZTwO9q4h0sCsFoARindPKO-k9tKzrpgsdhPXI';

const supabaseURL = process.env.SUPABASE_URL;
const supabaseANON = process.env.SUPABASE_ANON_KEY;

//const supabaseURL = 'https://wjstuuntrdknmqhzuigr.supabase.co';
//const supabaseANON = process.env.SUPABASE_ANON_KEY;
//const supabaseURL = configs.SUPABASE_URL;
//const supabaseANON = configs.SUPABASE_KEY



export const supabase = createClient(supabaseURL, supabaseANON);*/

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