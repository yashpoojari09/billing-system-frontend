"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/utils/api";
import { resetPasswordSchema } from "@/utils/validation";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      // 🔹 Validate before making API call
      const validationResult = resetPasswordSchema.safeParse({ newPassword, confirmPassword });
      if (!validationResult.success) {
        setError("⚠️ " + JSON.stringify(validationResult.error.format()));
        return;
      }


    try {
      const response = await resetPassword(token, { newPassword, confirmPassword });

      if (response.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

 
  return (
    <div className="bg-dark p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full max-w-md">
      <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">Reset Password</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {message && <p className="text-green-500 text-center">{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            aria-invalid={!!error}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            aria-invalid={!!error}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!newPassword || !confirmPassword}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;

