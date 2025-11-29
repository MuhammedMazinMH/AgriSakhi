-- Row Level Security Policies for AgriSakhi

-- Users Policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public can view expert profiles"
  ON users FOR SELECT
  USING (role = 'expert');

-- Detections Policies
CREATE POLICY "Users can view their own detections"
  ON detections FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own detections"
  ON detections FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own detections"
  ON detections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Experts can view all detections"
  ON detections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('expert', 'admin')
    )
  );

-- Diseases Policies (Public read access)
CREATE POLICY "Anyone can view diseases"
  ON diseases FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can modify diseases"
  ON diseases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Treatments Policies
CREATE POLICY "Users can view treatments for their detections"
  ON treatments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM detections
      WHERE detections.id = treatments.detection_id
      AND detections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert treatments for their detections"
  ON treatments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM detections
      WHERE detections.id = detection_id
      AND detections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own treatments"
  ON treatments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM detections
      WHERE detections.id = treatments.detection_id
      AND detections.user_id = auth.uid()
    )
  );

-- Reports Policies
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reports for their detections"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Community Posts Policies
CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Expert Consultations Policies
CREATE POLICY "Users can view their own consultations"
  ON expert_consultations FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = expert_id);

CREATE POLICY "Users can create consultations"
  ON expert_consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Experts can answer consultations"
  ON expert_consultations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('expert', 'admin')
    )
  );

-- Analytics Events Policies
CREATE POLICY "Users can insert their own events"
  ON analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all analytics"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
