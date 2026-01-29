import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== 'undefined') {
        console.warn('Supabase credentials are missing. Check .env.local');
    }
}

// Fallback to avoid build errors if env vars are missing
const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);
