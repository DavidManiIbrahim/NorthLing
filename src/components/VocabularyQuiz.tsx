import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Flame, Check, X, Headphones, FastForward } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuizSectionProps {
  languages: { base: string; target: string };
}

const VocabularyQuiz = ({ languages }: QuizSectionProps) => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  // Hardcoded vocabulary data
  const [loading, setLoading] = useState(false);
  const [stages] = useState([
    {
      id: 1,
      words: [
        { word: 'Hello', translation: 'Sannu', options: ['Sannu', 'Barka', 'Ina', 'Lafiya'] },
        { word: 'Water', translation: 'Ruwa', options: ['Ruwa', 'Gida', 'Abinci', 'Daki'] },
        { word: 'Food', translation: 'Abinci', options: ['Abinci', 'Ruwa', 'Gida', 'Lafiya'] },
        { word: 'Thank you', translation: 'Nagode', options: ['Nagode', 'Sannu', 'Barka', 'Ruwa'] },
        { word: 'Goodbye', translation: 'Sai anjima', options: ['Sai anjima', 'Nagode', 'Sannu', 'Barka'] },
        { word: 'Please', translation: 'Don Allah', options: ['Don Allah', 'Nagode', 'Barka', 'Daki'] },
        { word: 'Good morning', translation: 'Ina kwana', options: ['Ina kwana', 'Barka da yamma', 'Nagode', 'Lafiya'] },
        { word: 'Welcome', translation: 'Barka da zuwa', options: ['Barka da zuwa', 'Sai anjima', 'Sannu', 'Nagode'] },
        { word: 'How are you?', translation: 'Yaya kake?', options: ['Yaya kake?', 'Sai anjima', 'Barka da zuwa', 'Sannu'] },
        { word: 'Fine', translation: 'Lafiya lau', options: ['Lafiya lau', 'Yaya kake?', 'Sannu', 'Nagode'] }
      ]
    },
    {
      id: 2,
      words: [
        { word: 'House', translation: 'Gida', options: ['Gida', 'Daki', 'Abinci', 'Ruwa'] },
        { word: 'Room', translation: 'Daki', options: ['Daki', 'Gida', 'Abinci', 'Lafiya'] },
        { word: 'Kitchen', translation: 'Dakin girki', options: ['Dakin girki', 'Daki', 'Gida', 'Bene'] },
        { word: 'Bathroom', translation: 'Bayan gida', options: ['Bayan gida', 'Dakin girki', 'Daki', 'Gida'] },
        { word: 'Bedroom', translation: 'Dakin kwana', options: ['Dakin kwana', 'Bayan gida', 'Dakin girki', 'Daki'] },
        { word: 'Living room', translation: 'Zaure', options: ['Zaure', 'Dakin kwana', 'Bayan gida', 'Dakin girki'] },
        { word: 'Door', translation: 'Kofa', options: ['Kofa', 'Taga', 'Bango', 'Gida'] },
        { word: 'Window', translation: 'Taga', options: ['Taga', 'Kofa', 'Bango', 'Gida'] },
        { word: 'Wall', translation: 'Bango', options: ['Bango', 'Kofa', 'Taga', 'Gida'] },
        { word: 'Floor', translation: 'Kasa', options: ['Kasa', 'Bango', 'Kofa', 'Taga'] }
      ]
    },
    {
      id: 3,
      words: [
        { word: 'Goodbye', translation: 'Sai anjima', options: ['Sai anjima', 'Nagode', 'Sannu', 'Barka'] },
        { word: 'Please', translation: 'Don Allah', options: ['Don Allah', 'Nagode', 'Barka', 'Daki'] },
        { word: 'Morning', translation: 'Ina kwana', options: ['Ina kwana', 'Barka da yamma', 'Nagode', 'Lafiya'] },
        { word: 'Forest', translation: 'Daji', options: ['Daji', 'Gona', 'Kogi', 'Dutse'] },
        { word: 'Road', translation: 'Hanya', options: ['Hanya', 'Daji', 'Gona', 'Kogi'] },
        { word: 'City', translation: 'Birni', options: ['Birni', 'Hanya', 'Daji', 'Gona'] },
        { word: 'Mountain', translation: 'Dutse', options: ['Dutse', 'Kogi', 'Gona', 'Daji'] },
        { word: 'River', translation: 'Kogi', options: ['Kogi', 'Dutse', 'Gona', 'Daji'] },
        { word: 'Farm', translation: 'Gona', options: ['Gona', 'Kogi', 'Dutse', 'Daji'] }
      ]
    },
    {
      id: 4,
      words: [
        { word: 'Father', translation: 'Uba', options: ['Uba', 'Mahaifiya', 'Yaro', 'Gida'] },
        { word: 'Mother', translation: 'Uwa', options: ['Uwa', 'Uba', 'Yarinya', 'Abinci'] },
        { word: 'Child', translation: 'Yaro', options: ['Yaro', 'Uba', 'Uwa', 'Daki'] },
        { word: 'Light', translation: 'Hasken', options: ['Hasken', 'Kasa', 'Bango', 'Kofa'] },
        { word: 'Dark', translation: 'Duhu', options: ['Duhu', 'Hasken', 'Kasa', 'Bango'] },
        { word: 'Fire', translation: 'Wuta', options: ['Wuta', 'Duhu', 'Hasken', 'Kasa'] },
        { word: 'Door', translation: 'Kofa', options: ['Kofa', 'Tagar', 'Kujera', 'Tebur'] },
        { word: 'Wall', translation: 'Bango', options: ['Bango', 'Kofa', 'Tagar', 'Kujera'] },
        { word: 'Floor', translation: 'Kasa', options: ['Kasa', 'Bango', 'Kofa', 'Tagar'] }
      ]
    },
    {
      id: 5,
      words: [
        { word: 'Book', translation: 'Littafi', options: ['Littafi', 'Gida', 'Daki', 'Ruwa'] },
        { word: 'Pen', translation: 'Alkalam', options: ['Alkalam', 'Littafi', 'Abinci', 'Nagode'] },
        { word: 'School', translation: 'Makaranta', options: ['Makaranta', 'Gida', 'Daki', 'Lafiya'] },
        { word: 'Chair', translation: 'Kujera', options: ['Kujera', 'Tebur', 'Gida', 'Daki'] },
        { word: 'Table', translation: 'Tebur', options: ['Tebur', 'Kujera', 'Gida', 'Daki'] },
        { word: 'Window', translation: 'Tagar', options: ['Tagar', 'Kujera', 'Tebur', 'Daki'] },
        { word: 'Market', translation: 'Kasuwanci', options: ['Kasuwanci', 'Kasuwa', 'Gida', 'Daki'] },
        { word: 'Shop', translation: 'Shago', options: ['Shago', 'Kasuwanci', 'Gida', 'Daki'] },
        { word: 'Money', translation: 'Kudi', options: ['Kudi', 'Shago', 'Kasuwanci', 'Gida'] }
      ]
    },
    {
      id: 6,
      words: [
        { word: 'Car', translation: 'Mota', options: ['Mota', 'Keke', 'Gida', 'Daki'] },
        { word: 'Bicycle', translation: 'Keke', options: ['Keke', 'Mota', 'Abinci', 'Nagode'] },
        { word: 'Market', translation: 'Kasuwa', options: ['Kasuwa', 'Gida', 'Daki', 'Lafiya'] },
        { word: 'Boy', translation: 'Yaro', options: ['Yaro', 'Yarinya', 'Aboki', 'Abokiya'] },
        { word: 'Teacher', translation: 'Malam', options: ['Malam', 'Dalibi', 'Aboki', 'Yaro'] },
        { word: 'Student', translation: 'Dalibi', options: ['Dalibi', 'Malam', 'Aboki', 'Yaro'] },
        { word: 'Ten', translation: 'Goma', options: ['Goma', 'Tara', 'Takwas', 'Bakwai'] },
        { word: 'Friend', translation: 'Aboki', options: ['Aboki', 'Abokiya', 'Yaro', 'Yarinya'] },
        { word: 'Girl', translation: 'Yarinya', options: ['Yarinya', 'Yaro', 'Aboki', 'Abokiya'] }
      ]
    },
    {
      id: 7,
      words: [
        { word: 'Rice', translation: 'Shinkafa', options: ['Shinkafa', 'Abinci', 'Ruwa', 'Gida'] },
        { word: 'Meat', translation: 'Nama', options: ['Nama', 'Shinkafa', 'Abinci', 'Nagode'] },
        { word: 'Soup', translation: 'Miyan', options: ['Miyan', 'Nama', 'Shinkafa', 'Lafiya'] },
        { word: 'Seven', translation: 'Bakwai', options: ['Bakwai', 'Takwas', 'Tara', 'Goma'] },
        { word: 'Eight', translation: 'Takwas', options: ['Takwas', 'Bakwai', 'Tara', 'Goma'] },
        { word: 'Nine', translation: 'Tara', options: ['Tara', 'Bakwai', 'Takwas', 'Goma'] },
        { word: 'Four', translation: 'Hudu', options: ['Hudu', 'Biyar', 'Shida', 'Bakwai'] },
        { word: 'Five', translation: 'Biyar', options: ['Biyar', 'Hudu', 'Shida', 'Bakwai'] },
        { word: 'Six', translation: 'Shida', options: ['Shida', 'Biyar', 'Hudu', 'Bakwai'] }
      ]
    },
    {
      id: 8,
      words: [
        { word: 'Dog', translation: 'Kare', options: ['Kare', 'Mage', 'Akuya', 'Shanu'] },
        { word: 'Cat', translation: 'Mage', options: ['Mage', 'Kare', 'Akuya', 'Shanu'] },
        { word: 'Goat', translation: 'Akuya', options: ['Akuya', 'Kare', 'Mage', 'Shanu'] },
        { word: 'One', translation: 'Daya', options: ['Daya', 'Biyu', 'Uku', 'Hudu'] },
        { word: 'Two', translation: 'Biyu', options: ['Biyu', 'Daya', 'Uku', 'Hudu'] },
        { word: 'Three', translation: 'Uku', options: ['Uku', 'Daya', 'Biyu', 'Hudu'] },
        { word: 'Sun', translation: 'Rana', options: ['Rana', 'Ruwa', 'Dare', 'Gida'] },
        { word: 'Rain', translation: 'Ruwa', options: ['Ruwa', 'Rana', 'Dare', 'Gida'] },
        { word: 'Night', translation: 'Dare', options: ['Dare', 'Rana', 'Ruwa', 'Gida'] }
      ]
    }

  ]);
  const [currentStage, setCurrentStage] = useState(stages[0]);
  const [stageProgress, setStageProgress] = useState<Record<number, { score: number; total: number }>>({});
  const [animation, setAnimation] = useState<'correct' | 'wrong' | null>(null);

  const { toast } = useToast();

  // Function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // State for shuffled options
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  // Update options when quiz changes
  useEffect(() => {
    if (currentStage?.words?.[currentQuiz]) {
      setCurrentOptions(shuffleArray(currentStage.words[currentQuiz].options));
    }
  }, [currentQuiz, currentStage]);

  const handleAnswer = async (answer: string) => {
    if (showResult || !currentStage?.words) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentStage.words[currentQuiz]?.translation;

    setAnimation(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(s => s + 10);
      setStreakCount(s => s + 1);
    } else {
      setStreakCount(0);
    }

    setTimeout(() => {
      setAnimation(null);
      setSelectedAnswer(null);
      if (currentQuiz < (currentStage.words?.length || 0) - 1) {
        setCurrentQuiz(q => q + 1);
      } else {
        // Show celebration screen
        toast({
          title: "Stage Complete! 🎉",
          description: `Congratulations! You've completed Stage ${currentStage.id} with a score of ${score + (isCorrect ? 10 : 0)}!`,
          duration: 2000
        });
        setShowResult(true);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Vocabulary Quiz
          </CardTitle>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">{streakCount}</span>
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(currentQuiz / (currentStage?.words?.length || 1)) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {showResult ? (
          <div className="text-center space-y-4">
            <div className="py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-700 mb-2">Stage {currentStage.id} Complete!</h3>
              <p className="text-xl text-gray-700 mb-6">Final Score: {score}</p>
              <div className="space-y-4">
                <p className="text-green-600">You've mastered {currentStage.words.length} new words!</p>
                {currentStage.id < stages.length ? (
                  <Button
                    className="w-full max-w-md bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const nextStage = stages.find(s => s.id === currentStage.id + 1);
                      if (nextStage) {
                        setCurrentStage(nextStage);
                        setShowResult(false);
                        setCurrentQuiz(0);
                        setScore(0);
                        setStreakCount(0);
                      }
                    }}
                  >
                    Continue to Stage {currentStage.id + 1}
                  </Button>
                ) : (
                  <p className="text-purple-600 font-semibold">Congratulations! You've completed all stages!</p>
                )}
                <Button
                  variant="outline"
                  className="w-full max-w-md mt-2"
                  onClick={() => {
                    setShowResult(false);
                    setCurrentQuiz(0);
                    setScore(0);
                    setStreakCount(0);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuiz}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">
                  {currentStage?.words?.[currentQuiz]?.word}
                </h3>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Add text-to-speech functionality here
                    }}
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentQuiz < (currentStage.words?.length || 0) - 1) {
                        setCurrentQuiz(q => q + 1);
                      } else {
                        const nextStage = stages.find(s => s.id === currentStage.id + 1);
                        if (nextStage) {
                          setCurrentStage(nextStage);
                          setCurrentQuiz(0);
                          setScore(0);
                          setStreakCount(0);
                        } else {
                          setShowResult(true);
                        }
                      }
                    }}
                  >
                    <FastForward className="h-4 w-4 mr-2" />
                    I know this
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? (
                      option === currentStage.words?.[currentQuiz]?.translation
                        ? "success"
                        : "destructive"
                    ) : "outline"}
                    className={cn(
                      "h-20 text-lg relative overflow-hidden",
                      animation === 'correct' && selectedAnswer === option && "border-green-500 bg-green-50",
                      animation === 'wrong' && selectedAnswer === option && "border-red-500 bg-red-50"
                    )}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                  >
                    {option}
                    {selectedAnswer === option && (
                      option === currentStage.words?.[currentQuiz]?.translation ? (
                        <Check className="absolute bottom-2 right-2 h-4 w-4 text-green-500" />
                      ) : (
                        <X className="absolute bottom-2 right-2 h-4 w-4 text-red-500" />
                      )
                    )}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default VocabularyQuiz;
