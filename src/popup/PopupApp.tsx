import React, { useState, useEffect } from 'react';
import { CollectionList } from '../components/CollectionList';
import { SettingsForm } from '../components/SettingsForm';
import { useStorage } from '../hooks/useStorage';

type Tab = 'collections' | 'settings';

export const PopupApp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('collections');
  const [isLoading, setIsLoading] = useState(true);
  const { getUsername, setUsername: saveUsername } = useStorage();

  useEffect(() => {
    const loadUsername = async () => {
      const name = await getUsername();
      if (name) {
        setUsername(name);
      }
      setIsLoading(false);
    };
    loadUsername();
  }, [getUsername]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await saveUsername(username.trim());
    }
  };

  if (isLoading) {
    return (
      <div className="popup-container popup-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Show username input if not set
  if (!username) {
    return (
      <div className="popup-container">
        <div className="popup-header">
          <h1>Word Tool Evan</h1>
        </div>
        <form className="username-form" onSubmit={handleUsernameSubmit}>
          <label htmlFor="username">Enter your username to get started:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-username"
            autoFocus
          />
          <button type="submit" disabled={!username.trim()}>
            Get Started
          </button>
        </form>
      </div>
    );
  }

  // Main popup UI
  return (
    <div className="popup-container">
      <div className="popup-header">
        <h1>Word Tool Evan</h1>
        <span className="username-badge">{username}</span>
      </div>

      <div className="popup-tabs">
        <button
          className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`}
          onClick={() => setActiveTab('collections')}
        >
          Collections
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="popup-content">
        {activeTab === 'collections' && <CollectionList />}
        {activeTab === 'settings' && <SettingsForm username={username} />}
      </div>
    </div>
  );
};
