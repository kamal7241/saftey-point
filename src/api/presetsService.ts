import { Country } from "@/types/ui.types";

export const fetchCountries = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v2/countries?offset=${offset}&limit=${limit}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch countries");
        }

        return {
            countries: result.innerData.map((country: Country) => ({
                code: country.code,
                name: country.name,
                phoneCode: country.phoneCode,
                emoji: country.emoji,
            })),
        };
    } catch (error) {
        console.error("Error fetching countries:", error);
        return { countries: [] };
    }
};

export const fetchCurrencies = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/currency?offset=${offset}&limit=${limit}`
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch currencies");
        }

        return {
            success: result.success,
            message: result.message,
            innerData: {
                count: result.innerData.count,
                currencies: result.innerData.currencies
            }
        };
    } catch (error) {
        console.error("Error fetching currencies:", error);
        return {
            success: false,
            message: "Failed to fetch currencies",
            innerData: {
                count: 0,
                currencies: []
            }
        };
    }
};

export const fetchCurrencyById = async (id: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/currency/${id}`
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch currency");
        }

        return {
            success: result.success,
            message: result.message,
            data: result.innerData.currency
        };
    } catch (error) {
        console.error("Error fetching currency:", error);
        return {
            success: false,
            message: "Failed to fetch currency",
            data: null
        };
    }
};

export const createCurrency = async (currencyData: {
    name: string;
    exchangeRate: number;
    symbol: string;
    code: string;
    isActive: boolean;
}) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/currency`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currencyData),
            }
        );
        const result = await response.json();

        return {
            success: result.success,
            message: result.message,
            data: result.data
        };
    } catch (error) {
        console.error("Error creating currency:", error);
        return {
            success: false,
            message: "Failed to create currency",
            data: null
        };
    }
};

export const deleteCurrency = async (id: number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/currency/${id}`,
            {
                method: 'DELETE',
            }
        );
        const result = await response.json();
        return {
            success: result.success,
            message: result.message,
        };
    } catch (error) {
        console.error("Error deleting currency:", error);
        return {
            success: false,
            message: "Failed to delete currency",
        };
    }
};


export const fetchExams = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/exams?offset=${offset}&limit=${limit}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch exams");
        }

        return {
            success: result.success,
            message: result.message,
            innerData: {
                count: result.innerData?.count || 0,
                items: Array.isArray(result.innerData?.items) 
                    ? result.innerData.items 
                    : [result.innerData?.items].filter(Boolean)
            }
        };
    } catch (error) {
        console.error("Error fetching items:", error);
        return {
            success: false,
            message: "Failed to fetch items",
            innerData: {
                count: 0,
                items: []
            }
        };
    }
};

export const fetchFacilities = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/facility?offset=${offset}&limit=${limit}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch facilities");
        }

        return {
            success: result.success,
            message: result.message,
            innerData: {
                count: result.innerData?.count || 0,
                facilities: Array.isArray(result.innerData?.facilities) 
                    ? result.innerData.facilities 
                    : [result.innerData?.facilities].filter(Boolean)
            }
        };
    } catch (error) {
        console.error("Error fetching facilities:", error);
        return {
            success: false,
            message: "Failed to fetch facilities",
            innerData: {
                count: 0,
                facilities: []
            }
        };
    }
};

export const fetchFacilityById = async (id: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/facility/${id}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch facility");
        }

        return {
            success: result.success,
            message: result.message,
            data: result.innerData.facility
        };
    } catch (error) {
        console.error("Error fetching facility:", error);
        return {
            success: false,
            message: "Failed to fetch facility",
            data: null
        };
    }
};


interface FacilityData {
  title: string;
  titleArabic?: string;
  description: string;
  imageUrl?: string;
}

export const createFacility = async (data: FacilityData) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/facility`,
            {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();

        if (!result.success) {
            // Attempt to extract a more specific error message if available
            const errorMessage = result.message || (result.innerData && result.innerData.message) || "Failed to create facility";
            throw new Error(errorMessage);
        }

        return {
            success: result.success,
            message: result.message || "Facility created successfully",
            data: result.innerData?.facility || null
        };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating facility:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
            data: null
        };
    }
};

export const updateFacility = async (
    id: number,
    values: FacilityData,
    currentData: FacilityData
) => {
    console.log("Updating facility:", currentData);
    console.log("Updating facility values:", values);
    const apiData: Partial<FacilityData> = {};

    // Compare fields and add to apiData if changed
    if (values.title !== currentData.title) {
        apiData.title = values.title;
    }
    if (values.titleArabic && values.titleArabic !== currentData.titleArabic) {
        apiData.titleArabic = values.titleArabic;
    }
    if (values.description !== currentData.description) {
        apiData.description = values.description;
    }
    // Compare imageUrl, handling potential null/undefined values
    if (values.imageUrl !== currentData.imageUrl) {
         // Ensure you handle the case where one is null/undefined and the other is an empty string if necessary
        apiData.imageUrl = values.imageUrl;
    }

    // Corrected condition: Check if apiData is EMPTY
    if (Object.keys(apiData).length === 0) {
        console.log("No changes detected in facility data, skipping update.");
        return {
            success: false,
            message: "No changes detected.",
            data: { facility: currentData } // Return current data as no update occurred
        };
    }

    // If we reach here, it means there are changes in apiData
    console.log("Changes detected, proceeding with update:", apiData);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/facility/${id}`,
            {
                method: "PATCH",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiData), // Send only the changed data
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            const errorMessage = result.message || (result.innerData && result.innerData.message) || "Failed to update facility";
            throw new Error(errorMessage);
        }

        // Return the structure based on the provided successful response example
        return {
            success: result.success,
            message: result.message || "Facility updated successfully",
            data: result.innerData || null // Use innerData directly as it contains the facility object
        };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating facility:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
            data: null
        };
    }
};

export const deleteFacility = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/facility/${id}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*", // Standard accept header
            },
        });

        // Try to parse JSON regardless of status code, as error details might be in the body
        let result;
        try {
            result = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            // Handle cases where response is not JSON (e.g., 204 No Content)
            result = { success: response.ok, message: response.statusText };
        }


        if (!response.ok) { // Checks for 2xx status codes
             // Attempt to extract a more specific error message if available
            const errorMessage = result?.message || (result?.innerData && result.innerData.message) || `Failed to delete facility (Status: ${response.status})`;
            throw new Error(errorMessage);
        }

        // Return a consistent success response structure
        return {
            success: result?.success ?? true, // Default to true if success field is missing but status is ok
            message: result?.message || "Facility deleted successfully",
            data: result // Return the full result if needed
         };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error deleting facility:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred while deleting the facility.",
            data: null
        };
    }
};

export const fetchPromoCodes = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/promo-codes?offset=${offset}&limit=${limit}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch promo codes");
        }

        return {
            success: result.success,
            message: result.message,
            innerData: {
                total: result.innerData?.total || 0,
                items: Array.isArray(result.innerData?.items) 
                    ? result.innerData.items 
                    : [result.innerData?.items].filter(Boolean)
            }
        };
    } catch (error) {
        console.error("Error fetching promo codes:", error);
        return {
            success: false,
            message: "Failed to fetch promo codes",
            innerData: {
                total: 0,
                items: []
            }
        };
    }
};