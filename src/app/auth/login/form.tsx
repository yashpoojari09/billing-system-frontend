"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/utils/validation";
import { loginUser } from "@/utils/api";
import Input from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter


interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [error, setError] = useState("");
  const router = useRouter(); 
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      const response = await loginUser(data.email, data.password);
        // ✅ Store only the access token in localStorage
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("tenantId", response.user.tenantId);

    const tenantId = localStorage.getItem("tenantId") || "default-tenant";


      console.log("Login Successful:");
          // ✅ Redirect to Customers page
          router.push(`/tenants/${tenantId}/customers`);
        } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Access message safely
      } else {
        setError("An unknown error occurred."); // Fallback for non-Error types
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      
      <Input label="Email" {...register("email")} type="email" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      
      <Input label="Password" {...register("password")} type="password" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      
      <Button type="submit">Login</Button>
      
      <div className="text-sm text-white text-center mt-2">
        <a href="/auth/forgot-password" className="text-blue-500  hover:text-blue-700 transition duration-300">Forgot Password?</a>
      </div>
    </form>
  );
};

export default LoginForm;
