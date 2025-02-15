import { Company, Individual, SingleCourse } from "@/types/ui.types";


const generateRandomString = (length: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};


export const fetchCompanies = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Company ${generateRandomString(5)}`,
        location: `Location ${generateRandomString(3)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        branches: Math.floor(Math.random() * 10) + 1,
        employees: Math.floor(Math.random() * 500) + 50,
        created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        image: `https://loremflickr.com/320/240/business?random`,
    }));

    return data;
};

// export const fetchCompanies = async () => {
//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/company`);
//         const result = await response.json();

//         if (!result.success) {
//             throw new Error("Failed to fetch users");
//         }

//         return result.innerData.companies.map((company: Company) => ({
//             id: company.id,
//             name: `${company.user.firstName} ${individual.user.lastName}`,
//             email: individual.user.email,
//             status: individual.status === "ACTIVE" ? "1" : "0",
//             type: individual.userType,
//             phone: individual.user.phone,
//             image: `${process.env.NEXT_PUBLIC_URL}/${individual.user.avatar}`,
//         }));
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         return [];
//     }
// };


export const submitIndividual = async (values: Individual) => {
    const apiData = {
        identityType: values.identityType.toUpperCase(),
        nationalId: values.nationalId,
        nationalIdExpiry: values.nationalIdExpiry,
        nationalIdFront: values.nationalIdFront,
        nationalIdBack: values.nationalIdBack,
        nationality: values.nationality,
        birthday: values.birthday,
        user: {
            firstName: values.user.firstName,
            lastName: values.user.lastName || "",
            avatar: values.user.avatar || "avatar.png",
            email: values.user.email,
            phone: values.user.phone,
            address: "123 Main St",
            password: "",
            isVerified: values.user.isVerified || false,
        },
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/individual`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to submit individual");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error submitting individual:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};

export const updateIndividual = async (id: number, values: Individual) => {
    const apiData = {
        identityType: values.identityType.toUpperCase(),
        nationalId: values.nationalId,
        nationalIdExpiry: values.nationalIdExpiry,
        nationalIdFront: values.nationalIdFront,
        nationalIdBack: values.nationalIdBack,
        nationality: values.nationality,
        birthday: values.birthday,
        user: {
            firstName: values.user.firstName,
            lastName: values.user.lastName || "",
            avatar: values.user.avatar || "avatar.png",
            email: values.user.email,
            phone: values.user.phone,
            address: "123 Main St", // You can replace this if needed
            password: "", // Typically, you won't send the password unless it's changing
            isVerified: values.user.isVerified || false,
        },
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/individual/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update individual");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating individual:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};

export const deleteIndividual = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/individual/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete individual");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error deleting individual:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};


export const fetchUsers = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/individual`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch users");
        }

        return result.innerData.individuals.map((individual: Individual) => ({
            id: individual.id,
            name: `${individual.user.firstName} ${individual.user.lastName}`,
            email: individual.user.email,
            status: individual.status === "ACTIVE" ? "1" : "0",
            type: individual.userType,
            phone: individual.user.phone,
            image: `${process.env.NEXT_PUBLIC_URL}/${individual.user.avatar}`,
        }));
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const fetchUserById = async (userID: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/individual/${userID}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to fetch user details");
        }

        const individual = result.innerData.individual;
        return individual;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};

export const fetchCourses = async (): Promise<SingleCourse[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/courses`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch courses");
        }

        return result.innerData.items.map((course: SingleCourse) => ({
            id: course.id,
            title: course.title,
            language: course.language,
            enrollments: course.maxAttendees,
            sessions: course.sessions,
            level: course.level,
            status: course.status === "ACTIVE" ? "1" : "0",
        }));
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};
export const fetchCourseById = async (courseID: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/courses/${courseID}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to fetch course details");
        }

        const course = result.innerData;
        return course;
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        return null;
    }
};


export const fetchStaffManagement = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `User ${generateRandomString(5)}`,
        email: `email${generateRandomString(3)}`,
        phone: (Math.floor(Math.random() * 500) + 50).toString(),
        status: Math.random() > 0.5 ? "1" : "0",
        role: ["Admin", "Company", "Staff", "User"][Math.floor(Math.random() * 4)],
        image: `https://loremflickr.com/320/240/business?random`,
    }));

    return data;
};

export const fetchCertificates = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `User ${generateRandomString(5)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        issue_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        expiry_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }));

    return data;
};
export const fetchExams = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Exam ${generateRandomString(5)}`,
        assigned_to: `assigned to ${generateRandomString(5)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        exam_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        score: (Math.floor(Math.random() * 500) + 50).toString(),
    }));

    return data;
};

export const fetchBranches = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Branch ${generateRandomString(5)}`,
        location_map: `Location ${generateRandomString(3)}`,
        address: `address ${generateRandomString(3)}`,
        location_name: `Location ${generateRandomString(3)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        branches: Math.floor(Math.random() * 10) + 1,
        employees: Math.floor(Math.random() * 500) + 50,
        created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }));

    return data;
};

export const fetchAdmins = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `${generateRandomString(4)} ${generateRandomString(4)}`,
        role: ["Admin", "Company", "Staff", "User"][Math.floor(Math.random() * 4)],
        permissions: Math.random() < 0.5
            ? ["Admin", "Roles & Permissions"]
            : Math.random() < 0.5
                ? ["Certificates", "Reports"]
                : ["Admin", "Roles & Permissions", "Certificates"],
        status: Math.random() > 0.5 ? "1" : "0",
        image: `https://loremflickr.com/320/240/business?random`,
    }));

    return data;
};