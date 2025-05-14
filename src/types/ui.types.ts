/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";

// Type for a single breadcrumb item
export interface BreadcrumbItem {
    label: string;
    href: string;
}

// Props for the PageHeader component
export interface PageHeaderProps {
    breadcrumbItems: BreadcrumbItem[];
    title: string;
    actions?: ReactNode;
}

// Props for the Breadcrumb component
export interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export interface GroupInfo {
    label: string;
    icon?: ReactNode;
    content: ReactNode;
    copyIt?: boolean;
    block?: boolean;
}

export interface Company {
    id: number;
    name: string;
    location: string;
    status: string | number;
    branches: number;
    employees: number;
    created?: string;
    image?: string;
    isVerified?: boolean;
}
export interface SingleUser {
    identityType: any;
    id: number;
    name: string;
    email: string;
    type: string;
    phone: string;
    image?: string;
    status: string;
    isVerified: boolean;
}
export interface SingleCertificate {
    id: number;
    name: string;
    issue_date: string;
    expiry_date: string;
    status: string;
    image?: string;
}

export interface Branch {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    status: string | number;
    address: string;
    latitude: string;
    longitude: string;
}

export interface Partner {
    id: number;
    name: string;
    logo?: string | null;
    website?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}


export interface User {
    id: number;
    name: string;
    role: string;
    status: string;
    permissions: string[];
    image?: string;
}
export interface Individual {
    id?: number;
    identityType: string;
    nationalId: string;
    nationalIdExpiry: string;
    nationalIdFront: string;
    nationalIdBack: string;
    nationality: string;
    birthday: string;
    status: string;
    userType: string;
    user: {
        id?: number;
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        password?: string;
        isVerified: boolean;
        jobTitle?: string;
    };
}

export interface IndividualResponse {
    id: number;
    identityType: string;
    nationalId: string;
    nationalIdExpiry: string;
    nationalIdFront: string;
    nationalIdBack: string;
    countryId: string;
    birthday: string;
    status: string;
    userType: string;
    userId: number;
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    phone: string;
    isVerified: boolean;
}
export interface Country {
    isActive: boolean;
    id: number;
    code: string;
    name: string;
    phoneCode: string;
    emoji: string;
    image?: string;
}

export interface Currency {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    exchangeRate: number;
    image?: string;
    symbol: string;
    code: string;
    isActive: boolean;
    status?: boolean;
}

export interface SingleStaff {
    id?: number;
    status: string;
    userType: string;
    image?: string;
    resume?: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        password?: string;
        isVerified: boolean;
    };
}
export interface SingleStaffUI {
    id: number;
    status: string;
    type: string;
    image?: string;
    name?: string;
    email?: string;
    phone?: string;
    isVerified: boolean;
    avatar: string;
}

export interface SingleExam {
    id: number;
    name: string;
    assigned_to: string;
    exam_date: string;
    score: string;
    status: string;
    image?: string;
}

export interface SingleCourse {
    id: number;
    title: string;
    language: string;
    prerequisites?: string;
    validity?: string;
    description?: string;
    enrollments?: number;
    maxAttendees?: number;
    requiresMedicalTest?: boolean;
    sessions: number;
    level: number;
    status: string;
    image?: string;
    cover?: string;
}


export interface SingleCompany {
    id: number;
    status: string;
    userType: string;
    image?: string;
    resume?: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        password?: string;
        isVerified: boolean;
    };
}
export interface AdminResponse {
    permissions?: string[];
    role?: string;
    id: number;
    status: string;
    image?: string;
    userType: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        isVerified: boolean;
    };
}
// export interface AdminResponse {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     status: string;
//     userType: string;
//     phone: string;
//     avatar: string;
//     isVerified: boolean;
// }
export interface Admin {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    id: number;
    name: string;
    email: string;
    status: string;
    userType: string;
    phone: string;
    avatar: string;
    isVerified: boolean;
    image?: string;
}
export interface  Role {
    id: number;
    key: string;
    name: string;
    description: string;
    features: {
      key: string;
      name: string;
      create: boolean;
      delete: boolean;
      update: boolean;
      list: boolean;
      find: boolean;
    }[];
  }