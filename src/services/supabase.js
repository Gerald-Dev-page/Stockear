import { createClient } from '@supabase/supabase-js';

// Tus credenciales oficiales del backend de STOCKea
const supabaseUrl = 'https://voamjxcyvmwkwifwlrxi.supabase.co';
const supabaseKey = 'sb_publishable_UPfF4D7u69RsdlYb_VPvqg_4gWEarb3';

// Exportamos el cliente para usarlo en cualquier parte de la app
export const supabase = createClient(supabaseUrl, supabaseKey);