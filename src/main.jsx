import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { WeddingProvider } from './context/WeddingContext';
import './styles.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><WeddingProvider><App/></WeddingProvider></React.StrictMode>);
