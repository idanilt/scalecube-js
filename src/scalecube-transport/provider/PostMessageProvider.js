// @flow
import { Observable, Subject } from 'rxjs';
import { validateRequest, validateBuildConfig } from '../utils';
import { ProviderInterface } from '../api/ProviderInterface';
import { ProviderConfig, TransportRequest } from '../api/types';
import { errors } from '../errors';

export class PostMessageProvider implements ProviderInterface {
  _worker: any;
  _activeRequests: any;

  constructor() {
    this._worker = null;
    this._activeRequests = {};
    this._handleNewMessage = this._handleNewMessage.bind(this);
    return this;
  }

  build(config: ProviderConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const { URI } = config;
      const validationError = validateBuildConfig({ URI });
      if (validationError) {
        return reject(new Error(validationError));
      }
      this._worker = window.workers[URI];
      if (typeof (this._worker || {}).postMessage !== 'function') {
        return reject(new Error(errors.urlNotFound))
      }
      this._worker.addEventListener('message', this._handleNewMessage);
      resolve();
    });
  }

  request(requestData: TransportRequest): Observable<any> {
    return Observable.create((subscriber) => {
      const requestId = Object.keys(this._activeRequests).length + 1 + Date.now();
      const validationError = validateRequest(requestData, { type: true });
      if (validationError) {
        subscriber.error(new Error(validationError));
      } else {
        const { headers, data, entrypoint } = requestData;
        const { responsesLimit } = headers || {};
        this._activeRequests[requestId] = { subscriber: new Subject(), responsesCount: 0, responsesLimit };
        this._worker.postMessage({ entrypoint, data, requestId });
        this._activeRequests[requestId].subscriber.subscribe(
          (data) => {
            this._activeRequests[requestId].responsesCount++;
            if (!this._activeRequests[requestId].responsesLimit ||
              this._activeRequests[requestId].responsesCount <= this._activeRequests[requestId].responsesLimit) {
              subscriber.next(data);
            } else {
              subscriber.complete();
              delete this._activeRequests[requestId];
            }
          },
          error => subscriber.error(error),
          () => subscriber.complete()
        );
      }

      return () => { delete this._activeRequests[requestId]; }
    });
  }

  _handleNewMessage({ data }) {
    const { subscriber } = this._activeRequests[data.requestId] || {};
    if (!subscriber) {
      return;
    }
    if (!data.completed) {
      subscriber.next(data.data);
    } else {
      delete this._activeRequests[data.requestId];
      subscriber.complete();
    }
  }

  destroy(): Promise<void> {
    return new Promise((resolve) => {
      Object.values(this._activeRequests)
        .forEach(({ subscriber }) => subscriber.error(new Error(errors.closedConnection)));
      this._activeRequests = {};
      this._worker = null;
      resolve();
    });
  }

}


