import mongoose, { Document, Schema } from 'mongoose';

export interface IUserPreferences extends Document {
    userId: mongoose.Types.ObjectId;
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userPreferencesSchema = new Schema<IUserPreferences>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        language: {
            type: String,
            default: 'en',
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system',
        },
        notifications: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const UserPreferences = mongoose.model<IUserPreferences>(
    'UserPreferences',
    userPreferencesSchema
);
