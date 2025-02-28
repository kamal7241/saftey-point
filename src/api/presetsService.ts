import { Country } from "@/types/ui.types";

export const fetchCountries = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1.2/countries?offset=${offset}&limit=${limit}`);
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