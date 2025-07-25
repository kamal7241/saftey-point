/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Facility, Language, Level } from "./lookup.types";
import { AdminVmStatus } from "@/enum/admin-status.enum";

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
    companyId?: string | number;
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
        companyId?: string | number;
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
    companyId?: string;
    companyName?: string;
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

export interface CourseType {
    id: number;
    code: string;
    nameEnglish: string;
    nameArabic: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    image?: string;
}

export interface CancellationFee {
    id: number;
    name: string;
    description: string;
    type: 'FULL_REFUND' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NO_REFUND';
    percentage: string | null;
    fixedAmount: number | null;
    hoursBeforeStart: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    image?: string;
}

export interface SingleStaff {
    id?: number;
    status: string;
    userType: string;
    image?: string;
    resume?: string;
    roleId?: number;
    role?: {
        id: number;
        name: string;
        description: string;
        permissions: string[];
        isActive: boolean;
    };
    user: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        password?: string;
        isVerified: boolean;
        roleId: number | string;
        individual?: any;
        staff?: any;
        company?: any;
        admin?: any;
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
    roleName?: string;
    roleDescription?: string;
    roleId?: number;
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
    language: Language | null;
    languageId: number | null;
    level: Level | null;
    levelId: number | null;
    facility: Facility | null;
    facilityId: number | null;
    courseType: CourseType | null;
    courseTypeId: number | null;
    prerequisites: Level | null;
    validity: string;
    description: string;
    cover: string;
    maxAttendees: number;
    requiresMedicalTest: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    image?: string;
    enrollments?: string;
    sessions?: string;
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
    id: number;
    status: string;
    userType: string;
    image?: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        isVerified: boolean;
        individual: any;
        staff: any;
        company: any;
        admin: any;
    };
    roles: {
        id: number;
        key: string;
        name: string;
        description: string;
    }[];
    rolePermissions: {
        id: number;
        key: string;
        name: string;
        action: string;
        isAllowed: boolean;
    }[];
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
    id: number;
    name: string;
    email: string;
    status: AdminVmStatus;
    userType: string;
    type: string;
    phone: string;
    image: string;
    isVerified: boolean;
    user: {
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        address?: string;
        password?: string;
        isVerified: boolean;
        roleId?: string;
    };
    role?: string;
    roles?: {
        id: number;
        key: string;
        name: string;
        description: string;
    }[];
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

export interface CourseFormValues {
  courseTitle: string;
  status: string;
  prerequisites: string;
  description: string;
  validity: string;
  courseCover: string;
  medicalTest: string;
  maxAttendees: number;
  language: string;
  level: string;
  facility: string;
}