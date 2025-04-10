"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/utils/api";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Token is missing.");
        setIsValidToken(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/reset-password?token=${token}`);
        const data = await response.json();

        if (response.ok && data.message === "Valid token.") {
          setIsValidToken(true);
        } else {
          setError("Invalid or expired token.");
          setIsValidToken(false);
        }
      } catch {
        setError("An unexpected error occurred.");
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isValidToken === null) return <p className="text-center text-lg">Loading...</p>;
  if (!isValidToken) return <p className="text-red-500 text-center text-lg">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary px-4">
      <div className="bg-dark p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">
          Reset Your Password
        </h2>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};

// Wrap in Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center text-lg">Loading...</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
