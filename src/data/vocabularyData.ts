export interface VocabularyWord {
    word: string;
    translation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    audio_url?: string;
}

export interface VocabularyStage {
    id: number;
    level: number;
    words: VocabularyWord[];
}

export const VOCABULARY_DATA: Record<string, VocabularyStage[]> = {
    // English -> Hausa (Target: Hausa)
    'Hausa': [
        {
            id: 1, level: 1, words: [
                { word: 'Sannu', translation: 'Hello', difficulty: 'easy' },
                { word: 'Sai anjima', translation: 'Goodbye', difficulty: 'easy' },
                { word: 'Nagode', translation: 'Thank you', difficulty: 'easy' },
                { word: 'Ina kwana?', translation: 'Good morning?', difficulty: 'easy' },
                { word: 'Barka da yamma', translation: 'Good afternoon', difficulty: 'easy' }
            ]
        },
        {
            id: 2, level: 2, words: [
                { word: 'Ruwa', translation: 'Water', difficulty: 'easy' },
                { word: 'Abinci', translation: 'Food', difficulty: 'easy' },
                { word: 'Shinkafa', translation: 'Rice', difficulty: 'easy' },
                { word: 'Mota', translation: 'Car', difficulty: 'easy' },
                { word: 'Gida', translation: 'House', difficulty: 'easy' }
            ]
        },
        {
            id: 3, level: 3, words: [
                { word: 'Makaranta', translation: 'School', difficulty: 'medium' },
                { word: 'Littafi', translation: 'Book', difficulty: 'medium' },
                { word: 'Alkalam', translation: 'Pen', difficulty: 'medium' },
                { word: 'Malam', translation: 'Teacher', difficulty: 'medium' },
                { word: 'Dalibi', translation: 'Student', difficulty: 'medium' }
            ]
        },
        {
            id: 4, level: 4, words: [
                { word: 'Iyali', translation: 'Family', difficulty: 'medium' },
                { word: 'Uba', translation: 'Father', difficulty: 'medium' },
                { word: 'Uwa', translation: 'Mother', difficulty: 'medium' },
                { word: 'Dan\'uwa', translation: 'Brother', difficulty: 'medium' },
                { word: 'Yar\'uwa', translation: 'Sister', difficulty: 'medium' }
            ]
        }
    ],
    // English -> Fulani/Fulfulde (Target: Fulani)
    'Fulani': [
        {
            id: 1, level: 1, words: [
                { word: 'Jam', translation: 'Peace/Hello', difficulty: 'easy' },
                { word: 'A jaraama', translation: 'Thank you', difficulty: 'easy' },
                { word: 'On jaraama', translation: 'Thank you (plural)', difficulty: 'easy' },
                { word: 'No wa\'i?', translation: 'How are you?', difficulty: 'easy' },
                { word: 'Jam tan', translation: 'I am fine (Peace only)', difficulty: 'easy' }
            ]
        },
        {
            id: 2, level: 2, words: [
                { word: 'Ndiyam', translation: 'Water', difficulty: 'easy' },
                { word: 'Nyamdu', translation: 'Food', difficulty: 'easy' },
                { word: 'Maaro', translation: 'Rice', difficulty: 'easy' },
                { word: 'Suudu', translation: 'House/Room', difficulty: 'easy' },
                { word: 'Laawol', translation: 'Road', difficulty: 'easy' }
            ]
        },
        {
            id: 3, level: 3, words: [
                { word: 'Jangirde', translation: 'School', difficulty: 'medium' },
                { word: 'Deftere', translation: 'Book', difficulty: 'medium' },
                { word: 'Binndirgal', translation: 'Pen', difficulty: 'medium' },
                { word: 'Janginoowo', translation: 'Teacher', difficulty: 'medium' },
                { word: 'Pukaraajo', translation: 'Student', difficulty: 'medium' }
            ]
        }
    ],
    // Alias for Fulfulde
    'Fulfulde': [
        {
            id: 1, level: 1, words: [
                { word: 'Foy', translation: 'Hi/Hello', difficulty: 'easy' },
                { word: 'A jaraama', translation: 'Greetings', difficulty: 'easy' },
                { word: 'No wa\'i?', translation: 'How is it?', difficulty: 'easy' },
                { word: 'Jam tun', translation: 'Peace only', difficulty: 'easy' },
                { word: 'Mido waawi', translation: 'I can', difficulty: 'easy' }
            ]
        },
        {
            id: 2, level: 2, words: [
                { word: 'Ndiyam', translation: 'Water', difficulty: 'easy' },
                { word: 'Njaareendi', translation: 'Sand', difficulty: 'easy' },
                { word: 'Nagge', translation: 'Cow', difficulty: 'easy' },
                { word: 'Kosam', translation: 'Milk', difficulty: 'easy' },
                { word: 'Nebbam', translation: 'Oil', difficulty: 'easy' }
            ]
        }
    ]
};
