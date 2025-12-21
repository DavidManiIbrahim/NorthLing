import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
    userId: mongoose.Types.ObjectId;
    level: number;
    xp: number;
    streak: number;
    lessonsCompleted: number;
    lastActivityDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        level: {
            type: Number,
            default: 1,
        },
        xp: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        lessonsCompleted: {
            type: Number,
            default: 0,
        },
        lastActivityDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const UserProgress = mongoose.model<IUserProgress>(
    'UserProgress',
    userProgressSchema
);
