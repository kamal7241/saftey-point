/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Access the API URL from the environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to handle login
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}v1/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Login API Response:', response.data);
    
    // Check if the response indicates success
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Login failed');
    }
    
    console.log('Login successful, returning data:', response.data.innerData);
    return {
      success: true,
      data: response.data.innerData
    };
  } catch (error: any) {
    console.error('Login failed:', error);
    // Check if the error has a response with data
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    // Fallback to generic error message
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const forget = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}v1/auth/forgot-password`,
      { email },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Check if the response indicates success
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to send forgot password request');
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to send forgot password request.');
  }
};

export const verifyOTP = async ({ otp, email }: { otp: string; email: string }) => {
  try {
    const response = await axios.post(
      `${API_URL}v1/auth/verify-otp`,
      { otp, email },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Check if the response indicates success
    if (response.data.success === false) {
      throw new Error(response.data.message || 'OTP verification failed');
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('OTP verification failed.');
  }
};

export const resetPassword = async (newPassword: string, token: string) => {
  if (!token) {
    throw new Error("No OTP token found. Please request a new OTP.");
  }
  try {
    const response = await axios.post(
      `${API_URL}v1/auth/reset-password`,
      { newPassword },
      {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data;
    if (!data.success) {
      throw new Error(data.message || "Failed to reset password");
    }
    return {
      success: data.success,
      message: data.innerData?.message || data.message,
    };
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to reset password");
  }
};
