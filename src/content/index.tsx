import { createRoot } from 'react-dom/client';
import { ContentApp } from './ContentApp';
import './styles.css';

// Initialize the content script
const init = () => {
  console.log('[Word Tool] Initializing content script...');
  
  // Create container for React app
  const container = document.createElement('div');
  container.id = 'word-tool-container';
  document.body.appendChild(container);
  
  const root = createRoot(container);
  root.render(<ContentApp />);
  
  console.log('[Word Tool] Content script initialized');
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
