import * as mongoose from 'mongoose';

export interface IDbUserModel extends mongoose.Document, IDbUserPureModel {}

export interface IDbUserPureModel {
    userId: string;
    status?: string;
    hashtags?: string[];
    latestActivityTime?: Date;
    messages?: string[];
}

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, trim: true, index: true, unique: true, sparse: true },
    status: { type: String, required: false },
    hashtags: [String],
    latestActivityTime: { type: Date, required: false },
    messages: { type: [String], required: true, default: [] },
});

export const UserModel: mongoose.Model<IDbUserModel> = mongoose.models.User || mongoose.model<IDbUserModel>('User', UserSchema);
