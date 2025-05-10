"use client";
import { useRouter } from '@/i18n/routing';
import React from 'react'

interface SomethingWentWrongProps {
    message?: string
}

export const SomethingWentWrong: React.FC<SomethingWentWrongProps> = ({
    message = 'Something went wrong. Please try again later.',
}) => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 text-center">{message}</p>
            <button
                type="button"
                onClick={() => router.back()}
                className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition"
            >
                Go Back
            </button>
        </div>
    );
}

export default SomethingWentWrong
