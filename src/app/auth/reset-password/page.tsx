"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/utils/api";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage = () => {
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
      } catch (err) {
        setError("An unexpected error occurred.");
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isValidToken === null) return <p className="text-center">Loading...</p>;
  if (!isValidToken) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
