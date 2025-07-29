// Updated to match new backend structure

interface StaffFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password?: string;
    resume?: string | null;
    avatar?: string | null;
    role?: number | string;
    status?: string;
    isVerified?: boolean;
}

interface StaffData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    isVerified: boolean;
    staff?: {
        id: number;
        status: string;
        userType: string;
        resume?: string;
        staffRole?: {
            id: number;
            name: string;
            description: string;
        };
    };
}

export const fetchStaffManagement = async (offset: number = 0, limit: number = 10, name?: string) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("offset", offset.toString());
        queryParams.append("limit", limit.toString());
        if (name) {
            queryParams.append("name", name);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/staff?${queryParams.toString()}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch users");
        }

        return {
            users: result.innerData.staff.map((staff: StaffData) => ({
                id: staff.id, // User ID for backward compatibility
                staffId: staff.staff?.id, // Staff ID for staff operations
                name: `${staff.firstName} ${staff.lastName}`,
                email: staff.email,
                status: staff.staff?.status || "pending",
                type: staff.staff?.userType?.toLowerCase() || "staff",
                phone: staff.phone,
                image: `${process.env.NEXT_PUBLIC_URL}/${staff.avatar}`,
                roleName: staff.staff?.staffRole?.name || "No Role",
                roleDescription: staff.staff?.staffRole?.description || "",
                roleId: staff.staff?.staffRole?.id,
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

        const user = result.innerData.user;
        return user;
    } catch (error) {
        console.error("Error fetching staff by ID:", error);
        return null;
    }
};

export const submitStaff = async (values: StaffFormValues) => {
    const apiData = {
        firstName: values.firstName,
        lastName: values.lastName || "",
        avatar: values.avatar || "",
        email: values.email,
        phone: values.phoneNumber,
        password: values.password || "",
        resume: values.resume || "",
        staffRoleId: values.role,
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

        // Check if the API response indicates success
        if (result.success === false) {
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
    values: StaffFormValues,
    currentData: StaffData
) => {
    const apiData: Record<string, unknown> = {};

    // Compare user fields (now directly on apiData)
    if (values.firstName && values.firstName !== currentData.firstName)
        apiData.firstName = values.firstName;
    if (values.lastName && values.lastName !== currentData.lastName)
        apiData.lastName = values.lastName;
    if (values.avatar && values.avatar !== currentData.avatar)
        apiData.avatar = values.avatar;
    if (values.email && values.email !== currentData.email)
        apiData.email = values.email;
    if (values.phoneNumber && values.phoneNumber !== currentData.phone)
        apiData.phone = values.phoneNumber;
    if (values.isVerified !== currentData.isVerified)
        apiData.isVerified = values.isVerified;
    if (values.resume && values.resume !== currentData.staff?.resume)
        apiData.resume = values.resume;
    if (values.role && values.role !== currentData.staff?.staffRole?.id)
        apiData.staffRoleId = values.role;

    // If no changes detected, return early
    if (Object.keys(apiData).length === 0) {
        return { success: true, data: currentData };
    }

    // Use staff ID for the API call instead of user ID
    const staffId = currentData.staff?.id || id;
    
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/staff/${staffId}`,
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

        // Check if the API response indicates success
        if (result.success === false) {
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

export const resetStaffPassword = async (
    staffId: number,
    newPassword: string
) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/staff/${staffId}`,
            {
                method: "PATCH",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: {
                        password: newPassword,
                    },
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to reset password.");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error resetting password:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};


export const toggleStaffVerification = async (staffId: number, status: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/staff/${staffId}`,
            {
                method: "PATCH",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: status
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update staff verification status");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating staff verification:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};
