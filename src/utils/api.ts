import axios from "axios";
import {Customer, InvoiceRequest} from "@/types/types";
export const API_URL="https://billing-system-lemon.vercel.app/api";

// Get tokens from localStorage
export const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }
  return {}; // Return empty headers during SSR
};
// API instance with interceptor for authentication
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send HTTP-only cookies

});

api.interceptors.request.use(
  (config) => {
    Object.entries(getAuthHeaders()).forEach(([key, value]) => {
      config.headers = config.headers || {};
      config.headers[key] = value as string;
    });
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptor for handling expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        localStorage.setItem("accessToken", res.data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
        return api.request(originalRequest); // ✅ Use `api` instead of `axios`
      } catch (refreshError) {
        console.log("Refresh token expired. Logging out...");
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

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

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email },  { headers: getAuthHeaders() });
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
export const logoutUser = async () => {
  localStorage.removeItem("accessToken"); // No need to remove refresh token
  await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }); // Call backend logout API
  window.location.href = "/auth/login"; // Redirect to login
};


// Inventory api 
// Fetch Inventory Items
export const getInventory = async () => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
    const response = await api.get(`${API_URL}/tenants/${tenantId}/inventory`, { 
      headers: getAuthHeaders(), 
      withCredentials: true // ✅ Ensures cookies (refresh token) are sent
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

// Add New Inventory Item
export const addInventoryItem = async (data: { name: string; stock: number; price: number }) => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
    
    const response = await api.post(`${API_URL}/tenants/${tenantId}/inventory`, data,
       { headers: getAuthHeaders(),    withCredentials: true // ✅ Ensures cookies (refresh token) are sent
       });
    return response.data;
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error;
  }
};

// Update Inventory Item
export const updateInventoryItem = async (id: string, data: { name: string; stock: number; price: number; taxId: string }) => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
    
    const response = await api.put(`${API_URL}/tenants/${tenantId}/inventory/${id}`, data, 
      { headers: getAuthHeaders(),       withCredentials: true // ✅ Ensures cookies (refresh token) are sent
      });
    return response.data;
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw error;
  }
};

// Delete Inventory Item
export const deleteInventoryItem = async (id: string) => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
        const response = await api.delete(`${API_URL}/tenants/${tenantId}/inventory/${id}`,
           { headers: getAuthHeaders(),       withCredentials: true // ✅ Ensures cookies (refresh token) are sent
           });
    return response.data;
  } catch (error) {
    console.error("Error deleting inventory:", error);
    throw error;
  }
};
//customers

// Fetch Customers
export const getCustomers = async () => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    
    if (!tenantId) {
      throw new Error("Tenant ID is missing. Please log in again.");
    }

    const response = await api.get(`${API_URL}/tenants/${tenantId}/customers`, 
      { headers: getAuthHeaders() ,
      withCredentials: true // ✅ Ensures cookies (refresh token) are sent

    });

    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);

    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch customers.");
    } else {
      throw new Error("An unknown error occurred while fetching customers.");
    }
  }
};
export const addCustomer = async (customer: {name:string; email:string; phone:string}) => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    
    if (!tenantId) {
      throw new Error("Tenant ID is missing. Please log in again.");
    }

    const response = await api.post(`${API_URL}/tenants/${tenantId}/customers`, customer,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        withCredentials: true, // ✅ send cookies (for refresh token)
      });

    return response.data; // Return response data
  } catch (error) {
    console.error("Error adding customer:", error);

    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Failed to add customer.");
    } else {
      throw new Error("An unknown error occurred while adding customer.");
    }
  }
};


// Update Customer
export const updateCustomer = async (customerId: string, customer: Customer) => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
  
 const response = await api.put(`${API_URL}/tenants/${tenantId}/customers/${customerId}`, customer,{ 
  headers: { 
    ...getAuthHeaders(), 
    "Content-Type": "application/json" ,
    withCredentials: true // ✅ Ensures cookies (refresh token) are sent

  } });
  return response.data;

};
// // GEt CustomerBYID
// export async function getCustomerById(customerId: string,data: { name: string; email: string }) {
//   try {
//     const tenantId = localStorage.getItem("tenantId"); // Fetch tenantId inside the function

//     const res = await fetch(`${API_URL}/tenants/${tenantId}/customers/${customerId}`);

//     if (!res.ok) {
//       throw new Error(`Failed to fetch customer: ${res.statusText}`);
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Error fetching customer:", error);
//     throw error;
//   }
// }
// Delete Customer
export const deleteCustomer = async (customerId: string) => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
  
  await api.delete(`${API_URL}/tenants/${tenantId}/customers/${customerId}`, { headers: getAuthHeaders() ,
    withCredentials: true // ✅ Ensures cookies (refresh token) are sent

  });
};

