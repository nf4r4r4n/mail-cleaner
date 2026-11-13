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
    <header className="sticky top-0 z-30 bg-primary text-white shadow-elev-2">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6" />
          <span className="font-medium text-lg">Mail Cleaner</span>
          {account.email && (
            <span className="hidden sm:inline text-sm text-white/80 ml-2">{account.email}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Changer de theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Button onClick={onScan} disabled={scanning} loading={scanning} size="sm" variant="secondary" className="!bg-white !text-primary hover:!bg-gray-100">
            {scanning ? "Scan..." : "Scanner"}
          </Button>
          <button
            onClick={onDisconnect}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Deconnecter"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
