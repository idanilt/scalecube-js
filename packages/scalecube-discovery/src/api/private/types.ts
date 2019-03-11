import { Seed } from '../public';
import { ReplaySubject } from 'rxjs';
import { Endpoint } from '@scalecube/scalecube-microservice/src/api/public';

export interface NotifyAllListeners {
  seed: Seed;
}

export interface GetSeed {
  seedAddress: string;
}

export interface AddToCluster {
  seed: Seed;
  address: string;
  endPoints: Endpoint[];
  subjectNotifier: ReplaySubject<Endpoint[]>;
}

export interface RemoveFromCluster {
  seed: Seed;
  address: string;
}
