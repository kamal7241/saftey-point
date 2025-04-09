import { Individual, IndividualResponse } from "@/types/ui.types";

export const submitIndividual = async (values: Individual) => {
    const apiData = {
        identityType: values.identityType.toUpperCase(),
        nationalId: values.nationalId,
        nationalIdExpiry: values.nationalIdExpiry,
        nationalIdFront: values.nationalIdFront,
        nationalIdBack: values.nationalIdBack,
        nationality: values.nationality,
        countryId: values.nationality,
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

        if (!result.success) {
            throw new Error(result.message || "Failed to submit individual");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error submitting individual:", error);
            return { 
                success: false, 
                error: error.message,
                isDuplicate: error.message.includes("Phone Number or Email already exists")
            };
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
        apiData.user = userUpdates as Individual["user"];
    }

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

        return { success: true, data: result.innerData.individual };
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
            users: result.innerData.individuals.map((individual: IndividualResponse) => ({
                id: individual.id,
                name: `${individual.firstName} ${individual.lastName}`,
                email: individual.email,
                status: individual.status === "ACTIVE" ? "1" : "0",
                type: individual.userType,
                phone: individual.phone,
                image: individual.avatar.startsWith('http') 
                    ? individual.avatar 
                    : `${process.env.NEXT_PUBLIC_URL}${individual.avatar}`,
                isVerified: individual.isVerified
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

export const resetUserPassword = async (userId: number, newPassword: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/individual/${userId}`,
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

export const toggleUserVerification = async (userId: number, isVerified: boolean) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/individual/${userId}`,
            {
                method: "PATCH",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: {
                        isVerified: isVerified
                    }
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update user verification status");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating user verification:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};