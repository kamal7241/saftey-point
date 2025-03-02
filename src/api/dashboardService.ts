import { Individual, SingleCourse, SingleStaff } from "@/types/ui.types";


const generateRandomString = (length: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};


// export const fetchCompanies = async () => {
//     const data = Array.from({ length: 50 }, (_, index) => ({
//         id: index + 1,
//         name: `Company ${generateRandomString(5)}`,
//         location: `Location ${generateRandomString(3)}`,
//         status: Math.random() > 0.5 ? "1" : "0",
//         branches: Math.floor(Math.random() * 10) + 1,
//         employees: Math.floor(Math.random() * 500) + 50,
//         created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
//         image: `https://loremflickr.com/320/240/business?random`,
//     }));

//     return data;
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

export const updateIndividual = async (
    id: number,
    values: Individual,
    currentData: Individual
) => {
    const apiData: Partial<Individual> = {};

    // Compare top-level fields
    if (values.identityType !== currentData.identityType)
        apiData.identityType = values.identityType.toUpperCase();
    if (values.nationalId !== currentData.nationalId)
        apiData.nationalId = values.nationalId;
    if (values.nationalIdExpiry !== currentData.nationalIdExpiry)
        apiData.nationalIdExpiry = values.nationalIdExpiry;
    if (values.nationalIdFront !== currentData.nationalIdFront)
        apiData.nationalIdFront = values.nationalIdFront;
    if (values.nationalIdBack !== currentData.nationalIdBack)
        apiData.nationalIdBack = values.nationalIdBack;
    if (values.nationality !== currentData.nationality)
        apiData.nationality = values.nationality;
    if (values.birthday !== currentData.birthday)
        apiData.birthday = values.birthday;

    // Compare nested `user` fields
    const userUpdates: Partial<Individual["user"]> = {};

    if (values.user.firstName && values.user.firstName !== currentData.user.firstName)
        userUpdates.firstName = values.user.firstName;
    if (values.user.lastName && values.user.lastName !== currentData.user.lastName)
        userUpdates.lastName = values.user.lastName;
    if (values.user.avatar && values.user.avatar !== currentData.user.avatar)
        userUpdates.avatar = values.user.avatar;
    if (values.user.email && values.user.email !== currentData.user.email)
        userUpdates.email = values.user.email;
    if (values.user.phone && values.user.phone !== currentData.user.phone)
        userUpdates.phone = values.user.phone;
    if (values.user.isVerified !== currentData.user.isVerified)
        userUpdates.isVerified = values.user.isVerified;
    if (values.user.jobTitle && values.user.jobTitle !== currentData.user.jobTitle)
        userUpdates.jobTitle = values.user.jobTitle;

    if (Object.keys(userUpdates).length > 0) {
        apiData.user = userUpdates as Individual["user"]; // Type assertion to match the expected type
    }

    // If no changes detected, return early
    if (Object.keys(apiData).length === 0) {
        console.log("No changes detected, skipping update.");
        return { success: true, data: currentData };
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/individual/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiData),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update individual");
        }

        return { result };
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

export const fetchUsers = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/individual?offset=${offset}&limit=${limit}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch users");
        }

        return {
            users: result.innerData.individuals.map((individual: Individual) => ({
                id: individual.id,
                name: `${individual.user.firstName} ${individual.user.lastName}`,
                email: individual.user.email,
                status: individual.status === "ACTIVE" ? "1" : "0",
                type: individual.userType,
                phone: individual.user.phone,
                image: `${process.env.NEXT_PUBLIC_URL}/${individual.user.avatar}`,
            })),
            totalCount: result.innerData.count
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { users: [], totalCount: 0 };
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


export const fetchStaffManagement = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/staff?offset=${offset}&limit=${limit}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch users");
        }

        return {
            users: result.innerData.staff.map((staff: SingleStaff) => ({
                id: staff.id,
                name: `${staff.user.firstName} ${staff.user.lastName}`,
                email: `${staff.user.email}`,
                status: staff.status === "ACTIVE" ? "1" : "0",
                type: staff.userType.toLowerCase(),
                phone: staff.user.phone,
                image: `${process.env.NEXT_PUBLIC_URL}/${staff.user.avatar}`,
            })),
            totalCount: result.innerData.count
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { users: [], totalCount: 0 };
    }
};


export const fetchStaffById = async (userID: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/staff/${userID}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to fetch staff details");
        }

        const staff = result.innerData.staff;
        return staff;
    } catch (error) {
        console.error("Error fetching staff by ID:", error);
        return null;
    }
};

export const submitStaff = async (values: SingleStaff) => {
    const apiData = {
        resume: values.resume || "avatar.png",
        status: values.status || "pending",
        userType: values.userType || "STAFF",
        user: {
            firstName: values.user.firstName,
            lastName: values.user.lastName || "",
            avatar: values.user.avatar,
            email: values.user.email,
            phone: values.user.phone,
            password: values.user.password || "",
            isVerified: values.user.isVerified || false,
        },
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/staff`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to submit staff");
        }

        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error submitting staff:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};
export const updateStaff = async (
    id: number,
    values: SingleStaff,
    currentData: SingleStaff
) => {
    const apiData: Partial<SingleStaff> = {};

    // Compare top-level fields
    if (values.resume !== currentData.resume) apiData.resume = values.resume;
    if (values.status !== currentData.status) apiData.status = values.status;
    if (values.userType !== currentData.userType) apiData.userType = values.userType;

    // Compare nested `user` fields
    const userUpdates: Partial<SingleStaff["user"]> = {};

    if (values.user.firstName && values.user.firstName !== currentData.user.firstName)
        userUpdates.firstName = values.user.firstName;
    if (values.user.lastName && values.user.lastName !== currentData.user.lastName)
        userUpdates.lastName = values.user.lastName;
    if (values.user.avatar && values.user.avatar !== currentData.user.avatar)
        userUpdates.avatar = values.user.avatar;
    if (values.user.email && values.user.email !== currentData.user.email)
        userUpdates.email = values.user.email;
    if (values.user.phone && values.user.phone !== currentData.user.phone)
        userUpdates.phone = values.user.phone;
    if (values.user.isVerified !== currentData.user.isVerified)
        userUpdates.isVerified = values.user.isVerified;

    if (Object.keys(userUpdates).length > 0) {
        apiData.user = userUpdates as SingleStaff["user"]; // Type assertion to match the expected type
    }

    // If no changes detected, return early
    if (Object.keys(apiData).length === 0) {
        console.log("No changes detected, skipping update.");
        return { success: true, data: currentData };
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/staff/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiData),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update staff");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating staff:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};
export const deleteStaff = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/staff/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete staff");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error deleting staff:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
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