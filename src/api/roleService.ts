// import { Role } from "@/types/ui.types";

import { RoleStatus } from "@/enum/role-status.enum";

export interface RoleFeature {
  key: string;
  name: string;
  create: boolean;
  delete: boolean;
  update: boolean;
  list: boolean;
  find: boolean;
}

export interface RoleResponse {
  id: number;
  key: string;
  name: string;
  description: string;
  features: RoleFeature[];
  status: RoleStatus;
}

export const fetchRoles = async (): Promise<RoleResponse[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/auth/roles`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch roles');
    }

    return result;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const createRole = async (roleData: Omit<RoleResponse, 'id'>): Promise<{
  success: boolean;
  message: string;
  data?: RoleResponse;
  timestamp?: string;
}> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/auth/roles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(roleData),
      }
    );

    // Handle successful response (201) with no content
    if (response.status === 201) {
      return {
        success: true,
        message: 'Role created successfully'
      };
    }

    // Only parse as JSON if not 201 status
    const result = await response.json();

    return {
      success: false,
      message: result.message || 'Failed to create role',
      timestamp: result.timestamp
    };

  } catch (error) {
    if (error instanceof SyntaxError) {
      // If we get SyntaxError but status was 201, it's actually a success
      return {
        success: true,
        message: 'Role created successfully'
      };
    }
    console.error('Error creating role:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

export const updateRole = async (roleId: number, roleData: Partial<RoleResponse>) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/auth/roles/${roleId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(roleData),
      }
    );

    // Check if the request was successful FIRST
    if (response.ok) {
      // If successful, return the success message directly
      // No need to parse JSON if the API returns an empty body on success
      return {
        success: true,
        message: 'Role updated successfully'
      };
    } else {
      // If the request failed, THEN try to parse the error message from JSON body
      let errorMessage = `Failed to update role (Status: ${response.status})`;
      try {
        const result = await response.json();
        errorMessage = result.message || errorMessage; // Use message from response if available
      } catch (jsonError) {
        // If parsing the error response fails, use the status text
        console.error("Failed to parse error response JSON:", jsonError);
        errorMessage = `Failed to update role: ${response.statusText || response.status}`;
      }
      throw new Error(errorMessage);
    }

  } catch (error) {
    // Catch network errors or errors thrown from the !response.ok block
    console.error('Error updating role:', error);
    // Return a consistent error structure or rethrow
    return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred during update.'
    };
    // Or rethrow if the calling function expects to catch it:
    // throw error;
  }
};

export const setRoleStatus = async (roleId: number, roleStatus: RoleStatus) => {
    return updateRole(roleId, { status: roleStatus });
};

export const deleteRole = async (roleId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/auth/roles/${roleId}`,
      {
        method: 'DELETE',
        headers: {
          accept: '*/*',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete role');
    }

    return result;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};


export const fetchRoleById = async (roleId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/auth/roles/${roleId}`,
      {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch role');
    }

    return result;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};




// New interfaces and function for staff roles
export interface StaffRoleItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  permissions: string;
  isActive: boolean;
}

export interface StaffRolesApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  innerData: {
    items: StaffRoleItem[];
    total: number;
  };
}

export const fetchStaffRoles = async (): Promise<StaffRoleItem[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/staff-roles`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );

    if (!response.ok) {
      // Try to parse error message if available
      let errorMessage = 'Failed to fetch staff roles';
      try {
        const errorResult = await response.json();
        errorMessage = errorResult.message || errorMessage;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Ignore if error response is not JSON
      }
      throw new Error(errorMessage);
    }

    const result: StaffRolesApiResponse = await response.json();

    if (!result.success || !result.innerData || !result.innerData.items) {
      throw new Error(result.message || 'Failed to process staff roles data');
    }

    return result.innerData.items;
  } catch (error) {
    console.error('Error fetching staff roles:', error);
    return []; // Return empty array on error to prevent breaking UI
  }
};
