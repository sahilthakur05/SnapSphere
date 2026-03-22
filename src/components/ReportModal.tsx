import { useState } from "react";
import { X, Flag } from "lucide-react";

const REPORT_REASONS = [
  "Spam",
  "Nudity or sexual content",
  "Hate speech or symbols",
  "Violence or dangerous organizations",
  "Bullying or harassment",
  "False information",
  "Other",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting: boolean;
}

export function ReportModal({ isOpen, onClose, onSubmit, isSubmitting }: Props) {
  const [selected, setSelected] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-lg sm:max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-red-500" />
            <h2 className="text-lg font-semibold">Report Post</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-500">
            Why are you reporting this post?
          </p>

          <div className="space-y-2">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  selected === reason
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={reason}
                  checked={selected === reason}
                  onChange={() => setSelected(reason)}
                  className="accent-brand-500"
                />
                {reason}
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selected) onSubmit(selected);
              }}
              disabled={!selected || isSubmitting}
              className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isSubmitting ? "Reporting…" : "Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
