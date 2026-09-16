import { createClient } from '@supabase/supabase-js';

// Supabase Configuration from User Credentials
export const SUPABASE_URL = 'https://apihjelrqymneodcdfkv.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_fBX1R6ZsvIBy-ceHD7_mTw_liZXgspm';
export const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWhqZWxycXltbmVvZGNkZmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTQ4NjM4MSwiZXhwIjoyMTA1MDYyMzgxfQ.5i2ExxRXWWSsTygT2U6I217FnGjn-iTaUvrAHSLeyxw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
