import { Country } from "@/types/ui.types";

interface CountryResponse {
  success: boolean;
  message: string;
  innerData: {
    count?: number;
    countries?: Country[];
    country?: Country;
  };
}

interface PaginatedResponse {
  success: boolean;
  countries: Country[];
  total: number;
  message: string;
}

interface SingleCountryResponse {
  success: boolean;
  message: string;
  data: Country | null;
}

/**
 * Fetch all countries with pagination
 */
export const fetchCountries = async (offset: number = 0, limit: number = 10): Promise<PaginatedResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/countries?offset=${offset}&limit=${limit}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    const result: CountryResponse = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch countries");
    }

    return {
      success: true,
      countries: result.innerData.countries || [],
      total: result.innerData.count || 0,
      message: result.message,
    };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return {
      success: false,
      countries: [],
      total: 0,
      message: error instanceof Error ? error.message : "Failed to fetch countries",
    };
  }
};

/**
 * Fetch a single country by code
 */
export const fetchCountryByCode = async (code: string): Promise<SingleCountryResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/countries/${code}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    const result: CountryResponse = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch country");
    }

    return {
      success: true,
      message: result.message,
      data: result.innerData.country || null,
    };
  } catch (error) {
    console.error("Error fetching country:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch country",
      data: null,
    };
  }
};

/**
 * Fetch a single country by ID
 */
export const fetchCountryById = async (code: string | number): Promise<SingleCountryResponse> => {
  return fetchCountryByCode(code.toString());
};

/**
 * Create a new country
 */
export const createCountry = async (data: Omit<Country, "id">): Promise<SingleCountryResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/countries`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result: CountryResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create country");
    }

    return {
      success: true,
      message: result.message,
      data: result.innerData.country || null,
    };
  } catch (error) {
    console.error("Error creating country:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create country",
      data: null,
    };
  }
};

/**
 * Update an existing country
 */
export const updateCountry = async (
  id: number,
  data: Partial<Omit<Country, "id">>
): Promise<SingleCountryResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/countries/${id}`,
      {
        method: "PATCH",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result: CountryResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update country");
    }

    return {
      success: true,
      message: result.message,
      data: result.innerData.country || null,
    };
  } catch (error) {
    console.error("Error updating country:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update country",
      data: null,
    };
  }
};

/**
 * Delete a country
 */
export const deleteCountry = async (id: number): Promise<SingleCountryResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/countries/${id}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
        },
      }
    );
    const result: CountryResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete country");
    }

    return {
      success: true,
      message: result.message,
      data: null,
    };
  } catch (error) {
    console.error("Error deleting country:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete country",
      data: null,
    };
  }
};

/**
 * Toggle country active status
 */
export const toggleCountryStatus = async (
  id: number,
  isActive: boolean
): Promise<SingleCountryResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/countries/${id}`,
      {
        method: "PATCH",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      }
    );
    const result: CountryResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update country status");
    }

    return {
      success: true,
      message: result.message,
      data: result.innerData.country || null,
    };
  } catch (error) {
    console.error("Error updating country status:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update country status",
      data: null,
    };
  }
};

export const fetchAllCountries = async (): Promise<PaginatedResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/v2/countries?limit=1000`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    const result: CountryResponse = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch countries");
    }

    return {
      success: true,
      countries: result.innerData.countries || [],
      total: result.innerData.count || 0,
      message: result.message,
    };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return {
      success: false,
      countries: [],
      total: 0,
      message: error instanceof Error ? error.message : "Failed to fetch countries",
    };
  }
}; 