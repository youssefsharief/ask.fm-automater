import testingContainer from '../ioc_config_test';
import { CaptchaApiService } from '../../src/services/captcha-api-service';
import { config } from '../../src/config/config';
import * as expect from 'expect';

xdescribe('captcha api service', () => {
    let captchaApiService: CaptchaApiService;
    before(() => {
        captchaApiService = testingContainer.get<CaptchaApiService>(CaptchaApiService);
    });
    describe('initiateCaptchaRequest', () => {
        it('should return a number', async () => {
            const result = await captchaApiService.initiateCaptchaRequest(`${config.action.mainWebPage}/Nohawmylife`);
            expect(parseInt(result, 10)).toBeTruthy();
        });
    });

    describe('requestCaptchaResult', () => {
        it('should return payload', async () => {
            const result = await captchaApiService.requestCaptchaResults('61071198862');
            expect(result.request).toBeTruthy();
        });
    });
});
