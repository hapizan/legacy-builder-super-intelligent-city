"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Box, Cylinder, Plane } from "@react-three/drei"
import type { Mesh, Group } from "three"
import * as THREE from "three"

// Detailed building data for realistic Cyberjaya layout
// Properly spaced to avoid road conflicts and realistic distances
const buildings = [
  {
    id: 1,
    name: "Cyberjaya City Centre",
    position: [10, 0, 15] as [number, number, number], // Central commercial area
    size: [8, 30, 8] as [number, number, number],
    floors: 25,
    color: "#3b82f6",
    type: "commercial" as const,
    hasBalconies: true,
    hasRoof: true,
    windowPattern: "grid",
  },
  {
    id: 2,
    name: "MSC Malaysia HQ",
    position: [45, 0, 35] as [number, number, number], // Northeast tech district
    size: [8, 22, 8] as [number, number, number],
    floors: 18,
    color: "#10b981",
    type: "office" as const,
    hasBalconies: false,
    hasRoof: true,
    windowPattern: "horizontal",
  },
  {
    id: 3,
    name: "Multimedia University (MMU)",
    position: [-50, 0, 40] as [number, number, number], // Northwest education district
    size: [15, 18, 12] as [number, number, number],
    floors: 12,
    color: "#f59e0b",
    type: "education" as const,
    hasBalconies: true,
    hasRoof: false,
    windowPattern: "vertical",
  },
  {
    id: 4,
    name: "Cyberview Lodge Resort",
    position: [55, 0, -25] as [number, number, number], // Southeast resort area
    size: [12, 15, 8] as [number, number, number],
    floors: 8,
    color: "#8b5cf6",
    type: "residential" as const,
    hasBalconies: true,
    hasRoof: true,
    windowPattern: "residential",
  },
  {
    id: 5,
    name: "Tamarind Square",
    position: [-25, 0, -15] as [number, number, number], // West commercial
    size: [10, 12, 10] as [number, number, number],
    floors: 6,
    color: "#ef4444",
    type: "retail" as const,
    hasBalconies: false,
    hasRoof: true,
    windowPattern: "storefront",
  },
  {
    id: 6,
    name: "Shaftsbury Square",
    position: [35, 0, -15] as [number, number, number], // East mixed-use
    size: [8, 16, 8] as [number, number, number],
    floors: 10,
    color: "#06b6d4",
    type: "mixed" as const,
    hasBalconies: true,
    hasRoof: true,
    windowPattern: "mixed",
  },
  {
    id: 7,
    name: "D'Pulze Shopping Centre",
    position: [-35, 0, 15] as [number, number, number], // West retail district
    size: [18, 10, 12] as [number, number, number],
    floors: 4,
    color: "#84cc16",
    type: "retail" as const,
    hasBalconies: false,
    hasRoof: false,
    windowPattern: "mall",
  },
  {
    id: 8,
    name: "Cyberjaya University College",
    position: [25, 0, 55] as [number, number, number], // North education zone
    size: [16, 20, 12] as [number, number, number],
    floors: 14,
    color: "#f97316",
    type: "education" as const,
    hasBalconies: true,
    hasRoof: true,
    windowPattern: "campus",
  },
  {
    id: 9,
    name: "Sky Park Cyberjaya",
    position: [-15, 0, -45] as [number, number, number], // Southwest premium district
    size: [12, 32, 10] as [number, number, number], // Main tower only
    floors: 28,
    color: "#6366f1",
    type: "mixed" as const,
    hasBalconies: true,
    hasRoof: true,
    windowPattern: "luxury",
    isSkyPark: true,
    serviced_apartments: 296,
    hotel_rooms: 390,
    hasSkyBridge: true,
  },
  {
    id: 10,
    name: "Putrajaya Marriott Hotel",
    position: [65, 0, 10] as [number, number, number], // East hospitality
    size: [14, 20, 12] as [number, number, number],
    floors: 15,
    color: "#dc2626",
    type: "hotel" as const,
    hasBalconies: true,
    hasRoof: true,
    windowPattern: "hotel",
  },
  {
    id: 11,
    name: "Cyberjaya Transport Terminal",
    position: [15, 0, -65] as [number, number, number], // South transport hub
    size: [28, 8, 15] as [number, number, number],
    floors: 3,
    color: "#64748b",
    type: "transport" as const,
    hasBalconies: false,
    hasRoof: false,
    windowPattern: "industrial",
  },
  {
    id: 12,
    name: "Limkokwing University",
    position: [-65, 0, -25] as [number, number, number], // Southwest education
    size: [20, 16, 15] as [number, number, number],
    floors: 10,
    color: "#f59e0b",
    type: "education" as const,
    hasBalconies: true,
    hasRoof: true,
    windowPattern: "campus",
  },
  {
    id: 13,
    name: "Cyberjaya Medical Centre",
    position: [25, 0, -85] as [number, number, number], // South medical district
    size: [22, 15, 18] as [number, number, number],
    floors: 8,
    color: "#059669",
    type: "healthcare" as const,
    hasBalconies: false,
    hasRoof: true,
    windowPattern: "medical",
  },
];

interface BuildingData {
  id: number;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  floors: number;
  color: string;
  type: 'commercial' | 'office' | 'education' | 'residential' | 'retail' | 'mixed' | 'hotel' | 'transport' | 'healthcare';
  hasBalconies: boolean;
  hasRoof: boolean;
  windowPattern: string;
  isSkyPark?: boolean;
  serviced_apartments?: number;
  hotel_rooms?: number;
  hasSkyBridge?: boolean;
}

// Interior system interfaces for building interiors
interface InteriorElement {
  id: string;
  type: 'host_desk' | 'emergency_stair' | 'lift' | 'emergency_exit' | 'office_room' | 'meeting_room' | 'corridor' | 'lobby';
  position: [number, number, number];
  size: [number, number, number];
  floor: number;
  label?: string;
  color?: string;
}

interface BuildingInterior {
  buildingId: number;
  elements: InteriorElement[];
  floorPlans: FloorPlan[];
}

interface FloorPlan {
  floor: number;
  layout: 'open_office' | 'mixed_office' | 'residential' | 'commercial' | 'lobby';
  rooms: Room[];
}

interface Room {
  id: string;
  type: 'office' | 'meeting' | 'corridor' | 'lobby' | 'utility' | 'emergency';
  position: [number, number];
  size: [number, number];
  color: string;
}

