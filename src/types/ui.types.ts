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
