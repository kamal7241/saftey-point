/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseFormValues } from "@/types/forms.types";
import { SingleCourse } from "@/types/ui.types";
import { FormikValues } from "formik";
import {
  CertificateDTO,
  CertificateResponse,
  CorporatePricingDTO,
  CorporatePricingItem,
  CorporatePricingListResponse,
  CourseExam,
  CourseExamResponse,
  CourseResponse,
  CreateCourseDTO,
  ExamDTO,
  ExamQuestionDTO,
  ExamResponse,
  PricingDTO,
  PricingItem,
  PricingListResponse,
  PricingResponse,
  Question,
  QuestionListResponse,
  QuestionResponse,
  SessionDTO,
  SessionResponse,
  UpdateQuestionDTO,
} from "@/types/api.types";


export const submitCourse = async (values: CourseFormValues, step: number): Promise<CourseResponse> => {
  if (step === 0) {
    try {
      const courseData: CreateCourseDTO = {
        title: values.courseTitle,
        status: values.status.toUpperCase(),
        description: values.description,
        validity: values.validity,
        cover: values.courseCover,
        requiresMedicalTest: values.medicalTest === "yes",
        maxAttendees: Number(values.maxAttendees),
        languageId: Number(values.languageId),
        levelId: Number(values.levelId),
        prerequisiteId: Number(values.prerequisiteId),
        facilityId: Number(values.facilityId)
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/v1/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify(courseData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit course");
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting course:", error);
        return { success: false, error: error.message };
      } else {
        console.error("Unexpected error:", error);
        return { success: false, error: "An unexpected error occurred" };
      }
    }
  }
  return { success: false, error: "Invalid step" };
};

export const updateCourse = async (courseId: number, values: Partial<CourseFormValues>): Promise<CourseResponse> => {
  try {
    const courseData: Partial<CreateCourseDTO> = {
      title: values.courseTitle,
      status: values.status?.toUpperCase(),
      description: values.description,
      validity: values.validity,
      cover: values.courseCover,
      requiresMedicalTest: values.medicalTest === "yes",
      maxAttendees: Number(values.maxAttendees),
      languageId: Number(values.languageId),
      levelId: Number(values.levelId),
      prerequisiteId: Number(values.prerequisiteId),
      facilityId: Number(values.facilityId)
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/courses/${courseId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(courseData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update course");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating course:", error);
      return { success: false, error: error.message };
    }
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};


export const submitCertificate = async (values: FormikValues, courseId: string): Promise<CertificateResponse> => {
  try {
    const certificateData: CertificateDTO = {
      title: values.certificateName,
      validFrom: new Date(values.validate_date_interval[0]).toISOString().split('T')[0],
      validTo: new Date(values.validate_date_interval[1]).toISOString().split('T')[0],
      issueDate: new Date(values.issue_date).toISOString().split('T')[0],
      displaySource: values.displayScore === "yes",
      watermark: values.watermark === "yes",
      courseId: parseInt(courseId)
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/certificates`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(certificateData)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create certificate');
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const submitExam = async (values: FormikValues, courseId: string): Promise<ExamResponse> => {
  try {
    const examData: ExamDTO = {
      title: values.examName,
      instructions: values.instructions,
      duration: Number(values.examDuration),
      examType: values.examType,
      totalMarks: Number(values.totalMarks),
      passMarks: Number(values.passMarks),
      courseId: parseInt(courseId)
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/exams`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(examData)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create exam');
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const submitExamQuestion = async (examId: string, questionData: ExamQuestionDTO): Promise<QuestionResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/exams/${examId}/questions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(questionData)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create exam question');
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const deleteExamQuestion = async (examId: string, questionId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/exams/${examId}/questions/${questionId}`,
      {
        method: 'DELETE',
        headers: {
          'accept': '*/*'
        }
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, error: 'Failed to delete question' };
  }
};

export const submitSession = async (values: FormikValues, courseId: string): Promise<SessionResponse> => {
  try {
    const sessionData: SessionDTO = {
      title: values.title,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      status: "ACTIVE",
      courseId: parseInt(courseId)
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(sessionData)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create session');
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const updateSession = async (
  examId: string,
  data: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/session/${examId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return { success: response.ok, error: result.message };
  } catch (error) {
    console.error('Error updating exam:', error);
    return { success: false, error: 'Failed to update exam' };
  }
};


export const fetchCourses = async (offset: number = 0, limit: number = 10) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/courses?offset=${offset}&limit=${limit}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch courses");
    }

    return {
      courses: result.innerData.items.map((course: any): SingleCourse => ({
        id: course.id,
        title: course.title,
        language: course.language?.name || null,
        languageId: course.language?.id || null,
        level: course.level?.name || null,
        levelId: course.level?.id || null,
        facility: course.facility?.name || null,
        facilityId: course.facility?.id || null,
        prerequisites: course.prerequisites,
        validity: course.validity,
        description: course.description,
        cover: course.cover,
        maxAttendees: course.maxAttendees,
        requiresMedicalTest: course.requiresMedicalTest,
        status: course.status,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        deletedAt: course.deletedAt,
        image: course.cover ? `${process.env.NEXT_PUBLIC_URL}${course.cover}` : '',
      })),
      totalCount: result.innerData.count
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { courses: [], totalCount: 0 };
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

export const submitPricing = async (courseId: string, pricingData: PricingDTO): Promise<PricingResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course/${courseId}/pricing`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(pricingData)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit pricing');
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
}


export const submitCorporatePricing = async (courseId: number, values: CorporatePricingDTO): Promise<PricingResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course/${courseId}/corporate-pricing`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(values)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit corporate pricing');
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
};


export const fetchCorporatePricing = async (courseId: number): Promise<CorporatePricingItem[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course/${courseId}/corporate-pricing`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );
    const result: CorporatePricingListResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch corporate pricing details');
    }

    return result.innerData.items;
  } catch (error) {
    console.error('Error fetching corporate pricing:', error);
    return null;
  }
};

export const fetchCoursePricing = async (courseId: number): Promise<PricingItem[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course/${courseId}/pricing`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );
    const result: PricingListResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch pricing details');
    }

    return result.innerData.items;
  } catch (error) {
    console.error('Error fetching course pricing:', error);
    return null;
  }
};

export const fetchExamById = async (id: string) => {
  try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/exams/${id}`
      );
      const result = await response.json();

      if (!result.success) {
          throw new Error("Failed to fetch exam");
      }

      return {
          success: result.success,
          message: result.message,
          data: result.innerData
      };
  } catch (error) {
      console.error("Error fetching exam:", error);
      return {
          success: false,
          message: "Failed to fetch exam",
          data: null
      };
  }
};

