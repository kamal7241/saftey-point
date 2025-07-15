/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HandoutDTO,
  HandoutResponse,
  SingleHandoutResponse,
} from "@/types/api.types";

export const fetchHandouts = async (offset: number = 0, limit: number = 10): Promise<HandoutResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/handouts?offset=${offset}&limit=${limit}`
    );
    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch handouts");
    }

    // Map the API response to match the Handout interface
    const mappedHandouts = (result.innerData?.items || result.innerData?.handouts || []).map((item: any) => ({
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      fileUrl: item.fileUrl || '',
      fileType: item.fileType || '',
      fileSize: item.fileSize || 0,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      deletedAt: item.deletedAt,
    }));

    return {
      success: result.success,
      message: result.message,
      timestamp: result.timestamp,
      innerData: {
        count: result.innerData?.count || 0,
        handouts: mappedHandouts
      }
    };
  } catch (error) {
    console.error("Error fetching handouts:", error);
    return {
      success: false,
      message: "Failed to fetch handouts",
      innerData: {
        count: 0,
        handouts: []
      }
    };
  }
};

export const fetchHandoutById = async (id: string): Promise<SingleHandoutResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/handouts/${id}`
    );
    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch handout");
    }

    // Map the single handout to match the interface
    const handout = result.innerData?.handout || result.innerData;
    if (handout) {
      const mappedHandout = {
        id: handout.id,
        title: handout.title || '',
        description: handout.description || '',
        fileUrl: handout.fileUrl || '',
        fileType: handout.fileType || '',
        fileSize: handout.fileSize || 0,
        isActive: handout.isActive,
        createdAt: handout.createdAt,
        updatedAt: handout.updatedAt,
        deletedAt: handout.deletedAt,
      };

      return {
        success: result.success,
        message: result.message,
        timestamp: result.timestamp,
        innerData: {
          handout: mappedHandout
        }
      };
    }

    return {
      success: result.success,
      message: result.message,
      timestamp: result.timestamp,
      innerData: {
        handout: undefined
      }
    };
  } catch (error) {
    console.error("Error fetching handout:", error);
    return {
      success: false,
      message: "Failed to fetch handout",
      innerData: {
        handout: undefined
      }
    };
  }
};

export const createHandout = async (handoutData: HandoutDTO): Promise<SingleHandoutResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/handouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(handoutData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create handout");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const updateHandout = async (id: number, handoutData: Partial<HandoutDTO>): Promise<SingleHandoutResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/handouts/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(handoutData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update handout");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const deleteHandout = async (id: number): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/handouts/${id}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete handout");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}; 