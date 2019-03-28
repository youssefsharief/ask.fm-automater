import { inject, injectable } from 'inversify';
import * as request from 'request-promise-native';
import TYPES from '../constants/types';
import { config } from '../config/config';
import { logger } from '../infrastructure/logger';

@injectable()
export class CaptchaApiService {
    constructor(@inject(TYPES.captchaResolverApiKey) private apiKey: string, @inject(TYPES.GOOGLE_CAPTCHA_KEY) private googlekey: string) {}

    async initiateCaptchaRequest(pageurl: string) {
        logger.log('info', `apiKey ${this.apiKey}`);
        logger.log('info', `this.googlekey ${this.googlekey}`);
        const formData = {
            method: 'userrecaptcha',
            googlekey: this.googlekey,
            key: this.apiKey,
            pageurl,
            json: 1,
        };
        const response = await request.post(`${config.captchaResolver.url}/in.php`, {
            form: formData,
        });
        return JSON.parse(response).request;
    }

    requestCaptchaResults(requestId: string): Promise<{ status: number; request: string }> {
        const url = `${config.captchaResolver.url}/res.php?key=${this.apiKey}&action=get&id=${requestId}&json=1`;
        return new Promise(async (resolve, reject) => {
            const rawResponse = await request.get(url);
            const resp = JSON.parse(rawResponse);
            logger.log('info', `response from 2captcha about solving the issue ${resp}`);
            return resolve(resp);
        });
    }
}