export const fetchCourseExams = async (courseId: number): Promise<CourseExam[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/exams/${courseId}/exams`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );
    const result: CourseExamResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch exam details');
    }

    return result.innerData;
  } catch (error) {
    console.error('Error fetching course exams:', error);
    return null;
  }
};

export const fetchExamQuestions = async (examId: string): Promise<Question[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/exams/${examId}/questions`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );
    const result: QuestionListResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch questions');
    }

    return result.innerData;
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    return null;
  }
};


export const updateExamQuestion = async (
  examId: string,
  questionId: number,
  data: UpdateQuestionDTO
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/exams/${examId}/questions/${questionId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return { success: response.ok, error: result.message };
  } catch (error) {
    console.error('Error updating question:', error);
    return { success: false, error: 'Failed to update question' };
  }
};

export const updateExam = async (
  examId: string,
  data: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/exams/${examId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return { success: response.ok, error: result.message };
  } catch (error) {
    console.error('Error updating exam:', error);
    return { success: false, error: 'Failed to update exam' };
  }
};

export const fetchCourseCertificate = async (courseId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/certificates/course/${courseId}`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch certificate details');
    }

    return result.innerData.count;
  } catch (error) {
    console.error('Error fetching course certificate:', error);
    return null;
  }
};

export const fetchCourseSession = async (courseId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/session/course/${courseId}`,
      {
        headers: {
          accept: '*/*',
        },
      }
    );
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch session details');
    }

    return result.innerData.count;
  } catch (error) {
    console.error('Error fetching course session:', error);
    return null;
  }
};

export const updateCoursePricing = async (
  courseId: number,
  pricingId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Promise<PricingResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/course/${courseId}/pricing/${pricingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",

        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update pricing");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating pricing:", error);
      return { success: false, error: error.message };
    } else {
      console.error("Unexpected error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  }
};
const formatDate = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return null;
  }
};
export const updateCertificate = async (
  certificateId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Promise<CertificateResponse> => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const certificateData: any = {
    title: data.title,
    validFrom: formatDate(data.validFrom),
    validTo: formatDate(data.validTo),
    issueDate: formatDate(data.issueDate),
    displaySource: data.displaySource === 'yes',
    watermark: data.watermark === 'yes'
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/certificates/${certificateId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(certificateData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update certificate");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const deleteCourse = async (courseId: number): Promise<CourseResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/courses/${courseId}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete course");
    }

    return {
      success: result.success,
      message: result.innerData?.message || result.message,
      timestamp: result.timestamp
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting course:", error);
      return { success: false, error: error.message };
    }
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};