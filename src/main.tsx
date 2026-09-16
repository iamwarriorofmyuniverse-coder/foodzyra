import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './styles/index.css';

window.addEventListener('error', (event) => {
  console.error('[Foodzyra Global Error Caught]', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Foodzyra Unhandled Promise Rejection]', event.reason);
});

// Register PWA Service Worker for Mobile Application
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .catch((error) => console.warn('Service worker registration failed:', error));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);


