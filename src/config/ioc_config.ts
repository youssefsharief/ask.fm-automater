import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';

import { Container } from 'inversify';
import { concrete, commonConfigurableValues, productionValues } from './ioc-container-modules';

const container = new Container({ autoBindInjectable: true });

container.load(concrete, commonConfigurableValues, productionValues);

export default container;
