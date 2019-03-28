import { Query } from 'mongoose';
import { UserModel, IDbUserModel } from '../../src/db/models/user.model';
import * as mongoose from 'mongoose';
import { HashtagModel, IDbPureHashtagModel, IDbHashtagModel } from '../../src/db/models/hashtag.model';
import { logger } from '../../src/infrastructure/logger';
import { QuestionModel, IDbQuestionModel, IDbPureQuestionModel } from '../../src/db/models/question.model';

export const testingDbOperations = {
    disconnectDb() {
        return mongoose.disconnect();
    },

    removeAllUsers(): Query<any> {
        return UserModel.deleteMany({});
    },

    removeAllHashtags(): Query<any> {
        return HashtagModel.deleteMany({});
    },

    removeAllQuestions(): Query<any> {
        return QuestionModel.deleteMany({});
    },

    adddUser(u): Promise<IDbUserModel> {
        const user = new UserModel(u);
        return user.save();
    },

    addHashtags(hashtags: IDbPureHashtagModel[]): Array<Promise<IDbHashtagModel>> {
        return hashtags.map(async hashtag => {
            const newHashtag = new HashtagModel(hashtag);
            try {
                const result = await newHashtag.save();
                return result;
            } catch (e) {
                if (e.name === 'MongoError' && e.code === 11000) {
                    logger.log('info', `it is fine. There is just a duplicated hashtag ${hashtag}`);
                } else {
                    logger.log('error', `failed to save new hashtag ${e}`);
                }
            }
        });
    },

    addQuestions(questions: string[]): Array<Promise<IDbQuestionModel>> {
        return questions.map(async text => {
            const newItem = new QuestionModel({ text });
            try {
                const result = await newItem.save();
                return result;
            } catch (e) {
                if (e.name === 'MongoError' && e.code === 11000) {
                    logger.log('info', `it is fine. There is just a duplicated question ${text}`);
                } else {
                    logger.log('error', `failed to save new question ${e}`);
                }
            }
        });
    },
};
