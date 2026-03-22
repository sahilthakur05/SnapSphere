import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { ButtonSpinner } from "./Spinner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isSubmitting: boolean;
  error?: string | null;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  error,
}: Props) {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const canDelete = confirmText === "DELETE" && password.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-600">Delete Account</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm text-red-700 font-medium">
              This action is permanent and cannot be undone.
            </p>
            <p className="mt-1 text-xs text-red-600">
              All your posts, comments, likes, and followers will be permanently deleted.
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Confirm text */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="DELETE"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Enter your password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="Your password"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => canDelete && onConfirm(password)}
              disabled={!canDelete || isSubmitting}
              className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? <ButtonSpinner /> : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
