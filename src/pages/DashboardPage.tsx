import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LanguageSelector from '@/components/LanguageSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import Leaderboard from '@/components/Leaderboard';
import {
  BookOpen,
  Brain,
  Trophy,
  Star,
  Target,
  Check,
  Clock,
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  ListChecks,
  ListOrdered,
  Award
} from 'lucide-react';
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import LessonsSection from '@/components/LessonsSection';

// ...

const DashboardPage = () => {
  const { user, signOut, userRole } = useAuth();
  const { userProfile, loading: userLoading, updateLearningLanguage } = useUserProgress();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  // Default section from URL or 'dashboard'
  const [currentSection, setCurrentSection] = useState(searchParams.get('tab') || 'dashboard');

  // Load saved language preference from localStorage or default
  const savedBase = localStorage.getItem('northling_base_lang');
  const savedTarget = localStorage.getItem('northling_target_lang');

  const [selectedLanguages, setSelectedLanguages] = useState({
    base: savedBase || '',
    target: savedTarget || ''
  });

  // Sync currentSection with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== currentSection) {
      setCurrentSection(tab);
    } else if (!tab && currentSection !== 'dashboard') {
      // If no tab but section is not dashboard, update URL
      setSearchParams({ tab: currentSection });
    }
  }, [searchParams, currentSection]);

  // Update URL when section changes manually
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setSearchParams({ tab: section });
  };

  useEffect(() => {
    // If user has a preference saved in profile which we should respect on load
    if (!selectedLanguages.target) {
      if (userProfile?.studying_language) {
        const newLangs = {
          base: 'English',
          target: userProfile.studying_language
        };
        setSelectedLanguages(newLangs);
        localStorage.setItem('northling_base_lang', newLangs.base);
        localStorage.setItem('northling_target_lang', newLangs.target);
      } else {
        // Default fallback
        const defaultLangs = {
          base: 'English',
          target: 'Hausa'
        };
        setSelectedLanguages(defaultLangs);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getLevelProgress = () => {
    const points = userProfile?.points || 0;
    const pointsInCurrentLevel = points % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  const getMotivationalMessage = () => {
    const points = userProfile?.points || 0;
    if (points === 0) return "Welcome to your language learning journey! 🌟";
    if (points < 50) return "Great start! Keep up the momentum! 💪";
    if (points < 100) return "You're making excellent progress! 🚀";
    if (points < 200) return "Fantastic work! You're becoming fluent! ⭐";
    return "Amazing dedication! You're a language learning superstar! 🏆";
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg">
                  <span className="text-white text-lg"></span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">NorthLing</h1>
              </div>
              <Badge variant="secondary" className="ml-4">
                {userRole === 'admin' ? 'Admin' : 'Student'}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{userProfile?.points || 0}</span>
              </div>
              <div className="text-sm text-gray-600">Level {userProfile?.current_level || 1}</div>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <Button
              variant={currentSection === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => handleSectionChange('dashboard')}
              className="flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant={currentSection === 'vocabulary' ? 'default' : 'ghost'}
              onClick={() => handleSectionChange('vocabulary')}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Vocabulary</span>
            </Button>
            <Button
              variant={currentSection === 'lessons' ? 'default' : 'ghost'}
              onClick={() => handleSectionChange('lessons')}
              className="flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>Lessons</span>
            </Button>
            <Button
              variant={currentSection === 'quiz' ? 'default' : 'ghost'}
              onClick={() => handleSectionChange('quiz')}
              className="flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Quiz</span>
            </Button>
            <Button
              variant={currentSection === 'leaderboard' ? 'default' : 'ghost'}
              onClick={() => handleSectionChange('leaderboard')}
              className="flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentSection === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800">Welcome back, {user?.email?.split('@')[0]}!</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 mb-4">{getMotivationalMessage()}</p>

                <div className="flex items-center space-x-2 text-sm text-purple-600">
                  <span>Learning {selectedLanguages.target}</span>
                  <span>•</span>
                  <span>From {selectedLanguages.base}</span>
                  <Button variant="outline" size="sm" className="ml-4" onClick={() => setShowLanguageModal(true)}>
                    Change Language
                  </Button>
                </div>

                <Dialog open={showLanguageModal} onOpenChange={setShowLanguageModal}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Change Language</DialogTitle>
                      <DialogDescription>
                        Select your native language and the language you want to learn.
                      </DialogDescription>
                    </DialogHeader>
                    <LanguageSelector
                      onLanguageSelect={(langs) => {
                        setSelectedLanguages(langs);
                        localStorage.setItem('northling_base_lang', langs.base);
                        localStorage.setItem('northling_target_lang', langs.target);
                        setShowLanguageModal(false);
                        updateLearningLanguage(langs.target);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Learning Paths */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span>Vocabulary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 mb-4">Learn and practice new words in {selectedLanguages.target}</p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSectionChange('vocabulary')}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Lessons</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-600 mb-4">Interactive lessons to improve your {selectedLanguages.target}</p>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleSectionChange('lessons')}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-green-600" />
                    <span>Quiz</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-600 mb-4">Test your knowledge with interactive quizzes</p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleSectionChange('quiz')}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Words Learned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-800">{userProfile?.stages_completed?.vocabulary?.length || 0}</div>
                  <div className="text-xs text-blue-600 mt-1">+3 this week</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-800">{userProfile?.streak_days || 0} days</div>
                  <div className="text-xs text-red-600 mt-1">🔥 Keep it going!</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Total Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-800">{userProfile?.points || 0}</div>
                  <div className="text-xs text-purple-600 mt-1">Rank: #{Math.floor(Math.random() * 50) + 1}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Quiz Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-800">{Math.floor(Math.random() * 20) + 80}%</div>
                  <div className="text-xs text-green-600 mt-1">Last 10 quizzes</div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>Weekly Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const activity = Math.floor(Math.random() * 4);
                    return (
                      <div key={day} className="text-center">
                        <div className="text-xs text-gray-600 mb-1">{day}</div>
                        <div
                          className={`h-8 w-8 rounded mx-auto ${activity === 0 ? 'bg-gray-200' :
                            activity === 1 ? 'bg-purple-200' :
                              activity === 2 ? 'bg-purple-400' :
                                'bg-purple-600'
                            }`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                  Practice streak visualization
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>Daily Goal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Learn 5 new words</span>
                      <span>{Math.min(userProfile?.stages_completed?.vocabulary?.length || 0, 5)}/5</span>
                    </div>
                    <Progress value={(Math.min(userProfile?.stages_completed?.vocabulary?.length || 0, 5) / 5) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <span>Weekly Challenge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Complete 3 quiz stages</span>
                      <span>{Math.min(userProfile?.stages_completed?.quiz?.length || 0, 3)}/3</span>
                    </div>
                    <Progress value={(Math.min(userProfile?.stages_completed?.quiz?.length || 0, 3) / 3) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span>Level Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Level {userProfile?.current_level || 1}</span>
                    <span>{userProfile?.points || 0} / {(userProfile?.current_level || 1) * 100} points</span>
                  </div>
                  <Progress value={getLevelProgress()} className="h-3" />
                  <div className="text-xs text-gray-600">
                    {(100 - (userProfile?.points || 0) % 100)} more points to reach Level {(userProfile?.current_level || 1) + 1}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "First Steps", icon: "🌱", desc: "Started your learning journey", unlocked: true },
                    { name: "Word Master", icon: "📚", desc: "Learned 10 new words", unlocked: (userProfile?.stages_completed?.vocabulary?.length || 0) >= 10 },
                    { name: "Quiz Champion", icon: "🏆", desc: "Perfect quiz score", unlocked: (userProfile?.stages_completed?.quiz?.length || 0) >= 1 },
                  ].map((achievement, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200 opacity-60'
                      }`}>
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                          {achievement.name}
                        </div>
                        <div className={`text-sm ${achievement.unlocked ? 'text-yellow-600' : 'text-gray-500'}`}>
                          {achievement.desc}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-yellow-600">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
        }




        {
          currentSection === 'vocabulary' && (
            <VocabularyCard languages={selectedLanguages} />
          )
        }

        {
          currentSection === 'quiz' && (
            <QuizSection languages={selectedLanguages} />
          )
        }



        {
          currentSection === 'lessons' && (
            <LessonsSection languages={selectedLanguages} />
          )
        }

        {
          currentSection === 'leaderboard' && (
            <Leaderboard
              targetLanguage={selectedLanguages.target}
              currentUserId={user?.id}
            />
          )
        }
      </main >
    </div >
  );
};

export default DashboardPage;