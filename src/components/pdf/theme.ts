// src/components/pdf/theme.ts
// Per-destination color themes for the Equipment File PDF.
// Destinations: Mars (rusty), Moon (silver), Deep Space (violet).

export type DestinationThemeId = 'mars' | 'moon' | 'deepspace';

export interface DestinationTheme {
  id: DestinationThemeId;
  label: string;
  accent: string;       // primary destination color
  accentSoft: string;   // lighter tint for backgrounds
  ink: string;          // body text on light paper
  paper: string;        // page background
  band: string;         // cover/header band
  muted: string;        // secondary text
  rule: string;         // divider lines
}

export const THEMES: Record<DestinationThemeId, DestinationTheme> = {
  mars: {
    id: 'mars',
    label: 'Mars',
    accent: '#C76A45',
    accentSoft: '#F2E1D8',
    ink: '#1F1612',
    paper: '#FBF7F4',
    band: '#C76A45',
    muted: '#6B5347',
    rule: '#D9C4B8',
  },
  moon: {
    id: 'moon',
    label: 'Moon',
    accent: '#AAB6C4',
    accentSoft: '#EEF1F5',
    ink: '#1A1F26',
    paper: '#F7F9FC',
    band: '#5B6B7F',
    muted: '#5A6472',
    rule: '#C9D2DD',
  },
  deepspace: {
    id: 'deepspace',
    label: 'Deep Space',
    accent: '#8275FF',
    accentSoft: '#ECE9FF',
    ink: '#18152B',
    paper: '#F7F6FE',
    band: '#8275FF',
    muted: '#5A5380',
    rule: '#CEC9F2',
  },
};

// Map a body to one of the three destination themes.
export function themeForBodyId(bodyId: string | undefined): DestinationThemeId {
  if (bodyId === 'mars') return 'mars';
  if (bodyId === 'moon') return 'moon';
  return 'deepspace';
}

export function themeForBody(body: { id: string; accent?: string } | null): DestinationThemeId {
  if (!body) return 'deepspace';
  const accent = (body.accent ?? '').toLowerCase();
  if (accent === '#c76a45') return 'mars';
  if (accent === '#aab6c4') return 'moon';
  if (accent === '#8275ff') return 'deepspace';
  return themeForBodyId(body.id);
}
