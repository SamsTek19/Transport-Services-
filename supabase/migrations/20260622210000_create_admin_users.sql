-- Admin users who can access the dashboard and send invites.
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_select_own" ON admin_users;

CREATE POLICY "admin_users_select_own" ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
