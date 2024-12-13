import axios from 'axios';

// Access the API URL from the environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to handle login
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}v1/auth/login`,  // Note that `API_URL` will be combined with the endpoint
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
    return response.data;  // Return the response data (user and tokens)
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed. Please check your credentials.');
  }
};
