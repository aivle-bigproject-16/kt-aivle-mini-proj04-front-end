const KEYS = { token: 'accessToken', user: 'authUser' };

const parse = (key) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
};

let currentUserCache = parse(KEYS.user);

const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

const store = {
  getAccessToken: () => localStorage.getItem(KEYS.token) ?? null,
  setAccessToken: (token) => {
    if (token == null) localStorage.removeItem(KEYS.token);
    else localStorage.setItem(KEYS.token, token);
    notify();
  },
  clearAccessToken: () => {
    localStorage.removeItem(KEYS.token);
    notify();
  },

  getUser: () => currentUserCache,
  setUser: (user) => {
    if (user == null) {
      localStorage.removeItem(KEYS.user);
      currentUserCache = null;
    } else {
      localStorage.setItem(KEYS.user, JSON.stringify(user));
      currentUserCache = user;
    }
    notify();
  },
  clearUser: () => {
    localStorage.removeItem(KEYS.user);
    currentUserCache = null;
    notify();
  },

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export const getAccessToken = () => store.getAccessToken();
export const setAccessToken = (token) => store.setAccessToken(token);
export const clearAccessToken = () => store.clearAccessToken();

export const getUser = () => store.getUser();
export const setUser = (user) => store.setUser(user);
export const clearUser = () => store.clearUser();

import { useSyncExternalStore } from 'react';

export const hookAccessToken = () =>
  useSyncExternalStore(store.subscribe, store.getAccessToken);
export const hookSetAccessToken = () => store.setAccessToken;
export const hookUser = () =>
  useSyncExternalStore(store.subscribe, store.getUser);
export const hookSetUser = () => store.setUser;
