import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';

interface SettingsFormProps {
  username: string;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ username }) => {
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [clickToShowPopup, setClickToShowPopup] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { setSettings } = useStorage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setSettings({
      username,
      highlightColor,
      clickToShowPopup
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
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
  );
};
