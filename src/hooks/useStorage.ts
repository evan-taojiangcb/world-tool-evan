import { useCallback } from 'react';
import localforage from 'localforage';
import type { Collection, UserSettings } from '../types';

// Initialize localforage instances
const collectionsStore = localforage.createInstance({
  name: 'word-tool',
  storeName: 'collections'
});

export function useStorage() {
  // Username
  const getUsername = useCallback(async (): Promise<string | null> => {
    const result = await chrome.storage.local.get('username');
    return (result.username as string) || null;
  }, []);

  const setUsername = useCallback(async (username: string): Promise<void> => {
    await chrome.storage.local.set({ username });
  }, []);

  // Collections
  const getCollections = useCallback(async (): Promise<Collection[]> => {
    try {
      const username = await getUsername();
      if (!username) return [];
      
      const collections = await collectionsStore.getItem<Collection[]>(username);
      return collections || [];
    } catch (error) {
      console.error('[Word Tool] Error getting collections:', error);
      return [];
    }
  }, [getUsername]);

  const addCollection = useCallback(async (word: string, data: any): Promise<void> => {
    try {
      const username = await getUsername();
      if (!username) {
        console.error('[Word Tool] No username set');
        return;
      }

      const collections = await getCollections();
      const existing = collections.find(c => c.word === word);
      
      if (!existing) {
        collections.push({
          word,
          data: { ...data, collectedAt: Date.now() },
          collectedAt: Date.now()
        });
        await collectionsStore.setItem(username, collections);
      }
    } catch (error) {
      console.error('[Word Tool] Error adding collection:', error);
    }
  }, [getUsername, getCollections]);

  const removeCollection = useCallback(async (word: string): Promise<void> => {
    try {
      const username = await getUsername();
      if (!username) return;

      const collections = await getCollections();
      const filtered = collections.filter(c => c.word !== word);
      await collectionsStore.setItem(username, filtered);
    } catch (error) {
      console.error('[Word Tool] Error removing collection:', error);
    }
  }, [getUsername, getCollections]);

  // Settings
  const getSettings = useCallback(async (): Promise<UserSettings | null> => {
    try {
      const result = await chrome.storage.local.get('settings');
      if (result.settings && typeof result.settings === 'object') {
        return result.settings as UserSettings;
      }
      return null;
    } catch (error) {
      console.error('[Word Tool] Error getting settings:', error);
      return null;
    }
  }, []);

  const setSettings = useCallback(async (settings: UserSettings): Promise<void> => {
    await chrome.storage.local.set({ settings });
  }, []);

  return {
    getUsername,
    setUsername,
    getCollections,
    addCollection,
    removeCollection,
    getSettings,
    setSettings
  };
}
