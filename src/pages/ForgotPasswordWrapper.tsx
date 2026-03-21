import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { forgotPassword } from "../features/auth/authSlice";
import { ForgotPasswordPage } from "./ForgotPasswordPage";

export function ForgotPasswordWrapper() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (email: string) => {
    setError(null);
    setIsLoading(true);
    const result = await dispatch(forgotPassword(email));
    setIsLoading(false);
    if (!forgotPassword.fulfilled.match(result)) {
      setError(result.payload as string);
    }
  };

  return (
    <ForgotPasswordPage
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
