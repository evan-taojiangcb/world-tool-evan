import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';

export const OptionsApp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [clickToShowPopup, setClickToShowPopup] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { getUsername, getSettings, setUsername: saveUsername, setSettings } = useStorage();

  React.useEffect(() => {
    const loadData = async () => {
      const name = await getUsername();
      if (name) setUsername(name);
      
      const settings = await getSettings();
      if (settings) {
        setHighlightColor(settings.highlightColor);
        setClickToShowPopup(settings.clickToShowPopup);
      }
    };
    loadData();
  }, [getUsername, getSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveUsername(username);
    await setSettings({
      username,
      highlightColor,
      clickToShowPopup
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="options-container">
      <div className="options-header">
        <h1>Word Tool Evan - Settings</h1>
      </div>
      
      <form className="options-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="highlight-color">Highlight Color</label>
          <div className="color-picker">
            <input
              id="highlight-color"
              type="color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
            />
            <span>{highlightColor}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={clickToShowPopup}
              onChange={(e) => setClickToShowPopup(e.target.checked)}
            />
            <span>Click highlighted words to show popup</span>
          </label>
        </div>

        <button type="submit" className="save-btn">
          {isSaved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};
