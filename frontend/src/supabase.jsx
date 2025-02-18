import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgaofyptdwmqmofmbrhf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYW9meXB0ZHdtcW1vZm1icmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NDU2NDIsImV4cCI6MjA1NTQyMTY0Mn0.AfZ62KEtAjmPiB9uP_Re7VVrFVoTyfwIhsB9iPDZq5U'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase 