export interface CourseFormValues {
    courseTitle: string;
    description: string;
    status: string;
    price: string;
    certificate: string;
    prerequisites: string;
    validity: string;
    courseCover: string;
    medicalTest: string;
    maxAttendees: string;
    language: string;
    level: string;
}


export interface CompanyData {
    id?: number;
    name?: string;
    status: string;
    userType: string;
    user: {
        firstName: string;
        lastName: string;
        avatar: string | null;
        email: string;
        phone: string;
        password: string;
        isVerified: boolean;
    };
}


export interface AdminData {
    id?: number;
    status: string;
    userType: string;
    user: {
        roleId: string;
        firstName: string;
        lastName: string;
        avatar: string;
        email: string;
        phone: string;
        address?: string;
        password: string;
        isVerified: boolean;
    };
}
