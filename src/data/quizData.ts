export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: string;
    points: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    audio?: string;
}

export interface QuizStage {
    id: number;
    level: number;
    name: string;
    description: string;
    questions: QuizQuestion[];
}

export const QUIZ_DATA: Record<string, QuizStage[]> = {
    'Hausa': [
        {
            id: 1,
            level: 1,
            name: 'Hausa Basics',
            description: 'Test your knowledge of basic Hausa greetings and words.',
            questions: [
                {
                    question: 'What does "Sannu" mean?',
                    options: ['Hello', 'Goodbye', 'Water', 'Food'],
                    correct_answer: 'Hello',
                    points: 10,
                    difficulty: 'easy',
                    category: 'greetings'
                },
                {
                    question: 'How do you say "Thank you" in Hausa?',
                    options: ['Nagode', 'Sannu', 'Gida', 'Mota'],
                    correct_answer: 'Nagode',
                    points: 10,
                    difficulty: 'easy',
                    category: 'greetings'
                },
                {
                    question: 'Translate "Ruwa"',
                    options: ['Water', 'Rice', 'Road', 'School'],
                    correct_answer: 'Water',
                    points: 10,
                    difficulty: 'easy',
                    category: 'vocabulary'
                },
                {
                    question: 'What is "Makaranta"?',
                    options: ['School', 'Market', 'Hospital', 'House'],
                    correct_answer: 'School',
                    points: 10,
                    difficulty: 'easy',
                    category: 'vocabulary'
                }
            ]
        },
        {
            id: 2,
            level: 2,
            name: 'Common Objects',
            description: 'Identify common daily objects.',
            questions: [
                {
                    question: 'What is "Gida"?',
                    options: ['House', 'Car', 'Pen', 'Book'],
                    correct_answer: 'House',
                    points: 15,
                    difficulty: 'medium',
                    category: 'vocabulary'
                },
                {
                    question: 'Which word means "Car"?',
                    options: ['Mota', 'Keke', 'Jirgi', 'Doki'],
                    correct_answer: 'Mota',
                    points: 15,
                    difficulty: 'medium',
                    category: 'vocabulary'
                }
            ]
        }
    ],
    'Fulani': [
        {
            id: 1,
            level: 1,
            name: 'Fulani Basics',
            description: 'Basic Fulani greetings and essential words.',
            questions: [
                {
                    question: 'What does "Jam" mean?',
                    options: ['Peace', 'War', 'Food', 'Water'],
                    correct_answer: 'Peace',
                    points: 10,
                    difficulty: 'easy',
                    category: 'greetings'
                },
                {
                    question: 'Translate "Ndiyam"',
                    options: ['Water', 'Milk', 'Oil', 'Juice'],
                    correct_answer: 'Water',
                    points: 10,
                    difficulty: 'easy',
                    category: 'vocabulary'
                },
                {
                    question: 'How do you say "Thank you"?',
                    options: ['A jaraama', 'Jam tan', 'No wa\'i', 'Foy'],
                    correct_answer: 'A jaraama',
                    points: 10,
                    difficulty: 'easy',
                    category: 'greetings'
                }
            ]
        }
    ],
    'Fulfulde': [
        {
            id: 1,
            level: 1,
            name: 'Fulfulde Starters',
            description: 'Get started with Fulfulde.',
            questions: [
                {
                    question: 'Meaning of "Nagge"?',
                    options: ['Cow', 'Goat', 'Sheep', 'Chicken'],
                    correct_answer: 'Cow',
                    points: 10,
                    difficulty: 'easy',
                    category: 'animals'
                },
                {
                    question: 'Meaning of "Kosam"?',
                    options: ['Milk', 'Water', 'Oil', 'Soup'],
                    correct_answer: 'Milk',
                    points: 10,
                    difficulty: 'easy',
                    category: 'food'
                }
            ]
        }
    ]
};
