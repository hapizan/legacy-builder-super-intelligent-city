-- Row Level Security Policies for Smart City System
-- These policies ensure data security and proper access control

-- User Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Buildings and Infrastructure (Public read access, admin write)
CREATE POLICY "Anyone can view buildings" ON public.buildings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage buildings" ON public.buildings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'city_planner', 'operator')
    )
  );

-- Zones (Public read access, admin write)
CREATE POLICY "Anyone can view zones" ON public.zones
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage zones" ON public.zones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'city_planner', 'operator')
    )
  );

-- Sensors (Public read access, admin write)
CREATE POLICY "Anyone can view sensors" ON public.sensors
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage sensors" ON public.sensors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Sensor Readings (Public read access, system write)
CREATE POLICY "Anyone can view sensor readings" ON public.sensor_readings
  FOR SELECT USING (true);

CREATE POLICY "System can insert sensor readings" ON public.sensor_readings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage sensor readings" ON public.sensor_readings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Traffic Management (Public read access, admin write)
CREATE POLICY "Anyone can view traffic lights" ON public.traffic_lights
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage traffic lights" ON public.traffic_lights
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Anyone can view traffic flow" ON public.traffic_flow
  FOR SELECT USING (true);

CREATE POLICY "System can insert traffic flow data" ON public.traffic_flow
  FOR INSERT WITH CHECK (true);

-- Emergency Management
CREATE POLICY "Anyone can view emergency incidents" ON public.emergency_incidents
  FOR SELECT USING (true);

CREATE POLICY "Citizens can report incidents" ON public.emergency_incidents
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Emergency responders can manage incidents" ON public.emergency_incidents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'emergency_responder', 'operator')
    )
  );

CREATE POLICY "Emergency responders can view resources" ON public.emergency_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'emergency_responder', 'operator')
    )
  );

CREATE POLICY "Admins can manage emergency resources" ON public.emergency_resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Energy Management (Public read access, admin write)
CREATE POLICY "Anyone can view energy consumption" ON public.energy_consumption
  FOR SELECT USING (true);

CREATE POLICY "System can insert energy data" ON public.energy_consumption
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage energy data" ON public.energy_consumption
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Waste Management (Public read access, admin write)
CREATE POLICY "Anyone can view waste collection" ON public.waste_collection
  FOR SELECT USING (true);

CREATE POLICY "System can update waste levels" ON public.waste_collection
  FOR UPDATE USING (true);

CREATE POLICY "Admins can manage waste collection" ON public.waste_collection
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Development Projects
CREATE POLICY "Anyone can view development projects" ON public.development_projects
  FOR SELECT USING (true);

CREATE POLICY "City planners can manage projects" ON public.development_projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'city_planner', 'operator')
    )
  );

-- Permits
CREATE POLICY "Anyone can view permits" ON public.permits
  FOR SELECT USING (true);

CREATE POLICY "Citizens can submit permits" ON public.permits
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "City planners can manage permits" ON public.permits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'city_planner', 'operator')
    )
  );

-- AI Insights (Public read access, system write)
CREATE POLICY "Anyone can view AI insights" ON public.ai_insights
  FOR SELECT USING (true);

CREATE POLICY "System can create AI insights" ON public.ai_insights
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage AI insights" ON public.ai_insights
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- System Alerts
CREATE POLICY "Authenticated users can view alerts" ON public.system_alerts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create alerts" ON public.system_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage alerts" ON public.system_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Service Requests
CREATE POLICY "Citizens can view their own requests" ON public.service_requests
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Citizens can submit service requests" ON public.service_requests
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Staff can view all service requests" ON public.service_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator', 'city_planner')
    )
  );

CREATE POLICY "Staff can manage service requests" ON public.service_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operator', 'city_planner')
    )
  );
