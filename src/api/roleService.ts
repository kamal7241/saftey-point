// import { Role } from "@/types/ui.types";

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
      `${process.env.NEXT_PUBLIC_URL}/api/v1/roles/${roleId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(roleData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update role');
    }

    return result;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRole = async (roleId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/roles/${roleId}`,
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