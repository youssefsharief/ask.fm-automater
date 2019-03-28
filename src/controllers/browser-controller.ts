import { links } from '../pages/links';
import * as puppeteer from 'puppeteer-core';
import { inject, injectable } from 'inversify';
import { profilePage } from '../pages/profile-page.po';
import { CaptchaResolver } from '../services/captcha-resolver';
import { config } from '../config/config';
import { logger } from '../infrastructure/logger';

@injectable()
export class BrowserController {
    page: puppeteer.Page;
    question: string;
    constructor(@inject(CaptchaResolver) private captchaResolver: CaptchaResolver) {}

    async launch(): Promise<boolean> {
        const uBlockExtensionPath = config.chrome.uBlockExtensionPath;
        return puppeteer
            .launch({
                headless: false,
                defaultViewport: null,
                executablePath: config.chrome.executablePath,
                userDataDir: config.chrome.userDataDir,
                args: [`--disable-extensions-except=${uBlockExtensionPath}`, `--load-extension=${uBlockExtensionPath}`],
            })
            .then(async browser => {
                this.page = await browser.newPage();
                return true;
            });
    }

    async goToUserProfilePageAndSendQuestion(userId: string, question: string): Promise<boolean> {
        this.question = question;
        try {
            logger.log('info', userId);
            await this.page.goto(links.getProfilePage(userId), {
                waitUntil: 'networkidle2',
            });
            const isSent = await this.sendQuestion(userId);
            if (isSent) {
                // await this.page.waitFor(3000);
                return true;
            } else {
                logger.log('info', `failed to send to ${userId}`);
                // await this.page.waitFor(5 * 60 * 1000);
                return false;
            }
        } catch (e) {
            logger.log('info', e);
            return false;
        }
    }

    private async clickOnButtonAndCheckIfSent(): Promise<boolean> {
        try {
            logger.log('info', 'clicking');
            await this.page.click(profilePage.BUTTON_IN_BIG_PAGE);
            await this.page.waitForSelector(profilePage.SUCCESS_ALERT, {
                visible: true,
                timeout: 4000,
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    private async sendQuestion(userId: string): Promise<boolean> {
        const inputValue = await this.page.$eval(profilePage.QUESTION_INPUT_FIELD, el => el.innerHTML);
        for (const _ of inputValue) {
            await this.page.keyboard.down('Backspace');
        }
        await this.page.type(profilePage.QUESTION_INPUT_FIELD, this.question);
        const sent = await this.clickOnButtonAndCheckIfSent();
        if (sent) {
            return true;
        } else {
            try {
                const response = await this.captchaResolver.resolve(links.getProfilePage(userId));
                await this.page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`);
                return await this.clickOnButtonAndCheckIfSent();
            } catch (e) {
                logger.log('info', 'Failed to solve captcha');
                return false;
            }
        }
    }
}
