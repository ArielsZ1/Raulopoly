export const GAME_STORAGE_KEY = 'raulopolyGame';
export const TUTORIAL_SEEN_STORAGE_KEY = 'raulopolyTutorialSeen';
export const LANGUAGE_STORAGE_KEY = 'raulopolyLanguage';

const DEFAULT_LANGUAGE = 'es';
const DEFAULT_TUTORIAL_SEEN = false;
const DEFAULT_SAVED_GAME = null;

function getStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
}

function safeParseJSON(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function getSavedGame() {
  const storage = getStorage();
  if (!storage) return DEFAULT_SAVED_GAME;

  const saved = storage.getItem(GAME_STORAGE_KEY);
  return safeParseJSON(saved, DEFAULT_SAVED_GAME);
}

export function setSavedGame(state) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(GAME_STORAGE_KEY, JSON.stringify(state));
}

export function clearSavedGame() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(GAME_STORAGE_KEY);
}

export function getTutorialSeen() {
  const storage = getStorage();
  if (!storage) return DEFAULT_TUTORIAL_SEEN;

  const saved = storage.getItem(TUTORIAL_SEEN_STORAGE_KEY);
  if (saved === null) return DEFAULT_TUTORIAL_SEEN;
  return saved === 'true';
}

export function setTutorialSeen(value) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(TUTORIAL_SEEN_STORAGE_KEY, String(Boolean(value)));
}

export function getLanguage() {
  const storage = getStorage();
  if (!storage) return DEFAULT_LANGUAGE;

  const language = storage.getItem(LANGUAGE_STORAGE_KEY);
  return language || DEFAULT_LANGUAGE;
}

export function setLanguage(lang) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(LANGUAGE_STORAGE_KEY, lang || DEFAULT_LANGUAGE);
}
