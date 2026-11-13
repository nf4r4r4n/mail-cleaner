import { Moon, Sun, Mail, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import type { Account } from "../../types";

interface HeaderProps {
  account: Account;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onScan: () => void;
  scanning: boolean;
  onDisconnect: () => void;
}

export function Header({ account, theme, onToggleTheme, onScan, scanning, onDisconnect }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-accent" />
          <span className="font-semibold uppercase tracking-[0.2em] text-sm">Mail Cleaner</span>
          {account.email && (
            <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-800 pl-3">
              {account.email}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="h-10 w-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Changer de theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Button onClick={onScan} disabled={scanning} loading={scanning} size="sm">
            {scanning ? "Scan..." : "Scanner"}
          </Button>
          <button
            onClick={onDisconnect}
            className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-status-danger"
            aria-label="Deconnecter"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
