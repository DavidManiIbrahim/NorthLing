import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Check } from 'lucide-react';
import StagesSelector from './StagesSelector';
// import { supabase } from "@/integrations/supabase/client";
// import type { VocabularyStage } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/hooks/useUserProgress";

interface VocabularyCardProps {
  languages: { base: string; target: string };
}

import { VOCABULARY_DATA } from "@/data/vocabularyData";

// ...

function VocabularyCard({ languages }: VocabularyCardProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [currentStage, setCurrentStage] = useState<any>(null);
  const [unlockedState, setUnlockedState] = useState<{ stage: number, nextStage?: number } | null>(null);
  const [stages, setStages] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [stageProgress, setStageProgress] = useState<Record<number, number>>({});
  const { userProfile, updateProgress, loading: userLoading } = useUserProgress();
  const { toast } = useToast();
  const completedStages = userProfile?.stages_completed?.vocabulary || [];

  useEffect(() => {
    // Load stages based on target language
    const targetLang = languages?.target;
    // Strict lookup: only show data for the selected target language
    const data = VOCABULARY_DATA[targetLang];

    if (data) {
      setStages(data);

      // Set first stage as current if not set
      if (data.length > 0 && !currentStage) {
        setCurrentStage(data[0]);
      } else if (currentStage && data.length > 0) {
        // If language changed, verify current stage belongs to new language, otherwise reset
        const stageExists = data.find(s => s.id === currentStage.id);
        if (!stageExists) {
          setCurrentStage(data[0]);
          setCurrentCardIndex(0);
          setKnownWords([]);
        }
      }

      setLoading(false);
    }
  }, [languages.target]);

  const nextCard = () => {
    if (!currentStage) return;
    setCurrentCardIndex((prev) => (prev + 1) % currentStage.words.length);
    setIsFlipped(false);
  };

  const currentCard = currentStage?.words[currentCardIndex];

  const playAudio = async (text: string, lang: string) => {
    if (currentCard?.audio_url) {
      // Play from audio URL if available
      const audio = new Audio(currentCard.audio_url);
      await audio.play();
    } else if ('speechSynthesis' in window) {
      // Fallback to speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'Spanish' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStageSelect = (stageId: number) => {
    const stage = stages.find(s => s.level === stageId);
    if (!stage) return;

    // All stages are now unlocked by default
    setCurrentStage(stage);
    setCurrentCardIndex(0);
    setKnownWords([]);
    setIsFlipped(false);

    toast({
      title: "Stage Selected",
      description: `Stage ${stage.level} loaded successfully!`,
    });
  };

  const handleKnowWord = async () => {
    if (!currentStage || !currentCard || !userProfile) {
      console.log('Missing required data:', { currentStage, currentCard, userProfile });
      return;
    }

    // Always add the word to known words if it's not already there
    if (!knownWords.includes(currentCardIndex)) {
      const newKnownWords = [...knownWords, currentCardIndex];
      setKnownWords(newKnownWords);

      // Update stage progress
      const newProgress = {
        ...stageProgress,
        [currentStage.id]: (stageProgress[currentStage.id] || 0) + 1
      };
      setStageProgress(newProgress);

      // Calculate points based on difficulty
      const points = currentCard.difficulty === 'hard' ? 30 :
        currentCard.difficulty === 'medium' ? 20 : 10;

      try {
        // Only add the stage to completed stages if all words are known
        const completedStagesList = [...(userProfile.stages_completed?.vocabulary || [])];
        if (newKnownWords.length === currentStage.words.length &&
          !completedStagesList.includes(currentStage.level)) {
          completedStagesList.push(currentStage.level);
        }

        // Update user progress
        await updateProgress(points, {
          vocabulary: completedStagesList
        });

        // Show points toast
        toast({
          title: `+${points} Points!`,
          description: "Great job! Keep learning! 🌟",
        });

        // Check if stage is completed
        if (newKnownWords.length === currentStage.words.length) {
          // Show completion toast and set unlocked state
          toast({
            title: "Stage Completed!",
            description: `Congratulations! You've mastered all words in stage ${currentStage.level}!`,
          });

          const nextStageIndex = stages.findIndex(s => s.id === currentStage.id) + 1;
          setUnlockedState({
            stage: currentStage.level,
            nextStage: nextStageIndex < stages.length ? stages[nextStageIndex].level : undefined
          });
        }
      } catch (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error",
          description: `Failed to update progress: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }
    }

    // Always move to next card
    nextCard();
  };

  const handleDontKnowWord = () => {
    toast({
      title: "Keep practicing! 💪",
      description: "Review this word and try again later.",
    });
    nextCard();
  };

  const resetCards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownWords([]);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStage) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No vocabulary stages available
        </CardContent>
      </Card>
    );
  }

  // Show unlocked state UI if a stage was just completed
  if (unlockedState) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-100 to-blue-100 border-green-300 animate-pulse">
          <CardContent className="text-center p-8 flex flex-col items-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Stage {unlockedState.stage} Completed!
            </h3>
            <p className="text-green-700 mb-4">
              You unlocked a new state in your learning journey!
            </p>
            {unlockedState.nextStage ? (
              <Button
                className="bg-blue-600 hover:bg-blue-700 mb-2"
                onClick={() => {
                  setUnlockedState(null);
                  handleStageSelect(unlockedState.nextStage!);
                }}
              >
                Go to Stage {unlockedState.nextStage}
              </Button>
            ) : (
              <div className="text-lg text-blue-700 font-semibold">All stages completed!</div>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setUnlockedState(null);
                resetCards();
              }}
            >
              Practice Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Vocabulary Practice</h2>
            <p className="text-gray-600">
              Stage {currentStage.level} • Card {currentCardIndex + 1} of {currentStage.words.length} •
              Known: {knownWords.length} words
            </p>
          </div>

          {/* <StagesSelector
            stages={stages.map(stage => ({
              id: stage.id,
              level: stage.level,
              difficulty: 'medium', // Default difficulty since it's not in the stage data
              wordsCount: stage.words.length
            }))}
            currentStageId={currentStage.id}
            completedStages={completedStages}
            progress={stageProgress}
            onStageSelect={handleStageSelect}
          /> */}

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / currentStage.words.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div
        className="relative h-80 w-full cursor-pointer perspective"
        onClick={handleCardFlip}
      >
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col justify-center items-center p-8">
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-500 uppercase tracking-wide flex items-center justify-center gap-2">
                  <Badge variant={currentCard.difficulty === 'easy' ? 'secondary' : currentCard.difficulty === 'medium' ? 'default' : 'destructive'}>
                    {currentCard.difficulty}
                  </Badge>
                </div>
                <div className="text-4xl font-bold text-gray-800">
                  {currentCard.word}
                </div>
                <div className="text-gray-600 italic">
                  {languages.target}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentCard.word, languages.target); // Target word, usually Hausa
                  }}
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Back of card */}
          <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  Translation in {languages.base}
                </div>
                <div className="text-4xl font-bold text-blue-600">
                  {currentCard.translation}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentCard.translation, languages.target);
                  }}
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        Click the card to flip it and see the translation
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleDontKnowWord}
          variant="outline"
          className="flex-1 max-w-xs"
        // disabled={loading || userLoading || !userProfile}
        >
          Still Learning
        </Button>
        <Button
          onClick={handleKnowWord}
          className="flex-1 max-w-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        // disabled={loading || userLoading || !userProfile}
        >
          {/* {loading || userLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )} */}
          I Know This
        </Button>
      </div>
      {/* {!userProfile && (
        <div className="text-center text-sm text-red-500 mt-2">
          Loading user profile... Please wait.
        </div>
      )} */}

      {currentStage && knownWords.length === currentStage.words.length && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center p-6">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700 mb-4">
              You've completed all vocabulary cards!
            </p>
            <Button onClick={resetCards} className="bg-green-600 hover:bg-green-700">
              Practice Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default VocabularyCard;