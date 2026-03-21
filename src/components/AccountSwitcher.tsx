import { useState } from "react";
import { ChevronDown, Plus, Check, LogOut } from "lucide-react";

interface Account {
  id: string;
  username: string;
  avatar: string;
}

interface Props {
  currentAccount: Account;
  savedAccounts: Account[];
  onSwitch: (accountId: string) => void;
  onAddAccount: () => void;
  onLogout: () => void;
}

export function AccountSwitcher({
  currentAccount,
  savedAccounts,
  onSwitch,
  onAddAccount,
  onLogout,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        {currentAccount.username}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-8 z-50 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
            {/* Current account */}
            <div className="px-3 py-1.5">
              <p className="text-xs font-medium text-gray-400 uppercase">Current</p>
            </div>
            <div className="flex items-center gap-3 px-3 py-2">
              {currentAccount.avatar ? (
                <img src={currentAccount.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                  {currentAccount.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="flex-1 text-sm font-semibold text-gray-900">{currentAccount.username}</span>
              <Check className="h-4 w-4 text-brand-500" />
            </div>

            {/* Other accounts */}
            {savedAccounts.length > 0 && (
              <>
                <div className="my-1 border-t border-gray-100" />
                <div className="px-3 py-1.5">
                  <p className="text-xs font-medium text-gray-400 uppercase">Switch to</p>
                </div>
                {savedAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => { onSwitch(acc.id); setIsOpen(false); }}
                    className="flex w-full items-center gap-3 px-3 py-2 hover:bg-gray-50"
                  >
                    {acc.avatar ? (
                      <img src={acc.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                        {acc.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-gray-700">{acc.username}</span>
                  </button>
                ))}
              </>
            )}

            <div className="my-1 border-t border-gray-100" />

            {/* Add account */}
            <button
              onClick={() => { onAddAccount(); setIsOpen(false); }}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-brand-500 hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-brand-300">
                <Plus className="h-4 w-4" />
              </div>
              Add Account
            </button>

            {/* Logout */}
            <button
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center">
                <LogOut className="h-4 w-4" />
              </div>
              Log Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
