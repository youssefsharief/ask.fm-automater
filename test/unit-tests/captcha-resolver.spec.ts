import testingContainer from '../ioc_config_test';
import { CaptchaApiService } from '../../src/services/captcha-api-service';
import { CaptchaResolver } from '../../src/services/captcha-resolver';
import { injectable } from 'inversify';
import * as expect from 'expect';

@injectable()
class MockCaptchaApiService implements Partial<CaptchaApiService> {
    initiateCaptchaRequest(pageLink: string) {
        return new Promise((res, rej) => res('1212'));
    }

    requestCaptchaResults(requestId): Promise<{ status: number; request: string }> {
        return new Promise((res, rej) => res({ status: 1, request: 'ADJK_DFLK' }));
    }
}

describe('Captcha Resolver', () => {
    let captchaResolver: CaptchaResolver;
    before(() => {
        testingContainer.unbind(CaptchaApiService);
        testingContainer.bind<Partial<CaptchaApiService>>(CaptchaApiService).to(MockCaptchaApiService);
        captchaResolver = testingContainer.get<CaptchaResolver>(CaptchaResolver);
    });
    it('should return result', async () => {
        const result = await captchaResolver.resolve('yahoo.com/important-news');
        expect(result).toBe('ADJK_DFLK');
    });
});
