import { injectable } from 'inversify';
import { HashtagRateMap } from '../interfaces/data';
import { IDbUserPureModel } from '../db/models/user.model';
import { logger } from '../infrastructure/logger';

@injectable()
export class Domain {
    user: IDbUserPureModel;
    hashtagRateMap: HashtagRateMap;
    question: string;
    isProbablyDumb(): boolean {
        if (!this.user.hashtags) {
            return false;
        } else {
            for (const hashtag of this.user.hashtags) {
                if (this.hashtagRateMap[hashtag] <= 3) {
                    return true;
                }
            }
            return false;
        }
    }

    isSavedAsMale(): boolean {
        return this.user.status === 'male';
    }

    isExcluded(): boolean {
        return this.user.status === 'excluded' ? true : false;
    }

    isInActive(): boolean {
        return this.user.status === 'inactive' ? true : false;
    }

    hasOldLatestActivityDate() {
        if (this.user.latestActivityTime) {
            const diff = new Date().getTime() - this.user.latestActivityTime.getTime();
            return diff / 1000 / 60 / 60 / 24 / 365 > 0.25;
        } else {
            return false;
        }
    }

    hasUserBeenContacted(): boolean {
        return !this.user.messages ? false : this.user.messages.length ? true : false;
    }

    hasReachedTheDbFromAnOldAlgorithm(): boolean {
        return this.user.hashtags ? false : true;
    }

    hasMessageSentToUserBefore(): boolean {
        const wasSent = !this.hasUserBeenContacted() ? false : this.user.messages.find(message => message === this.question) ? true : false;
        if (wasSent) {
            logger.log('info', `message has been sent to user ${this.user.userId} before`);
        }
        return wasSent;
    }

    userSatisfiesCriteria(user: IDbUserPureModel, hashtagRateMap: HashtagRateMap, question: string): boolean {
        this.user = user;
        this.hashtagRateMap = hashtagRateMap;
        this.question = question;
        return (
            !this.isExcluded() &&
            !this.isInActive() &&
            !this.isSavedAsMale() &&
            !this.hasOldLatestActivityDate() &&
            !this.hasMessageSentToUserBefore() &&
            !this.hasReachedTheDbFromAnOldAlgorithm() &&
            !this.isProbablyDumb()
        );
    }
}
