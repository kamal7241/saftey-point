/* eslint-disable @typescript-eslint/no-explicit-any */

export interface CancellationFee {
    id: number;
    name: string;
    description: string;
    type: 'FULL_REFUND' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NO_REFUND';
    percentage: string | null;
    fixedAmount: number | null;
    hoursBeforeStart: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface CreateCancellationFeeData {
    name: string;
    description: string;
    type: 'FULL_REFUND' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NO_REFUND';
    percentage?: string | null;
    fixedAmount?: number | null;
    hoursBeforeStart: number;
    isActive: boolean;
    sortOrder: number;
}

export type UpdateCancellationFeeData = CreateCancellationFeeData;

export const fetchCancellationFees = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/cancellation-fees?offset=${offset}&limit=${limit}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch cancellation fees");
        }

        return {
            success: result.success,
            message: result.message,
            innerData: {
                count: result.innerData?.count || 0,
                cancellationFees: Array.isArray(result.innerData?.items) 
                    ? result.innerData.items 
                    : [result.innerData?.items].filter(Boolean)
            }
        };
    } catch (error) {
        console.error("Error fetching cancellation fees:", error);
        return {
            success: false,
            message: "Failed to fetch cancellation fees",
            innerData: {
                count: 0,
                cancellationFees: []
            }
        };
    }
};

export const fetchCancellationFeeById = async (id: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/cancellation-fees/${id}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch cancellation fee");
        }

        return {
            success: result.success,
            message: result.message,
            data: result.innerData?.cancellationFee || result.data
        };
    } catch (error) {
        console.error("Error fetching cancellation fee:", error);
        return {
            success: false,
            message: "Failed to fetch cancellation fee",
            data: null
        };
    }
};

export const createCancellationFee = async (data: CreateCancellationFeeData) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/cancellation-fees`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accept: "*/*",
                },
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();

        return {
            success: result.success,
            message: result.message,
            data: result.data || result.innerData
        };
    } catch (error) {
        console.error("Error creating cancellation fee:", error);
        return {
            success: false,
            message: "Failed to create cancellation fee",
            data: null
        };
    }
};

export const updateCancellationFee = async (id: number, data: UpdateCancellationFeeData) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/cancellation-fees/${id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    accept: "*/*",
                },
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();

        return {
            success: result.success,
            message: result.message,
            data: result.data || result.innerData
        };
    } catch (error) {
        console.error("Error updating cancellation fee:", error);
        return {
            success: false,
            message: "Failed to update cancellation fee",
            data: null
        };
    }
};

export const deleteCancellationFee = async (id: number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/cancellation-fees/${id}`,
            {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || "Failed to delete cancellation fee");
        }
        
        return {
            success: true,
            message: result.message,
        };
    } catch (error) {
        console.error("Error deleting cancellation fee:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete cancellation fee",
        };
    }
}; 