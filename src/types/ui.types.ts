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
    status: string;
    branches: number;
    employees: number;
    created: string;
    image?: string;
}
export interface SingleUser {
    id: number;
    name: string;
    email: string;
    type: string;
    phone: string;
    image?: string;
    status: string;
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
    name: string;
    location_name: string;
    status: string;
    address: string;
    location_map: string;
    created: string;
    image?: string;
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
    id: number;
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
        id: number;
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        isVerified: boolean;
    };
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

export interface SingleStaff {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    image?: string;
}

export interface SingleCourse {
    id: number;
    name: string;
    language: string;
    enrollments: number;
    sessions: number;
    level: number;
    status: string;
    image?: string;
}
