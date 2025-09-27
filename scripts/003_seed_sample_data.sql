-- Sample Data for Smart City System
-- This script populates the database with realistic sample data for testing and demonstration

-- Insert sample zones
INSERT INTO public.zones (id, name, zone_type, population, area_sqm) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Cyberjaya City Centre', 'commercial', 15000, 2500000),
  ('550e8400-e29b-41d4-a716-446655440002', 'Residential District A', 'residential', 25000, 3200000),
  ('550e8400-e29b-41d4-a716-446655440003', 'Tech Park Zone', 'commercial', 8000, 1800000),
  ('550e8400-e29b-41d4-a716-446655440004', 'Green Valley', 'residential', 12000, 2100000),
  ('550e8400-e29b-41d4-a716-446655440005', 'Industrial Sector', 'industrial', 3000, 1500000);

-- Insert sample buildings
INSERT INTO public.buildings (name, address, building_type, floors, occupancy_capacity, zone_id, status) VALUES
  ('Cyberjaya City Mall', 'Persiaran Multimedia, Cyberjaya', 'commercial', 4, 5000, '550e8400-e29b-41d4-a716-446655440001', 'active'),
  ('MSC Corporate Tower', 'Jalan Teknologi 2/1, Cyberjaya', 'commercial', 25, 2500, '550e8400-e29b-41d4-a716-446655440001', 'active'),
  ('Cyberjaya University', 'Persiaran Orang Utan, Cyberjaya', 'educational', 8, 8000, '550e8400-e29b-41d4-a716-446655440003', 'active'),
  ('Residential Complex Alpha', 'Jalan Residensi 1, Cyberjaya', 'residential', 15, 300, '550e8400-e29b-41d4-a716-446655440002', 'active'),
  ('Tech Innovation Hub', 'Jalan Inovasi, Cyberjaya', 'commercial', 12, 1200, '550e8400-e29b-41d4-a716-446655440003', 'active');

-- Insert sample sensors
INSERT INTO public.sensors (sensor_id, sensor_type, location, zone_id, status, metadata) VALUES
  ('AQ001', 'air_quality', POINT(101.6500, 2.9200), '550e8400-e29b-41d4-a716-446655440001', 'active', '{"model": "AirSense Pro", "installation_date": "2024-01-15"}'),
  ('TR001', 'traffic', POINT(101.6480, 2.9180), '550e8400-e29b-41d4-a716-446655440001', 'active', '{"model": "TrafficFlow X1", "lanes": 4}'),
  ('EN001', 'energy', POINT(101.6520, 2.9220), '550e8400-e29b-41d4-a716-446655440002', 'active', '{"model": "PowerMeter 3000", "capacity": "500kW"}'),
  ('WE001', 'weather', POINT(101.6510, 2.9210), '550e8400-e29b-41d4-a716-446655440003', 'active', '{"model": "WeatherStation Pro", "height": "10m"}'),
  ('NO001', 'noise', POINT(101.6490, 2.9190), '550e8400-e29b-41d4-a716-446655440001', 'active', '{"model": "SoundLevel Monitor", "range": "30-130dB"}');

-- Insert sample sensor readings (recent data)
INSERT INTO public.sensor_readings (sensor_id, reading_value, unit, reading_type, quality_score, recorded_at) VALUES
  ((SELECT id FROM public.sensors WHERE sensor_id = 'AQ001'), 45.2, 'μg/m³', 'PM2.5', 0.95, NOW() - INTERVAL '5 minutes'),
  ((SELECT id FROM public.sensors WHERE sensor_id = 'AQ001'), 78.1, 'μg/m³', 'PM10', 0.92, NOW() - INTERVAL '5 minutes'),
  ((SELECT id FROM public.sensors WHERE sensor_id = 'TR001'), 156, 'vehicles/hour', 'vehicle_count', 0.98, NOW() - INTERVAL '2 minutes'),
  ((SELECT id FROM public.sensors WHERE sensor_id = 'EN001'), 342.5, 'kWh', 'consumption', 0.99, NOW() - INTERVAL '1 hour'),
  ((SELECT id FROM public.sensors WHERE sensor_id = 'WE001'), 28.5, '°C', 'temperature', 0.97, NOW() - INTERVAL '10 minutes'),
  ((SELECT id FROM public.sensors WHERE sensor_id = 'WE001'), 65.2, '%', 'humidity', 0.96, NOW() - INTERVAL '10 minutes'),
  ((SELECT id FROM public.sensors WHERE sensor_id = 'NO001'), 52.3, 'dB', 'noise_level', 0.94, NOW() - INTERVAL '3 minutes');

