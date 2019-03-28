import container from './config/ioc_config';
import { MainController } from './controllers/main-controller';
process.on('unhandledRejection', up => {
    throw up;
});

const controller = container.get(MainController);

(async function main() {
    await controller.start();
})();
