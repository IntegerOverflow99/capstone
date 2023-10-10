import { fluentProvide } from 'inversify-binding-decorators';

/**
 * Decorator allowing for singleton injection with Inversify.
 * @param identifier Inversify binding identifier.
 */
const ProvideSingleton = (identifier: any) => {
  return fluentProvide(identifier).inSingletonScope().done();
};

export default ProvideSingleton;
