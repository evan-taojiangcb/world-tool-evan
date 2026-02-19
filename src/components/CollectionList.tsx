import React, { useState, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';
import type { Collection } from '../types';

export const CollectionList: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCollections, removeCollection } = useStorage();

  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true);
      const cols = await getCollections();
      setCollections(cols.sort((a, b) => b.collectedAt - a.collectedAt));
      setIsLoading(false);
    };
    loadCollections();
  }, [getCollections]);

  const handleDelete = async (word: string) => {
    await removeCollection(word);
    setCollections(prev => prev.filter(c => c.word !== word));
  };

  const handleExport = (format: 'json' | 'csv') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(collections, null, 2);
      filename = 'word-collections.json';
      mimeType = 'application/json';
    } else {
      const headers = 'Word,Part of Speech,Definition,Example,Translation,Collected At\n';
      const rows = collections.map(c => {
        const def = c.data.definitions[0];
        return `"${c.word}","${def?.partOfSpeech || ''}","${def?.definition || ''}","${def?.example || ''}","${def?.translation || ''}","${new Date(c.collectedAt).toISOString()}"`;
      }).join('\n');
      content = headers + rows;
      filename = 'word-collections.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="collections-loading">Loading...</div>;
  }

  if (collections.length === 0) {
    return (
      <div className="collections-empty">
        <p>No collections yet.</p>
        <p className="hint">Double-click or select words on any page to add them to your collection.</p>
      </div>
    );
  }

  return (
    <div className="collections-container">
      <div className="collections-actions">
        <button onClick={() => handleExport('json')}>Export JSON</button>
        <button onClick={() => handleExport('csv')}>Export CSV</button>
      </div>

      <div className="collections-count">
        {collections.length} {collections.length === 1 ? 'word' : 'words'} collected
      </div>

      <div className="collections-list">
        {collections.map((collection) => (
          <div key={collection.word} className="collection-item">
            <div className="collection-word">{collection.word}</div>
            <div className="collection-definition">
              {collection.data.definitions[0]?.definition}
            </div>
            <div className="collection-meta">
              <span className="collection-pos">
                {collection.data.definitions[0]?.partOfSpeech}
              </span>
              <span className="collection-date">
                {new Date(collection.collectedAt).toLocaleDateString()}
              </span>
            </div>
            <button
              className="collection-delete"
              onClick={() => handleDelete(collection.word)}
              title="Delete"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
