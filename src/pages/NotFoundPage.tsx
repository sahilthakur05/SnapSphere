import { Link } from "react-router-dom";
import { Camera, Home, ArrowLeft } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

export function NotFoundPage() {
  usePageTitle("Page Not Found");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <Camera className="h-16 w-16 text-gray-300" />
      <h1 className="mt-6 text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-gray-900">
        Page not found
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-gray-500">
        The page you're looking for doesn't exist or may have been removed.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
      </div>
    </div>
  );
}
