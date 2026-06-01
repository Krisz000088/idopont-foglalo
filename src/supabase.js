import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xmotbhzulhkieswweeyj.supabase.co'

const supabaseKey = 'sb_publishable_G3EbLVRPEVWmkK39C6YGtQ_1yhvJMMl'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)