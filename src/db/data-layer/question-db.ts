import { injectable } from 'inversify';
import { QuestionModel, IDbPureQuestionModel } from '../models/question.model';

@injectable()
export class QuestionDb {
    getAll(): Promise<IDbPureQuestionModel[]> {
        return QuestionModel.find({})
            .lean()
            .exec();
    }
}
