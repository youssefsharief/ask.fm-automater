export const config = {
    captchaResolver: {
        apiKey: process.env.captchaApiKey,
        url: process.env.captchaResolverUrl,
    },
    chrome: {
        executablePath: process.env.executablePath,
        userDataDir: process.env.userDataDir,
        uBlockExtensionPath: process.env.uBlockExtensionPath,
    },
    action: {
        mainWebPage: process.env.mainWebPage,
        question: process.env.question,
    },
    google: {
        captchaSiteKey: process.env.googleCaptchaSiteKey,
    },
    database: {
        productionDatabaseURI: process.env.mongodbURI,
    },
};
