import testingContainer from '../ioc_config_test';
import { testingDbOperations } from '../testing-operations/db-test';
import { UserDb } from '../../src/db/data-layer/user-db';
import { IDbUserModel, IDbUserPureModel } from '../../src/db/models/user.model';
import TYPES from '../../src/constants/types';
import { MongoConnection } from '../../src/db/mongo-connection';
import { MainController } from '../../src/controllers/main-controller';
import * as expect from 'expect';
import { HashtagDb } from '../../src/db/data-layer/hashtag-db';
import { IDbPureHashtagModel, IDbHashtagModel } from '../../src/db/models/hashtag.model';
import { BrowserController } from '../../src/controllers/browser-controller';
import { injectable } from 'inversify';

@injectable()
class MockBrowserController implements Partial<BrowserController> {
    launch() {
        return Promise.resolve(true);
    }

    goToUserProfilePageAndSendQuestion() {
        return Promise.resolve(true);
    }
}

describe('e2e', () => {
    let mongoConnection: MongoConnection;
    let userDb: UserDb;
    let hashtagDb: HashtagDb;
    let mainController: MainController;

    before(async () => {
        testingContainer.snapshot();
        testingContainer.rebind<Partial<BrowserController>>(BrowserController).to(MockBrowserController);

        userDb = testingContainer.get(UserDb);
        hashtagDb = testingContainer.get(HashtagDb);
        mongoConnection = testingContainer.get(MongoConnection);
        mainController = testingContainer.get(MainController);

        await mongoConnection.connect();
        await Promise.all([
            testingDbOperations.removeAllUsers(),
            testingDbOperations.removeAllHashtags(),
            testingDbOperations.removeAllQuestions(),
        ]);

        mainController = testingContainer.get(MainController);
        const promises = [
            testingDbOperations.adddUser({ userId: 'sarah_id', status: 'contacted', hashtags: ['a good one'] }),
            testingDbOperations.adddUser({ userId: 'mohamedqassim4', latestActivityTime: new Date('2019-01-01T14:33:13'), status: 'male' }),
            testingDbOperations.adddUser({
                userId: 'noha_id',
                latestActivityTime: new Date('2019-01-01T14:33:13'),
                status: 'contacted',
                hashtags: ['a bad one', 'a good one'],
            }),
            testingDbOperations.adddUser({
                userId: 'so3ad_id',
                latestActivityTime: new Date('2019-01-01T14:33:13'),
                status: 'contacted',
                hashtags: ['a good one'],
            }),
            testingDbOperations.adddUser({
                userId: 'long_time_id',
                latestActivityTime: new Date('2014-01-01T14:33:13'),
                status: 'contacted',
                hashtags: ['a good one'],
            }),
            testingDbOperations.addHashtags([{ text: 'a good one', rate: 7 }, { text: 'a bad one', rate: 2 }]),
            testingDbOperations.addQuestions(['random 1', 'random 2']),
        ];
        await Promise.all<any>(promises);
    });

    describe('fetching for users', () => {
        let result: IDbUserPureModel[];
        before(async () => {
            result = await userDb.getAllUsers();
        });
        it('users added should be there', () => {
            expect(result.length).toBe(5);
        });

        it('all props should be represented', () => {
            expect(result[0].hashtags).toEqual(['a good one']);
            expect(result[1].latestActivityTime.toISOString()).toBe('2019-01-01T12:33:13.000Z');
        });
    });

    describe('fetching for hashtags', () => {
        let result: IDbHashtagModel[];
        before(async () => {
            result = await hashtagDb.getAll();
        });
        it('hashtags added should be there', () => {
            expect(result.length).toBe(2);
        });

        it('all props should be represented', () => {
            expect(result[0].text).toBe('a good one');
            expect(result[1].rate).toBe(2);
        });
    });

    describe('action', () => {
        it('only sara and so3ad should be contacted', async () => {
            await mainController.start();
            const result = await userDb.getAllUsers();
            expect(result[0].messages.length).toBe(2);
            expect(result[1].messages.length).toBe(0);
            expect(result[2].messages.length).toBe(0);
            expect(result[3].messages.length).toBe(2);
            expect(result[4].messages.length).toBe(0);
        });
    });
    after(async () => {
        testingContainer.restore();
        await testingDbOperations.disconnectDb();
    });
});
