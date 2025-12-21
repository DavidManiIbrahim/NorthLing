import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LESSONS_DATA, LessonStage } from "@/data/lessonsData";
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

interface LessonsSectionProps {
    languages: { base: string; target: string };
}

const LessonsSection = ({ languages }: LessonsSectionProps) => {
    const [stages, setStages] = useState<LessonStage[]>([]);
    const [currentStage, setCurrentStage] = useState<LessonStage | null>(null);
    const [currentContentIndex, setCurrentContentIndex] = useState(0);

    useEffect(() => {

        const targetLang = languages.target || 'Hausa';

        // Strict lookup for target language data
        const data = LESSONS_DATA[targetLang];

        if (data) {
            setStages(data);
            if (data.length > 0) {
                setCurrentStage(data[0]);
                setCurrentContentIndex(0);
            } else {
                setCurrentStage(null);
            }
        } else {
            // If data for the specific language is missing, check if we should fallback. 
            // The user requested "each language have their vocabulary...", so falling back to Hausa when I selected "Fulfulde" (if it was missing) would be bad.
            // So we will set stages to empty and let the "No lessons available" screen show.
            setStages([]);
            setCurrentStage(null);
        }
    }, [languages.target]);

    const handleNext = () => {
        if (currentStage && currentContentIndex < currentStage.contents.length - 1) {
            setCurrentContentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentContentIndex > 0) {
            setCurrentContentIndex(prev => prev - 1);
        }
    };

    if (!currentStage) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-gray-500">
                    No lessons available for {languages.target} yet.
                </CardContent>
            </Card>
        );
    }

    const content = currentStage.contents[currentContentIndex];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{currentStage.title}</h2>
                <p className="text-sm text-gray-500">Lesson {currentContentIndex + 1} of {currentStage.contents.length}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        {content.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {content.content}
                    </p>

                    <div className="bg-purple-50 p-4 rounded-lg space-y-3 border border-purple-100">
                        <h4 className="font-semibold text-purple-800">Examples:</h4>
                        {content.examples.map((ex, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-2 bg-white rounded shadow-sm">
                                <span className="font-bold text-gray-800">{ex.original}</span>
                                <span className="text-gray-500 italic">{ex.translation}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={handlePrev} disabled={currentContentIndex === 0}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>
                        <Button onClick={handleNext} disabled={currentContentIndex === currentStage.contents.length - 1}>
                            Next <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LessonsSection;
