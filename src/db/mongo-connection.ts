import * as mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import TYPES from '../constants/types';
import { logger } from '../infrastructure/logger';

@injectable()
export class MongoConnection {
    constructor(@inject(TYPES.DatabaseURI) private databaseURI: string) {}

    connect() {
        return new Promise((resolve, reject) => {
            mongoose.connection.on('open', () => {
                logger.log('info', 'test db connected');
                return resolve(true);
            });
            mongoose.connection.on('error', error => reject(new Error(error)));
            return mongoose.connect(this.databaseURI, { useNewUrlParser: true });
        });
    }
}
