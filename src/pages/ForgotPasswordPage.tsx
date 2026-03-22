import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { ButtonSpinner } from "../components/Spinner";

interface Props {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ForgotPasswordPage({ onSubmit, isLoading, error }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email.trim());
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">SnapSphere</h1>
          <p className="mt-1 text-sm text-gray-500">Reset your password</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {sent && !error ? (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
              <p className="text-sm text-gray-500">
                We've sent a password reset link to{" "}
                <span className="font-medium text-gray-900">{email}</span>
              </p>
              <p className="text-xs text-gray-400">
                Didn't receive it? Check your spam folder or try again.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-full bg-gray-100 p-3">
                  <Mail className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <p className="mb-4 text-center text-sm text-gray-500">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {isLoading ? <ButtonSpinner /> : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to login */}
        <p className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
