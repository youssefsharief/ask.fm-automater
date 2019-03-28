import { ContainerModule } from 'inversify';
import { CaptchaApiService } from '../services/captcha-api-service';
import { BrowserController } from '../controllers/browser-controller';
import { CaptchaResolver } from '../services/captcha-resolver';
import TYPES from '../constants/types';
import { config } from './config';
import { UserDb } from '../db/data-layer/user-db';
import { HashtagDb } from '../db/data-layer/hashtag-db';
import { Domain } from '../services/domain-service';
import { MainController } from '../controllers/main-controller';
import { QuestionDb } from '../db/data-layer/question-db';

export const concrete = new ContainerModule(bind => {
    bind<MainController>(MainController).toSelf();
    bind<CaptchaResolver>(CaptchaResolver).toSelf();
    bind<CaptchaApiService>(CaptchaApiService).toSelf();
    bind<BrowserController>(BrowserController).toSelf();
    bind<UserDb>(UserDb).to(UserDb);
    bind<HashtagDb>(HashtagDb).toSelf();
    bind<QuestionDb>(QuestionDb).to(QuestionDb);
    bind<Domain>(Domain).toSelf();
    bind(TYPES.maximumTimesASingleQuestionShouldBeAsked).toConstantValue(100);
});

export const commonConfigurableValues = new ContainerModule(bind => {
    bind(TYPES.captchaResolverApiKey).toConstantValue(config.captchaResolver.apiKey);
    bind(TYPES.GOOGLE_CAPTCHA_KEY).toConstantValue(config.google.captchaSiteKey);
});

export const productionValues = new ContainerModule(bind => {
    bind(TYPES.DatabaseURI).toConstantValue(config.database.productionDatabaseURI);
});
