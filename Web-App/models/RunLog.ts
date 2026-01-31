import mongoose from 'mongoose';

export interface RunLog extends mongoose.Document {
    teamName: string;
    score: number;
    timeTaken: number; // in seconds
    batteryUsed: number; // percentage
    timestamp: Date;
    notes?: string;
}

const RunLogSchema = new mongoose.Schema<RunLog>({
    teamName: { type: String, required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    batteryUsed: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
});

export default mongoose.models.RunLog || mongoose.model<RunLog>('RunLog', RunLogSchema);
