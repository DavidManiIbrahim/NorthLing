export interface LessonContent {
    id: number;
    title: string;
    content: string; // Markdown or HTML supported text
    examples: { original: string; translation: string; audio?: string }[];
}

export interface LessonStage {
    id: number;
    level: number;
    title: string;
    contents: LessonContent[];
}

export const LESSONS_DATA: Record<string, LessonStage[]> = {
    'Hausa': [
        {
            id: 1,
            level: 1,
            title: 'Introduction to Hausa Greetings',
            contents: [
                {
                    id: 1,
                    title: 'Basic Greetings',
                    content: 'In Hausa culture, greetings are very important. They are often long and structured. The most common greeting is "Sannu".',
                    examples: [
                        { original: 'Sannu', translation: 'Hello' },
                        { original: 'Ina kwana?', translation: 'Good morning? (How was your sleep?)' }
                    ]
                },
                {
                    id: 2,
                    title: 'Respectful Address',
                    content: 'When addressing older people, it is polite to avoid direct eye contact initially and use respectful titles.',
                    examples: [
                        { original: 'Ranka ya dade', translation: 'May your life be long (Respectful greeting)' }
                    ]
                }
            ]
        }
    ],
    'Fulani': [
        {
            id: 1,
            level: 1,
            title: 'Fulani Culture & Greetings',
            contents: [
                {
                    id: 1,
                    title: 'The Pulaaku Code',
                    content: 'Pulaaku is the code of conduct for Fulani people, emphasizing patience, self-control, and wisdom.',
                    examples: [
                        { original: 'Jam', translation: 'Peace' },
                        { original: 'A jaraama', translation: 'Thank you / Greetings' }
                    ]
                }
            ]
        }
    ],
    'Fulfulde': [
        {
            id: 1,
            level: 1,
            title: 'Welcome to Fulfulde',
            contents: [
                {
                    id: 1,
                    title: 'The Basics',
                    content: 'Fulfulde is the language of the Fulobe people. While dialects vary, the core greetings are shared across regions.',
                    examples: [
                        { original: 'Foy', translation: 'Hi/Hello' },
                        { original: 'No wa\'i?', translation: 'How is it going?' }
                    ]
                }
            ]
        }
    ]
};
