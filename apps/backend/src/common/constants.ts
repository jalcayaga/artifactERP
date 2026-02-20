export enum UserRole {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER',
    USER = 'USER'
}

export const ERP_ACCESS_ROLES = [
    UserRole.SUPERADMIN,
    UserRole.ADMIN,
    UserRole.EDITOR,
    UserRole.VIEWER
];

export const ADMIN_ONLY = [UserRole.SUPERADMIN, UserRole.ADMIN];
