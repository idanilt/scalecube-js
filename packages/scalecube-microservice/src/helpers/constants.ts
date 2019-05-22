import { AsyncModel, Message, RequestResponseAsyncModel, RequestStreamAsyncModel } from '../api';

export const MICROSERVICE_NOT_EXISTS = 'microservice does not exists';
export const MESSAGE_NOT_PROVIDED = 'Message has not been provided';
export const SERVICE_DEFINITION_NOT_PROVIDED = '(serviceDefinition) is not defined';
export const SERVICE_REFERENCE_NOT_PROVIDED = '(service reference) is not defined';
export const SERVICE_NAME_NOT_PROVIDED = '(serviceDefinition.serviceName) is not defined';
export const ASYNC_MODEL_NOT_PROVIDED = 'Async Model is not defined';
export const WRONG_DATA_FORMAT_IN_MESSAGE = 'Message format error: data must be Array';
export const DEFINITION_MISSING_METHODS = 'Definition missing methods:object';
export const SERVICES_IS_NOT_ARRAY = 'services is not array';
export const SERVICE_IS_NOT_OBJECT = 'service is not object';
export const INVALID_METHODS = 'service definition methods should be non empty object';
export const INVALID_ASYNC_MODEL = 'Async model value is not correct';
export const MICROSERVICE_OPTIONS_IS_NOT_OBJECT = 'microservice options is not object';
export const QUALIFIER_IS_NOT_STRING = 'qualifier not of type string';
export const SEED_ADDRESS_IS_NOT_STRING = 'seed address should be non empty string';
export const INVALID_SERVICE_REFERENCE = 'Service reference expected to be non empty object';

export const getServiceMethodIsMissingError = (methodName: string) =>
  `service method '${methodName}' missing in the serviceDefinition`;
export const getNotFoundByRouterError = (qualifier: string) =>
  `can't find services with the request: '${JSON.stringify(qualifier)}'`;
export const getAsyncModelMissmatch = (expectedAsyncModel: AsyncModel, receivedAsyncModel: AsyncModel) =>
  `asyncModel miss match, expect ${expectedAsyncModel}, but received ${receivedAsyncModel}`;
export const getMethodNotFoundError = (message: Message) => `Can't find method ${message.qualifier}`;
export const getInvalidMethodReferenceError = (qualifier: string) =>
  `${qualifier} has valid definition but reference is not a function.`;

export const getMethodsAreNotDefinedProperly = (serviceName: string, methods: string[]) =>
  `All of the following methods in ${serviceName} are not defined properly: ${methods.concat(', ')}`;
export const getServiceNameInvalid = (serviceName: any) =>
  `serviceName is not valid, must be type string but received type ${typeof serviceName}`;
export const ASYNC_MODEL_TYPES: {
  REQUEST_STREAM: RequestStreamAsyncModel;
  REQUEST_RESPONSE: RequestResponseAsyncModel;
} = {
  REQUEST_RESPONSE: 'requestResponse',
  REQUEST_STREAM: 'requestStream',
};

export const RSocketConnectionStatus = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  CLOSED: 'CLOSED',
  ERROR: 'ERROR',
};
