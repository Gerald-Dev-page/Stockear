import { createClient } from '@supabase/supabase-js';

// URL y clave pública de tu proyecto Supabase
const supabaseUrl = 'https://pfijbquilizgpvezfbjo.supabase.co';
const supabaseAnonKey = 'sb_publishable_RnqnUpaZo-EFJeysZMkv-w_JvjQfT3_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);