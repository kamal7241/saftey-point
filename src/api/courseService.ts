/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseFormValues } from "@/types/forms.types";
import { SingleCourse } from "@/types/ui.types";
import { FormikValues } from "formik";

interface CreateCourseDTO {
    title: string;
    status: string;
    prerequisites: string;
    description: string;
    validity: string;
    cover: string;
    requiresMedicalTest: boolean;
    maxAttendees: number;
    language: string;
    level: string;
}

interface CourseResponse {
    success: boolean;
    message?: string;
    timestamp?: string;
    innerData?: {
        id: number;
        title: string;
        status: string;
        prerequisites: string;
        validity: string;
        cover: string;
        level: string;
        language: string;
        maxAttendees: number;
        requiresMedicalTest: boolean;
        description: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
    error?: string;
}

interface CertificateDTO {
    title: string;
    validFrom: string;
    validTo: string;
    issueDate: string;
    displaySource: boolean;
    watermark: boolean;
    courseId: number;
}

interface CertificateResponse {
    success: boolean;
    message?: string;
    error?: string;
    innerData?: any;
}

interface ExamDTO {
    title: string;
    instructions: string;
    duration: number;
    examType: string;
    totalMarks: number;
    passMarks: number;
    courseId: number;
}

interface ExamResponse {
    success: boolean;
    message?: string;
    error?: string;
    innerData?: any;
}

interface ExamQuestionOption {
    optionText: string;
    isCorrect: boolean;
}

interface ExamQuestionAnswer {
    answerText: string;
    isCorrect: boolean;
    matchWith: string;
    options: string[];
}

interface ExamQuestionDTO {
    title: string;
    description: string;
    type: string;
    examId: number;
    options: ExamQuestionOption[];
    answers: ExamQuestionAnswer[];
}

interface QuestionResponse {
    success: boolean;
    message?: string;
    error?: string;
    innerData?: any;
}

interface PricingDTO {
    price: number;
    discount: number;
    isTheoreticalOnly: boolean;
    type: string;
    isCompanyTraining: boolean;
}

interface PricingResponse {
    success: boolean;
    message?: string;
    error?: string;
    innerData?: any;
}

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

// Add these interfaces after the existing ones
interface SessionDTO {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    courseId: number;
}

interface SessionResponse {
    success: boolean;
    message?: string;
    error?: string;
    innerData?: any;
}

// Add this function with the other export functions
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


// Add this function with the other export functions
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