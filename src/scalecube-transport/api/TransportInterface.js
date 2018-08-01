// @flow
import { TransportRequest, ProviderConfig } from './types';
import { Observable } from 'rxjs';

export interface TransportInterface {
  setProvider(provider: ProviderInterface, config: ProviderConfig): Promise<void>;
  request(transportRequest: TransportRequest): Observable<any>;
}