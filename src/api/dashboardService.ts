const generateRandomString = (length: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const fetchExams = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Exam ${generateRandomString(5)}`,
        assigned_to: `assigned to ${generateRandomString(5)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        exam_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        score: (Math.floor(Math.random() * 500) + 50).toString(),
    }));

    return data;
};

export const fetchAdmins = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `${generateRandomString(4)} ${generateRandomString(4)}`,
        role: ["Admin", "Company", "Staff", "User"][Math.floor(Math.random() * 4)],
        permissions: Math.random() < 0.5
            ? ["Admin", "Roles & Permissions"]
            : Math.random() < 0.5
                ? ["Certificates", "Reports"]
                : ["Admin", "Roles & Permissions", "Certificates"],
        status: Math.random() > 0.5 ? "1" : "0",
        image: `https://loremflickr.com/320/240/business?random`,
    }));

    return data;
};


export const fetchCountries = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/v2/countries`,
            {
                headers: {
                    accept: "*/*",
                },
            }
        );
        const result = await response.json();

        if (!result.success) {
            throw new Error("Failed to fetch countries");
        }

        return {
            success: true,
            countries: result.innerData,
            message: result.message,
        };
    } catch (error) {
        console.error("Error fetching countries:", error);
        return {
            success: false,
            countries: [],
            message: error instanceof Error ? error.message : "Failed to fetch countries",
        };
    }
};
