import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
// forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

 // ✅ Define Zod Schema for Password Validation
 export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // src/schemas/inventorySchema.ts
export const inventorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  stock: z.number().min(0, "Stock must be 0 or more"),
  price: z.number().min(0, "Price must be 0 or more"),
});

//Customers Schema
export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

//taxation
export const taxRuleSchema = z.object({
  taxRate: z.number().min(0, "Tax rate must be a positive number"),
  region: z.string().min(2, "Region name is required"),
});
