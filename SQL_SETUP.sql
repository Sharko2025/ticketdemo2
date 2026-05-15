-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium',
    reporter TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    source TEXT NOT NULL DEFAULT 'Web',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access (all operations)
-- WARNING: In a production environment, you should restrict this!
CREATE POLICY "Allow public access" ON public.tickets
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Enable Realtime for the tickets table
-- This is crucial for the dashboard to update automatically
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
