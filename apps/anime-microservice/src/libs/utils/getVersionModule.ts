import { getVersionApiEnv } from 'shared/lib/utils/getVersionApi';
import { V1Module } from '../../versions/v1/v1.module';

export function getVersionModule() {
  switch (getVersionApiEnv()) {
    default:
      return V1Module;
  }
}
