import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://xjquitrcorzdwivcklge.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcXVpdHJjb3J6ZHdpdmNrbGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NDM1MjcsImV4cCI6MjAzMTQxOTUyN30.8fm4p2kThkxqIHCKAojRlA7KTxQUcc_688rR3M64hf8'
);
