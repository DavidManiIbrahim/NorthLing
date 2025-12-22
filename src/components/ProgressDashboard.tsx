import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Clock, User, Check, Target, Trophy, Flame } from 'lucide-react';

interface ProgressDashboardProps {
  progress: {
    wordsLearned: number;
    streak: number;
    points: number;
    level: number;
  };
  languages: { base: string; target: string };
  onSectionChange: (section: string) => void;
}

const ProgressDashboard = ({ progress, languages, onSectionChange }: ProgressDashboardProps) => {
  const { user } = useAuth();

  const getLevelProgress = () => {
    const pointsInCurrentLevel = progress.points % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    const userName = user?.username?.split(' ')[0] || 'Learner';

    return `Good ${timeOfDay}, ${userName}! 👋`;
  };

  const getMotivationalMessage = () => {
    if (progress.points === 0) return "Ready to start your language learning journey? 🌟";
    if (progress.streak === 0) return "Let's get back on track with your studies! 💪";
    if (progress.streak >= 7) return `Amazing ${progress.streak}-day streak! Keep it going! 🔥`;
    if (progress.points < 50) return "Great start! Every word counts! 💪";
    if (progress.points < 100) return "You're making excellent progress! 🚀";
    if (progress.points < 200) return "Fantastic work! You're becoming fluent! ⭐";
    return "Amazing dedication! You're a language learning superstar! 🏆";
  };

  const getSuggestedLessons = () => {
    const lessons = [
      {
        title: "Basic Greetings",
        description: "Learn essential greetings and introductions",
        difficulty: "Beginner",
        xp: 50,
        action: () => onSectionChange('lessons')
      },
      {
        title: "Daily Vocabulary",
        description: "Practice common words for everyday situations",
        difficulty: "Beginner",
        xp: 30,
        action: () => onSectionChange('vocabulary')
      },
      {
        title: "Grammar Quiz",
        description: "Test your understanding of basic grammar rules",
        difficulty: "Intermediate",
        xp: 75,
        action: () => onSectionChange('quiz')
      }
    ];

    // Filter based on user's progress
    if (progress.wordsLearned < 10) {
      return lessons.slice(0, 2); // Show only basic lessons for beginners
    }
    return lessons; // Show all lessons for more advanced users
  };

  const achievements = [
    { name: "First Steps", description: "Learn your first word", unlocked: progress.wordsLearned >= 1, icon: "🌱" },
    { name: "Quick Learner", description: "Learn 10 words", unlocked: progress.wordsLearned >= 10, icon: "⚡" },
    { name: "Point Collector", description: "Earn 100 points", unlocked: progress.points >= 100, icon: "💎" },
    { name: "Dedicated", description: "Maintain a 3-day streak", unlocked: progress.streak >= 3, icon: "🔥" },
    { name: "Level Up", description: "Reach level 2", unlocked: progress.level >= 2, icon: "🆙" },
    { name: "Vocabulary Builder", description: "Learn 25 words", unlocked: progress.wordsLearned >= 25, icon: "📚" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section with personalized greeting */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          {getPersonalizedGreeting()}
        </h2>
        <p className="text-gray-600 text-lg">
          {getMotivationalMessage()}
        </p>

        {/* Daily Streak Highlight */}
        {progress.streak > 0 && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full border border-orange-200">
            <Flame className="h-5 w-5 text-red-500" />
            <span className="font-semibold text-red-700">
              {progress.streak} day streak!
            </span>
            <span className="text-sm text-red-600">Keep it going!</span>
          </div>
        )}

        <p className="text-sm text-gray-500">
          Learning {languages.target} from {languages.base}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600">{progress.wordsLearned}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Words Learned</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="mx-auto bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-600">{progress.points}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Total Points</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="mx-auto bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">{progress.streak}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="mx-auto bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-purple-600">{progress.level}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Current Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {progress.level}</span>
              <span>{progress.points % 100}/100 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getLevelProgress()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {100 - (progress.points % 100)} more points to reach Level {progress.level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Suggested Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getSuggestedLessons().map((lesson, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{lesson.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {lesson.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {lesson.xp} XP
                    </span>
                  </div>
                </div>
                <Button onClick={lesson.action} size="sm" className="ml-4">
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button
              onClick={() => onSectionChange('lessons')}
              className="h-20 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <div className="text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-1" />
                <div className="font-semibold">Lessons</div>
                <div className="text-xs opacity-90">Interactive learning</div>
              </div>
            </Button>

            <Button
              onClick={() => onSectionChange('vocabulary')}
              className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <div className="text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-1" />
                <div className="font-semibold">Practice</div>
                <div className="text-xs opacity-90">Vocabulary cards</div>
              </div>
            </Button>

            <Button
              onClick={() => onSectionChange('quiz')}
              className="h-20 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-1" />
                <div className="font-semibold">Quiz</div>
                <div className="text-xs opacity-90">Test knowledge</div>
              </div>
            </Button>

            <Button
              onClick={() => onSectionChange('achievements')}
              className="h-20 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
            >
              <div className="text-center">
                <Trophy className="h-6 w-6 mx-auto mb-1" />
                <div className="font-semibold">Achievements</div>
                <div className="text-xs opacity-90">View progress</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${achievement.unlocked
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                  }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className={`font-semibold ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                    {achievement.name}
                  </div>
                  <div className={`text-sm ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
