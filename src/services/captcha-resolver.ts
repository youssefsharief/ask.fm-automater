import { inject, injectable } from 'inversify';
import { CaptchaApiService } from './captcha-api-service';
import { pollFn } from './poll';
import { logger } from '../infrastructure/logger';

@injectable()
export class CaptchaResolver {
    constructor(@inject(CaptchaApiService) private captchaApiService: CaptchaApiService) {}

    async resolve(pageLink: string): Promise<string> {
        logger.log('info', 'trying to get request id to solve captcha');
        const requestId = await this.captchaApiService.initiateCaptchaRequest(pageLink);
        logger.log('info', `REQUEST_ID ${requestId}`);
        const fn = () => this.captchaApiService.requestCaptchaResults(requestId);
        try {
            const response = await pollFn<{ status: number; request: string }>(
                fn,
                1500,
                600000,
// tslint:disable-next-line: triple-equals
                obj => obj.status == 1,
                obj => obj.request === 'ERROR_CAPTCHA_UNSOLVABLE',
            );
            return response.request;
        } catch (e) {
            logger.log('info', 'Failed to solve captcha');
            throw e;
        }
    }
}
