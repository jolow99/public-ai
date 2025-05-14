-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  model TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  feedback TEXT CHECK (feedback IN ('positive', 'negative', NULL))
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);

-- Enable row level security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own messages
DROP POLICY IF EXISTS "Users can only access their own messages" ON chat_messages;
CREATE POLICY "Users can only access their own messages"
  ON chat_messages
  FOR ALL
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table chat_messages;
