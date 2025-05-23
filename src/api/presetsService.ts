/* eslint-disable @typescript-eslint/no-explicit-any */

export const fetchCountries = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v2/countries?offset=${offset}&limit=${limit}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch countries");
        }

        return {
            success: true,
            countries: result.innerData.countries,
            total: result.innerData.count,
            message: result.message,
        };
    } catch (error) {
        console.error("Error fetching countries:", error);
        return { countries: [] };
    }
};

export const fetchCountryByCode = async (id: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v2/countries/${id}`
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch country");
        }

        return {
            success: result.success,
            message: result.message,
            data: result.innerData.country
        };
    } catch (error) {
        console.error("Error fetching country:", error);
        return {
            success: false,
            message: "Failed to fetch country",
            data: null
        };
    }
};
interface CountryData {
    name: string;
    code: string;
    phoneCode: string;
    emoji?: string;
}

export const createCountry = async (data: CountryData) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v2/countries`,
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
            const errorMessage = result.message || "Failed to create country";
            throw new Error(errorMessage);
        }

        return {
            success: result.success,
            message: result.message || "Country created successfully",
            data: result.innerData
        };
    } catch (error: any) {
        console.error("Error creating country:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
            data: null
        };
    }
};

export const updateCountry = async (
    id: number,
    data: Partial<CountryData>
) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v2/countries/${id}`,
            {
                method: "PATCH",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            const errorMessage = result.message || "Failed to update country";
            throw new Error(errorMessage);
        }

        return {
            success: result.success,
            message: result.message || "Country updated successfully",
            data: result.innerData
        };
    } catch (error: any) {
        console.error("Error updating country:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
            data: null
        };
    }
};
export const toggleCountryStatus = async (id: number, isActive: boolean) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v2/countries/${id}`,
            {
                method: "PATCH",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isActive:isActive }),
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            const errorMessage = result.message || "Failed to update country status";
            throw new Error(errorMessage);
        }

        return {
            success: result.success,
            message: result.message || "Country status updated successfully",
            data: result.innerData
        };
    } catch (error: any) {
        console.error("Error updating country status:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
            data: null
        };
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
    const apiData: Partial<FacilityData> = {};
    if (values.title !== currentData.title) {
        apiData.title = values.title;
    }
    if (values.titleArabic && values.titleArabic !== currentData.titleArabic) {
        apiData.titleArabic = values.titleArabic;
    }
    if (values.description !== currentData.description) {
        apiData.description = values.description;
    }
    if (values.imageUrl !== currentData.imageUrl) {
        apiData.imageUrl = values.imageUrl;
    }

    if (Object.keys(apiData).length === 0) {
        console.log("No changes detected in facility data, skipping update.");
        return {
            success: false,
            message: "No changes detected.",
            data: { facility: currentData }
        };
    }

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

export const fetchPromoByCode = async (code: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/promo-codes/${code}`, {
            headers: {
                accept: "*/*",
            },
        });
        const result = await response.json();
        // if (!result.success) {
        //     throw new Error(result.message || "Failed to fetch promo code");
        // }
        return result;
    } catch (error: any) {
        console.error("Error fetching promo code by code:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch promo code",
            innerData: null
        };
    }
};

export const updatePromoCode = async (code: string, promoData: any) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/promo-codes/${code}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                accept: "*/*",
            },
            body: JSON.stringify(promoData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update promo code. Status: ${response.status}`);
        }

        // If response has no body, just return a generic success
        return {
            success: true,
            message: "Promo code updated successfully",
            innerData: null,
        };
    } catch (error: any) {
        console.error("Error updating promo code:", error);
        return {
            success: false,
            message: error.message || "Failed to update promo code",
            innerData: null,
        };
    }
};


export const addPromoCode = async (promoData: any) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/promo-codes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "*/*",
            },
            body: JSON.stringify(promoData),
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || "Failed to add promo code");
        }
        return result;
    } catch (error: any) {
        console.error("Error adding promo code:", error);
        return {
            success: false,
            message: error.message || "Failed to add promo code",
            innerData: null
        };
    }
};

export const deletePromoCode = async (id: number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/promo-codes/${id}`,
            {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || "Failed to delete promo-codes");
        }
        return {
            success: true,
            message: result.message,
        };
    } catch (error) {
        console.error("Error deleting promo-codes:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete promo-codes",
        };
    }
};