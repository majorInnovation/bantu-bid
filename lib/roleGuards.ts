import { User } from './types'

export type UserRole = 'admin' | 'supplier'

export interface RoleGuard {
  canCreateTender: boolean
  canApplyTender: boolean
  canManageSuppliers: boolean
  canViewAnalytics: boolean
  canCreateConsortium: boolean
  canJoinConsortium: boolean
}

export function getRoleGuard(role: UserRole): RoleGuard {
  switch (role) {
    case 'admin':
      return {
        canCreateTender: true,
        canApplyTender: false,
        canManageSuppliers: true,
        canViewAnalytics: true,
        canCreateConsortium: false,
        canJoinConsortium: false,
      }
    case 'supplier':
      return {
        canCreateTender: false,
        canApplyTender: true,
        canManageSuppliers: false,
        canViewAnalytics: false,
        canCreateConsortium: true,
        canJoinConsortium: true,
      }
    default:
      return {
        canCreateTender: false,
        canApplyTender: false,
        canManageSuppliers: false,
        canViewAnalytics: false,
        canCreateConsortium: false,
        canJoinConsortium: false,
      }
  }
}

export function isAdmin(role?: UserRole): boolean {
  return role === 'admin'
}

export function isSupplier(role?: UserRole): boolean {
  return role === 'supplier'
}

export function canAccessPage(role: UserRole, requiredRole: UserRole): boolean {
  return role === requiredRole
}
