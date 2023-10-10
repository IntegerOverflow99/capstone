import ProvideSingleton from '../../inversify-utils/ProvideSingleton';

/**
 * DataService is a decorator that allows for singleton injection with Inversify. It is specifically meant to be used with classes than manage data.
 * @param target Constructor function of the class to be decorated.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const DataService = () => (target: Function) => {
  ProvideSingleton(target)(target);
};

export default DataService;
