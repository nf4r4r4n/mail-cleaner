import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useAccount } from "./hooks/useAccount";
import { useTheme } from "./hooks/useTheme";
import { useScan } from "./hooks/useScan";
import { Header } from "./components/layout/Header";
import { ConnectPage } from "./pages/ConnectPage";
import DashboardPage from "./pages/DashboardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function Shell() {
  const account = useAccount();
  const { theme, toggle } = useTheme();
  const scan = useScan();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("connected")) setMessage(`Connecte : ${p.get("connected")}`);
  }, []);

  if (account.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm uppercase tracking-wide text-gray-500">Chargement...</span>
      </div>
    );
  }

  if (!account.data?.connected) {
    return <ConnectPage message={message} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header
        account={account.data}
        theme={theme}
        onToggleTheme={toggle}
        onScan={scan.start}
        scanning={scan.running}
        onDisconnect={async () => {
          await account.disconnect.mutateAsync();
          queryClient.clear();
        }}
      />
      <DashboardPage scan={scan} />
      <Toaster position="bottom-right" theme={theme} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Shell />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
