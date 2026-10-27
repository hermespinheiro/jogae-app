import type { AuthProfile } from '../../auth/authorization';
import { requireRole } from '../../auth/authorization';

export function assertCanAdministerUsers(profile: AuthProfile) {
  requireRole(profile, 'Administrador');
}
