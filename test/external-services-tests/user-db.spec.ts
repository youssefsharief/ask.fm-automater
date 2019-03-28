import testingContainer from '../ioc_config_test';
import { UserDb } from '../../src/db/data-layer/user-db';
import { IDbUserModel, IDbUserPureModel } from '../../src/db/models/user.model';
import { testingDbOperations } from '../testing-operations/db-test';
import * as expect from 'expect';
import { MongoConnection } from '../../src/db/mongo-connection';

xdescribe('user db', () => {
    let userDb: UserDb;
    before(async () => {
        const mongoConnection = testingContainer.get<MongoConnection>(MongoConnection);
        await mongoConnection.connect();
        await testingDbOperations.removeAllUsers();
        userDb = testingContainer.get<UserDb>(UserDb);
    });

    after(async () => {
        await testingDbOperations.disconnectDb();
    });

    describe('adding a user with a message', async () => {
        let result: IDbUserModel;
        before(async () => {
            result = await userDb.associateMessageWithUser('new_id_that_i_sent_message_to', 'this is an important message');
        });
        it('should be able to add new user', () => {
            expect(result.userId).toBe('new_id_that_i_sent_message_to');
            expect(result.status).toBe('contacted');
            expect(result.messages[0]).toBe('this is an important message');
        });

        describe('getting all users', () => {
            let result2: IDbUserPureModel[];
            before(async () => {
                result2 = await userDb.getAllUsers();
            });

            it('should return an array of users', () => {
                expect(result2[0].userId).toBe('new_id_that_i_sent_message_to');
                expect(result2[0].status).toBe('contacted');
                expect(result2[0].messages[0]).toEqual('this is an important message');
            });
        });
    });
});