// Building interior data for detailed floor plans
const buildingInteriors: BuildingInterior[] = [
  {
    buildingId: 1, // Cyberjaya City Centre
    floorPlans: [
      {
        floor: 0, // Ground floor - Lobby
        layout: 'lobby',
        rooms: [
          { id: 'main-lobby', type: 'lobby', position: [0, 0], size: [7, 7], color: '#f8fafc' },
          { id: 'reception-area', type: 'office', position: [2, -2.5], size: [2.5, 1.5], color: '#e2e8f0' },
          { id: 'security-office', type: 'office', position: [-2, -2.5], size: [1.5, 1], color: '#fef2f2' },
          { id: 'retail-space', type: 'office', position: [3, 2.5], size: [2, 2], color: '#f0f9ff' },
        ]
      },
      {
        floor: 1, // Typical office floor
        layout: 'mixed_office',
        rooms: [
          { id: 'main-corridor', type: 'corridor', position: [0, 0], size: [8, 1.2], color: '#cbd5e1' },
          { id: 'office-suite-1', type: 'office', position: [-2.5, 2.5], size: [2.5, 2.5], color: '#f1f5f9' },
          { id: 'office-suite-2', type: 'office', position: [2.5, 2.5], size: [2.5, 2.5], color: '#f1f5f9' },
          { id: 'conference-room-1', type: 'meeting', position: [-2.5, -2.5], size: [2.5, 2], color: '#e0f2fe' },
          { id: 'conference-room-2', type: 'meeting', position: [2.5, -2.5], size: [2.5, 2], color: '#e0f2fe' },
          { id: 'break-room', type: 'utility', position: [0, -3.5], size: [1.5, 1], color: '#f0fdf4' },
        ]
      }
    ],
    elements: [
      // Ground floor elements
      { id: 'main-reception', type: 'host_desk', position: [2, 0.1, -2.5], size: [2, 0.8, 1.2], floor: 0, label: 'Main Reception', color: '#3b82f6' },
      { id: 'security-desk', type: 'host_desk', position: [-2, 0.1, -2.5], size: [1.2, 0.8, 0.8], floor: 0, label: 'Security', color: '#ef4444' },
      { id: 'lift-bank-1', type: 'lift', position: [-3.5, 0, 0], size: [1.4, 2.8, 1.4], floor: 0, label: 'Lift Bank A', color: '#6b7280' },
      { id: 'lift-bank-2', type: 'lift', position: [3.5, 0, 0], size: [1.4, 2.8, 1.4], floor: 0, label: 'Lift Bank B', color: '#6b7280' },
      { id: 'fire-stair-east', type: 'emergency_stair', position: [3.5, 0, 3.5], size: [1.5, 2.8, 1.5], floor: 0, label: 'Fire Stair East', color: '#f97316' },
      { id: 'fire-stair-west', type: 'emergency_stair', position: [-3.5, 0, 3.5], size: [1.5, 2.8, 1.5], floor: 0, label: 'Fire Stair West', color: '#f97316' },
      { id: 'main-entrance', type: 'emergency_exit', position: [0, 0.1, -3.8], size: [2, 2.5, 0.2], floor: 0, label: 'Main Entrance', color: '#10b981' },
      { id: 'fire-exit-east', type: 'emergency_exit', position: [3.8, 0.1, 0], size: [0.2, 2.2, 1.5], floor: 0, label: 'Fire Exit East', color: '#f59e0b' },
      { id: 'fire-exit-west', type: 'emergency_exit', position: [-3.8, 0.1, 0], size: [0.2, 2.2, 1.5], floor: 0, label: 'Fire Exit West', color: '#f59e0b' },
      
      // Water hosts (fire hose cabinets)
      { id: 'water-host-1', type: 'office_room', position: [1.5, 0.5, 3.5], size: [0.3, 1.5, 0.4], floor: 0, label: 'Fire Hose', color: '#dc2626' },
      { id: 'water-host-2', type: 'office_room', position: [-1.5, 0.5, 3.5], size: [0.3, 1.5, 0.4], floor: 0, label: 'Fire Hose', color: '#dc2626' },
      
      // Typical floor elements (floors 1-24)
      { id: 'lift-a-f1', type: 'lift', position: [-3.5, 3.5, 0], size: [1.4, 2.8, 1.4], floor: 1, label: 'Lift Bank A', color: '#6b7280' },
      { id: 'lift-b-f1', type: 'lift', position: [3.5, 3.5, 0], size: [1.4, 2.8, 1.4], floor: 1, label: 'Lift Bank B', color: '#6b7280' },
      { id: 'fire-stair-east-f1', type: 'emergency_stair', position: [3.5, 3.5, 3.5], size: [1.5, 2.8, 1.5], floor: 1, label: 'Fire Stair East', color: '#f97316' },
      { id: 'fire-stair-west-f1', type: 'emergency_stair', position: [-3.5, 3.5, 3.5], size: [1.5, 2.8, 1.5], floor: 1, label: 'Fire Stair West', color: '#f97316' },
      { id: 'fire-exit-east-f1', type: 'emergency_exit', position: [3.8, 3.6, 0], size: [0.2, 2.2, 1.5], floor: 1, label: 'Fire Exit East', color: '#f59e0b' },
      { id: 'fire-exit-west-f1', type: 'emergency_exit', position: [-3.8, 3.6, 0], size: [0.2, 2.2, 1.5], floor: 1, label: 'Fire Exit West', color: '#f59e0b' },
      { id: 'reception-desk-f1', type: 'host_desk', position: [0, 3.6, -1], size: [1.5, 0.8, 0.8], floor: 1, label: 'Floor Reception', color: '#3b82f6' },
      
      // Water hosts on floor 1
      { id: 'water-host-1-f1', type: 'office_room', position: [1.5, 4, 3.5], size: [0.3, 1.5, 0.4], floor: 1, label: 'Fire Hose', color: '#dc2626' },
      { id: 'water-host-2-f1', type: 'office_room', position: [-1.5, 4, 3.5], size: [0.3, 1.5, 0.4], floor: 1, label: 'Fire Hose', color: '#dc2626' },
      { id: 'water-cooler-f1', type: 'office_room', position: [0, 3.6, -3], size: [0.4, 1.2, 0.4], floor: 1, label: 'Water Cooler', color: '#06b6d4' },
    ]
  },
  {
    buildingId: 2, // MSC Malaysia HQ
    floorPlans: [
      {
        floor: 0,
        layout: 'lobby',
        rooms: [
          { id: 'corporate-lobby', type: 'lobby', position: [0, 0], size: [7, 6], color: '#f0f9ff' },
          { id: 'security-office', type: 'office', position: [2.5, -2.5], size: [2, 1.5], color: '#dbeafe' },
          { id: 'visitor-lounge', type: 'meeting', position: [-2.5, -2.5], size: [2, 1.5], color: '#f0fdf4' },
          { id: 'cafe-area', type: 'utility', position: [3, 2.5], size: [1.5, 1.5], color: '#fef3c7' },
        ]
      },
      {
        floor: 1,
        layout: 'open_office',
        rooms: [
          { id: 'open-workspace', type: 'office', position: [0, 1], size: [7, 4], color: '#f0fdf4' },
          { id: 'server-room', type: 'utility', position: [3, -2.5], size: [2, 2], color: '#fef3c7' },
          { id: 'meeting-pods', type: 'meeting', position: [-2.5, -2.5], size: [3, 2], color: '#fef7ff' },
        ]
      },
      {
        floor: 2,
        layout: 'mixed_office',
        rooms: [
          { id: 'executive-corridor', type: 'corridor', position: [0, 0], size: [8, 1], color: '#cbd5e1' },
          { id: 'ceo-office', type: 'office', position: [2.5, 2.5], size: [2.5, 2.5], color: '#fef2f2' },
          { id: 'boardroom', type: 'meeting', position: [-2.5, 2.5], size: [3, 2.5], color: '#f0f9ff' },
          { id: 'finance-dept', type: 'office', position: [2.5, -2.5], size: [2.5, 2], color: '#f1f5f9' },
          { id: 'hr-dept', type: 'office', position: [-2.5, -2.5], size: [2.5, 2], color: '#fef7ff' },
        ]
      }
    ],
    elements: [
      // Ground floor
      { id: 'main-reception', type: 'host_desk', position: [0, 0.1, -2.5], size: [2.5, 0.8, 1.2], floor: 0, label: 'Main Reception', color: '#3b82f6' },
      { id: 'security-desk', type: 'host_desk', position: [2.5, 0.1, -2.5], size: [1.5, 0.8, 0.8], floor: 0, label: 'Security Desk', color: '#ef4444' },
      { id: 'visitor-check-in', type: 'host_desk', position: [-2.5, 0.1, -2.5], size: [1.5, 0.8, 0.8], floor: 0, label: 'Visitor Check-in', color: '#3b82f6' },
      { id: 'main-elevator', type: 'lift', position: [-3.5, 0, 0], size: [1.6, 2.8, 1.6], floor: 0, label: 'Main Elevator', color: '#6b7280' },
      { id: 'service-elevator', type: 'lift', position: [3.5, 0, 0], size: [1.2, 2.8, 1.2], floor: 0, label: 'Service Elevator', color: '#6b7280' },
      { id: 'fire-stair-1', type: 'emergency_stair', position: [-3.5, 0, 3.5], size: [1.6, 2.8, 1.6], floor: 0, label: 'Fire Stair A', color: '#f97316' },
      { id: 'fire-stair-2', type: 'emergency_stair', position: [3.5, 0, 3.5], size: [1.6, 2.8, 1.6], floor: 0, label: 'Fire Stair B', color: '#f97316' },
      { id: 'main-exit', type: 'emergency_exit', position: [0, 0.1, -3.8], size: [2.5, 2.5, 0.2], floor: 0, label: 'Main Exit', color: '#10b981' },
      { id: 'emergency-exit-1', type: 'emergency_exit', position: [-3.8, 0.1, 0], size: [0.2, 2.2, 2], floor: 0, label: 'Emergency Exit', color: '#f59e0b' },
      { id: 'emergency-exit-2', type: 'emergency_exit', position: [3.8, 0.1, 0], size: [0.2, 2.2, 2], floor: 0, label: 'Emergency Exit', color: '#f59e0b' },
      
      // Water hosts and safety equipment
      { id: 'fire-hose-1', type: 'office_room', position: [1.8, 0.5, 3.5], size: [0.4, 1.6, 0.5], floor: 0, label: 'Fire Hose', color: '#dc2626' },
      { id: 'fire-hose-2', type: 'office_room', position: [-1.8, 0.5, 3.5], size: [0.4, 1.6, 0.5], floor: 0, label: 'Fire Hose', color: '#dc2626' },
      { id: 'water-cooler-lobby', type: 'office_room', position: [0, 0.6, 2.5], size: [0.4, 1.2, 0.4], floor: 0, label: 'Water Cooler', color: '#06b6d4' },
      
      // Floor 1 - Tech floor
      { id: 'elevator-f1', type: 'lift', position: [-3.5, 3.5, 0], size: [1.6, 2.8, 1.6], floor: 1, label: 'Main Elevator', color: '#6b7280' },
      { id: 'service-elevator-f1', type: 'lift', position: [3.5, 3.5, 0], size: [1.2, 2.8, 1.2], floor: 1, label: 'Service Elevator', color: '#6b7280' },
      { id: 'fire-stair-1-f1', type: 'emergency_stair', position: [-3.5, 3.5, 3.5], size: [1.6, 2.8, 1.6], floor: 1, label: 'Fire Stair A', color: '#ef4444' },
      { id: 'fire-stair-2-f1', type: 'emergency_stair', position: [3.5, 3.5, 3.5], size: [1.6, 2.8, 1.6], floor: 1, label: 'Fire Stair B', color: '#ef4444' },
      { id: 'it-helpdesk', type: 'host_desk', position: [0, 3.6, -2.5], size: [2, 0.8, 1], floor: 1, label: 'IT Helpdesk', color: '#8b5cf6' },
      { id: 'server-access', type: 'host_desk', position: [3, 3.6, -2.5], size: [1.2, 0.8, 0.8], floor: 1, label: 'Server Access', color: '#f59e0b' },
      
      // Water hosts floor 1
      { id: 'fire-hose-1-f1', type: 'office_room', position: [1.8, 4, 3.5], size: [0.4, 1.6, 0.5], floor: 1, label: 'Fire Hose', color: '#dc2626' },
      { id: 'fire-hose-2-f1', type: 'office_room', position: [-1.8, 4, 3.5], size: [0.4, 1.6, 0.5], floor: 1, label: 'Fire Hose', color: '#dc2626' },
      { id: 'water-station-f1', type: 'office_room', position: [0, 4.1, 2.5], size: [0.4, 1.2, 0.4], floor: 1, label: 'Water Station', color: '#06b6d4' },
      
      // Floor 2 - Executive floor
      { id: 'elevator-f2', type: 'lift', position: [-3.5, 7, 0], size: [1.6, 2.8, 1.6], floor: 2, label: 'Executive Elevator', color: '#6b7280' },
      { id: 'fire-stair-1-f2', type: 'emergency_stair', position: [-3.5, 7, 3.5], size: [1.6, 2.8, 1.6], floor: 2, label: 'Fire Stair A', color: '#ef4444' },
      { id: 'fire-stair-2-f2', type: 'emergency_stair', position: [3.5, 7, 3.5], size: [1.6, 2.8, 1.6], floor: 2, label: 'Fire Stair B', color: '#ef4444' },
      { id: 'executive-assistant', type: 'host_desk', position: [2.5, 7.1, 1], size: [1.5, 0.8, 0.8], floor: 2, label: 'Executive Assistant', color: '#8b5cf6' },
      { id: 'boardroom-service', type: 'host_desk', position: [-2.5, 7.1, 1], size: [1.2, 0.8, 0.6], floor: 2, label: 'Boardroom Service', color: '#3b82f6' },
      
      // Water hosts floor 2
      { id: 'fire-hose-1-f2', type: 'office_room', position: [1.8, 7.5, 3.5], size: [0.4, 1.6, 0.5], floor: 2, label: 'Fire Hose', color: '#dc2626' },
      { id: 'fire-hose-2-f2', type: 'office_room', position: [-1.8, 7.5, 3.5], size: [0.4, 1.6, 0.5], floor: 2, label: 'Fire Hose', color: '#dc2626' },
      { id: 'executive-water', type: 'office_room', position: [0, 7.6, 2.5], size: [0.4, 1.2, 0.4], floor: 2, label: 'Executive Water', color: '#06b6d4' },
    ]
  },
  {
    buildingId: 3, // Multimedia University (MMU)
    floorPlans: [
      {
        floor: 0,
        layout: 'lobby',
        rooms: [
          { id: 'student-lobby', type: 'lobby', position: [0, 0], size: [10, 8], color: '#fef3c7' },
          { id: 'admin-office', type: 'office', position: [4, -3], size: [3, 2], color: '#fed7aa' },
          { id: 'info-counter', type: 'office', position: [-4, -3], size: [3, 1.5], color: '#fed7aa' },
        ]
      },
      {
        floor: 1,
        layout: 'mixed_office',
        rooms: [
          { id: 'lecture-hall-1', type: 'meeting', position: [-4, 2], size: [4, 3], color: '#fde68a' },
          { id: 'lecture-hall-2', type: 'meeting', position: [4, 2], size: [4, 3], color: '#fde68a' },
          { id: 'main-corridor', type: 'corridor', position: [0, 0], size: [12, 1.5], color: '#fbbf24' },
          { id: 'faculty-office-1', type: 'office', position: [-4, -3], size: [3, 2], color: '#f3e8ff' },
          { id: 'faculty-office-2', type: 'office', position: [4, -3], size: [3, 2], color: '#f3e8ff' },
        ]
      }
    ],
    elements: [
      // Ground floor
      { id: 'student-services', type: 'host_desk', position: [-4, 0.1, -3], size: [2, 0.8, 1], floor: 0, label: 'Student Services', color: '#3b82f6' },
      { id: 'security-desk', type: 'host_desk', position: [4, 0.1, -3], size: [1.5, 0.8, 0.8], floor: 0, label: 'Security', color: '#ef4444' },
      { id: 'main-elevator', type: 'lift', position: [-6, 0, 0], size: [2, 2.5, 2], floor: 0, label: 'Main Elevator', color: '#6b7280' },
      { id: 'emergency-stair-east', type: 'emergency_stair', position: [6, 0, 4], size: [2, 2.5, 2], floor: 0, label: 'Emergency Stair East', color: '#ef4444' },
      { id: 'emergency-stair-west', type: 'emergency_stair', position: [-6, 0, 4], size: [2, 2.5, 2], floor: 0, label: 'Emergency Stair West', color: '#ef4444' },
      { id: 'main-entrance-exit', type: 'emergency_exit', position: [0, 0.1, -6], size: [3, 2.5, 0.3], floor: 0, label: 'Main Entrance', color: '#10b981' },
      { id: 'side-exit-east', type: 'emergency_exit', position: [7.5, 0.1, 0], size: [0.3, 2.2, 2], floor: 0, label: 'Side Exit', color: '#f59e0b' },
      { id: 'side-exit-west', type: 'emergency_exit', position: [-7.5, 0.1, 0], size: [0.3, 2.2, 2], floor: 0, label: 'Side Exit', color: '#f59e0b' },
      
      // First floor
      { id: 'elevator-f1', type: 'lift', position: [-6, 3, 0], size: [2, 2.5, 2], floor: 1, label: 'Main Elevator', color: '#6b7280' },
      { id: 'stair-east-f1', type: 'emergency_stair', position: [6, 3, 4], size: [2, 2.5, 2], floor: 1, label: 'Emergency Stair East', color: '#ef4444' },
      { id: 'stair-west-f1', type: 'emergency_stair', position: [-6, 3, 4], size: [2, 2.5, 2], floor: 1, label: 'Emergency Stair West', color: '#ef4444' },
      { id: 'faculty-reception', type: 'host_desk', position: [0, 3.1, -1], size: [1.5, 0.8, 0.8], floor: 1, label: 'Faculty Reception', color: '#8b5cf6' },
    ]
  },
  {
    buildingId: 4, // Cyberview Lodge Resort
    floorPlans: [
      {
        floor: 0, // Hotel lobby
        layout: 'lobby',
        rooms: [
          { id: 'grand-lobby', type: 'lobby', position: [0, 0], size: [8, 6], color: '#fef7ff' },
          { id: 'concierge', type: 'office', position: [3, -2.5], size: [2, 1.5], color: '#f3e8ff' },
          { id: 'bell-services', type: 'office', position: [-3, -2.5], size: [2, 1.5], color: '#f3e8ff' },
          { id: 'restaurant', type: 'utility', position: [0, 3], size: [4, 2], color: '#fef3c7' },
        ]
      },
      {
        floor: 1, // Guest rooms
        layout: 'residential',
        rooms: [
          { id: 'guest-corridor', type: 'corridor', position: [0, 0], size: [8, 1.5], color: '#f1f5f9' },
          { id: 'suite-101', type: 'office', position: [-3, 2.5], size: [2, 2], color: '#fef2f2' },
          { id: 'suite-102', type: 'office', position: [3, 2.5], size: [2, 2], color: '#fef2f2' },
          { id: 'suite-103', type: 'office', position: [-3, -2.5], size: [2, 2], color: '#fef2f2' },
          { id: 'suite-104', type: 'office', position: [3, -2.5], size: [2, 2], color: '#fef2f2' },
        ]
      }
    ],
    elements: [
      // Ground floor
      { id: 'front-desk', type: 'host_desk', position: [0, 0.1, -2.5], size: [3, 0.8, 1.2], floor: 0, label: 'Front Desk', color: '#3b82f6' },
      { id: 'concierge-desk', type: 'host_desk', position: [3, 0.1, -2.5], size: [1.5, 0.8, 0.8], floor: 0, label: 'Concierge', color: '#8b5cf6' },
      { id: 'guest-elevator', type: 'lift', position: [-3.5, 0, 0], size: [1.6, 2.8, 1.6], floor: 0, label: 'Guest Elevator', color: '#6b7280' },
      { id: 'service-elevator-hotel', type: 'lift', position: [3.5, 0, 0], size: [1.2, 2.8, 1.2], floor: 0, label: 'Service Elevator', color: '#6b7280' },
      { id: 'fire-exit-hotel', type: 'emergency_exit', position: [0, 0.1, -3.8], size: [2, 2.5, 0.2], floor: 0, label: 'Main Exit', color: '#10b981' },
      { id: 'emergency-stair-hotel', type: 'emergency_stair', position: [-3.5, 0, 3.5], size: [1.6, 2.8, 1.6], floor: 0, label: 'Emergency Stair', color: '#ef4444' },
      
      // Water and safety
      { id: 'fire-hose-hotel-1', type: 'office_room', position: [2, 0.5, 3.5], size: [0.4, 1.6, 0.5], floor: 0, label: 'Fire Hose', color: '#dc2626' },
      { id: 'water-station-lobby', type: 'office_room', position: [-2, 0.6, 3], size: [0.4, 1.2, 0.4], floor: 0, label: 'Water Station', color: '#06b6d4' },
      
      // Floor 1
      { id: 'guest-elevator-f1', type: 'lift', position: [-3.5, 3.5, 0], size: [1.6, 2.8, 1.6], floor: 1, label: 'Guest Elevator', color: '#6b7280' },
      { id: 'service-elevator-f1', type: 'lift', position: [3.5, 3.5, 0], size: [1.2, 2.8, 1.2], floor: 1, label: 'Service Elevator', color: '#6b7280' },
      { id: 'emergency-stair-f1', type: 'emergency_stair', position: [-3.5, 3.5, 3.5], size: [1.6, 2.8, 1.6], floor: 1, label: 'Emergency Stair', color: '#ef4444' },
      { id: 'housekeeping-station', type: 'host_desk', position: [0, 3.6, -3], size: [1.2, 0.8, 0.8], floor: 1, label: 'Housekeeping', color: '#f59e0b' },
      
      // Water hosts floor 1
      { id: 'fire-hose-hotel-f1', type: 'office_room', position: [2, 4, 3.5], size: [0.4, 1.6, 0.5], floor: 1, label: 'Fire Hose', color: '#dc2626' },
    ]
  },
  {
    buildingId: 5, // Putrajaya International Convention Centre
    floorPlans: [
      {
        floor: 0,
        layout: 'commercial',
        rooms: [
          { id: 'main-hall', type: 'lobby', position: [0, 0], size: [10, 8], color: '#f8fafc' },
          { id: 'registration', type: 'office', position: [4, -3], size: [3, 2], color: '#e2e8f0' },
          { id: 'info-desk', type: 'office', position: [-4, -3], size: [3, 2], color: '#e2e8f0' },
        ]
      }
    ],
    elements: [
      { id: 'main-info', type: 'host_desk', position: [0, 0.1, -3], size: [3, 0.8, 1.2], floor: 0, label: 'Information', color: '#3b82f6' },
      { id: 'registration-desk', type: 'host_desk', position: [4, 0.1, -3], size: [2, 0.8, 1], floor: 0, label: 'Registration', color: '#8b5cf6' },
      { id: 'main-lift-conv', type: 'lift', position: [-4.5, 0, 0], size: [2, 2.8, 2], floor: 0, label: 'Main Elevator', color: '#6b7280' },
      { id: 'fire-exit-conv', type: 'emergency_exit', position: [0, 0.1, -4.5], size: [3, 2.5, 0.3], floor: 0, label: 'Main Exit', color: '#10b981' },
      { id: 'emergency-stair-conv', type: 'emergency_stair', position: [4.5, 0, 4], size: [2, 2.8, 2], floor: 0, label: 'Emergency Stair', color: '#ef4444' },
      { id: 'fire-hose-conv', type: 'office_room', position: [3, 0.5, 4], size: [0.5, 1.8, 0.6], floor: 0, label: 'Fire Hose', color: '#dc2626' },
      { id: 'water-station-conv', type: 'office_room', position: [-3, 0.6, 4], size: [0.4, 1.2, 0.4], floor: 0, label: 'Water Station', color: '#06b6d4' },
    ]
  }
];

