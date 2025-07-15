import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
    "https://ucjledsxqqdelcojqohc.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjamxlZHN4cXFkZWxjb2pxb2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDUxODIsImV4cCI6MjA2NzkyMTE4Mn0.ZU-j9s0G2L2SLV_itIEY79d7C1fR1vy2KfK5kZP-Wno"
)