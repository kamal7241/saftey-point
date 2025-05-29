import { SingleStaff } from "@/types/ui.types";

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
                status: staff.status,
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
        resume: values.resume || "",
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
            roleId: values.user.roleId || 1,
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

export const updateStaffStatus = async (staffId: number, status: string) => {
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
            throw new Error(result.message || "Failed to update staff status");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating staff status:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};
