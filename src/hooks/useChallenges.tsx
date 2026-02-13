import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Challenge, emptyCanvas, ChallengeStatus, CanvasFields } from "@/types/challenge";

const STORAGE_KEY = "ccb-challenges";

const loadChallenges = (): Challenge[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

interface ChallengesContextType {
  challenges: Challenge[];
  createChallenge: (title: string) => Challenge;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  duplicateChallenge: (id: string) => void;
  deleteChallenge: (id: string) => void;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export const ChallengesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>(loadChallenges);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
  }, [challenges]);

  const createChallenge = useCallback((title: string): Challenge => {
    const newChallenge: Challenge = {
      id: crypto.randomUUID(),
      title,
      status: "draft",
      quality_score: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      canvas: { ...emptyCanvas },
    };
    setChallenges((prev) => [newChallenge, ...prev]);
    return newChallenge;
  }, []);

  const updateChallenge = useCallback((id: string, updates: Partial<Challenge>) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
      )
    );
  }, []);

  const duplicateChallenge = useCallback((id: string) => {
    setChallenges((prev) => {
      const original = prev.find((c) => c.id === id);
      if (!original) return prev;
      const copy: Challenge = {
        ...original,
        id: crypto.randomUUID(),
        title: `${original.title} (cópia)`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return [copy, ...prev];
    });
  }, []);

  const deleteChallenge = useCallback((id: string) => {
    setChallenges((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <ChallengesContext.Provider value={{ challenges, createChallenge, updateChallenge, duplicateChallenge, deleteChallenge }}>
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) throw new Error("useChallenges must be used within ChallengesProvider");
  return context;
};
