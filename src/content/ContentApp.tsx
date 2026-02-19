import React, { useState, useEffect, useCallback } from 'react';
import { FloatingButton } from '../components/FloatingButton';
import { WordPopup } from '../components/WordPopup';
import { useStorage } from '../hooks/useStorage';
import { getWordAtCursor } from '../utils/selection';
import type { WordData } from '../types';

export const ContentApp: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [collections, setCollections] = useState<Set<string>>(new Set());
  const { getCollections, addCollection, removeCollection } = useStorage();

  // Load collections on mount
  useEffect(() => {
    const loadCollections = async () => {
      const cols = await getCollections();
      setCollections(new Set(cols.map(c => c.word)));
    };
    loadCollections();
  }, [getCollections]);

  // Handle text selection
  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setButtonPosition(null);
      setSelectedText('');
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length > 100 || /^[0-9\s.,!?;:'"()-]+$/.test(text)) {
      setButtonPosition(null);
      setSelectedText('');
      return;
    }

    // Check if selection is in an input/textarea
    const target = selection.anchorNode?.parentElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable === false)) {
      return;
    }

    setSelectedText(text);
    
    // Get position for floating button
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setButtonPosition({
      x: rect.right + window.scrollX,
      y: rect.top + window.scrollY
    });
  }, []);

  // Handle double-click
  const handleDoubleClick = useCallback((e: MouseEvent) => {
    const word = getWordAtCursor(e.target as Node);
    if (word && word.length > 1 && !/^[0-9]+$/.test(word)) {
      setSelectedText(word);
      setButtonPosition({
        x: e.clientX + window.scrollX + 20,
        y: e.clientY + window.scrollY
      });
    }
  }, []);

  // Listen for selection events
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelect);
    document.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelect);
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [handleTextSelect, handleDoubleClick]);

  // Handle button click
  const handleButtonClick = () => {
    if (!selectedText || !buttonPosition) return;
    
    setPopupPosition({
      x: buttonPosition.x,
      y: buttonPosition.y + 30
    });
    setShowPopup(true);
    
    // Clear selection
    window.getSelection()?.removeAllRanges();
    setButtonPosition(null);
  };

  // Handle popup close
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Handle collection toggle
  const handleToggleCollection = async (word: string, data: WordData) => {
    if (collections.has(word)) {
      await removeCollection(word);
      setCollections(prev => {
        const next = new Set(prev);
        next.delete(word);
        return next;
      });
    } else {
      await addCollection(word, data);
      setCollections(prev => new Set(prev).add(word));
    }
  };

  // Highlight collected words on page
  useEffect(() => {
    if (collections.size === 0) return;

    const highlightWords = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'NOSCRIPT') {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.classList.contains('word-tool-highlight')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      const textNodes: Text[] = [];
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text);
      }

      textNodes.forEach(textNode => {
        const text = textNode.textContent || '';
        let modified = false;
        let newText = text;

        collections.forEach(word => {
          const regex = new RegExp(`\\b(${word})\\b`, 'gi');
          if (regex.test(text)) {
            newText = newText.replace(regex, '<mark class="word-tool-highlight" data-word="$1">$1</mark>');
            modified = true;
          }
        });

        if (modified) {
          const span = document.createElement('span');
          span.innerHTML = newText;
          textNode.parentNode?.replaceChild(span, textNode);
        }
      });
    };

    highlightWords();

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            highlightWords();
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [collections]);

  // Handle click on highlighted words
  useEffect(() => {
    const handleHighlightClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('word-tool-highlight')) {
        const word = target.dataset.word;
        if (word) {
          setSelectedText(word);
          setPopupPosition({
            x: e.clientX + window.scrollX,
            y: e.clientY + window.scrollY
          });
          setShowPopup(true);
        }
      }
    };

    document.addEventListener('click', handleHighlightClick);
    return () => document.removeEventListener('click', handleHighlightClick);
  }, []);

  return (
    <>
      {buttonPosition && selectedText && (
        <FloatingButton
          position={buttonPosition}
          onClick={handleButtonClick}
        />
      )}
      
      {showPopup && (
        <WordPopup
          position={popupPosition}
          word={selectedText}
          isCollected={collections.has(selectedText)}
          onClose={handleClosePopup}
          onToggleCollection={handleToggleCollection}
        />
      )}
    </>
  );
};
