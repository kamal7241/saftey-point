export interface CourseFormValues {
    courseTitle: string;
    description: string;
    status: string;
    price: string;
    certificate: string;
}


export interface CompanyData {
    id?: string;
    name: string;
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
