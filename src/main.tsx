import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {SpeedInsights} from '@vercel/speed-insights/react';
import {inject} from '@vercel/analytics';
import App from './App.tsx';
import './index.css';

inject();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>,
);