-- Insert sample traffic lights
INSERT INTO public.traffic_lights (intersection_name, location, status, current_phase, cycle_duration) VALUES
  ('Jalan Teknologi & Persiaran Multimedia', POINT(101.6485, 2.9185), 'operational', 'green', 120),
  ('Persiaran Orang Utan & Jalan Inovasi', POINT(101.6505, 2.9205), 'operational', 'red', 90),
  ('Jalan Residensi & Persiaran Cyber', POINT(101.6495, 2.9195), 'operational', 'yellow', 110);

-- Insert sample traffic flow data
INSERT INTO public.traffic_flow (location, road_name, vehicle_count, average_speed, congestion_level, recorded_at) VALUES
  (POINT(101.6485, 2.9185), 'Jalan Teknologi', 156, 45.2, 'medium', NOW() - INTERVAL '5 minutes'),
  (POINT(101.6505, 2.9205), 'Persiaran Orang Utan', 89, 52.1, 'low', NOW() - INTERVAL '5 minutes'),
  (POINT(101.6495, 2.9195), 'Jalan Residensi', 234, 32.8, 'high', NOW() - INTERVAL '5 minutes');

-- Insert sample emergency resources
INSERT INTO public.emergency_resources (resource_type, unit_id, status, current_location, capacity) VALUES
  ('ambulance', 'AMB001', 'available', POINT(101.6500, 2.9200), 2),
  ('fire_truck', 'FIRE001', 'available', POINT(101.6490, 2.9190), 6),
  ('police_car', 'POL001', 'available', POINT(101.6510, 2.9210), 4),
  ('rescue_team', 'RES001', 'available', POINT(101.6505, 2.9205), 8);

-- Insert sample energy consumption data
INSERT INTO public.energy_consumption (zone_id, consumption_kwh, peak_demand_kw, energy_source, cost, recorded_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 2450.5, 450.2, 'grid', 1225.25, NOW() - INTERVAL '1 hour'),
  ('550e8400-e29b-41d4-a716-446655440002', 1890.3, 320.1, 'solar', 945.15, NOW() - INTERVAL '1 hour'),
  ('550e8400-e29b-41d4-a716-446655440003', 3200.8, 580.5, 'grid', 1600.40, NOW() - INTERVAL '1 hour');

-- Insert sample waste collection points
INSERT INTO public.waste_collection (location, waste_type, bin_capacity, current_level, last_collected_at, next_collection_scheduled, status) VALUES
  (POINT(101.6485, 2.9185), 'general', 1000, 750, NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day', 'normal'),
  (POINT(101.6505, 2.9205), 'recyclable', 800, 650, NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', 'normal'),
  (POINT(101.6495, 2.9195), 'organic', 600, 580, NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 hours', 'full');

-- Insert sample AI insights
INSERT INTO public.ai_insights (insight_type, title, description, confidence_score, priority, status, metadata) VALUES
  ('traffic_optimization', 'Traffic Light Optimization Opportunity', 'Adjusting traffic light timing at Jalan Teknologi intersection could reduce congestion by 23%', 0.87, 'medium', 'active', '{"estimated_improvement": "23%", "affected_intersections": 1}'),
  ('energy_efficiency', 'Solar Panel Installation Recommendation', 'Installing solar panels on Residential Complex Alpha could reduce energy costs by 35%', 0.92, 'high', 'active', '{"estimated_savings": "35%", "payback_period": "3.2 years"}'),
  ('maintenance_alert', 'Sensor Maintenance Required', 'Air quality sensor AQ001 showing decreased accuracy, maintenance recommended', 0.78, 'medium', 'active', '{"sensor_id": "AQ001", "accuracy_drop": "5%"}');

-- Insert sample system alerts
INSERT INTO public.system_alerts (alert_type, severity, title, message, source_system, status) VALUES
  ('performance', 'warning', 'High Traffic Congestion Detected', 'Traffic congestion levels are above normal on Jalan Teknologi. Consider alternative routes.', 'traffic_management', 'active'),
  ('maintenance', 'info', 'Scheduled Maintenance Tonight', 'Energy grid maintenance scheduled for Zone 2 from 2:00 AM to 4:00 AM.', 'energy_management', 'active'),
  ('system_error', 'error', 'Sensor Communication Lost', 'Lost communication with weather sensor WE001. Technical team notified.', 'sensor_network', 'acknowledged');

-- Create a trigger function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_incidents_updated_at BEFORE UPDATE ON public.emergency_incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_development_projects_updated_at BEFORE UPDATE ON public.development_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
