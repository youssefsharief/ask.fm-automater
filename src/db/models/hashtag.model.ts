import * as mongoose from 'mongoose';

export interface IDbHashtagModel extends mongoose.Document, IDbPureHashtagModel {}

export interface IDbPureHashtagModel {
    text: string;
    rate: number;
}

export const getDbPureHashtag = (text, status) => ({ text, status });

const HashtagSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true, index: true, unique: true, sparse: true },
    rate: { type: Number, required: false },
});

export const HashtagModel: mongoose.Model<IDbHashtagModel> =
    mongoose.models.Hashtag || mongoose.model<IDbHashtagModel>('Hashtag', HashtagSchema);
