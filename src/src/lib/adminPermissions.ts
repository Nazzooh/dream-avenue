export const adminRoles = ['developer', 'owner', 'manager', 'coordinator'] as const;

export type AdminRole = (typeof adminRoles)[number];
export type AdminPermission =
  | 'operations'
  | 'content'
  | 'partners'
  | 'referrals'
  | 'tasks'
  | 'analytics'
  | 'audit'
  | 'access'
  | 'publish'
  | 'destructive';

const managerPermissions: AdminPermission[] = ['operations', 'content', 'partners', 'referrals', 'tasks', 'analytics'];
const coordinatorPermissions: AdminPermission[] = ['operations', 'partners', 'referrals', 'tasks'];

export function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === 'string' && (adminRoles as readonly string[]).includes(role);
}

export function can(role: unknown, permission: AdminPermission): boolean {
  if (role === 'developer' || role === 'owner') return true;
  if (role === 'manager') return managerPermissions.includes(permission);
  if (role === 'coordinator') return coordinatorPermissions.includes(permission);
  return false;
}

export function roleLabel(role: unknown): string {
  const labels: Record<string, string> = {
    developer: 'Developer',
    owner: 'Owner / CEO',
    manager: 'Manager',
    coordinator: 'Coordinator',
  };
  return labels[String(role)] || 'Team member';
}
