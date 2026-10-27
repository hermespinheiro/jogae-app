import { readMasterConfig } from '../infrastructure/authentication/master-config';
import { bootstrapMaster, type MasterBootstrapPort } from '../application/authentication/master-bootstrap';

export async function runMasterBootstrap(port: MasterBootstrapPort) {
  return bootstrapMaster(port, readMasterConfig());
}
