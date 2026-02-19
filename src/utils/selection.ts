/**
 * Get selected text from the current selection
 */
export function getSelectedText(): string {
  const selection = window.getSelection();
  if (!selection) return '';
  return selection.toString().trim();
}

/**
 * Get word at cursor position from a mouse event
 */
export function getWordAtCursor(_node: Node): string {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return '';

  const range = selection.getRangeAt(0);
  const text = range.toString().trim();
  
  // Extract word using regex
  const wordMatch = text.match(/[a-zA-Z]+/);
  return wordMatch ? wordMatch[0].toLowerCase() : '';
}

/**
 * Calculate position for floating button
 */
export function getButtonPosition(range: Range): { x: number; y: number } {
  const rect = range.getBoundingClientRect();
  return {
    x: rect.right + window.scrollX,
    y: rect.top + window.scrollY
  };
}

/**
 * Check if selection is in an editable element
 */
export function isInEditableElement(node: Node | null): boolean {
  if (!node) return false;
  
  let current: Node | null = node;
  while (current) {
    if (current instanceof HTMLElement) {
      const contentEditable = current.getAttribute('contenteditable');
      if (contentEditable === 'true' || contentEditable === '') return true;
      if (current.isContentEditable) return true;
      if (current.tagName === 'INPUT' || current.tagName === 'TEXTAREA') {
        return true;
      }
    }
    current = current.parentNode;
  }
  return false;
}
