import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';
import LanguageSelectionFlow from './LanguageSelectionFlow';
import AnimatedLoader from '@/components/AnimatedLoader';

interface LanguagePreferences {
  spoken_languages: string[];
  learning_languages: string[];
  primary_spoken_language: string;
  primary_learning_language: string;
}

interface LanguageMiddlewareProps {
  children: React.ReactNode;
}

const LanguageMiddleware = ({ children }: LanguageMiddlewareProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setLanguage } = useLocalization();
  const navigate = useNavigate();
  const location = useLocation();
  // Language selection modal is now disabled
  // const [showLanguageFlow, setShowLanguageFlow] = useState(false);
  const [isCheckingLanguages, setIsCheckingLanguages] = useState(true);
  const [languagePreferences, setLanguagePreferences] = useState<LanguagePreferences | null>(null);

  useEffect(() => {
    setIsCheckingLanguages(false);
  }, []);





  // Do not block public routes with loader
  const isPublicRoute = location.pathname === '/' || location.pathname.startsWith('/auth');

  // Only show loading for auth initialization, never for language checks
  if (!isPublicRoute && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <AnimatedLoader text="Setting up your experience..." />
      </div>
    );
  }



  // Render children only if:
  // 1. User is not authenticated (show auth flow), OR
  // 2. User is authenticated and has complete language preferences
  return <>{children}</>;
};

export default LanguageMiddleware;