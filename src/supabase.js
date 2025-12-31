import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://pffgactwblhauzsjuyqv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZmdhY3R3YmxoYXV6c2p1eXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODE0MTQsImV4cCI6MjA4MjY1NzQxNH0.wfYcIU3RnQyeYiNg6GcQnLvibfRjuFsUl4svqSEIoc4"
)
