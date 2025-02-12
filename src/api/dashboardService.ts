// import axios from 'axios';

import { SingleCourse } from "@/types/ui.types";

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
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Company ${generateRandomString(5)}`,
        location: `Location ${generateRandomString(3)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        branches: Math.floor(Math.random() * 10) + 1,
        employees: Math.floor(Math.random() * 500) + 50,
        created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        image: `https://loremflickr.com/320/240/business?random`,
    }));

    return data;
};


export const fetchUsers = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `User ${generateRandomString(5)}`,
        email: `email${generateRandomString(3)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        type: ["Individuals", "Company"][Math.floor(Math.random() * 2)],
        phone: (Math.floor(Math.random() * 500) + 50).toString(),
        image: `https://loremflickr.com/320/240/business?random`,
    }));

    return data;
};
export const fetchCourses = async (): Promise<SingleCourse[]> => {
    const generateRandomString = (length: number) =>
        Math.random().toString(36).substring(2, 2 + length);

    const data: SingleCourse[] = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Course ${generateRandomString(5)}`,
        language: ["English", "Spanish", "French", "German"][Math.floor(Math.random() * 4)],
        enrollments: Math.floor(Math.random() * 500) + 1,
        sessions: Math.floor(Math.random() * 20) + 1,
        level: Math.floor(Math.random() * 5) + 1, // Level 1-5
        status: Math.random() > 0.5 ? "1" : "0",
        image: `https://loremflickr.com/320/240/education?random=${index + 1}`,
    }));

    return data;
};


export const fetchStaffManagement = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `User ${generateRandomString(5)}`,
        email: `email${generateRandomString(3)}`,
        phone: (Math.floor(Math.random() * 500) + 50).toString(),
        status: Math.random() > 0.5 ? "1" : "0",
        role: ["Admin", "Company", "Staff", "User"][Math.floor(Math.random() * 4)],
        image: `https://loremflickr.com/320/240/business?random`,
    }));

    return data;
};

export const fetchCertificates = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `User ${generateRandomString(5)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        issue_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        expiry_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }));

    return data;
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

export const fetchBranches = async () => {
    const data = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Branch ${generateRandomString(5)}`,
        location_map: `Location ${generateRandomString(3)}`,
        address: `address ${generateRandomString(3)}`,
        location_name: `Location ${generateRandomString(3)}`,
        status: Math.random() > 0.5 ? "1" : "0",
        branches: Math.floor(Math.random() * 10) + 1,
        employees: Math.floor(Math.random() * 500) + 50,
        created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
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