import { injectable } from 'inversify';
import { HashtagModel, IDbHashtagModel } from '../models/hashtag.model';

@injectable()
export class HashtagDb {
    getAll(): Promise<IDbHashtagModel[]> {
        return HashtagModel.find({})
            .lean()
            .exec();
    }
}
