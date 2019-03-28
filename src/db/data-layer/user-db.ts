import { UserModel, IDbUserModel, IDbUserPureModel } from '../models/user.model';
import { injectable } from 'inversify';

@injectable()
export class UserDb {
    getAllUsers(): Promise<IDbUserPureModel[]> {
        return UserModel.find({})
            .lean()
            .exec();
    }

    associateMessageWithUser(userId, message): Promise<IDbUserModel> {
        return UserModel.findOneAndUpdate(
            { userId },
            { $push: { messages: message }, status: 'contacted' },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        ).exec();
    }
}
