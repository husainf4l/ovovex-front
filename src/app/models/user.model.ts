export interface User {
    id: string;
    email: string;
    password?: string; // Optional if you don't want to expose it in responses
    phoneNumber: string;
    userName: string;
    name: string;
    fcmToken?: string;
    profileImage: string;
    role: UserRole;
    companyId?: string;
    company?: Company;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Company {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email: string;
    website?: string;
    taxNumber: string;
    logoImage: string;
    createdAt: Date;
    updatedAt: Date;
    users?: User[];
  }
  
  export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';
  