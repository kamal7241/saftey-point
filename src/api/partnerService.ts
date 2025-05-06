/* eslint-disable @typescript-eslint/no-explicit-any */

export const fetchPartnerById = async (id: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/partner/${id}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch partner");
        }

        return {
            success: result.success,
            message: result.message,
            data: result.innerData.partner
        };
    } catch (error) {
        console.error("Error fetching partner:", error);
        return {
            success: false,
            message: "Failed to fetch partner",
            data: null
        };
    }
};

export const deletePartner = async (id: number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/partner/${id}`,
            {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || "Failed to delete partner");
        }
        return {
            success: true,
            message: result.message,
        };
    } catch (error) {
        console.error("Error deleting partner:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete partner",
        };
    }
};


export const createPartner = async (data: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/partner`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "*/*" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updatePartner = async (id: number, data: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/partner/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", accept: "*/*" },
    body: JSON.stringify(data),
  });
  return response.json();
};



export const fetchPartners = async (offset: number = 0, limit: number = 10) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v1/partner?offset=${offset}&limit=${limit}`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch partners");
        }

        return {
            success: result.success,
            message: result.message,
            innerData: {
                count: result.innerData?.count || 0,
                partners: Array.isArray(result.innerData?.partners) 
                    ? result.innerData.partners 
                    : [result.innerData?.partners].filter(Boolean)
            }
        };
    } catch (error) {
        console.error("Error fetching partners:", error);
        return {
            success: false,
            message: "Failed to fetch partners",
            innerData: {
                count: 0,
                partners: []
            }
        };
    }
};
