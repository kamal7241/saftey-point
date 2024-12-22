// import axios from 'axios';

// Access the API URL from the environment variable
// const API_URL = process.env.NEXT_PUBLIC_API_URL;


const generateRandomString = (length: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};


export const fetchCompanies = async () => {
    const companies = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Company ${generateRandomString(5)}`,
        location: `Location ${generateRandomString(3)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        branches: Math.floor(Math.random() * 10) + 1,
        employees: Math.floor(Math.random() * 500) + 50,
        created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        image: `https://loremflickr.com/320/240/business?random`,
    }));

    return companies; // Return the generated companies
};