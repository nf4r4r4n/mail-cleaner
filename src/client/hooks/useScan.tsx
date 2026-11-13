import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type { ScanState } from "../types";

export function useScan() {
  const qc = useQueryClient();
  const [scan, setScan] = useState<ScanState | null>(null);
  const [running, setRunning] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const start = useCallback(async () => {
    setRunning(true);
    setScan({ scanId: "", status: "running", processed: 0, found: 0 });
    try {
      const { scanId } = await api.startScan();
      setScan((s) => (s ? { ...s, scanId } : { scanId, status: "running", processed: 0, found: 0 }));
      const es = new EventSource(`/api/scan/${scanId}/progress`);
      esRef.current = es;
      es.onmessage = (e) => {
        const p = JSON.parse(e.data) as ScanState;
        setScan(p);
        if (p.status === "done" || p.status === "error") {
          es.close();
          esRef.current = null;
          setRunning(false);
          if (p.status === "done") {
            qc.invalidateQueries({ queryKey: ["candidates"] });
            qc.invalidateQueries({ queryKey: ["stats"] });
            qc.invalidateQueries({ queryKey: ["senders"] });
          }
        }
      };
      es.onerror = () => {
        es.close();
        esRef.current = null;
        setRunning(false);
        setScan((s) => (s ? { ...s, status: "error", message: "Connexion perdue" } : s));
      };
    } catch (err: any) {
      setRunning(false);
      setScan({ scanId: "", status: "error", processed: 0, found: 0, message: err?.message });
    }
  }, [qc]);

  const reset = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    setRunning(false);
    setScan(null);
  }, []);

  return { scan, running, start, reset };
}
