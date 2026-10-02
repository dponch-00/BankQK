import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Finance from './finance';
import './globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><Finance /></StrictMode>,
);
