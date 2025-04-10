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
                prerequisites: values.prerequisites.toUpperCase(),
                description: values.description,
                validity: values.validity,
                cover: values.courseCover,
                requiresMedicalTest: values.medicalTest === "yes",
                maxAttendees: Number(values.maxAttendees),
                language: values.language,
                level: values.level.toUpperCase(),
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
            title: values.sessionName,
            description: values.description,
            startDate: values.session_time.from,
            endDate: values.session_time.to,
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



export const fetchCourses = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/courses?offset=${offset}&limit=${limit}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch courses");
        }

        return {
            courses: result.innerData.items.map((course: SingleCourse) => ({
                id: course.id,
                title: course.title,
                language: course.language,
                enrollments: course.maxAttendees,
                sessions: course.sessions,
                level: course.level,
                status: course.status === "ACTIVE" ? "1" : "0",
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