export declare enum UserRole {
    SUPERADMIN = "superadmin",
    ADMIN = "admin",
    OPERARIO = "operario",
    HIDRAULICO = "hidraulico"
}
export declare class User {
    id: number;
    username: string;
    password?: string;
    role: UserRole;
    isActive: boolean;
    createdBy: number;
    updatedBy: number;
    deletedBy: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
