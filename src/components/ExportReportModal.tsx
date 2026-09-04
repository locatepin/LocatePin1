import React, { useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Code,
  X,
  CheckCircle2,
  Sparkles,
  Calendar,
} from "lucide-react";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeVisitors,
    totalVisitorsToday,
    pageviewsToday,
    conversionRate,
    revenueToday,
    bounceRate,
    topPages,
    channels,
    selectedWebsite,
    timeRange,
  } = useAnalytics();

  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "pdf">("csv");
  const [includeAIInsights, setIncludeAIInsights] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      let fileData: string;
      let filename: string;
      let mimeType: string;

      if (exportFormat === "csv") {
        const headers = "Path,Visitors,ConversionRate,BounceRate,Trend\n";
        const rows = topPages
          .map((p) => `"${p.path}",${p.visitors},${p.conversionRate}%,${p.bounceRate}%,+${p.trend}%`)
          .join("\n");
        fileData = `Website: ${selectedWebsite}\nGenerated: ${new Date().toISOString()}\nTotal Visitors Today: ${totalVisitorsToday}\nConversion Rate: ${conversionRate}%\nRevenue: $${revenueToday}\n\n` + headers + rows;
        filename = `trafficpulse_${selectedWebsite.replace(/[^a-z0-9]/gi, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
        mimeType = "text/csv;charset=utf-8;";
      } else if (exportFormat === "json") {
        const payload = {
          website: selectedWebsite,
          generatedAt: new Date().toISOString(),
          timeRange,
          summary: {
            activeVisitors,
            totalVisitorsToday,
            pageviewsToday,
            conversionRate,
            revenueToday,
            bounceRate,
          },
          topPages,
          channels,
          aiInsightsIncluded: includeAIInsights,
        };
        fileData = JSON.stringify(payload, null, 2);
        filename = `trafficpulse_${selectedWebsite.replace(/[^a-z0-9]/gi, "_")}_${new Date().toISOString().slice(0, 10)}.json`;
        mimeType = "application/json;charset=utf-8;";
      } else {
        // PDF Simulation text export
        fileData = `TrafficPulse AI Executive Intelligence Report\nWebsite: ${selectedWebsite}\nDate: ${new Date().toLocaleDateString()}\n\nSummary:\n- Total Visitors: ${totalVisitorsToday}\n- Conversion Rate: ${conversionRate}%\n- Revenue Today: $${revenueToday}\n- Active Concurrent: ${activeVisitors}\n\nTop Channels:\n` +
          channels.map((c) => `- ${c.channel}: ${c.visitors} visitors (${c.percentage}%), $${c.revenue} rev`).join("\n");
        filename = `trafficpulse_executive_report_${new Date().toISOString().slice(0, 10)}.txt`;
        mimeType = "text/plain;charset=utf-8;";
      }

      const blob = new Blob([fileData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-zinc-950 px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif italic text-lg text-white">
                Export Intelligence Report
              </h3>
              <p className="text-xs text-zinc-500">
                {selectedWebsite} &bull; {timeRange}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Format Selection */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-2">
              Select Output Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat("csv")}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  exportFormat === "csv"
                    ? "bg-zinc-900 border-[#c5a059] text-[#c5a059] shadow-sm"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 mx-auto mb-1.5" />
                <span className="text-xs font-semibold block">CSV (Excel)</span>
                <span className="text-[10px] text-zinc-500">Full Raw Data</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("json")}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  exportFormat === "json"
                    ? "bg-zinc-900 border-[#c5a059] text-[#c5a059] shadow-sm"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                <Code className="w-5 h-5 mx-auto mb-1.5" />
                <span className="text-xs font-semibold block">JSON Payload</span>
                <span className="text-[10px] text-zinc-500">API Pipeline</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("pdf")}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  exportFormat === "pdf"
                    ? "bg-zinc-900 border-[#c5a059] text-[#c5a059] shadow-sm"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1.5" />
                <span className="text-xs font-semibold block">Executive Summary</span>
                <span className="text-[10px] text-zinc-500">Board Deck Ready</span>
              </button>
            </div>
          </div>

          {/* AI Insights Checkbox */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAIInsights}
                onChange={(e) => setIncludeAIInsights(e.target.checked)}
                className="rounded accent-[#c5a059] bg-zinc-900 border-zinc-700"
              />
              <div>
                <span className="text-xs font-semibold text-zinc-200 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  Include AI Anomaly & Growth Opportunity Recommendations
                </span>
                <span className="text-[11px] text-zinc-500 block mt-0.5">
                  Embeds revenue projection models and SEO keyword clusters in the report
                </span>
              </div>
            </label>
          </div>

          {/* Summary Preview */}
          <div className="text-xs text-zinc-400 space-y-1 bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono">
            <div className="flex justify-between">
              <span>Concurrent Users:</span>
              <strong className="text-white">{activeVisitors}</strong>
            </div>
            <div className="flex justify-between">
              <span>Today's Total Traffic:</span>
              <strong className="text-white">{totalVisitorsToday.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Revenue Capture:</span>
              <strong className="text-emerald-400">${revenueToday.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-950 px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent hover:bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black text-xs font-semibold shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <span>Compiling {exportFormat.toUpperCase()}...</span>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Report ({exportFormat.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
