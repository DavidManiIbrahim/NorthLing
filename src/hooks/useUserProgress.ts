import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';

// Define the shape expected by the UI components
interface UserProfile {
  user_id: string;
  username: string;
  avatar_url?: string;
  points: number;
  current_level: number;
  streak_days: number;
  stages_completed: {
    vocabulary: number[];
    quiz: number[];
  };
  learning_languages: {
    base: string;
    target: string;
  };
}

export function useUserProgress() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchUserProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch progress and preferences from the new API
      const [progress, preferences] = await Promise.all([
        apiClient.getProgress(),
        apiClient.getPreferences()
      ]);

      // Adapt the backend response to the frontend's expected format
      const adaptedProfile: UserProfile = {
        user_id: user.id,
        username: user.username || '',
        avatar_url: user.profileImage,
        points: progress.xp || 0,
        current_level: progress.level || 1,
        streak_days: progress.streak || 0,
        // Backend currently stores simplified progress, so we mock these for now to prevent crashes
        // TODO: Update backend to support detailed stage tracking if needed
        stages_completed: {
          vocabulary: Array(progress.lessonsCompleted || 0).fill(0).map((_, i) => i + 1),
          quiz: []
        },
        learning_languages: {
          base: preferences.baseLanguage || 'en',
          target: preferences.targetLanguage || 'es'
        }
      };

      setUserProfile(adaptedProfile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // Note: Real-time subscription is removed as it was specific to Supabase
    // We could implement polling or websocket updates if needed later
  }, [user]);

  const updateProgress = async (
    points: number,
    completedStages?: { vocabulary?: number[]; quiz?: number[] }
  ) => {
    try {
      if (!userProfile) throw new Error('No user profile found');

      // Calculate new values
      const newXp = (userProfile.points || 0) + points;
      // Estimate level based on XP (simple formula: 1 level per 100 XP)
      const newLevel = Math.floor(newXp / 100) + 1;

      // Update backend
      const updatedProgress = await apiClient.updateProgress({
        xp: newXp,
        level: newLevel,
        // We accumulate lessons completed based on vocabulary stages
        lessonsCompleted: completedStages?.vocabulary?.length || userProfile.stages_completed.vocabulary.length
      });

      // Update local state
      setUserProfile(prev => prev ? ({
        ...prev,
        points: updatedProgress.xp,
        current_level: updatedProgress.level,
        stages_completed: {
          vocabulary: completedStages?.vocabulary || prev.stages_completed.vocabulary,
          quiz: completedStages?.quiz || prev.stages_completed.quiz
        }
      }) : null);

      return updatedProgress;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateLearningLanguage = async (targetLanguage: string) => {
    try {
      await apiClient.updatePreferences({ language: targetLanguage });

      setUserProfile(prev => prev ? ({
        ...prev,
        learning_languages: {
          ...prev.learning_languages,
          target: targetLanguage
        }
      }) : null);
    } catch (err) {
      console.error('Error updating language preference:', err);
      // Optional: Add toast notification here
    }
  };

  const updateLeaderboard = async () => {
    // This is now handled by the backend automatically when progress is updated
    return;
  };

  return {
    loading,
    error,
    userProfile,
    updateProgress,
    updateLearningLanguage,
    updateLeaderboard,
    refetch: fetchUserProfile
  };
}
