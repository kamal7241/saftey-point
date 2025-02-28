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
    return response.data.innerData;  // Return the response data (user and tokens)
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const forget = async (email: string) => {
  // Mock response for forget functionality
  return {
    user: { email },  // Mock user data
    tokens: { access: 'mockAccessToken', refresh: 'mockRefreshToken' },  // Mock tokens
  };
  // ... existing code ...
};


export const verifyOTP = async ({ otp }: { otp: string }) => {
  if (otp === "123456") {
    return {
      user: { email: "mockuser@example.com" }, // Mock user data
      tokens: { access: "mockAccessToken", refresh: "mockRefreshToken" }, // Mock tokens
    };
  } else {
    throw new Error("Invalid OTP try 123456");
  }
};

// Mock of the resetPassword function
export const resetPassword = async (newPassword: string) => {
  // Simulate an API delay (e.g., network latency)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock condition: assume the password must not be "12345678" for success
  if (newPassword === "12345678") {
    throw new Error("Password reset failed: Weak password");
  }

  // Simulate a successful response with mock tokens
  return {
    tokens: {
      access: "mockAccessToken12345",
      refresh: "mockRefreshToken67890",
    },
  };
};
