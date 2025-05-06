import { CompanyData } from "@/types/forms.types";
import { Branch } from "@/types/ui.types";

export const submitCompany = async (values: CompanyData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/company`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to submit company");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error submitting company:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};

export const fetchCompanies = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/company?offset=${offset}&limit=${limit}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch users");
        }

        return {
            companies: result.innerData.companies.map((company: CompanyData) => ({
                id: company.id,
                name: `${company.user.firstName} ${company.user.lastName}`,
                email: company.user.email,
                status: company.status === "ACTIVE" ? "1" : "0",
                type: company.userType,
                phone: company.user.phone,
                isVerified: company.user.isVerified,
                image: `${process.env.NEXT_PUBLIC_URL}/${company.user.avatar}`,
            })),
            totalCount: result.innerData.count
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { users: [], totalCount: 0 };
    }
};

export const fetchComapnyById = async (companyID: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/company/${companyID}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to fetch company details");
        }

        const company = result.innerData.company;
        return company;
    } catch (error) {
        console.error("Error fetching company by ID:", error);
        return null;
    }
};

export const deleteCompany = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/company/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete company");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error deleting company:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};

export const updateCompany = async (
    id: number,
    values: CompanyData,
    currentData: CompanyData
) => {
    const apiData: Partial<CompanyData> = {};

    // Compare top-level fields
    // if (values.name !== currentData.name)
    //     apiData.name = values.name;
    if (values.status !== currentData.status)
        apiData.status = values.status.toUpperCase();

    // Compare nested `user` fields
    const userUpdates: Partial<CompanyData["user"]> = {};

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
        apiData.user = userUpdates as CompanyData["user"];
    }

    // If no changes detected, return early
    if (Object.keys(apiData).length === 0) {
        console.log("No changes detected, skipping update.");
        return { success: true, data: currentData };
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/company/${id}`,
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
            throw new Error(result.message || "Failed to update company");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating company:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};

export const resetCompanyPassword = async (
    companyId: number,
    newPassword: string
) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/company/${companyId}`,
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

export const toggleCompanyVerification = async (companyId: number, isVerified: boolean) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/company/${companyId}`,
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
            throw new Error(result.message || "Failed to update company verification status");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating company verification:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};



export const fetchBranches = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/branch?offset=0&limit=100`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch branches");
        }

        return {
            success: true,
            branches: result.innerData.branches,
            message: result.message,
        };
    } catch (error) {
        console.error("Error fetching branches:", error);
        return {
            success: false,
            branches: [],
            message: error instanceof Error ? error.message : "Failed to fetch branches",
        };
    }
};


export const fetchBranchById = async (branchID: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/branch/${branchID}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to fetch branch details");
        }

        const branch = result.innerData.branch;
        return branch;
    } catch (error) {
        console.error("Error fetching branch by ID:", error);
        return null;
    }
};

export const toggleBranchVerification = async (branchId: number, status: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/branch/${branchId}`,
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
            throw new Error(result.message || "Failed to update branch verification status");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating branch verification:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};


export const submitBranch = async (values: Branch) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/branch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to submit branch");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error submitting branch:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};

export const updateBranch = async (
    id: number,
    values: Branch
) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/branch/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update branch");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating branch:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};
export const deleteBranch = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/branch/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete branch");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error deleting branch:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};
