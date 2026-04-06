import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Challenge, emptyCanvas, ChallengeStatus, CanvasFields } from "@/types/challenge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SharedChallenge extends Challenge {
  isShared: true;
  permission: "viewer" | "editor";
  ownerName?: string;
}

interface ChallengesContextType {
  challenges: Challenge[];
  sharedChallenges: SharedChallenge[];
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
  infographic_url: row.infographic_url ?? null,
});

export const ChallengesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [sharedChallenges, setSharedChallenges] = useState<SharedChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch own + shared challenges
  useEffect(() => {
    if (!user) {
      setChallenges([]);
      setSharedChallenges([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const fetchAll = async () => {
      // Own challenges
      const { data: ownData } = await supabase
        .from("challenges")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ownData) setChallenges(ownData.map(dbToChallenge));

      // Shared with me
      const { data: shareData } = await supabase
        .from("challenge_shares")
        .select("*")
        .eq("shared_with_id", user.id);

      if (shareData && shareData.length > 0) {
        const challengeIds = shareData.map((s: any) => s.challenge_id);
        const { data: sharedData } = await supabase
          .from("challenges")
          .select("*")
          .in("id", challengeIds);

        if (sharedData) {
          const enriched: SharedChallenge[] = sharedData.map((row: any) => {
            const share = shareData.find((s: any) => s.challenge_id === row.id);
            return {
              ...dbToChallenge(row),
              isShared: true as const,
              permission: (share?.permission || "viewer") as "viewer" | "editor",
            };
          });
          setSharedChallenges(enriched);
        }
      } else {
        setSharedChallenges([]);
      }

      setLoading(false);
    };

    fetchAll();
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
    // Also update shared challenges locally
    setSharedChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c))
    );
    // Persist to DB
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.canvas !== undefined) dbUpdates.sections = updates.canvas;
    if (updates.evaluation !== undefined) dbUpdates.evaluation = updates.evaluation;
    if (updates.infographic_url !== undefined) dbUpdates.infographic_url = updates.infographic_url;
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
    <ChallengesContext.Provider value={{ challenges, sharedChallenges, loading, createChallenge, updateChallenge, duplicateChallenge, deleteChallenge }}>
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) throw new Error("useChallenges must be used within ChallengesProvider");
  return context;
};
