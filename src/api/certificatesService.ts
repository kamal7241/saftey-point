/* eslint-disable @typescript-eslint/no-explicit-any */
import { CertificateResponse } from "@/types/api.types";

export interface Certificate {
    id: number;
    title: string;
    validFrom: string;
    validTo: string;
    issueDate: string;
    displayScore: boolean;
    watermark: boolean;
    courseId: number;
}

export const fetchCertificates = async (offset: number, limit: number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/certificates?offset=${offset}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'accept': '*/*'
                }
            }
        );
        const data = await response.json();
        return {
            certificates: data.innerData.items,
            totalCount: data.innerData.count
        };
    } catch (error) {
        console.error('Error fetching certificates:', error);
        throw error;
    }
};

export const createCertificate = async (certificateData: any) => {

    const apiData: any = {
        title: certificateData.title,
        validFrom: formatDate(certificateData.validFrom),
        validTo: formatDate(certificateData.validTo),
        issueDate: formatDate(certificateData.issueDate),
        displaySource: certificateData.displayScore === 'yes',
        watermark: certificateData.watermark === 'yes'
    };
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/certificates`,
            {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiData)
            }
        );
        if (response.ok) {
            return { success: true };
        }
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

export const deleteCertificate = async (id: number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/certificates/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'accept': '*/*'
                }
            }
        );
        return await response.json();
    } catch (error) {
        console.error('Error deleting certificate:', error);
        throw error;
    }
};


export const fetchCertificateById = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/certificates/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to fetch certificate details");
        }

        const individual = result.innerData;
        return individual;
    } catch (error) {
        console.error("Error fetching certificate by ID:", error);
        return null;
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
        displaySource: data.displayScore === 'yes',
        watermark: data.watermark === 'yes'
    };
    console.log("certificateData", certificateData);
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