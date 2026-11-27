import { describe, expect, it } from 'vitest';
import { can, canManageGallery, isAdminRole, roleLabel } from '../adminPermissions';

describe('adminPermissions', () => {
  it('validates admin roles strictly', () => {
    expect(isAdminRole('developer')).toBe(true);
    expect(isAdminRole('owner')).toBe(true);
    expect(isAdminRole('manager')).toBe(true);
    expect(isAdminRole('coordinator')).toBe(true);
    expect(isAdminRole('guest')).toBe(false);
    expect(isAdminRole('')).toBe(false);
    expect(isAdminRole(null)).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });

  it('grants full permissions to developer and owner', () => {
    for (const role of ['developer', 'owner'] as const) {
      expect(can(role, 'operations')).toBe(true);
      expect(can(role, 'publish')).toBe(true);
      expect(can(role, 'destructive')).toBe(true);
      expect(can(role, 'audit')).toBe(true);
      expect(can(role, 'access')).toBe(true);
    }
  });

  it('restricts manager from leadership-only permissions', () => {
    expect(can('manager', 'operations')).toBe(true);
    expect(can('manager', 'content')).toBe(true);
    expect(can('manager', 'analytics')).toBe(true);
    expect(can('manager', 'publish')).toBe(false);
    expect(can('manager', 'destructive')).toBe(false);
    expect(can('manager', 'audit')).toBe(false);
    expect(can('manager', 'access')).toBe(false);
  });

  it('restricts coordinator to assigned operations', () => {
    expect(can('coordinator', 'operations')).toBe(true);
    expect(can('coordinator', 'partners')).toBe(true);
    expect(can('coordinator', 'tasks')).toBe(true);
    expect(can('coordinator', 'content')).toBe(false);
    expect(can('coordinator', 'analytics')).toBe(false);
    expect(can('coordinator', 'finance')).toBe(false);
  });

  it('denies all permissions for unknown roles', () => {
    expect(can('user', 'operations')).toBe(false);
    expect(can(undefined, 'operations')).toBe(false);
  });

  it('checks gallery management and role labels', () => {
    expect(canManageGallery('manager')).toBe(true);
    expect(canManageGallery('coordinator')).toBe(false);
    expect(roleLabel('owner')).toBe('Owner / CEO');
    expect(roleLabel('unknown')).toBe('Team member');
  });
});
