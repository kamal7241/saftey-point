/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CourseTypeDTO,
  CourseTypeResponse,
  SingleCourseTypeResponse,
} from "@/types/api.types";

export const fetchCourseTypes = async (offset: number = 0, limit: number = 10): Promise<CourseTypeResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course-types?offset=${offset}&limit=${limit}`
    );
    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch course types");
    }

    // Map the API response to match the CourseType interface
    const mappedCourseTypes = (result.innerData?.items || result.innerData?.courseTypes || []).map((item: any) => ({
      id: item.id,
      code: item.code || '',
      nameEnglish: item.nameEnglish || item.name || '',
      nameArabic: item.nameArabic || '',
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
        courseTypes: mappedCourseTypes
      }
    };
  } catch (error) {
    console.error("Error fetching course types:", error);
    return {
      success: false,
      message: "Failed to fetch course types",
      innerData: {
        count: 0,
        courseTypes: []
      }
    };
  }
};

export const fetchCourseTypeById = async (id: string): Promise<SingleCourseTypeResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course-types/${id}`
    );
    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch course type");
    }

    // Map the single course type to match the new interface
    const courseType = result.innerData?.courseType || result.innerData;
    if (courseType) {
      const mappedCourseType = {
        id: courseType.id,
        code: courseType.code || '',
        nameEnglish: courseType.nameEnglish || courseType.name || '',
        nameArabic: courseType.nameArabic || '',
        isActive: courseType.isActive,
        createdAt: courseType.createdAt,
        updatedAt: courseType.updatedAt,
        deletedAt: courseType.deletedAt,
      };

      return {
        success: result.success,
        message: result.message,
        timestamp: result.timestamp,
        innerData: {
          courseType: mappedCourseType
        }
      };
    }

    return {
      success: result.success,
      message: result.message,
      timestamp: result.timestamp,
      innerData: {
        courseType: undefined
      }
    };
  } catch (error) {
    console.error("Error fetching course type:", error);
    return {
      success: false,
      message: "Failed to fetch course type",
      innerData: {
        courseType: undefined
      }
    };
  }
};

export const createCourseType = async (courseTypeData: CourseTypeDTO): Promise<SingleCourseTypeResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course-types`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(courseTypeData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create course type");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const updateCourseType = async (id: number, courseTypeData: Partial<CourseTypeDTO>): Promise<SingleCourseTypeResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course-types/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(courseTypeData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update course type");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const deleteCourseType = async (id: number): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course-types/${id}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete course type");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}; 