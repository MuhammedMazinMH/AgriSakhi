-- AgriSakhi Database Schema
-- PostgreSQL + Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'expert', 'admin')),
  is_guest BOOLEAN DEFAULT false,
  guest_detections_count INTEGER DEFAULT 0,
  free_detections_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Detections Table
CREATE TABLE IF NOT EXISTS detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  disease_name TEXT NOT NULL,
  disease_name_local TEXT,
  scientific_name TEXT,
  confidence DECIMAL(5,4) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  affected_area_percentage INTEGER NOT NULL CHECK (affected_area_percentage >= 0 AND affected_area_percentage <= 100),
  crop_type TEXT,
  detection_metadata JSONB DEFAULT '{}',
  weather_data JSONB,
  location_data JSONB,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diseases Knowledge Base Table
CREATE TABLE IF NOT EXISTS diseases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  scientific_name TEXT NOT NULL,
  description JSONB NOT NULL, -- Multi-language descriptions
  symptoms JSONB NOT NULL, -- List of symptoms in multiple languages
  crop_types TEXT[] NOT NULL,
  severity_levels JSONB DEFAULT '{}',
  treatment_methods JSONB NOT NULL, -- Organic, chemical, cultural, biological
  prevention_strategies JSONB NOT NULL,
  images TEXT[] DEFAULT '{}',
  seasonal_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatments Table
CREATE TABLE IF NOT EXISTS treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('organic', 'chemical', 'cultural', 'biological')),
  description TEXT NOT NULL,
  dosage TEXT,
  cost_estimate DECIMAL(10,2),
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
  duration_days INTEGER,
  applied_at TIMESTAMP WITH TIME ZONE,
  result_status TEXT DEFAULT 'pending' CHECK (result_status IN ('pending', 'effective', 'ineffective', 'partial')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('pdf', 'email', 'whatsapp')),
  file_url TEXT,
  shared_at TIMESTAMP WITH TIME ZONE,
  verification_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('question', 'tip', 'success_story', 'new_disease')),
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert Consultations Table
CREATE TABLE IF NOT EXISTS expert_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES users(id) ON DELETE SET NULL,
  detection_id UUID REFERENCES detections(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('detection_complete', 'expert_answer', 'system', 'community')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_detections_user_id ON detections(user_id);
CREATE INDEX idx_detections_created_at ON detections(created_at DESC);
CREATE INDEX idx_detections_disease_name ON detections(disease_name);
CREATE INDEX idx_treatments_detection_id ON treatments(detection_id);
CREATE INDEX idx_reports_detection_id ON reports(detection_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_expert_consultations_user_id ON expert_consultations(user_id);
CREATE INDEX idx_expert_consultations_expert_id ON expert_consultations(expert_id);
CREATE INDEX idx_expert_consultations_status ON expert_consultations(status);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create Updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Updated_at Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detections_updated_at BEFORE UPDATE ON detections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON diseases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expert_consultations_updated_at BEFORE UPDATE ON expert_consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed Data: Common Diseases
INSERT INTO diseases (name, scientific_name, description, symptoms, crop_types, treatment_methods, prevention_strategies) VALUES
('Tomato Early Blight', 'Alternaria solani', 
 '{"en": "Fungal disease causing dark spots on leaves", "hi": "पत्तियों पर काले धब्बे पैदा करने वाली फंगल बीमारी"}',
 '{"en": ["Dark spots with concentric rings", "Yellow halo around spots", "Leaf wilting"], "hi": ["केंद्रित वलय के साथ काले धब्बे", "धब्बों के चारों ओर पीला हैलो", "पत्ती मुरझाना"]}',
 ARRAY['Tomato', 'Potato'],
 '{"organic": ["Neem oil spray", "Copper fungicide"], "chemical": ["Chlorothalonil", "Mancozeb"]}',
 '{"en": ["Crop rotation", "Remove infected leaves", "Proper spacing"], "hi": ["फसल चक्र", "संक्रमित पत्तियों को हटाएं", "उचित दूरी"]}'
) ON CONFLICT (name) DO NOTHING;

INSERT INTO diseases (name, scientific_name, description, symptoms, crop_types, treatment_methods, prevention_strategies) VALUES
('Rice Blast', 'Magnaporthe oryzae',
 '{"en": "Fungal disease affecting rice plants", "hi": "चावल के पौधों को प्रभावित करने वाली फंगल बीमारी"}',
 '{"en": ["Diamond-shaped lesions", "White to gray centers", "Brown margins"], "hi": ["हीरे के आकार के घाव", "सफेद से भूरे केंद्र", "भूरे मार्जिन"]}',
 ARRAY['Rice'],
 '{"organic": ["Neem cake", "Trichoderma"], "chemical": ["Tricyclazole", "Azoxystrobin"]}',
 '{"en": ["Use resistant varieties", "Balanced fertilization", "Field drainage"], "hi": ["प्रतिरोधी किस्मों का उपयोग", "संतुलित उर्वरक", "खेत जल निकासी"]}'
) ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
