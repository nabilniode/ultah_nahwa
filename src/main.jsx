import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Prevent browser from restoring scroll position on reload
// Always start from the very top (Hero section)
if (typeof window !== 'undefined') {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
