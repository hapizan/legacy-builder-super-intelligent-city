-- Smart City System Database Schema
-- This script creates all the necessary tables for the comprehensive smart city management system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users and Authentication (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'emergency_responder', 'city_planner', 'operator')),
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- City Infrastructure
CREATE TABLE IF NOT EXISTS public.buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  building_type TEXT NOT NULL CHECK (building_type IN ('residential', 'commercial', 'industrial', 'government', 'educational', 'healthcare')),
  floors INTEGER DEFAULT 1,
  occupancy_capacity INTEGER,
  coordinates POINT,
  zone_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'under_construction', 'maintenance', 'demolished')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL CHECK (zone_type IN ('residential', 'commercial', 'industrial', 'mixed', 'green_space', 'transportation')),
  boundary POLYGON,
  population INTEGER DEFAULT 0,
  area_sqm DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IoT Sensors and Monitoring
CREATE TABLE IF NOT EXISTS public.sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id TEXT UNIQUE NOT NULL,
  sensor_type TEXT NOT NULL CHECK (sensor_type IN ('air_quality', 'noise', 'traffic', 'weather', 'energy', 'water', 'waste', 'security')),
  location POINT NOT NULL,
  building_id UUID REFERENCES public.buildings(id),
  zone_id UUID REFERENCES public.zones(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'error')),
  last_reading_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE CASCADE,
  reading_value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  reading_type TEXT NOT NULL,
  quality_score DECIMAL CHECK (quality_score >= 0 AND quality_score <= 1),
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traffic Management
CREATE TABLE IF NOT EXISTS public.traffic_lights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intersection_name TEXT NOT NULL,
  location POINT NOT NULL,
  status TEXT DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance', 'error')),
  current_phase TEXT DEFAULT 'red' CHECK (current_phase IN ('red', 'yellow', 'green')),
  cycle_duration INTEGER DEFAULT 120, -- seconds
  last_optimized_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.traffic_flow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location POINT NOT NULL,
  road_name TEXT NOT NULL,
  vehicle_count INTEGER NOT NULL DEFAULT 0,
  average_speed DECIMAL,
  congestion_level TEXT DEFAULT 'low' CHECK (congestion_level IN ('low', 'medium', 'high', 'severe')),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Management
CREATE TABLE IF NOT EXISTS public.emergency_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type TEXT NOT NULL CHECK (incident_type IN ('fire', 'medical', 'accident', 'natural_disaster', 'security', 'infrastructure')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'dispatched', 'in_progress', 'resolved', 'closed')),
  location POINT NOT NULL,
  address TEXT,
  description TEXT NOT NULL,
  reported_by UUID REFERENCES public.user_profiles(id),
  assigned_to UUID REFERENCES public.user_profiles(id),
  estimated_resolution TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emergency_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('ambulance', 'fire_truck', 'police_car', 'rescue_team', 'utility_crew')),
  unit_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'dispatched', 'busy', 'maintenance')),
  current_location POINT,
  assigned_incident_id UUID REFERENCES public.emergency_incidents(id),
  capacity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Energy Management
CREATE TABLE IF NOT EXISTS public.energy_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id),
  zone_id UUID REFERENCES public.zones(id),
  consumption_kwh DECIMAL NOT NULL,
  peak_demand_kw DECIMAL,
  energy_source TEXT CHECK (energy_source IN ('grid', 'solar', 'wind', 'battery')),
  cost DECIMAL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste Management
CREATE TABLE IF NOT EXISTS public.waste_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location POINT NOT NULL,
  waste_type TEXT NOT NULL CHECK (waste_type IN ('general', 'recyclable', 'organic', 'hazardous')),
  bin_capacity DECIMAL NOT NULL,
  current_level DECIMAL NOT NULL,
  last_collected_at TIMESTAMP WITH TIME ZONE,
  next_collection_scheduled TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'full', 'overflowing', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- City Planning and Development
CREATE TABLE IF NOT EXISTS public.development_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('residential', 'commercial', 'infrastructure', 'public_space', 'transportation')),
  status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'in_progress', 'completed', 'cancelled')),
  location POINT,
  area_boundary POLYGON,
  estimated_cost DECIMAL,
  start_date DATE,
  expected_completion DATE,
  actual_completion DATE,
  project_manager_id UUID REFERENCES public.user_profiles(id),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_type TEXT NOT NULL CHECK (permit_type IN ('building', 'renovation', 'demolition', 'business', 'event')),
  applicant_name TEXT NOT NULL,
  applicant_contact TEXT,
  location POINT,
  address TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'expired')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.user_profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  description TEXT,
  metadata JSONB DEFAULT '{}'
);

-- AI and Analytics
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL CHECK (insight_type IN ('traffic_optimization', 'energy_efficiency', 'emergency_prediction', 'maintenance_alert', 'planning_recommendation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'implemented', 'dismissed')),
  affected_area POLYGON,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- System Notifications and Alerts
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('system_error', 'maintenance', 'security', 'performance', 'emergency')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  source_system TEXT,
  affected_users TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Citizen Services
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type TEXT NOT NULL CHECK (request_type IN ('maintenance', 'complaint', 'suggestion', 'information', 'permit_application')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_progress', 'resolved', 'closed')),
  location POINT,
  address TEXT,
  submitted_by UUID REFERENCES public.user_profiles(id),
  assigned_to UUID REFERENCES public.user_profiles(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_id ON public.sensor_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_recorded_at ON public.sensor_readings(recorded_at);
CREATE INDEX IF NOT EXISTS idx_traffic_flow_recorded_at ON public.traffic_flow(recorded_at);
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_status ON public.emergency_incidents(status);
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_created_at ON public.emergency_incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_energy_consumption_recorded_at ON public.energy_consumption(recorded_at);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON public.ai_insights(created_at);
CREATE INDEX IF NOT EXISTS idx_system_alerts_status ON public.system_alerts(status);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_lights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
