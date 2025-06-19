import { AdminStatus, AdminVmStatus } from "@/enum/admin-status.enum";
import { AdminData } from "@/types/forms.types";
import { AdminResponse } from "@/types/ui.types";

export const submitAdmin = async (adminData: AdminData) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/admin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "*/*",
                },
                body: JSON.stringify(adminData),
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to submit admin");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Handle specific error messages
            if (error.message.includes("Phone Number or Email already exists")) {
                return { 
                    success: false, 
                    error: "Phone number or email is already registered in the system"
                };
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unexpected error occurred" };
    }
};

export const updateAdmin = async (
    adminId: number,
    values: AdminData,
    currentData: AdminData
) => {
    const apiData: Partial<AdminData> = {};

    // Compare top-level fields
    if (values.status !== currentData.status)
        apiData.status = values.status.toUpperCase();

    // Compare nested `user` fields
    const userUpdates: Partial<AdminData["user"]> = {};

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
    if (values.user.roleId && values.user.roleId !== currentData.user.roleId)
        userUpdates.roleId = values.user.roleId;

    if (Object.keys(userUpdates).length > 0) {
        apiData.user = userUpdates as AdminData["user"];
    }

    // If no changes detected, return early
    if (Object.keys(apiData).length === 0) {
        console.log("No changes detected, skipping update.");
        return { success: true, data: currentData };
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/admin/${adminId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    accept: "*/*",
                },
                body: JSON.stringify(apiData),
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to update admin");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unexpected error occurred" };
    }
};

export const fetchAdmins = async (offset: number = 0, limit: number = 10, name?: string) => {
    try {
        const params = new URLSearchParams({
            offset: offset.toString(),
            limit: limit.toString()
        });
        
        if (name) {
            params.append('name', name);
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/admin?${params.toString()}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to fetch admins");
        }

        return {
            admins: result.innerData.admins.map((admin: AdminResponse) => ({
                id: admin.id,
                name: `${admin.user.firstName} ${admin.user.lastName}`,
                email: admin.user.email,
                status: admin.status === AdminStatus.ACTIVE? AdminVmStatus.ACTIVE : AdminVmStatus.SUSPENDED,
                type: admin.userType,
                phone: admin.user.phone,
                image: admin.user.avatar.startsWith('http') 
                    ? admin.user.avatar 
                    : `${process.env.NEXT_PUBLIC_URL}${admin.user.avatar}`,
                isVerified: admin.user.isVerified,
                role: admin.roles && admin.roles.length > 0 ? admin.roles[0].name : 'N/A'
            })),
            totalCount: result.innerData.count
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unexpected error occurred" };
    }
};

export const fetchAdminById = async (adminId: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/admin/${adminId}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to fetch admin details");
        }

        const admin: AdminResponse = result.innerData.admin;

        return {
            success: true,
            admin: {
                id: admin.id,
                name: `${admin.user.firstName} ${admin.user.lastName}`,
                email: admin.user.email,
                status: admin.status === AdminStatus.ACTIVE ? AdminVmStatus.ACTIVE : AdminVmStatus.SUSPENDED,
                userType: admin.userType,
                type: admin.userType,
                phone: admin.user.phone,
                image: admin.user.avatar.startsWith('http')
                    ? admin.user.avatar
                    : `${process.env.NEXT_PUBLIC_URL}${admin.user.avatar}`,
                isVerified: admin.user.isVerified,
                user: {
                    ...admin.user,
                    roleId: admin.roles && admin.roles.length > 0 ? admin.roles[0].id.toString() : ''
                },
                role: admin.roles && admin.roles.length > 0 ? admin.roles[0].name : 'N/A',
                roles: admin.roles || []
            }
        };

    } catch (error: unknown) {
        console.error("Error fetching admin by ID:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unexpected error occurred" };
    }
};

export const deleteAdmin = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/admin/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                accept: "*/*",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete admin");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error deleting admin:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};

export const resetAdminPassword = async (
    adminId: number,
    newPassword: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/v1/admin/${adminId}`,
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

export const toggleAdminVerification = async (adminId: number, isVerified: boolean) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/admin/${adminId}`, // Adjusted endpoint
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
            throw new Error(result.message || "Failed to update admin verification status");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating admin verification:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};

export const updateAdminStatus = async (adminId: number, status: AdminStatus) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/admin/${adminId}`, // Adjusted endpoint
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
            throw new Error(result.message || "Failed to update admin verification status");
        }

        return { success: true, data: result };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating admin verification:", error);
            return { success: false, error: error.message };
        } else {
            console.error("Unexpected error:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    }
};