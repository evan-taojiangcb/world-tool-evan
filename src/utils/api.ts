import type { WordData } from '../types';

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function fetchWordData(word: string): Promise<WordData> {
  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data found');
    }
    
    const entry = data[0];
    
    // Extract phonetics
    const phonetics = entry.phonetics || [];
    const ukPhonetic = phonetics.find((p: any) => p.text?.includes('/') && !p.text.includes('美')) || phonetics[0];
    const usPhonetic = phonetics.find((p: any) => p.text?.includes('/') && p.text.includes('美')) || phonetics[0];
    
    // Extract audio URLs
    const ukAudio = phonetics.find((p: any) => p.audio?.includes('-uk') || p.audio?.includes('_uk'))?.audio || '';
    const usAudio = phonetics.find((p: any) => p.audio?.includes('-us') || p.audio?.includes('_us'))?.audio || '';
    
    // Extract definitions
    const meanings = entry.meanings || [];
    const definitions: WordData['definitions'] = [];
    
    for (const meaning of meanings) {
      const partOfSpeech = meaning.partOfSpeech;
      const defs = meaning.definitions || [];
      
      for (const def of defs.slice(0, 2)) { // Take first 2 definitions
        definitions.push({
          partOfSpeech,
          definition: def.definition || '',
          example: def.example || '',
          translation: def.translation || '' // API doesn't provide translation
        });
      }
    }
    
    return {
      word: entry.word || word,
      phonetic: {
        uk: ukPhonetic?.text || '',
        us: usPhonetic?.text || ''
      },
      audio: {
        uk: ukAudio,
        us: usAudio
      },
      definitions: definitions.slice(0, 5) // Max 5 definitions
    };
  } catch (error) {
    console.error('[Word Tool] Error fetching word data:', error);
    throw error;
  }
}

// Mock data for testing when API is unavailable
export function getMockWordData(word: string): WordData {
  return {
    word,
    phonetic: {
      uk: '/test/',
      us: '/test/'
    },
    audio: {
      uk: '',
      us: ''
    },
    definitions: [
      {
        partOfSpeech: 'noun',
        definition: 'This is a test definition for the word.',
        example: 'This is an example sentence.',
        translation: '这是测试定义。'
      }
    ]
  };
}
