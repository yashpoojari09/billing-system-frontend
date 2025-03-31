"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/utils/validation"; // Ensure this validates the email
import { forgotPassword } from "@/utils/api";
import { useState } from "react";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [message, setMessage] = useState("");  // Success message state
  const [errorMessage, setErrorMessage] = useState("");  // Error message state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema), // Use Zod schema to validate email
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    try {
      // Call API to send password reset link to the provided email
      await forgotPassword(data.email);
      
      // Show success message
      setMessage("A password reset link has been sent to your email.");
      setErrorMessage(""); // Clear any previous errors
    } catch {
      // Handle error and show message
      setErrorMessage("Failed to send reset link. Please try again.");
      setMessage(""); // Clear success message
    }
  };

  return (

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         {message && <p className="text-green-500 text-center">{message}</p>}

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <Input
          label="Email"
          {...register("email")}  // Register email field
          error={errors.email?.message}  // Show validation error if any
        />
      <Button type="submit">Send Reset Link</Button>
        
        <p className="text-white text-center mt-2">
          <a href="/auth/login" className="underline text-blue-300">Back to Login</a>
        </p>
      </form>
  );
};

export default ForgotPasswordForm;
