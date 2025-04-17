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