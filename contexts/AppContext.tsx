import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GeneratedLook {
  id: string;
  originalUri: string;
  generatedUri: string;
  hairstyleName: string;
  category: string;
  color?: string;
  createdAt: number;
  isFavorite: boolean;
}

export interface HairstyleOption {
  id: string;
  name: string;
  category: string;
  gender: "male" | "female" | "unisex";
  prompt: string;
  thumbnailEmoji: string;
  isNew?: boolean;
  isTrending?: boolean;
}

interface AppContextType {
  history: GeneratedLook[];
  favorites: GeneratedLook[];
  addToHistory: (look: GeneratedLook) => void;
  toggleFavorite: (id: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  selectedGender: "male" | "female";
  setSelectedGender: (gender: "male" | "female") => void;
  isPremium: boolean;
  freeGenerationsLeft: number;
  decrementGenerations: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  history: "hairtry_history",
  gender: "hairtry_gender",
  freeGens: "hairtry_free_gens",
  isPremium: "hairtry_premium",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<GeneratedLook[]>([]);
  const [selectedGender, setSelectedGenderState] = useState<"male" | "female">("male");
  const [isPremium, setIsPremium] = useState(false);
  const [freeGenerationsLeft, setFreeGenerationsLeft] = useState(5);

  useEffect(() => {
    (async () => {
      try {
        const [storedHistory, storedGender, storedFreeGens, storedPremium] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.history),
          AsyncStorage.getItem(STORAGE_KEYS.gender),
          AsyncStorage.getItem(STORAGE_KEYS.freeGens),
          AsyncStorage.getItem(STORAGE_KEYS.isPremium),
        ]);
        if (storedHistory) setHistory(JSON.parse(storedHistory));
        if (storedGender) setSelectedGenderState(storedGender as "male" | "female");
        if (storedFreeGens) setFreeGenerationsLeft(parseInt(storedFreeGens, 10));
        if (storedPremium) setIsPremium(storedPremium === "true");
      } catch {}
    })();
  }, []);

  const addToHistory = useCallback((look: GeneratedLook) => {
    setHistory((prev) => {
      const updated = [look, ...prev].slice(0, 50);
      AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.map((look) =>
        look.id === id ? { ...look, isFavorite: !look.isFavorite } : look
      );
      AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((look) => look.id !== id);
      AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    AsyncStorage.setItem(STORAGE_KEYS.history, "[]").catch(() => {});
  }, []);

  const setSelectedGender = useCallback((gender: "male" | "female") => {
    setSelectedGenderState(gender);
    AsyncStorage.setItem(STORAGE_KEYS.gender, gender).catch(() => {});
  }, []);

  const decrementGenerations = useCallback(() => {
    if (isPremium) return;
    setFreeGenerationsLeft((prev) => {
      const next = Math.max(0, prev - 1);
      AsyncStorage.setItem(STORAGE_KEYS.freeGens, String(next)).catch(() => {});
      return next;
    });
  }, [isPremium]);

  const favorites = history.filter((look) => look.isFavorite);

  return (
    <AppContext.Provider
      value={{
        history,
        favorites,
        addToHistory,
        toggleFavorite,
        removeFromHistory,
        clearHistory,
        selectedGender,
        setSelectedGender,
        isPremium,
        freeGenerationsLeft,
        decrementGenerations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
