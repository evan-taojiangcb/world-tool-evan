export interface Phonetic {
  uk: string;
  us: string;
}

export interface Audio {
  uk: string;
  us: string;
}

export interface Definition {
  partOfSpeech: string;
  definition: string;
  example: string;
  translation: string;
}

export interface WordData {
  word: string;
  phonetic: Phonetic;
  audio: Audio;
  definitions: Definition[];
  collectedAt?: number;
}

export interface Collection {
  word: string;
  data: WordData;
  collectedAt: number;
}

export interface UserSettings {
  username: string;
  highlightColor: string;
  clickToShowPopup: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
