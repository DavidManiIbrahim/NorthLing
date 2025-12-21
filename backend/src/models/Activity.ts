import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
    userId: mongoose.Types.ObjectId;
    type: string;
    description: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
activitySchema.index({ userId: 1, createdAt: -1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
