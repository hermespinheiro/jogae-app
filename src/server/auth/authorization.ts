export type Role = 'Administrador' | 'Editor' | 'Leitor';
export type ProfileStatus = 'active' | 'invited' | 'disabled';

export type AuthProfile = {
  id: string;
  role: Role;
  status: ProfileStatus;
  mustChangePassword: boolean;
};

export function requireActive(profile: AuthProfile): void {
  if (profile.status !== 'active') throw new Error('Unauthorized');
}

export function requireRole(profile: AuthProfile, ...roles: Role[]): void {
  requireActive(profile);
  if (!roles.includes(profile.role)) throw new Error('Forbidden');
}

export function requiresPasswordChange(profile: AuthProfile): boolean {
  return profile.mustChangePassword;
}

export function assertCanAccess(profile: AuthProfile): void {
  requireActive(profile);
}
