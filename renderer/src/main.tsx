import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <Theme appearance="inherit" accentColor="blue" grayColor="slate" radius="large" scaling="100%">
      <App />
    </Theme>
  );
}


