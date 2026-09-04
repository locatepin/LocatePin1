import React from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import { AlertTriangle, CheckCircle2, ArrowRight, X } from "lucide-react";

export const AnomaliesBar: React.FC = () => {
  const { anomalies, resolveAnomaly } = useAnalytics();
  const unresolvedAnomalies = anomalies.filter((a) => !a.resolved);

  if (unresolvedAnomalies.length === 0) return null;

  return (
    <div id="anomalies-bar-container" className="space-y-2">
      {unresolvedAnomalies.map((anomaly) => (
        <div
          key={anomaly.id}
          className="p-4 rounded-2xl bg-gradient-to-r from-[#15120d] via-[#1a150e] to-[#0a0a0a] border border-[#c5a059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 mt-0.5 sm:mt-0 flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#c5a059]">
                  {anomaly.type} Influx Detected
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {anomaly.timestamp}
                </span>
              </div>
              <p className="text-xs text-zinc-200 mt-0.5">{anomaly.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => resolveAnomaly(anomaly.id)}
              className="px-3 py-1.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acknowledge</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
