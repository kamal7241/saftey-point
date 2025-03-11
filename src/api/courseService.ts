/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseFormValues } from "@/types/forms.types";
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
    innerData?:any;
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