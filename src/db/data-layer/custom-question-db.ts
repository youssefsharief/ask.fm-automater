import { injectable } from 'inversify';
import { IDbPureQuestionModel } from '../models/question.model';

@injectable()
export class CustomQuestionDb {
    getAll(): Promise<IDbPureQuestionModel[]> {
        return Promise.resolve([
            { text: 'What is your name' },
        ]);
    }
}
