// src/types/index.ts
export type BodyType = 'planet' | 'moon' | 'asteroid' | 'comet' | 'station' | 'other';
export type BodyId = string;
export type EquipmentId = string;

export type EquipmentStatus = 'concluded' | 'lost-contact' | 'inactive' | 'uncertain' | 'active';

export interface Coord {
  lat: number;   // degrees
  lon: number;   // degrees
  source: string; // citation
}

export interface Body {
  id: BodyId;
  name: { en: string; ar: string };
  type: BodyType;
  orbitOrder: number;        // carousel order
  accent: string;            // destination color hex
  modelUrl?: string;         // 3D model (GLB)
  textureUrl?: string;
  description?: { en: string; ar: string };
}

export interface Equipment {
  id: EquipmentId;
  bodyId: BodyId;
  name: { en: string; ar: string };
  shortDescription: { en: string; ar: string };
  status: EquipmentStatus;
  launchDate?: string;       // ISO date; undefined => excluded from timeline
  arrivalDate?: string;
  lastContactDate?: string;
  endDate?: string;
  coord?: Coord;
  modelUrl?: string;
  imageUrl?: string;
  specs?: Record<string, string>;
  story?: { en: string; ar: string };
  achievements?: { en: string[]; ar: string[] };
  sources: { title: string; url: string }[];
}

export interface AppState {
  selectedBodyId: BodyId | null;
  camera: { x: number; y: number; zoom: number };
  locale: 'en' | 'ar';
}