// Component for realistic windows
function BuildingWindows({ building }: { building: BuildingData }) {
  const windows = []
  const floorHeight = building.size[1] / building.floors
  
  // Generate windows based on pattern
  for (let floor = 0; floor < building.floors; floor++) {
    const y = (floor * floorHeight) + (floorHeight / 2)
    
    // Front and back faces
    for (let side of [-1, 1]) {
      const windowsPerRow = Math.floor(building.size[0] / 1.5)
      for (let i = 0; i < windowsPerRow; i++) {
        const x = (i - windowsPerRow / 2) * 1.2
        const z = side * (building.size[2] / 2 + 0.02)
        
        windows.push(
          <Box
            key={`window-front-${floor}-${i}-${side}`}
            args={[0.8, floorHeight * 0.6, 0.05]}
            position={[x, y, z]}
          >
            <meshStandardMaterial 
              color="#87ceeb" 
              transparent 
              opacity={0.7} 
              emissive="#4a90e2"
              emissiveIntensity={0.1}
            />
          </Box>
        )
      }
    }
    
    // Side faces
    for (let side of [-1, 1]) {
      const windowsPerRow = Math.floor(building.size[2] / 1.5)
      for (let i = 0; i < windowsPerRow; i++) {
        const z = (i - windowsPerRow / 2) * 1.2
        const x = side * (building.size[0] / 2 + 0.02)
        
        windows.push(
          <Box
            key={`window-side-${floor}-${i}-${side}`}
            args={[0.05, floorHeight * 0.6, 0.8]}
            position={[x, y, z]}
          >
            <meshStandardMaterial 
              color="#87ceeb" 
              transparent 
              opacity={0.7}
              emissive="#4a90e2"
              emissiveIntensity={0.1}
            />
          </Box>
        )
      }
    }
  }
  
  return <group>{windows}</group>
}

