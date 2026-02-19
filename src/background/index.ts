// Background Service Worker
console.log('[Word Tool] Background service worker loaded');

chrome.runtime.onMessage.addListener((
  message: { type: string; url?: string; key?: string; data?: Record<string, unknown> },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
) => {
  console.log('[Word Tool] Received message:', message);

  if (message.type === 'FETCH_WORD') {
    fetch(message.url!)
      .then(res => res.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === 'GET_STORAGE') {
    chrome.storage.local.get(message.key, (result) => {
      sendResponse(result);
    });
    return true;
  }

  if (message.type === 'SET_STORAGE') {
    chrome.storage.local.set(message.data!, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Word Tool] Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    console.log('[Word Tool] First time installation');
  }
});
