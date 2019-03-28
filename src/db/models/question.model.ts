import * as mongoose from 'mongoose';

export interface IDbQuestionModel extends mongoose.Document, IDbPureQuestionModel {}

export interface IDbPureQuestionModel {
    text: string;
}

export const getDbPureQuestion = (text, status) => ({ text, status });

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true, index: true, unique: true, sparse: true },
});

export const QuestionModel: mongoose.Model<IDbQuestionModel> =
    mongoose.models.Question || mongoose.model<IDbQuestionModel>('Question', QuestionSchema);
