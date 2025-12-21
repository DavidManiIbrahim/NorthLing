import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/components/LandingPage';
import LocalizedDashboard from '@/components/enhanced/LocalizedDashboard';
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import { apiClient } from '@/lib/api-client';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userProgress, setUserProgress] = useState({
    wordsLearned: 0,
    streak: 0,
    points: 0,
    level: 1
  });
  const [userLanguages, setUserLanguages] = useState({
    spoken: [] as string[],
    learning: [] as string[],
    primarySpoken: '',
    primaryLearning: ''
  });
  const [hasLanguagePreferences, setHasLanguagePreferences] = useState(false);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const userData = await apiClient.getCurrentUser();

      // Load language preferences
      if (userData.preferences) {
        const prefs = userData.preferences;
        setUserLanguages({
          spoken: prefs.spokenLanguages || [],
          learning: prefs.learningLanguages || [],
          primarySpoken: prefs.baseLanguage || 'en',
          primaryLearning: prefs.targetLanguage || 'es'
        });
        setHasLanguagePreferences(
          (prefs.spokenLanguages?.length || 0) > 0 ||
          (prefs.learningLanguages?.length || 0) > 0 ||
          !!prefs.targetLanguage
        );
      }

      // Load user stats
      if (userData.progress) {
        const prog = userData.progress;
        setUserProgress({
          wordsLearned: prog.lessonsCompleted || 0,
          streak: prog.streak || 0,
          points: prog.xp || 0,
          level: prog.level || 1
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSectionChange = (section: string) => {
    if (section === 'admin' && user?.role === 'admin') {
      navigate('/admin');
    } else if (section === 'lessons') {
      navigate('/course');
    } else if (section === 'achievements') {
      navigate('/achievements');
    } else if (section === 'community') {
      navigate('/community');
    } else {
      setCurrentSection(section);
    }
  };

  // Redirect authenticated users from root to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return <LandingPage onLanguageSelect={() => { }} />;
  }

  // Show localized dashboard for authenticated users with language preferences
  if (hasLanguagePreferences) {
    return (
      <motion.div
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LocalizedDashboard
          progress={userProgress}
          languages={userLanguages}
          onSectionChange={handleSectionChange}
          userName={user?.username || 'Student'}
        />

        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentSection === 'vocabulary' && (
                <VocabularyCard
                  languages={{ base: userLanguages.primarySpoken, target: userLanguages.primaryLearning }}
                />
              )}

              {currentSection === 'quiz' && (
                <QuizSection
                  languages={{ base: userLanguages.primarySpoken, target: userLanguages.primaryLearning }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    );
  }

  // Fallback - LanguageMiddleware should handle language selection flow
  return <LandingPage onLanguageSelect={() => { }} />;
};

export default Index;