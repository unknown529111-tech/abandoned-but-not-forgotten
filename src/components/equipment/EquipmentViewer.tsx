// src/components/equipment/EquipmentViewer.tsx
// Lazy-loaded 3D viewer wrapper: error boundary -> image/procedural fallback,
// reset-view control. The canvas itself is lazy-loaded.
import { Suspense, useState, Component } from 'react';
import type { ReactNode } from 'react';
import { lazy } from 'react';
import type { Equipment, Body } from '../../types';
import EquipmentFallback from './EquipmentFallback';

const EquipmentCanvas = lazy(() => import('./EquipmentCanvas'));

interface Props {
  equipment: Equipment;
  body: Body | null;
  reducedMotion: boolean;
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default function EquipmentViewer({ equipment, body, reducedMotion }: Props) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="eq-viewer">
      <CanvasErrorBoundary fallback={<EquipmentFallback body={body} imageUrl={equipment.imageUrl} />}>
        <Suspense fallback={<div className="eq-loading">Loading 3D scene…</div>}>
          <EquipmentCanvas
            equipment={equipment}
            reducedMotion={reducedMotion}
            resetKey={resetKey}
          />
        </Suspense>
      </CanvasErrorBoundary>
      <button
        type="button"
        className="eq-reset"
        onClick={() => setResetKey((k) => k + 1)}
        aria-label="Reset view"
      >
        Reset view
      </button>
    </div>
  );
}