// Taxation
export const getTaxRules = async () => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
  
  const response = await api.get(`${API_URL}/tenants/${tenantId}/taxation`, { headers: getAuthHeaders(),
    withCredentials: true // ✅ Ensures cookies (refresh token) are sent

   });
  return response.data;
};

export const createTaxRule = async (data: { taxRate: number; region: string }) => {
  const isValidFloat = (value: number | string): boolean => {
    return !isNaN(Number(value)) && parseFloat(String(value)) === parseFloat(String(value));
  };
  const taxRate = parseFloat(data.taxRate.toString()); // Ensure taxRate is a floating-point number
  if (!isValidFloat(taxRate)) {
    throw new Error("Tax rate must be a valid floating-point number.");
  }
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
  
  const response = await api.post(`${API_URL}/tenants/${tenantId}/taxation`, data, { headers: getAuthHeaders() ,
    withCredentials: true // ✅ Ensures cookies (refresh token) are sent

  });
  return response.data;
};

export const updateTaxRule = async (taxId: string, data: { taxRate: number; region: string }) => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
  
  const response = await api.put(`${API_URL}/tenants/${tenantId}/taxation/${taxId}`, data, { headers: getAuthHeaders(),
    withCredentials: true // ✅ Ensures cookies (refresh token) are sent

   });
  return response.data;
};

export const deleteTaxRule = async (taxId: string) => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");
  
  const response = await api.delete(`${API_URL}/tenants/${tenantId}/taxation/${taxId}`, { headers: getAuthHeaders(),
    withCredentials: true // ✅ Ensures cookies (refresh token) are sent

   });
  return response.data;
};



// export const fetchInvoicePreview = async (formData: any ) => {
//   const tenantId = localStorage.getItem("tenantId");

//   try {
//     const response = await api.post(`${API_URL}/tenants/${tenantId}/invoice/preview`, formData, {
//       headers: {
//         'Content-Type': 'application/json',
//         ...getAuthHeaders()
//       }
//     });
//     return response.data.invoicePreview;
//   } catch (error) {
//     console.error('Error fetching invoice preview:', error);
//     throw error;
//   }
// };

// ✅ Submit invoice
export const createInvoice = async (invoiceData: InvoiceRequest) => {
  try {
    const token = localStorage.getItem("accessToken"); // Ensure authentication
    if (!token) {
      return { success: false, error: "Unauthorized: No token provided" };
    }
    const tenantId = localStorage.getItem("tenantId");

    const response = await api.post(`${API_URL}/tenants/${tenantId}/invoice`, invoiceData, {
      headers: {
        ...getAuthHeaders(),

        "Content-Type": "application/json"
          },
    });

    if (response.status === 201) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.data.error || "Unknown error" };
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      success: false,
      error: axios.isAxiosError(error) && error.response?.data?.error ? error.response.data.error : "Server error",
    };
  }
};


export interface InvoiceListItem {
  id: string;
  receiptNumber: string;
  customerName: string;
  amount: string;
  date: string;

}
export interface FetchInvoicesResponse {
  invoices: InvoiceListItem[];
  total: number;
}



export const fetchInvoices = async (page = 1, pageSize = 10): Promise<FetchInvoicesResponse> => {
  const tenantId = localStorage.getItem('tenantId');
  const res = await api.get(`${API_URL}/tenants/${tenantId}/invoices?page=${page}&limit=${pageSize}`);
  return res.data;
};

export const searchCustomerByEmail = async (search: string) => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) {
      throw new Error("Tenant ID is missing. Please log in again.");
    }

    const response = await api.get(
      `${API_URL}/tenants/${tenantId}/customers?search=${search.trim().toLowerCase()}`,
      {
        headers: getAuthHeaders(), // `getAuthHeaders` should return an object
      }
    );

    return response.data || null; // Ensure it safely accesses `customer`
  } catch (error) {
    console.error("Customer not found, please Add Customer:", error);
    return null;
  }
};

import { TenantSettingsFormData} from '@/utils/validation';



// settings api 
export const fetchTenantSettings = async (): Promise<TenantSettingsFormData | null> => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) {
      throw new Error("Tenant ID is missing. Please log in again.");
    }
    const res = await api.get(`${API_URL}/tenants/${tenantId}/settings`);
    return res.data || null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export const updateTenantSettings = async (data: TenantSettingsFormData) => {
  try {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) {
      throw new Error("Tenant ID is missing. Please log in again.");
    }
  const response =  await api.put(`${API_URL}/tenants/${tenantId}/settings`, data, {
    headers: {
      ...getAuthHeaders(),

      "Content-Type": "application/json"
        },
  });
  if (response.status === 200) {
    return { success: true, data: response.data };
  } else {
    return { success: false, error: response.data.error || "Unknown error" };
  }  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};