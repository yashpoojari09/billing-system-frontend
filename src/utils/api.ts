import axios from "axios";
export const API_URL="https://billing-system-lemon.vercel.app/api";

// Get tokens from localStorage
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// API instance with interceptor for authentication
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    Object.entries(getAuthHeaders()).forEach(([key, value]) => {
      config.headers?.set(key, value as string);
    });
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password}, 
      { withCredentials: true } // ✅ Ensures refresh token is stored in cookies
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Please Check your email or Password");
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};
/// Refresh Token
export const refreshAccessToken = async () => {
  try {
    const response = await axios.get("${API_URL}/auth/refresh", { withCredentials: true });
     // ✅ Store the new access token in localStorage
     localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("Error refreshing token", error);
    return null;
  }
};


export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Failed to send forgot password email.");
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

import { z } from "zod";
import { resetPasswordSchema } from "./validation";

// Reste Password
export const resetPassword = async (token:string, input: z.infer<typeof resetPasswordSchema>) => {
  // 🔹 Validate input using Zod
  const parsedInput = resetPasswordSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, message: parsedInput.error.format() };
  }

  try {
    const { data } = await axios.post(`${API_URL}/auth/reset-password`, 
      { token, ...parsedInput.data }, // 🔥 Send token along with the form data
        { headers: { "Content-Type": "application/json" } }
    );

    return { success: true, message: data.message };
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "An unknown error occurred.";
    
    return { success: false, message: errorMessage };
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login"; // Redirect to login page
};

// Inventory api 
// Fetch Inventory Items
export const getInventory = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

// Add New Inventory Item
export const addInventoryItem = async (data: { name: string; stock: number; price: number }) => {
  try {
    const response = await axios.post(`${API_URL}/inventory`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error;
  }
};

// Update Inventory Item
export const updateInventoryItem = async (id: string, data: { name: string; stock: number; price: number }) => {
  try {
    const response = await axios.put(`${API_URL}/inventory/${id}`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw error;
  }
};

// Delete Inventory Item
export const deleteInventoryItem = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/inventory/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error deleting inventory:", error);
    throw error;
  }
};

//customers

// Fetch Customers
export const getCustomers = async () => {
  const response = await axios.get(`${API_URL}/customers`, { headers: getAuthHeaders() });
  return response.data;
};

// Add Customer
export const addCustomer = async (customer: { name: string; email: string }) => {
  await axios.post(`${API_URL}/customers`, customer, { headers: getAuthHeaders() });
};

// Update Customer
export const updateCustomer = async (customerId: string, customer: { name: string; email: string }) => {
  await axios.put(`${API_URL}/customers/${customerId}`, customer, { headers: getAuthHeaders() });
};

// Delete Customer
export const deleteCustomer = async (customerId: string) => {
  await axios.delete(`${API_URL}/customers/${customerId}`, { headers: getAuthHeaders() });
};

// Taxation
export const getTaxRules = async () => {
  const response = await axios.get(`${API_URL}/taxation`, { headers: getAuthHeaders() });
  return response.data;
};

export const createTaxRule = async (data: { taxRate: number; region: string }) => {
  const response = await axios.post(`${API_URL}/taxation`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateTaxRule = async (taxId: string, data: { taxRate: number; region: string }) => {
  const response = await axios.put(`${API_URL}/taxation/${taxId}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteTaxRule = async (taxId: string) => {
  const response = await axios.delete(`${API_URL}/taxation/${taxId}`, { headers: getAuthHeaders() });
  return response.data;
};