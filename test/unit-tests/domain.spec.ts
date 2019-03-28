import testingContainer from '../ioc_config_test';
import * as expect from 'expect';
import { Domain } from '../../src/services/domain-service';
import { HashtagRateMap } from '../../src/interfaces/data';
import { IDbUserPureModel } from '../../src/db/models/user.model';

describe('captcha api service', () => {
    let domain: Domain;
    const question: string = 'a random question';
    before(() => {
        domain = testingContainer.get<Domain>(Domain);
    });
    describe('user satisfies all criteria', () => {
        it('user with no messages should pass', () => {
            const user: IDbUserPureModel = { userId: 'a', status: 'contacted', hashtags: ['a good hashtag'] };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(true);
        });

        it('user with messages should pass', () => {
            const user: IDbUserPureModel = {
                userId: 'a',
                status: 'contacted',
                hashtags: ['a good hashtag'],
                messages: ['irrelevant question?'],
            };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(true);
        });

        it('user with no status', () => {
            const user: IDbUserPureModel = {
                userId: 'a',
                status: undefined,
                hashtags: ['a good hashtag'],
                messages: ['irrelevant question?'],
            };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(true);
        });
    });

    describe('user activity', () => {
        it('was active from 2 months ago should pass', () => {
            // MockDate.set('02/20/2019');
            const user: IDbUserPureModel = {
                userId: 'a',
                status: 'contacted',
                hashtags: ['a good hashtag'],
                latestActivityTime: new Date('2019-01-01T14:33:13'),
            };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(true);
            // MockDate.reset();
        });

        it('was active from 5 months ago should not pass', () => {
            // MockDate.set('02/20/2019');
            const user: IDbUserPureModel = {
                userId: 'a',
                status: 'contacted',
                hashtags: ['a good hashtag'],
                latestActivityTime: new Date('2018-11-01T14:33:13'),
            };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(false);
            // MockDate.reset();
        });

        it('should return false', () => {
            const user: IDbUserPureModel = { userId: 'a', status: 'inactive', hashtags: ['a good hashtag'] };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(false);
        });
    });

    describe('user has been contacted with question before', () => {
        it('should return false', () => {
            const user: IDbUserPureModel = {
                userId: 'a',
                status: 'contacted',
                hashtags: ['a good hashtag'],
                messages: ['a random question'],
            };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(false);
        });
    });

    describe('user is excluded', () => {
        it('should return false', () => {
            const user: IDbUserPureModel = { userId: 'a', status: 'excluded', hashtags: ['a good hashtag'] };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(false);
        });
    });

    describe('user is male', () => {
        it('should return false', () => {
            const user: IDbUserPureModel = { userId: 'a', status: 'male', hashtags: ['a good hashtag'] };
            const hashtagRateMap: HashtagRateMap = { 'a good hashtag': 7 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(false);
        });
    });

    describe('user has bad hashtag', () => {
        it('should return false', () => {
            const user: IDbUserPureModel = { userId: 'a', status: 'male', hashtags: ['a bad hashtag'] };
            const hashtagRateMap: HashtagRateMap = { 'a bad hashtag': 3 };
            expect(domain.userSatisfiesCriteria(user, hashtagRateMap, question)).toBe(false);
        });
    });
});