// Component for building interior elements
function BuildingInterior({ building, showInterior }: { building: BuildingData, showInterior: boolean }) {
  if (!showInterior) return null;
  
  const interior = buildingInteriors.find(int => int.buildingId === building.id);
  
  // If no specific interior data, create a default one with basic elements
  const defaultInterior = {
    buildingId: building.id,
    floorPlans: [
      {
        floor: 0,
        layout: 'lobby' as const,
        rooms: [
          { id: 'main-room', type: 'lobby' as const, position: [0, 0] as [number, number], size: [building.size[0]-1, building.size[2]-1] as [number, number], color: '#f8fafc' }
        ]
      }
    ],
    elements: [
      { id: 'test-stair', type: 'emergency_stair' as const, position: [building.size[0]/3, 0, building.size[2]/3] as [number, number, number], size: [1.5, 3, 1.5] as [number, number, number], floor: 0, label: 'Emergency Stair', color: '#f97316' },
      { id: 'test-lift', type: 'lift' as const, position: [-building.size[0]/3, 0, -building.size[2]/3] as [number, number, number], size: [1.2, 2.5, 1.2] as [number, number, number], floor: 0, label: 'Lift', color: '#6b7280' }
    ]
  };
  
  const activeInterior = interior || defaultInterior;

  return (
    <group position={[building.position[0], building.position[1] + building.size[1]/2, building.position[2]]}>
      {/* TEST: Big obvious cube to see if interior is rendering */}
      <Box args={[2, 2, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ff00ff" 
          emissive="#ff00ff"
          emissiveIntensity={2.0}
        />
      </Box>
      
      {/* TEST: Simple bright staircase - ORANGE as per viewer legend */}
      <Box args={[1, 3, 1]} position={[3, 0, 3]}>
        <meshStandardMaterial 
          color="#f97316" 
          emissive="#f97316"
          emissiveIntensity={3.0}
        />
      </Box>
      
      {/* Interior lighting */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={2} 
        distance={building.size[0] * 2} 
        color="#ffffff" 
      />
      <pointLight 
        position={[building.size[0]/2, building.size[1]/4, building.size[2]/2]} 
        intensity={1.5} 
        distance={building.size[0]} 
        color="#f0f9ff" 
      />
      <pointLight 
        position={[-building.size[0]/2, building.size[1]/4, -building.size[2]/2]} 
        intensity={1.5} 
        distance={building.size[0]} 
        color="#f0f9ff" 
      />
      
      {/* Floor plans as transparent planes */}
      {activeInterior.floorPlans.map((floor, floorIndex) => (
        <group key={`floor-${floor.floor}`} position={[0, (floor.floor * (building.size[1] / building.floors)) - building.size[1]/2 + 1, 0]}>
          {/* Floor base */}
          <Plane
            args={[building.size[0] - 0.1, building.size[2] - 0.1]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.05, 0]}
          >
            <meshStandardMaterial 
              color="#f8fafc" 
              transparent 
              opacity={0.8}
              emissive="#e2e8f0"
              emissiveIntensity={0.2}
            />
          </Plane>
          
          {/* Floor outline */}
          <Box args={[building.size[0], 0.05, 0.1]} position={[0, 0.025, building.size[2]/2 - 0.1]}>
            <meshStandardMaterial color="#64748b" emissive="#64748b" emissiveIntensity={0.2} />
          </Box>
          <Box args={[building.size[0], 0.05, 0.1]} position={[0, 0.025, -building.size[2]/2 + 0.1]}>
            <meshStandardMaterial color="#64748b" emissive="#64748b" emissiveIntensity={0.2} />
          </Box>
          <Box args={[0.1, 0.05, building.size[2]]} position={[building.size[0]/2 - 0.1, 0.025, 0]}>
            <meshStandardMaterial color="#64748b" emissive="#64748b" emissiveIntensity={0.2} />
          </Box>
          <Box args={[0.1, 0.05, building.size[2]]} position={[-building.size[0]/2 + 0.1, 0.025, 0]}>
            <meshStandardMaterial color="#64748b" emissive="#64748b" emissiveIntensity={0.2} />
          </Box>
          
          {/* Room divisions */}
          {floor.rooms.map((room) => (
            <Box
              key={room.id}
              args={[room.size[0], 0.1, room.size[1]]}
              position={[room.position[0], 0.05, room.position[1]]}
            >
              <meshStandardMaterial color={room.color} transparent opacity={0.6} />
            </Box>
          ))}
          
          {/* Room labels */}
          {floor.rooms.map((room) => (
            <Text
              key={`${room.id}-label`}
              position={[room.position[0], 0.2, room.position[1]]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.3}
              color="#1f2937"
              anchorX="center"
              anchorY="middle"
            >
              {room.type.toUpperCase()}
            </Text>
          ))}
        </group>
      ))}

      {/* Interior elements (lifts, stairs, etc.) */}
      {activeInterior.elements.map((element) => {
        const floorHeight = building.size[1] / building.floors;
        const yPosition = (element.floor * floorHeight) - building.size[1]/2 + floorHeight/2 + element.position[1];
        
        return (
          <group key={element.id} position={[element.position[0], yPosition, element.position[2]]}>
            {/* Element geometry - Skip for emergency stairs as they have custom rendering */}
            {element.type !== 'emergency_stair' && (
              <>
                <Box args={element.size}>
                  <meshStandardMaterial 
                    color={element.color || '#64748b'} 
                    transparent 
                    opacity={1.0}
                    emissive={element.color || '#64748b'}
                    emissiveIntensity={showInterior ? 0.6 : 0.3}
                    roughness={0.2}
                    metalness={0.1}
                  />
                </Box>
                
                {/* Glowing outline for better visibility */}
                <Box args={[element.size[0] + 0.15, element.size[1] + 0.15, element.size[2] + 0.15]}>
                  <meshStandardMaterial 
                    color={element.color || '#64748b'} 
                    transparent 
                    opacity={showInterior ? 0.5 : 0.3}
                    emissive={element.color || '#64748b'}
                    emissiveIntensity={showInterior ? 0.8 : 0.5}
                  />
                </Box>
              </>
            )}
            
            {/* Element label */}
            {element.label && (
              <Text
                position={[0, element.size[1]/2 + 0.5, 0]}
                fontSize={0.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#000000"
              >
                {element.label}
              </Text>
            )}
            
            {/* Special styling for different element types */}
            {element.type === 'emergency_exit' && (
              <Text
                position={[0, 0, element.size[2]/2 + 0.1]}
                fontSize={0.25}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                EXIT
              </Text>
            )}
            
            {element.type === 'lift' && (
              <>
                {/* Lift doors - GRAY as per viewer legend */}
                <Box args={[element.size[0] - 0.1, element.size[1] - 0.1, 0.05]} position={[0, 0, element.size[2]/2]}>
                  <meshStandardMaterial 
                    color="#6b7280"
                    emissive="#6b7280"
                    emissiveIntensity={showInterior ? 0.5 : 0.2}
                  />
                </Box>
                {/* Lift indicator */}
                <Box args={[0.3, 0.2, 0.05]} position={[0, element.size[1]/2 - 0.2, element.size[2]/2 + 0.05]}>
                  <meshStandardMaterial 
                    color={showInterior ? "#00ff88" : "#10b981"} 
                    emissive={showInterior ? "#00ff88" : "#10b981"} 
                    emissiveIntensity={showInterior ? 1.0 : 0.5} 
                  />
                </Box>
                {/* Lift call buttons */}
                <Box args={[0.1, 0.15, 0.03]} position={[element.size[0]/2 - 0.2, 0, element.size[2]/2 + 0.08]}>
                  <meshStandardMaterial 
                    color={showInterior ? "#ffaa00" : "#f59e0b"}
                    emissive={showInterior ? "#ffaa00" : "#f59e0b"}
                    emissiveIntensity={showInterior ? 0.8 : 0.3}
                  />
                </Box>
              </>
            )}
            
            {element.type === 'emergency_stair' && (
              <>
                {/* Emergency staircase - ORANGE color as per viewer legend */}
                <Box args={[element.size[0], element.size[1], element.size[2]]}>
                  <meshStandardMaterial 
                    color="#f97316" 
                    emissive="#f97316" 
                    emissiveIntensity={showInterior ? 2.0 : 1.0}
                    transparent
                    opacity={1.0}
                  />
                </Box>
                
                {/* Bright "STAIRS" text label */}
                <Text
                  position={[0, element.size[1]/2 + 0.8, 0]}
                  fontSize={0.6}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.1}
                  outlineColor="#000000"
                >
                  🚨 STAIRS
                </Text>
                
                {/* Flashing beacon on top */}
                {showInterior && (
                  <Cylinder 
                    args={[0.5, 0.5, 0.6]}
                    position={[0, element.size[1]/2 + 0.5, 0]}
                  >
                    <meshStandardMaterial 
                      color="#f97316" 
                      emissive="#f97316"
                      emissiveIntensity={3.0}
                    />
                  </Cylinder>
                )}
                
                {/* Super bright point light */}
                {showInterior && (
                  <pointLight 
                    position={[0, element.size[1]/2, 0]} 
                    intensity={5} 
                    distance={20} 
                    color="#f97316" 
                  />
                )}
              </>
            )}
            
            {element.type === 'host_desk' && (
              <>
                {/* Desk surface - BLUE as per viewer legend */}
                <Box args={[element.size[0], 0.05, element.size[2]]} position={[0, element.size[1]/2, 0]}>
                  <meshStandardMaterial color="#3b82f6" />
                </Box>
                {/* Computer monitor */}
                <Box args={[0.4, 0.3, 0.05]} position={[0, element.size[1]/2 + 0.2, -element.size[2]/4]}>
                  <meshStandardMaterial color="#1f2937" emissive="#3b82f6" emissiveIntensity={0.2} />
                </Box>
                {/* Chair */}
                <Cylinder args={[0.2, 0.2, 0.4]} position={[0, element.size[1]/2 - 0.2, element.size[2]/3]}>
                  <meshStandardMaterial color="#374151" />
                </Cylinder>
              </>
            )}
            
            {/* Water hosts and water coolers */}
            {(element.label?.includes('Fire Hose') || element.label?.includes('Water')) && (
              <>
                {element.label?.includes('Fire Hose') && (
                  <>
                    {/* Fire hose cabinet - RED as per viewer legend */}
                    <Box args={[element.size[0], element.size[1], element.size[2]]} position={[0, 0, 0]}>
                      <meshStandardMaterial 
                        color="#ef4444" 
                        emissive="#ef4444" 
                        emissiveIntensity={showInterior ? 1.0 : 0.3}
                      />
                    </Box>
                    {/* Hose reel */}
                    <Cylinder args={[0.15, 0.15, 0.1]} position={[0, 0, element.size[2]/2]} rotation={[Math.PI/2, 0, 0]}>
                      <meshStandardMaterial 
                        color="#dc2626"
                        emissive="#dc2626"
                        emissiveIntensity={showInterior ? 0.5 : 0.2}
                      />
                    </Cylinder>
                    {/* Glass door */}
                    <Box args={[element.size[0] - 0.05, element.size[1] - 0.1, 0.02]} position={[0, 0, element.size[2]/2 + 0.1]}>
                      <meshStandardMaterial 
                        color={showInterior ? "#ffcccc" : "#fca5a5"} 
                        transparent 
                        opacity={showInterior ? 0.6 : 0.3}
                        emissive={showInterior ? "#ffcccc" : "#000000"}
                        emissiveIntensity={showInterior ? 0.2 : 0}
                      />
                    </Box>
                    {/* Fire hose warning light */}
                    {showInterior && (
                      <Box args={[0.1, 0.05, 0.05]} position={[0, element.size[1]/2 + 0.1, element.size[2]/2 + 0.15]}>
                        <meshStandardMaterial 
                          color="#ff0000" 
                          emissive="#ff0000"
                          emissiveIntensity={1.5}
                        />
                      </Box>
                    )}
                  </>
                )}
                
                {element.label?.includes('Water') && !element.label?.includes('Fire') && (
                  <>
                    {/* Water cooler base */}
                    <Cylinder args={[element.size[0]/2, element.size[0]/2, element.size[1] * 0.7]} position={[0, -element.size[1] * 0.15, 0]}>
                      <meshStandardMaterial color="#0891b2" />
                    </Cylinder>
                    {/* Water bottle */}
                    <Cylinder args={[0.12, 0.15, element.size[1] * 0.4]} position={[0, element.size[1] * 0.3, 0]}>
                      <meshStandardMaterial color="#06b6d4" transparent opacity={0.7} />
                    </Cylinder>
                    {/* Tap */}
                    <Box args={[0.08, 0.05, 0.1]} position={[0, 0, element.size[2]/2]}>
                      <meshStandardMaterial color="#374151" />
                    </Box>
                  </>
                )}
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Component for balconies
function BuildingBalconies({ building }: { building: BuildingData }) {
  if (!building.hasBalconies) return null
  
  const balconies = []
  const floorHeight = building.size[1] / building.floors
  
  // Add balconies every few floors
  for (let floor = 2; floor < building.floors; floor += 3) {
    const y = (floor * floorHeight) + (floorHeight / 2)
    
    // Front balconies
    balconies.push(
      <Box
        key={`balcony-front-${floor}`}
        args={[building.size[0] * 0.8, 0.2, 1.5]}
        position={[0, y, building.size[2] / 2 + 0.75]}
      >
        <meshStandardMaterial color="#d1d5db" />
      </Box>
    )
    
    // Balcony railings
    balconies.push(
      <Box
        key={`railing-front-${floor}`}
        args={[building.size[0] * 0.8, 1, 0.1]}
        position={[0, y + 0.5, building.size[2] / 2 + 1.4]}
      >
        <meshStandardMaterial color="#6b7280" transparent opacity={0.8} />
      </Box>
    )
  }
  
  return <group>{balconies}</group>
}

// Component for building roof details
function BuildingRoof({ building }: { building: BuildingData }) {
  if (!building.hasRoof) return null
  
  const roofY = building.size[1] + 0.5
  
  return (
    <group>
      {/* Main roof */}
      <Box
        args={[building.size[0] + 0.5, 1, building.size[2] + 0.5]}
        position={[0, roofY, 0]}
      >
        <meshStandardMaterial color="#4b5563" />
      </Box>
      
      {/* Roof equipment/details */}
      <Box
        args={[2, 1.5, 1.5]}
        position={[building.size[0] / 4, roofY + 1.25, 0]}
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Antenna or spire for tall buildings */}
      {building.floors > 15 && (
        <Cylinder
          args={[0.1, 0.1, 8]}
          position={[0, roofY + 4.5, 0]}
        >
          <meshStandardMaterial color="#9ca3af" />
        </Cylinder>
      )}
      
      {/* Helipad for very tall buildings */}
      {building.floors > 20 && (
        <Cylinder
          args={[3, 3, 0.2]}
          position={[0, roofY + 0.6, 0]}
        >
          <meshStandardMaterial color="#dc2626" />
        </Cylinder>
      )}
    </group>
  )
}

// Accurate Sky Park Cyberjaya Complex based on real development
function SkyParkComplex({ building }: { building: BuildingData }) {
  if (!building.isSkyPark) return null
  
  // Sky Park has 6 interconnected buildings arranged in a specific layout
  const skyBridgeHeight = 22 // Real sky bridge height (approximately 22 floors up)
  
  return (
    <group>
      {/* Tower 1 (North Tower) - Serviced Apartments */}
      <group position={[0, 0, 18]}>
        <Box
          args={[9, 30, 9]}
          position={[0, 15, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#7c3aed" roughness={0.3} metalness={0.3} />
        </Box>
        <BuildingWindows building={{ ...building, position: [0, 0, 0] as [number, number, number], size: [9, 30, 9] as [number, number, number] }} />
      </group>
      
      {/* Tower 2 (East Tower) - Hotel Rooms */}
      <group position={[20, 0, 8]}>
        <Box
          args={[8, 28, 8]}
          position={[0, 14, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.3} />
        </Box>
        <BuildingWindows building={{ ...building, position: [0, 0, 0] as [number, number, number], size: [8, 28, 8] as [number, number, number] }} />
      </group>
      
      {/* Tower 3 (South Tower) - Mixed Use */}
      <group position={[0, 0, -15]}>
        <Box
          args={[10, 26, 10]}
          position={[0, 13, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#a855f7" roughness={0.3} metalness={0.3} />
        </Box>
        <BuildingWindows building={{ ...building, position: [0, 0, 0] as [number, number, number], size: [10, 26, 10] as [number, number, number] }} />
      </group>
      
      {/* Tower 4 (West Tower) - Office Suites */}
      <group position={[-18, 0, 3]}>
        <Box
          args={[9, 24, 9]}
          position={[0, 12, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#9333ea" roughness={0.3} metalness={0.3} />
        </Box>
        <BuildingWindows building={{ ...building, position: [0, 0, 0] as [number, number, number], size: [9, 24, 9] as [number, number, number] }} />
      </group>
      
      {/* Tower 5 (Central Commercial) - Lower Rise */}
      <group position={[-8, 0, -5]}>
        <Box
          args={[12, 18, 8]}
          position={[0, 9, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#7e22ce" roughness={0.3} metalness={0.3} />
        </Box>
        <BuildingWindows building={{ ...building, position: [0, 0, 0] as [number, number, number], size: [12, 18, 8] as [number, number, number] }} />
      </group>
      
      {/* Shopping Mall (3-story, ground level) */}
      <group position={[5, 0, 25]}>
        <Box
          args={[25, 12, 15]}
          position={[0, 6, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#6d28d9" roughness={0.2} metalness={0.4} />
        </Box>
        {/* Large mall windows */}
        <Box args={[24, 8, 0.2]} position={[0, 6, 7.6]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Box>
        <Box args={[24, 8, 0.2]} position={[0, 6, -7.6]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Box>
      </group>
      
      {/* Iconic Sky Bridge System (500 meters total length) */}
      <group>
        {/* Main Sky Bridge - Central to North Tower */}
        <Box
          args={[18, 4, 3]}
          position={[0, skyBridgeHeight, 9]}
          castShadow
        >
          <meshStandardMaterial 
            color="#f1f5f9" 
            transparent 
            opacity={0.85}
            emissive="#6366f1"
            emissiveIntensity={0.15}
            roughness={0.1}
            metalness={0.8}
          />
        </Box>
        
        {/* Sky Bridge - Central to East Tower */}
        <Box
          args={[20, 4, 3]}
          position={[10, skyBridgeHeight, 4]}
          castShadow
        >
          <meshStandardMaterial 
            color="#f1f5f9" 
            transparent 
            opacity={0.85}
            emissive="#6366f1"
            emissiveIntensity={0.15}
            roughness={0.1}
            metalness={0.8}
          />
        </Box>
        
        {/* Sky Bridge - Central to South Tower */}
        <Box
          args={[15, 4, 3]}
          position={[0, skyBridgeHeight, -7.5]}
          castShadow
        >
          <meshStandardMaterial 
            color="#f1f5f9" 
            transparent 
            opacity={0.85}
            emissive="#6366f1"
            emissiveIntensity={0.15}
            roughness={0.1}
            metalness={0.8}
          />
        </Box>
        
        {/* Sky Bridge - Central to West Tower */}
        <Box
          args={[3, 4, 18]}
          position={[-9, skyBridgeHeight, 1]}
          castShadow
        >
          <meshStandardMaterial 
            color="#f1f5f9" 
            transparent 
            opacity={0.85}
            emissive="#6366f1"
            emissiveIntensity={0.15}
            roughness={0.1}
            metalness={0.8}
          />
        </Box>
        
        {/* Sky Bridge - Central to Commercial Wing */}
        <Box
          args={[3, 4, 12]}
          position={[-4, skyBridgeHeight - 4, -2.5]}
          castShadow
        >
          <meshStandardMaterial 
            color="#f1f5f9" 
            transparent 
            opacity={0.85}
            emissive="#6366f1"
            emissiveIntensity={0.15}
            roughness={0.1}
            metalness={0.8}
          />
        </Box>
        
        {/* Sky Bridge Support Structures */}
        {Array.from({ length: 8 }, (_, i) => (
          <Cylinder
            key={`sky-support-${i}`}
            args={[0.8, 0.8, skyBridgeHeight]}
            position={[
              (i % 4 - 1.5) * 8, 
              skyBridgeHeight / 2, 
              Math.floor(i / 4) * 16 - 8
            ]}
          >
            <meshStandardMaterial color="#64748b" metalness={0.6} />
          </Cylinder>
        ))}
        
        {/* Sky Bridge Glass Panels */}
        <Box args={[18, 3, 0.2]} position={[0, skyBridgeHeight, 9]}>
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.6} />
        </Box>
        <Box args={[20, 3, 0.2]} position={[10, skyBridgeHeight, 4]}>
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.6} />
        </Box>
      </group>
      
      {/* 5-Story Underground Car Park */}
      <Box
        args={[45, 15, 35]}
        position={[0, -7.5, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Car Park Entrance Ramps */}
      <Box
        args={[8, 1, 25]}
        position={[20, -1, -20]}
        rotation={[-0.15, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#4b5563" />
      </Box>
      <Box
        args={[8, 1, 25]}
        position={[-20, -1, -20]}
        rotation={[-0.15, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#4b5563" />
      </Box>
      
      {/* Sky Park Landmark Signage */}
      <Text
        position={[0, building.size[1] + 8, 0]}
        fontSize={4}
        color="#6366f1"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.3}
        outlineColor="#1e1b4b"
      >
        SKY PARK CYBERJAYA
      </Text>
      
      {/* Podium Deck Amenities */}
      <group position={[0, 6, 0]}>
        {/* Swimming Pool Complex */}
        <Cylinder
          args={[12, 12, 1]}
          position={[8, 0, 8]}
        >
          <meshStandardMaterial 
            color="#0ea5e9" 
            transparent 
            opacity={0.8}
            emissive="#0284c7"
            emissiveIntensity={0.3}
          />
        </Cylinder>
        
        {/* Clubhouse */}
        <Box
          args={[15, 8, 12]}
          position={[-12, 4, 8]}
          castShadow
        >
          <meshStandardMaterial color="#dc2626" />
        </Box>
        
        {/* BBQ Area */}
        <Box
          args={[20, 2, 8]}
          position={[0, 1, -12]}
          castShadow
        >
          <meshStandardMaterial color="#65a30d" />
        </Box>
        
        {/* Business Center */}
        <Box
          args={[10, 6, 8]}
          position={[18, 3, -8]}
          castShadow
        >
          <meshStandardMaterial color="#0891b2" />
        </Box>
      </group>
      
      {/* Landscaping around Sky Park */}
      {Array.from({ length: 12 }, (_, i) => (
        <group key={`skypark-tree-${i}`} position={[
          Math.cos(i * Math.PI / 6) * 35,
          0,
          Math.sin(i * Math.PI / 6) * 35
        ]}>
          <Cylinder args={[0.4, 0.3, 6]} position={[0, 3, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          <Cylinder args={[0.2, 2.5, 5]} position={[0, 6.5, 0]}>
            <meshStandardMaterial color="#228b22" />
          </Cylinder>
        </group>
      ))}
    </group>
  )
}

// Component for floor separators
function FloorSeparators({ building }: { building: BuildingData }) {
  const separators = []
  const floorHeight = building.size[1] / building.floors
  
  for (let floor = 1; floor < building.floors; floor++) {
    const y = floor * floorHeight
    
    separators.push(
      <Box
        key={`floor-separator-${floor}`}
        args={[building.size[0] + 0.1, 0.1, building.size[2] + 0.1]}
        position={[0, y, 0]}
      >
        <meshStandardMaterial color="#9ca3af" />
      </Box>
    )
  }
  
  return <group>{separators}</group>
}

interface BuildingProps {
  building: BuildingData
  onClick: (building: BuildingData) => void
  isSelected: boolean
}

function Building({ building, onClick, isSelected }: BuildingProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current && (hovered || isSelected)) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={building.position}>
      {/* Base foundation */}
      <Box
        args={[building.size[0] + 1, 0.5, building.size[2] + 1]}
        position={[0, -0.25, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#6b7280" />
      </Box>
      
      {/* Main building structure */}
      <Box
        args={building.size}
        position={[0, building.size[1] / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(building)}
      >
        <meshStandardMaterial
          color={building.color}
          transparent
          opacity={isSelected ? 0.15 : (hovered ? 0.85 : 0.95)}
          emissive={hovered || isSelected ? building.color : "#000000"}
          emissiveIntensity={hovered || isSelected ? 0.15 : 0}
          roughness={0.4}
          metalness={0.2}
          side={isSelected ? THREE.DoubleSide : THREE.FrontSide}
          depthWrite={!isSelected}
        />
      </Box>

      {/* Floor separators */}
      <FloorSeparators building={building} />
      
      {/* Windows */}
      <BuildingWindows building={building} />
      
      {/* Balconies */}
      <BuildingBalconies building={building} />
      
      {/* Roof details */}
      <BuildingRoof building={building} />
      
      {/* Sky Park Complex (if applicable) */}
      <SkyParkComplex building={building} />

      {/* Ground floor entrance */}
      <Box
        args={[2, 3, 0.2]}
        position={[0, 1.5, building.size[2] / 2 + 0.1]}
      >
        <meshStandardMaterial color="#8b4513" />
      </Box>
      
      {/* Entrance canopy */}
      <Box
        args={[4, 0.2, 2]}
        position={[0, 3.5, building.size[2] / 2 + 1]}
      >
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      
      {/* Building type indicator light */}
      <Box
        args={[0.5, 0.5, 0.5]}
        position={[0, building.size[1] + 1, 0]}
      >
        <meshStandardMaterial 
          color={building.type === 'residential' ? '#10b981' : 
                building.type === 'commercial' ? '#3b82f6' : 
                building.type === 'office' ? '#f59e0b' : 
                building.type === 'education' ? '#8b5cf6' : 
                building.type === 'mixed' ? '#6366f1' :
                building.type === 'hotel' ? '#dc2626' :
                building.type === 'transport' ? '#64748b' :
                building.type === 'healthcare' ? '#059669' : '#ef4444'}
          emissive={building.type === 'residential' ? '#10b981' : 
                   building.type === 'commercial' ? '#3b82f6' : 
                   building.type === 'office' ? '#f59e0b' : 
                   building.type === 'education' ? '#8b5cf6' : 
                   building.type === 'mixed' ? '#6366f1' :
                   building.type === 'hotel' ? '#dc2626' :
                   building.type === 'transport' ? '#64748b' :
                   building.type === 'healthcare' ? '#059669' : '#ef4444'}
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Building label and info */}
      {(hovered || isSelected) && (
        <group>
          <Text 
            position={[0, building.size[1] + 4, 0]} 
            fontSize={1.5} 
            color="#ffffff" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#000000"
          >
            {building.name}
          </Text>
          <Text 
            position={[0, building.size[1] + 2.5, 0]} 
            fontSize={1} 
            color="#e5e7eb" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {`${building.floors} Floors • ${building.type.toUpperCase()}`}
          </Text>
        </group>
      )}
      
      {/* Building interior (shown when selected) */}
      <BuildingInterior building={building} showInterior={isSelected} />
      
      {/* Direct interior elements for testing */}
      {isSelected && (
        <group>
          {/* EMERGENCY STAIRCASE - FULL HEIGHT ORANGE as per viewer legend */}
          <Box args={[2.5, building.size[1], 2.5]} position={[building.size[0]/3, building.size[1]/2, building.size[2]/3]}>
            <meshStandardMaterial 
              color="#f97316" 
              emissive="#f97316"
              emissiveIntensity={3.0}
            />
          </Box>
          
          {/* STAIRS text label */}
          <Text
            position={[building.size[0]/3, building.size[1] + 1, building.size[2]/3]}
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.15}
            outlineColor="#000000"
          >
            🚨 EMERGENCY STAIRS 🚨
          </Text>
          
          {/* Test lift - GRAY as per viewer legend */}
          <Box args={[2, 4, 2]} position={[-building.size[0]/3, building.size[1]/2 + 2, -building.size[2]/3]}>
            <meshStandardMaterial 
              color="#6b7280" 
              emissive="#6b7280"
              emissiveIntensity={1.5}
            />
          </Box>
          
          {/* Test water host - RED as per viewer legend (Fire Hoses & Exits) */}
          <Box args={[1, 3, 1]} position={[0, building.size[1]/2 + 1.5, building.size[2]/2 - 1]}>
            <meshStandardMaterial 
              color="#ef4444" 
              emissive="#ef4444"
              emissiveIntensity={3.0}
            />
          </Box>
        </group>
      )}
    </group>
  )
}

// Realistic road network avoiding building conflicts
function Roads() {
  return (
    <group>
      {/* MEX Highway (North-South, West side) */}
      <Box args={[10, 0.4, 180]} position={[-90, -0.1, 0]} receiveShadow>
        <meshStandardMaterial color="#1a202c" />
      </Box>
      
      {/* LDP Highway (East-West, North side) */}
      <Box args={[180, 0.4, 10]} position={[0, -0.1, 90]} receiveShadow>
        <meshStandardMaterial color="#1a202c" />
      </Box>
      
      {/* ELITE Highway (East side) */}
      <Box args={[8, 0.3, 160]} position={[85, -0.05, 0]} receiveShadow>
        <meshStandardMaterial color="#2d3748" />
      </Box>
      
      {/* SKVE Highway (South side) */}
      <Box args={[160, 0.3, 8]} position={[0, -0.05, -90]} receiveShadow>
        <meshStandardMaterial color="#2d3748" />
      </Box>
      
      {/* Persiaran Cyberpoint (Main North-South arterial) */}
      <Box args={[8, 0.3, 120]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#4a5568" />
      </Box>
      
      {/* Jalan Impact (Main East-West arterial) */}
      <Box args={[120, 0.3, 8]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#4a5568" />
      </Box>
      
      {/* Persiaran Multimedia (Northwest district) */}
      <Box args={[8, 0.2, 80]} position={[-40, 0.05, 40]} receiveShadow>
        <meshStandardMaterial color="#718096" />
      </Box>
      
      {/* Jalan Teknokrat (South district) */}
      <Box args={[100, 0.2, 6]} position={[0, 0.05, -60]} receiveShadow>
        <meshStandardMaterial color="#718096" />
      </Box>
      
      {/* Persiaran Bestari (East district) */}
      <Box args={[6, 0.2, 80]} position={[60, 0.05, 20]} receiveShadow>
        <meshStandardMaterial color="#718096" />
      </Box>
      
      {/* Jalan Lkw (Southwest) */}
      <Box args={[60, 0.2, 6]} position={[-45, 0.05, -40]} receiveShadow>
        <meshStandardMaterial color="#718096" />
      </Box>
      
      {/* Local connector roads */}
      <Box args={[6, 0.15, 40]} position={[20, 0.08, 30]} receiveShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[6, 0.15, 40]} position={[-20, 0.08, 30]} receiveShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[40, 0.15, 6]} position={[40, 0.08, -40]} receiveShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[40, 0.15, 6]} position={[-40, 0.08, -40]} receiveShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      
      {/* Road markings for highways */}
      {Array.from({ length: 30 }, (_, i) => (
        <Box
          key={`highway-marking-${i}`}
          args={[2, 0.05, 0.5]}
          position={[i * 6 - 90, 0.06, 0]}
        >
          <meshStandardMaterial color="#f7fafc" />
        </Box>
      ))}
      
      {/* Road markings for arterials */}
      {Array.from({ length: 20 }, (_, i) => (
        <Box
          key={`arterial-marking-${i}`}
          args={[1.5, 0.05, 0.3]}
          position={[0, 0.06, i * 6 - 60]}
        >
          <meshStandardMaterial color="#f7fafc" />
        </Box>
      ))}
      
      {/* Highway guardrails */}
      <Box args={[0.3, 1.2, 180]} position={[-95, 0.6, 0]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      <Box args={[0.3, 1.2, 180]} position={[-85, 0.6, 0]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      <Box args={[180, 1.2, 0.3]} position={[0, 0.6, 95]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      <Box args={[180, 1.2, 0.3]} position={[0, 0.6, 85]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      
      {/* Traffic roundabouts */}
      <Cylinder args={[8, 8, 0.3]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#6b7280" />
      </Cylinder>
      <Cylinder args={[3, 3, 0.5]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#22c55e" />
      </Cylinder>
      
      <Cylinder args={[6, 6, 0.3]} position={[40, 0.1, 40]}>
        <meshStandardMaterial color="#6b7280" />
      </Cylinder>
      <Cylinder args={[2, 2, 0.5]} position={[40, 0.25, 40]}>
        <meshStandardMaterial color="#22c55e" />
      </Cylinder>
    </group>
  )
}

// Realistic MRT and Transport Infrastructure (Underground with elevated stations)
function TransportHubs() {
  return (
    <group>
      {/* Underground MRT Tunnel System */}
      <Box args={[6, 4, 150]} position={[0, -5, 0]} receiveShadow>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      
      {/* MRT Cyberjaya Utara Station (Elevated) */}
      <group position={[-25, 0, 70]}>
        {/* Station Building (Above Ground) */}
        <Box args={[25, 12, 15]} position={[0, 6, 0]} castShadow>
          <meshStandardMaterial color="#0ea5e9" />
        </Box>
        
        {/* Station Entrance */}
        <Box args={[8, 6, 8]} position={[0, 3, 12]} castShadow>
          <meshStandardMaterial color="#0284c7" />
        </Box>
        
        {/* Station Platform (Underground) */}
        <Box args={[30, 4, 8]} position={[0, -3, 0]} receiveShadow>
          <meshStandardMaterial color="#374151" />
        </Box>
        
        {/* Platform Access Stairs */}
        <Box args={[4, 8, 3]} position={[8, 0.5, 8]} castShadow>
          <meshStandardMaterial color="#6b7280" />
        </Box>
        <Box args={[4, 8, 3]} position={[-8, 0.5, 8]} castShadow>
          <meshStandardMaterial color="#6b7280" />
        </Box>
        
        {/* Station Signage */}
        <Text
          position={[0, 14, 0]}
          fontSize={2.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#1e40af"
        >
          MRT CYBERJAYA UTARA
        </Text>
        
        {/* Station Canopy */}
        <Box args={[35, 1, 20]} position={[0, 13, 0]} castShadow>
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.8} />
        </Box>
        
        {/* Support Pillars */}
        {Array.from({ length: 6 }, (_, i) => (
          <Cylinder
            key={`mrt-pillar-utara-${i}`}
            args={[1, 1, 12]}
            position={[(i - 2.5) * 6, 6, 0]}
          >
            <meshStandardMaterial color="#475569" />
          </Cylinder>
        ))}
      </group>
      
      {/* MRT Cyberjaya City Centre Station (Elevated) */}
      <group position={[15, 0, -70]}>
        {/* Station Building */}
        <Box args={[22, 10, 12]} position={[0, 5, 0]} castShadow>
          <meshStandardMaterial color="#0ea5e9" />
        </Box>
        
        {/* Station Entrance */}
        <Box args={[6, 5, 6]} position={[0, 2.5, 10]} castShadow>
          <meshStandardMaterial color="#0284c7" />
        </Box>
        
        {/* Underground Platform */}
        <Box args={[28, 4, 8]} position={[0, -3, 0]} receiveShadow>
          <meshStandardMaterial color="#374151" />
        </Box>
        
        {/* Escalators */}
        <Box args={[3, 10, 2]} position={[6, 1, 6]} rotation={[0.3, 0, 0]} castShadow>
          <meshStandardMaterial color="#9ca3af" />
        </Box>
        <Box args={[3, 10, 2]} position={[-6, 1, 6]} rotation={[0.3, 0, 0]} castShadow>
          <meshStandardMaterial color="#9ca3af" />
        </Box>
        
        <Text
          position={[0, 12, 0]}
          fontSize={2.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#1e40af"
        >
          MRT CYBERJAYA CITY CENTRE
        </Text>
        
        {/* Support Pillars */}
        {Array.from({ length: 4 }, (_, i) => (
          <Cylinder
            key={`mrt-pillar-centre-${i}`}
            args={[0.8, 0.8, 10]}
            position={[(i - 1.5) * 7, 5, 0]}
          >
            <meshStandardMaterial color="#475569" />
          </Cylinder>
        ))}
      </group>
      
      {/* Underground MRT Tracks (visible sections) */}
      <group>
        {/* Track Rails */}
        <Box args={[0.3, 0.2, 150]} position={[-1, -6, 0]}>
          <meshStandardMaterial color="#71717a" metalness={0.8} />
        </Box>
        <Box args={[0.3, 0.2, 150]} position={[1, -6, 0]}>
          <meshStandardMaterial color="#71717a" metalness={0.8} />
        </Box>
        
        {/* Track Sleepers */}
        {Array.from({ length: 50 }, (_, i) => (
          <Box
            key={`sleeper-${i}`}
            args={[4, 0.3, 0.5]}
            position={[0, -6.2, i * 3 - 75]}
          >
            <meshStandardMaterial color="#525252" />
          </Box>
        ))}
      </group>
      
      {/* Bus Rapid Transit (BRT) - Elevated Guideway */}
      <group>
        {/* BRT Elevated Track */}
        <Box args={[4, 1, 140]} position={[35, 8, 0]} castShadow>
          <meshStandardMaterial color="#dc2626" />
        </Box>
        
        {/* BRT Support Pillars */}
        {Array.from({ length: 15 }, (_, i) => (
          <Cylinder
            key={`brt-pillar-${i}`}
            args={[0.8, 0.8, 8]}
            position={[35, 4, (i - 7) * 10]}
          >
            <meshStandardMaterial color="#7f1d1d" />
          </Cylinder>
        ))}
        
        {/* BRT Stations (Elevated) */}
        {Array.from({ length: 5 }, (_, i) => (
          <group key={`brt-station-${i}`} position={[35, 8, (i - 2) * 30]}>
            <Box args={[12, 6, 8]} position={[0, 3, 0]} castShadow>
              <meshStandardMaterial color="#fecaca" />
            </Box>
            <Box args={[10, 1, 6]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color="#dc2626" />
            </Box>
            {/* Station Canopy */}
            <Box args={[15, 0.5, 10]} position={[0, 6.5, 0]} castShadow>
              <meshStandardMaterial color="#f3f4f6" transparent opacity={0.9} />
            </Box>
          </group>
        ))}
      </group>
      
      {/* Cyberjaya Transport Hub (Bus Terminal) */}
      <group position={[15, 0, -65]}>
        {/* Main Terminal Building */}
        <Box args={[40, 8, 20]} position={[0, 4, 0]} castShadow>
          <meshStandardMaterial color="#64748b" />
        </Box>
        
        {/* Bus Bays */}
        {Array.from({ length: 10 }, (_, i) => (
          <Box
            key={`bus-bay-${i}`}
            args={[4, 0.3, 15]}
            position={[(i - 4.5) * 4, 0.15, 15]}
            receiveShadow
          >
            <meshStandardMaterial color="#374151" />
          </Box>
        ))}
        
        {/* Terminal Canopy */}
        <Box args={[45, 1, 35]} position={[0, 9, 8]} castShadow>
          <meshStandardMaterial color="#e5e7eb" transparent opacity={0.8} />
        </Box>
        
        <Text
          position={[0, 10, 0]}
          fontSize={3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          CYBERJAYA TRANSPORT HUB
        </Text>
      </group>
    </group>
  )
}

function Landscaping() {
  const trees = []
  const parks = []
  
  // Generate palm trees (common in Cyberjaya)
  for (let i = 0; i < 40; i++) {
    const x = (Math.random() - 0.5) * 120
    const z = (Math.random() - 0.5) * 120
    
    // Avoid placing trees on buildings and roads
    if (Math.abs(x) < 45 && Math.abs(z) < 45) continue
    
    trees.push(
      <group key={`tree-${i}`} position={[x, 0, z]}>
        {/* Palm tree trunk */}
        <Cylinder args={[0.4, 0.3, 8]} position={[0, 4, 0]}>
          <meshStandardMaterial color="#8b4513" />
        </Cylinder>
        {/* Palm fronds */}
        {Array.from({ length: 6 }, (_, j) => (
          <Box
            key={`frond-${j}`}
            args={[0.3, 4, 0.1]}
            position={[
              Math.cos(j * Math.PI / 3) * 2,
              8,
              Math.sin(j * Math.PI / 3) * 2
            ]}
            rotation={[0, j * Math.PI / 3, Math.PI / 6]}
          >
            <meshStandardMaterial color="#228b22" />
          </Box>
        ))}
      </group>
    )
  }
  
  // Cyberjaya Central Park (actual landmark)
  parks.push(
    <group key="cyberjaya-central-park">
      <Cylinder args={[25, 25, 0.2]} position={[-35, 0.1, -30]}>
        <meshStandardMaterial color="#22c55e" />
      </Cylinder>
      
      {/* Park lake */}
      <Cylinder args={[8, 8, 0.3]} position={[-35, 0, -30]}>
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.8}
          emissive="#1e40af"
          emissiveIntensity={0.1}
        />
      </Cylinder>
      
      {/* Park pavilion */}
      <Cylinder args={[4, 4, 5]} position={[-35, 2.5, -15]}>
        <meshStandardMaterial color="#dc2626" />
      </Cylinder>
      
      {/* Jogging track */}
      <Cylinder args={[20, 18, 0.1]} position={[-35, 0.05, -30]}>
        <meshStandardMaterial color="#6b7280" />
      </Cylinder>
      
      {/* Exercise stations */}
      {Array.from({ length: 6 }, (_, i) => (
        <Box
          key={`exercise-${i}`}
          args={[1, 2, 1]}
          position={[
            -35 + Math.cos(i * Math.PI / 3) * 15,
            1,
            -30 + Math.sin(i * Math.PI / 3) * 15
          ]}
        >
          <meshStandardMaterial color="#f59e0b" />
        </Box>
      ))}
    </group>
  )
  
  // Innovation Park (Tech companies area)
  parks.push(
    <group key="innovation-park">
      <Box args={[30, 0.2, 20]} position={[35, 0.1, 25]}>
        <meshStandardMaterial color="#10b981" />
      </Box>
      
      {/* Tech company buildings (smaller structures) */}
      {Array.from({ length: 8 }, (_, i) => (
        <Box
          key={`tech-building-${i}`}
          args={[4, 6, 3]}
          position={[
            35 + (i % 4) * 6 - 9,
            3,
            25 + Math.floor(i / 4) * 8 - 4
          ]}
          castShadow
        >
          <meshStandardMaterial color="#6366f1" />
        </Box>
      ))}
    </group>
  )
  
  // Putrajaya Lake (nearby landmark visible from Cyberjaya)
  parks.push(
    <group key="putrajaya-lake">
      <Cylinder args={[35, 35, 0.4]} position={[70, -0.2, -60]}>
        <meshStandardMaterial 
          color="#0ea5e9" 
          transparent 
          opacity={0.7}
          emissive="#0284c7"
          emissiveIntensity={0.2}
        />
      </Cylinder>
    </group>
  )
  
  return <group>{trees}{parks}</group>
}

function UrbanFurniture() {
  const furniture = []
  
  // Street lights
  for (let i = 0; i < 20; i++) {
    const x = (i % 10) * 12 - 54
    const z = Math.floor(i / 10) * 40 - 20
    
    furniture.push(
      <group key={`streetlight-${i}`} position={[x, 0, z]}>
        {/* Pole */}
        <Cylinder args={[0.15, 0.15, 8]} position={[0, 4, 0]}>
          <meshStandardMaterial color="#696969" />
        </Cylinder>
        {/* Light */}
        <Cylinder args={[0.8, 0.6, 0.5]} position={[0, 8, 0]}>
          <meshStandardMaterial 
            color="#fffaf0" 
            emissive="#fffaf0" 
            emissiveIntensity={0.2}
          />
        </Cylinder>
      </group>
    )
  }
  
  // Traffic lights at intersections
  furniture.push(
    <group key="traffic-light-1" position={[0, 0, 0]}>
      <Cylinder args={[0.1, 0.1, 6]} position={[3, 3, 3]}>
        <meshStandardMaterial color="#696969" />
      </Cylinder>
      <Box args={[0.5, 1.5, 0.3]} position={[3, 6, 3]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
      {/* Traffic light colors */}
      <Cylinder args={[0.15, 0.15, 0.1]} position={[3, 6.5, 3.2]}>
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.1]} position={[3, 6, 3.2]}>
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.1} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.1]} position={[3, 5.5, 3.2]}>
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </Cylinder>
    </group>
  )
  
  // Bus stops
  furniture.push(
    <group key="bus-stop-1" position={[15, 0, 8]}>
      <Box args={[4, 3, 1.5]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#4a5568" transparent opacity={0.7} />
      </Box>
      <Box args={[3.5, 0.3, 1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
    </group>
  )
  
  return <group>{furniture}</group>
}

// Camera controller for building interior view
function CameraController({ selectedBuilding }: { selectedBuilding: BuildingData | null }) {
  useFrame(({ camera }) => {
    if (selectedBuilding) {
      // Position camera at a good distance to see the whole building exterior and interior
      const targetPosition = new THREE.Vector3(
        selectedBuilding.position[0] + selectedBuilding.size[0] * 1.5, // Outside the building, good distance
        selectedBuilding.position[1] + selectedBuilding.size[1] * 0.6, // Mid-height view
        selectedBuilding.position[2] + selectedBuilding.size[2] * 1.2 // At an angle to see depth
      );
      
      // Smooth camera movement
      camera.position.lerp(targetPosition, 0.08);
      
      // Look at the center of the building to see interior through transparent walls
      camera.lookAt(
        selectedBuilding.position[0],
        selectedBuilding.position[1] + selectedBuilding.size[1] * 0.4,
        selectedBuilding.position[2]
      );
    }
  });
  
  return null;
}

export function CityModel() {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null)

  const handleBuildingClick = (building: BuildingData) => {
    setSelectedBuilding(selectedBuilding?.id === building.id ? null : building)
  }

  return (
    <group>
      {/* Camera controller for interior zoom */}
      <CameraController selectedBuilding={selectedBuilding} />
      
      {/* Ground plane - enlarged for better city layout */}
      <Plane args={[300, 300]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial color="#e2e8f0" />
      </Plane>
      
      {/* Buildings */}
      {buildings.map((building) => (
        <Building
          key={building.id}
          building={building}
          onClick={handleBuildingClick}
          isSelected={selectedBuilding?.id === building.id}
        />
      ))}

      {/* Infrastructure */}
      <Roads />
      <TransportHubs />
      <Landscaping />
      <UrbanFurniture />
      
      {/* Water features */}
      <group>
        {/* Lake/pond */}
        <Cylinder args={[8, 8, 0.2]} position={[35, -0.1, 30]}>
          <meshStandardMaterial 
            color="#4682b4" 
            transparent 
            opacity={0.8}
            emissive="#1e40af"
            emissiveIntensity={0.1}
          />
        </Cylinder>
      </group>
      
      {/* Selected building info panel */}
      {selectedBuilding && (
        <group position={[selectedBuilding.position[0], selectedBuilding.size[1] + 8, selectedBuilding.position[2]]}>
          <Box args={[12, 6, 0.2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1f2937" transparent opacity={0.9} />
          </Box>
          <Text
            position={[0, 1.5, 0.15]}
            fontSize={1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
          >
            {`Building: ${selectedBuilding.name}`}
          </Text>
          <Text
            position={[0, 0.5, 0.15]}
            fontSize={0.8}
            color="#d1d5db"
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
          >
            {`Type: ${selectedBuilding.type} • Floors: ${selectedBuilding.floors}`}
          </Text>
          <Text
            position={[0, -0.5, 0.15]}
            fontSize={0.7}
            color="#9ca3af"
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
          >
            {`Size: ${selectedBuilding.size[0]}m × ${selectedBuilding.size[2]}m × ${selectedBuilding.size[1]}m`}
          </Text>
          <Text
            position={[0, -1.5, 0.15]}
            fontSize={0.6}
            color="#6b7280"
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
          >
            {selectedBuilding.isSkyPark 
              ? `Sky Bridge • ${selectedBuilding.serviced_apartments} Apartments • ${selectedBuilding.hotel_rooms} Hotel Rooms`
              : `Features: ${selectedBuilding.hasBalconies ? 'Balconies' : 'No Balconies'} • ${selectedBuilding.hasRoof ? 'Rooftop Access' : 'Flat Roof'}`
            }
          </Text>
          
          {/* Additional info for Sky Park */}
          {selectedBuilding.isSkyPark && (
            <Text
              position={[0, -2.2, 0.15]}
              fontSize={0.5}
              color="#8b5cf6"
              anchorX="center"
              anchorY="middle"
              maxWidth={10}
            >
              Mixed-Use Development • Shopping Mall • Underground Parking • 500m Sky Bridge
            </Text>
          )}
        </group>
      )}
    </group>
  )
}
