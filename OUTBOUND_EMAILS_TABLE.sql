-- Run this in your Supabase SQL Editor to enable persistence for outbound emails and calls

CREATE TABLE IF NOT EXISTS outbound_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id TEXT, -- Can be UUID or email string
  lead_name TEXT,
  subject TEXT,
  status TEXT, -- 'sent', 'opened', 'replied'
  type TEXT, -- 'inbound', 'outreach'
  thread_id TEXT,
  thread JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outbound_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id TEXT,
  lead_name TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration TEXT,
  status TEXT, -- 'completed', 'voicemail', 'missed'
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE outbound_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_calls ENABLE ROW LEVEL SECURITY;

-- Create policies (assuming authenticated users can do everything for now)
CREATE POLICY "Allow all for authenticated users on outbound_emails" ON outbound_emails FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users on outbound_calls" ON outbound_calls FOR ALL USING (auth.role() = 'authenticated');
