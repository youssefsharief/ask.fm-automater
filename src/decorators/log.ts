import { logger } from '../infrastructure/logger';

export function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // keep a reference to the original function
    const originalValue = descriptor.value;

    // Replace the original function with a wrapper
    descriptor.value = function(...args: any[]) {
        logger.log('info', `=> ${propertyKey}(${args.join(', ')})`);

        // Call the original function
        const result = originalValue.apply(this, args);

        logger.log('info', `<= ${result}`);
        return result;
    };
}
