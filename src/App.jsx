import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './tokens.css';
import './base.css';
import './styles/motion.css';
const Home = lazy(() => import('./pages/Home'));
const SolarSystem = lazy(() => import('./pages/SolarSystem'));
const PlanetExplorer = lazy(() => import('./pages/PlanetExplorer'));
const EquipmentDetail = lazy(() => import('./pages/EquipmentDetail'));
const TimelinePage = lazy(() => import('./pages/Timeline'));
const NotFound = lazy(() => import('./pages/Placeholders').then((m) => ({ default: m.NotFound })));
export default function App() {
    return (<BrowserRouter>
      <a className="skip-link" href="#main">Skip to content</a>
      <Suspense fallback={<div className="solar-loading">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/solar" element={<SolarSystem />}/>
          <Route path="/planet/:bodyId" element={<PlanetExplorer />}/>
          <Route path="/equipment/:equipmentId" element={<EquipmentDetail />}/>
          <Route path="/timeline/:bodyId?" element={<TimelinePage />}/>
          <Route path="/404" element={<NotFound />}/>
          <Route path="*" element={<Navigate to="/404" replace/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>);
}
