import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SolarSystem, PlanetExplorer, EquipmentDetail, TimelinePage, NotFound } from './pages/Placeholders';
import './styles/tokens.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SolarSystem />} />
        <Route path="/planet/:bodyId" element={<PlanetExplorer />} />
        <Route path="/equipment/:equipmentId" element={<EquipmentDetail />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
