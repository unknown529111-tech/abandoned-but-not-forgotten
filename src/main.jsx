import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './tokens.css';
import './base.css';
import './i18n';
import App from './App.jsx';
document.title = 'Abandoned but not Forgotten';
createRoot(document.getElementById('root')).render(<StrictMode>
    <App />
  </StrictMode>);
