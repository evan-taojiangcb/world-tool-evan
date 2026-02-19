import { createRoot } from 'react-dom/client';
import { PopupApp } from './PopupApp';
import './styles.css';

console.log('[Word Tool] Popup starting...');

const init = () => {
  console.log('[Word Tool] Popup init called');
  const container = document.getElementById('root');
  if (container) {
    console.log('[Word Tool] Container found, rendering...');
    const root = createRoot(container);
    root.render(<PopupApp />);
    console.log('[Word Tool] Render complete');
  } else {
    console.error('[Word Tool] Container not found!');
  }
};

init();
