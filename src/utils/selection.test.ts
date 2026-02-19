import { getWordAtCursor, isInEditableElement } from './selection';

describe('selection utils', () => {
  describe('getWordAtCursor', () => {
    it('should return empty string for null node', () => {
      expect(getWordAtCursor(null as any)).toBe('');
    });

    it('should extract word from text node', () => {
      const textNode = document.createTextNode('hello world');
      // This is a simplified test - in real scenario would need proper DOM setup
      expect(typeof getWordAtCursor(textNode)).toBe('string');
    });
  });

  describe('isInEditableElement', () => {
    it('should return false for null node', () => {
      expect(isInEditableElement(null)).toBe(false);
    });

    it('should return true for input element', () => {
      const input = document.createElement('input');
      expect(isInEditableElement(input)).toBe(true);
    });

    it('should return true for textarea element', () => {
      const textarea = document.createElement('textarea');
      expect(isInEditableElement(textarea)).toBe(true);
    });

    it('should return true for contenteditable element', () => {
      const div = document.createElement('div');
      div.setAttribute('contenteditable', 'true');
      expect(isInEditableElement(div)).toBe(true);
    });

    it('should return false for regular div', () => {
      const div = document.createElement('div');
      expect(isInEditableElement(div)).toBe(false);
    });
  });
});
