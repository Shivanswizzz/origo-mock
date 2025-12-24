import { createClient } from '@supabase/supabase-js';

// Project Credentials
const supabaseUrl = 'https://srkqvxpeoipsnicmeunp.supabase.co';
const supabaseKey = 'sb_publishable_hG3GcXSBpIMVO0Mm2CF1jw_nSSFG7Wq';

export const supabase = createClient(supabaseUrl, supabaseKey);
