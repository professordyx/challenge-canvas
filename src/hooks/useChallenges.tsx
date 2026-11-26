import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Challenge, emptyCanvas, ChallengeStatus, CanvasFields } from "@/types/challenge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { createAutosaveQueue, SaveStatus } from "@/lib/autosave";

interface SharedChallenge extends Challenge {
  isShared: true;
  permission: "viewer" | "editor";
  ownerName?: string;
}

interface ChallengesContextType {
  challenges: Challenge[];
  sharedChallenges: SharedChallenge[];
  loading: boolean;
  loadError: string | null;
  reloadChallenges: () => Promise<void>;
  createChallenge: (title: string) => Promise<Challenge>;
  updateChallenge: (id: string, updates: Partial<Challenge>, options?: { immediate?: boolean }) => void;
  updateCanvasField: (id: string, field: keyof CanvasFields, value: string, options?: { immediate?: boolean }) => void;
  flushChallenge: (id: string) => Promise<void>;
  getSaveStatus: (id: string) => SaveStatus;
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
  interview_transcript: row.interview_transcript ?? null,
});

export const ChallengesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [sharedChallenges, setSharedChallenges] = useState<SharedChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatuses, setSaveStatuses] = useState<Record<string, SaveStatus>>({});

  const challengesRef = useRef<Challenge[]>([]);
  const sharedRef = useRef<SharedChallenge[]>([]);
  challengesRef.current = challenges;
  sharedRef.current = sharedChallenges;

  const queueRef = useRef(
    createAutosaveQueue(
      async (id, payload) => {
        const { error } = await supabase.from("challenges").update(payload).eq("id", id);
        if (error) throw error;
      },
      {
        onStatusChange: (id, status) => {
          setSaveStatuses((prev) => (prev[id] === status ? prev : { ...prev, [id]: status }));
        },
      }
    )
  );

  useEffect(() => {
    const queue = queueRef.current;
    return () => queue.dispose();
  }, []);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setChallenges([]);
      setSharedChallenges([]);
      setLoadError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);

    try {
      const { data: ownData, error: ownError } = await supabase
        .from("challenges")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ownError) throw ownError;
      if (ownData) setChallenges(ownData.map(dbToChallenge));

      const { data: shareData, error: shareError } = await supabase
        .from("challenge_shares")
        .select("*")
        .eq("shared_with_id", user.id);

      if (shareError) throw shareError;

      if (shareData && shareData.length > 0) {
        const challengeIds = shareData.map((s: any) => s.challenge_id);
        const { data: sharedData, error: sharedError } = await supabase
          .from("challenges")
          .select("*")
          .in("id", challengeIds);

        if (sharedError) throw sharedError;

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

    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch own + shared challenges
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    void fetchAll();
  }, [authLoading, fetchAll]);

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

  const updateChallenge = useCallback(
    (id: string, updates: Partial<Challenge>, options?: { immediate?: boolean }) => {
      const now = new Date().toISOString();
      setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: now } : c)));
      setSharedChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: now } : c)));

      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.canvas !== undefined) dbUpdates.sections = updates.canvas;
      if (updates.evaluation !== undefined) dbUpdates.evaluation = updates.evaluation;
      if (updates.infographic_url !== undefined) dbUpdates.infographic_url = updates.infographic_url;
      if (updates.interview_transcript !== undefined) dbUpdates.interview_transcript = updates.interview_transcript;

      if (Object.keys(dbUpdates).length > 0) {
        queueRef.current.schedule(id, dbUpdates, { immediate: options?.immediate ?? true });
      }
    },
    []
  );

  const updateCanvasField = useCallback(
    (id: string, field: keyof CanvasFields, value: string, options?: { immediate?: boolean }) => {
      const current =
        challengesRef.current.find((c) => c.id === id) ?? sharedRef.current.find((c) => c.id === id);
      if (!current) return;
      const updatedCanvas: CanvasFields = { ...current.canvas, [field]: value };
      const nextStatus: ChallengeStatus = current.status === "draft" ? "in_progress" : current.status;
      updateChallenge(id, { canvas: updatedCanvas, status: nextStatus }, { immediate: options?.immediate ?? false });
    },
    [updateChallenge]
  );

  const flushChallenge = useCallback(async (id: string) => {
    await queueRef.current.flush(id);
  }, []);

  const getSaveStatus = useCallback(
    (id: string): SaveStatus => saveStatuses[id] ?? "idle",
    [saveStatuses]
  );

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
    <ChallengesContext.Provider
      value={{
        challenges,
        sharedChallenges,
        loading,
        loadError,
        reloadChallenges: fetchAll,
        createChallenge,
        updateChallenge,
        updateCanvasField,
        flushChallenge,
        getSaveStatus,
        duplicateChallenge,
        deleteChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) throw new Error("useChallenges must be used within ChallengesProvider");
  return context;
};
