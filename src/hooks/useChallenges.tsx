import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Challenge, emptyCanvas, ChallengeStatus, CanvasFields } from "@/types/challenge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ChallengesContextType {
  challenges: Challenge[];
  loading: boolean;
  createChallenge: (title: string) => Promise<Challenge>;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  duplicateChallenge: (id: string) => void;
  deleteChallenge: (id: string) => void;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

const dbToChallenge = (row: any): Challenge => ({
  id: row.id,
  title: row.title,
  status: row.status as ChallengeStatus,
  quality_score: row.evaluation?.score ?? null,
  created_at: row.created_at,
  updated_at: row.updated_at,
  canvas: { ...emptyCanvas, ...(typeof row.sections === 'object' ? row.sections : {}) },
  evaluation: row.evaluation ?? null,
});

export const ChallengesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch challenges from DB
  useEffect(() => {
    if (!user) {
      setChallenges([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("challenges")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setChallenges(data.map(dbToChallenge));
        }
        setLoading(false);
      });
  }, [user]);

  const createChallenge = useCallback(async (title: string): Promise<Challenge> => {
    if (!user) throw new Error("Not authenticated");
    const insertData = { title, user_id: user.id, status: "draft", sections: emptyCanvas as any };
    const { data, error } = await supabase
      .from("challenges")
      .insert([insertData])
      .select()
      .single();
    if (error) throw error;
    const challenge = dbToChallenge(data);
    setChallenges((prev) => [challenge, ...prev]);
    return challenge;
  }, [user]);

  const updateChallenge = useCallback((id: string, updates: Partial<Challenge>) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c))
    );
    // Persist to DB
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.canvas !== undefined) dbUpdates.sections = updates.canvas;
    if (updates.evaluation !== undefined) dbUpdates.evaluation = updates.evaluation;
    if (Object.keys(dbUpdates).length > 0) {
      supabase.from("challenges").update(dbUpdates).eq("id", id).then();
    }
  }, []);

  const duplicateChallenge = useCallback(async (id: string) => {
    if (!user) return;
    const original = challenges.find((c) => c.id === id);
    if (!original) return;
    const insertData = {
      title: `${original.title} (cópia)`,
      user_id: user.id,
      status: "draft",
      sections: original.canvas as any,
    };
    const { data, error } = await supabase
      .from("challenges")
      .insert([insertData])
      .select()
      .single();
    if (!error && data) {
      setChallenges((prev) => [dbToChallenge(data), ...prev]);
    }
  }, [user, challenges]);

  const deleteChallenge = useCallback((id: string) => {
    setChallenges((prev) => prev.filter((c) => c.id !== id));
    supabase.from("challenges").delete().eq("id", id).then();
  }, []);

  return (
    <ChallengesContext.Provider value={{ challenges, loading, createChallenge, updateChallenge, duplicateChallenge, deleteChallenge }}>
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) throw new Error("useChallenges must be used within ChallengesProvider");
  return context;
};
