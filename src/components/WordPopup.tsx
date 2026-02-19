import React, { useState, useEffect, useRef } from 'react';
import type { WordData } from '../types';
import { fetchWordData } from '../utils/api';

interface WordPopupProps {
  position: { x: number; y: number };
  word: string;
  isCollected: boolean;
  onClose: () => void;
  onToggleCollection: (word: string, data: WordData) => void;
}

export const WordPopup: React.FC<WordPopupProps> = ({
  position,
  word,
  isCollected,
  onClose,
  onToggleCollection,
}) => {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Fetch word data
  useEffect(() => {
    const loadWordData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWordData(word);
        setWordData(data);
      } catch (err) {
        setError('Failed to load word data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (word) {
      loadWordData();
    }
  }, [word]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (_e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(_e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Handle drag
  const handleMouseDown = (_e: React.MouseEvent) => {
    if ((_e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (_e: MouseEvent) => {
    if (isDragging) {
      // Update position via state (in real implementation, use a position state)
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Play pronunciation
  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    }
  };

  // Handle collection toggle
  const handleCollectionClick = () => {
    if (wordData) {
      onToggleCollection(word, wordData);
    }
  };

  return (
    <div
      ref={popupRef}
      className="word-tool-popup"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 2147483647,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="word-tool-popup-header drag-handle">
        <span className="word-tool-popup-word">{word}</span>
        <button
          className={`word-tool-popup-collect ${isCollected ? 'collected' : ''}`}
          onClick={handleCollectionClick}
          title={isCollected ? 'Remove from collection' : 'Add to collection'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isCollected ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="word-tool-popup-content">
        {loading && (
          <div className="word-tool-popup-loading">Loading...</div>
        )}

        {error && (
          <div className="word-tool-popup-error">{error}</div>
        )}

        {wordData && !loading && !error && (
          <>
            {/* Phonetics */}
            <div className="word-tool-popup-phonetics">
              {wordData.phonetic.uk && (
                <div className="phonetic-item">
                  <span className="phonetic-label">UK</span>
                  <span className="phonetic-text">{wordData.phonetic.uk}</span>
                  {wordData.audio.uk && (
                    <button
                      className="phonetic-audio-btn"
                      onClick={() => playAudio(wordData.audio.uk)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {wordData.phonetic.us && (
                <div className="phonetic-item">
                  <span className="phonetic-label">US</span>
                  <span className="phonetic-text">{wordData.phonetic.us}</span>
                  {wordData.audio.us && (
                    <button
                      className="phonetic-audio-btn"
                      onClick={() => playAudio(wordData.audio.us)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Definitions */}
            <div className="word-tool-popup-definitions">
              {wordData.definitions.map((def, index) => (
                <div key={index} className="definition-item">
                  <span className="part-of-speech">{def.partOfSpeech}</span>
                  <span className="definition-text">{def.definition}</span>
                  {def.example && (
                    <div className="example-item">
                      <span className="example-text">{def.example}</span>
                      {def.translation && (
                        <span className="example-translation">{def.translation}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
