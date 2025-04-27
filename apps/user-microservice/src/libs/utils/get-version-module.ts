import { getVersionApiEnv } from 'shared/lib/utils/get-version-api';
import { V1Module } from '../../versions/v1/v1.module';

export function getVersionModule() {
  switch (getVersionApiEnv()) {
    default:
      return V1Module;
  }
}
