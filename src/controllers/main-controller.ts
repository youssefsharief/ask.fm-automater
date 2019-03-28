import { inject, injectable } from 'inversify';
import { MongoConnection } from '../db/mongo-connection';
import { BrowserController } from './browser-controller';
import { HashtagDb } from '../db/data-layer/hashtag-db';
import { UserDb } from '../db/data-layer/user-db';
import { IDbUserModel, IDbUserPureModel } from '../db/models/user.model';
import { HashtagRateMap } from '../interfaces/data';
import { Domain } from '../services/domain-service';
import { logger } from '../infrastructure/logger';
import { QuestionDb } from '../db/data-layer/question-db';
import TYPES from '../constants/types';

@injectable()
export class MainController {
    constructor(
        @inject(BrowserController) private browserController: BrowserController,
        @inject(MongoConnection) private mongoConnection: MongoConnection,
        @inject(HashtagDb) private hashtagDb: HashtagDb,
        @inject(UserDb) private userDb: UserDb,
        @inject(Domain) private domain: Domain,
        @inject(QuestionDb) private questionDb: QuestionDb,
        @inject(TYPES.maximumTimesASingleQuestionShouldBeAsked) private maximumTimesASingleQuestionShouldBeAsked: number,
    ) { }

    private async dataPromises(): Promise<{ users: IDbUserPureModel[]; hashtagRateMap: HashtagRateMap; questions: string[] }> {
        await this.mongoConnection.connect();
        logger.log('info', 'waiting for data from db');
        const [hashtags, users, questions] = await Promise.all([
            this.hashtagDb.getAll(),
            this.userDb.getAllUsers(),
            this.questionDb.getAll(),
        ]);
        logger.log('info', 'data arrived from db');
        const hashtagRateMap: HashtagRateMap = hashtags.reduce((obj, item) => {
            obj[item.text] = item.rate;
            return obj;
        }, {});
        return { users, hashtagRateMap, questions: questions.map(item => item.text) };
    }

    async start(): Promise<void> {
        const [{ users, hashtagRateMap, questions }, hasBrowserLaunched] = await Promise.all([
            this.dataPromises(),
            this.browserController.launch(),
        ]);
        if (hasBrowserLaunched) {
            for (const question of questions) {
                let timesQuestionAsked = 0;
                for (let userIndex = 0; userIndex < users.length &&
                    timesQuestionAsked <= this.maximumTimesASingleQuestionShouldBeAsked; userIndex++) {
                    const user = users[userIndex]
                    logger.log('info', `user ${user.userId}   ${user}`);
                    if (this.domain.userSatisfiesCriteria(user, hashtagRateMap, question)) {
                        if (await this.browserController.goToUserProfilePageAndSendQuestion(user.userId, question)) {
                            timesQuestionAsked++;
                            await this.userDb.associateMessageWithUser(user.userId, question);
                        } else {
                            logger.log('info', `browser was not able to send question for user ${user.userId}`);
                        }
                    } else {
                        logger.log('info', `user ${user.userId}  did not satisfy criteria`);
                    }
                }
            }
        }
    }
}
