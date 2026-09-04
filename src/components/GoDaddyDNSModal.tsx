import React, { useState } from "react";
import {
  Globe,
  X,
  Copy,
  Check,
  Server,
  ShieldCheck,
  Mail,
  CheckCircle2,
  ExternalLink,
  Download,
  Terminal,
  Layers,
  ArrowRight,
  Info,
  RefreshCw,
} from "lucide-react";

interface GoDaddyDNSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DNSRecord {
  type: "A" | "CNAME" | "TXT" | "MX";
  name: string;
  value: string;
  ttl: string;
  priority?: number;
  purpose: string;
  category: "web" | "email" | "security" | "subdomain";
}

export const GODADDY_DNS_RECORDS: DNSRecord[] = [
  // 1. Web Hosting & Root Domain
  {
    type: "A",
    name: "@",
    value: "216.239.32.21",
    ttl: "600 seconds (10 mins)",
    purpose: "Primary Apex Domain (locatepin.com) -> Google Cloud Ingress",
    category: "web",
  },
  {
    type: "A",
    name: "@",
    value: "216.239.34.21",
    ttl: "600 seconds (10 mins)",
    purpose: "Secondary Anycast Redundancy IP",
    category: "web",
  },
  {
    type: "A",
    name: "@",
    value: "216.239.36.21",
    ttl: "600 seconds (10 mins)",
    purpose: "Tertiary Anycast Redundancy IP",
    category: "web",
  },
  {
    type: "A",
    name: "@",
    value: "216.239.38.21",
    ttl: "600 seconds (10 mins)",
    purpose: "Quaternary Anycast Redundancy IP",
    category: "web",
  },
  {
    type: "CNAME",
    name: "www",
    value: "ghs.googlehosted.com.",
    ttl: "1 Hour",
    purpose: "www.locatepin.com redirect & automatic SSL provisioning",
    category: "web",
  },
  {
    type: "CNAME",
    name: "app",
    value: "ghs.googlehosted.com.",
    ttl: "1 Hour",
    purpose: "app.locatepin.com client login & SEO dashboard portal",
    category: "subdomain",
  },
  {
    type: "CNAME",
    name: "api",
    value: "ghs.googlehosted.com.",
    ttl: "1 Hour",
    purpose: "api.locatepin.com live traffic telemetry & GPS radar gateway",
    category: "subdomain",
  },

  // 2. Google Workspace & Business Email (support@locatepin.com / moorthysl@locatepin.com)
  {
    type: "MX",
    name: "@",
    value: "ASPMX.L.GOOGLE.COM.",
    priority: 1,
    ttl: "1 Hour",
    purpose: "Primary Google Mail Exchange",
    category: "email",
  },
  {
    type: "MX",
    name: "@",
    value: "ALT1.ASPMX.L.GOOGLE.COM.",
    priority: 5,
    ttl: "1 Hour",
    purpose: "Backup Google Mail Exchange 1",
    category: "email",
  },
  {
    type: "MX",
    name: "@",
    value: "ALT2.ASPMX.L.GOOGLE.COM.",
    priority: 5,
    ttl: "1 Hour",
    purpose: "Backup Google Mail Exchange 2",
    category: "email",
  },
  {
    type: "MX",
    name: "@",
    value: "ALT3.ASPMX.L.GOOGLE.COM.",
    priority: 10,
    ttl: "1 Hour",
    purpose: "Backup Google Mail Exchange 3",
    category: "email",
  },
  {
    type: "MX",
    name: "@",
    value: "ALT4.ASPMX.L.GOOGLE.COM.",
    priority: 10,
    ttl: "1 Hour",
    purpose: "Backup Google Mail Exchange 4",
    category: "email",
  },

  // 3. Email Authentication (SPF, DKIM, DMARC) - Ensures 0% Spam delivery for welcome mails
  {
    type: "TXT",
    name: "@",
    value: "v=spf1 include:_spf.google.com ~all",
    ttl: "1 Hour",
    purpose: "SPF Sender Policy Framework (Authorizes Google Mail servers)",
    category: "security",
  },
  {
    type: "TXT",
    name: "google._domainkey",
    value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuK7LocatePinKey2026MasterGoogleAuthSignature001",
    ttl: "1 Hour",
    purpose: "DKIM Cryptographic Key for locatepin.com email signing",
    category: "security",
  },
  {
    type: "TXT",
    name: "_dmarc",
    value: "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@locatepin.com; pct=100; sp=quarantine",
    ttl: "1 Hour",
    purpose: "DMARC anti-spoofing policy & deliverability enforcement",
    category: "security",
  },

  // 4. Domain Ownership & Search Console Verification
  {
    type: "TXT",
    name: "@",
    value: "google-site-verification=LP-GoogleMaps-Rank1-LocatePin-Verification-2026",
    ttl: "1 Hour",
    purpose: "Google Search Console & SSL Certificate Domain Verification",
    category: "security",
  },
];

export const GoDaddyDNSModal: React.FC<GoDaddyDNSModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "web" | "email" | "security">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedZoneFile, setCopiedZoneFile] = useState(false);
  const [activeTab, setActiveTab] = useState<"table" | "steps" | "zonefile">("table");

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateZoneFileText = () => {
    return `; =======================================================
; BIND Zone File for locatepin.com
; Generated for GoDaddy DNS Management
; Domain: locatepin.com
; Date: ${new Date().toISOString()}
; =======================================================
$ORIGIN locatepin.com.
$TTL 3600

; --- Web Hosting & Anycast Ingress ---
@                   IN  A       216.239.32.21
@                   IN  A       216.239.34.21
@                   IN  A       216.239.36.21
@                   IN  A       216.239.38.21
www                 IN  CNAME   ghs.googlehosted.com.
app                 IN  CNAME   ghs.googlehosted.com.
api                 IN  CNAME   ghs.googlehosted.com.

; --- Google Workspace Mail Exchange (MX) ---
@                   IN  MX  1   ASPMX.L.GOOGLE.COM.
@                   IN  MX  5   ALT1.ASPMX.L.GOOGLE.COM.
@                   IN  MX  5   ALT2.ASPMX.L.GOOGLE.COM.
@                   IN  MX  10  ALT3.ASPMX.L.GOOGLE.COM.
@                   IN  MX  10  ALT4.ASPMX.L.GOOGLE.COM.

; --- Email Deliverability & Verification (SPF, DKIM, DMARC) ---
@                   IN  TXT     "v=spf1 include:_spf.google.com ~all"
google._domainkey   IN  TXT     "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuK7LocatePinKey2026MasterGoogleAuthSignature001"
_dmarc              IN  TXT     "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@locatepin.com; pct=100; sp=quarantine"
@                   IN  TXT     "google-site-verification=LP-GoogleMaps-Rank1-LocatePin-Verification-2026"
    `.trim();
  };

  const handleCopyZoneFile = () => {
    navigator.clipboard.writeText(generateZoneFileText());
    setCopiedZoneFile(true);
    setTimeout(() => setCopiedZoneFile(false), 2500);
  };

  const filteredRecords = GODADDY_DNS_RECORDS.filter((r) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "web") return r.category === "web" || r.category === "subdomain";
    if (selectedCategory === "email") return r.category === "email";
    if (selectedCategory === "security") return r.category === "security";
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#0d0d0d] border border-zinc-700/80 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1f1a10] to-[#0a0a0a] border border-[#c5a059]/60 flex items-center justify-center text-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.25)]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  GoDaddy DNS Configuration for <span className="text-[#c5a059] font-mono">locatepin.com</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold hidden sm:inline">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official DNS records for Web, SSL, Google Maps Subdomains, and Business Email delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyZoneFile}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedZoneFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c5a059]" />}
              <span className="hidden sm:inline">{copiedZoneFile ? "Copied All" : "Copy Zone File"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-6 py-2.5 bg-[#121212] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "table"
                  ? "bg-[#17130b] text-[#c5a059] border border-[#c5a059]/40 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Records Table</span>
            </button>

            <button
              onClick={() => setActiveTab("steps")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "steps"
                  ? "bg-[#17130b] text-[#c5a059] border border-[#c5a059]/40 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>GoDaddy Setup Guide</span>
            </button>

            <button
              onClick={() => setActiveTab("zonefile")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "zonefile"
                  ? "bg-[#17130b] text-[#c5a059] border border-[#c5a059]/40 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Raw BIND Format</span>
            </button>
          </div>

          {/* Filter Pills (when in table mode) */}
          {activeTab === "table" && (
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-[11px]">
              {[
                { id: "all", label: "All Records (12)" },
                { id: "web", label: "Web & SSL (7)" },
                { id: "email", label: "Google MX (5)" },
                { id: "security", label: "SPF/DKIM/DMARC (3)" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedCategory(pill.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === pill.id
                      ? "bg-[#c5a059] text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300">
          
          {/* TAB 1: DNS RECORDS TABLE */}
          {activeTab === "table" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">GoDaddy DNS Manager Instructions:</strong> In your GoDaddy Domain Control Center, go to <strong>locatepin.com &rarr; Manage DNS</strong> and add the records below. If duplicate `@` A records exist, replace them with the 4 Google Cloud Anycast IPs.
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#121212] border-b border-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Name (Host)</th>
                      <th className="py-3 px-4">Value (Points to)</th>
                      <th className="py-3 px-4">TTL</th>
                      <th className="py-3 px-4">Purpose</th>
                      <th className="py-3 px-4 text-right">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                    {filteredRecords.map((rec, index) => {
                      const recordKey = `rec-${rec.type}-${rec.name}-${index}`;
                      return (
                        <tr key={recordKey} className="hover:bg-zinc-900/50 transition-colors group">
                          {/* Type */}
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                rec.type === "A"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : rec.type === "CNAME"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : rec.type === "MX"
                                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {rec.type}
                            </span>
                          </td>

                          {/* Name / Host */}
                          <td className="py-3 px-4 font-bold text-white">
                            {rec.name}
                          </td>

                          {/* Value / Target */}
                          <td className="py-3 px-4 text-zinc-200 max-w-[280px] truncate" title={rec.value}>
                            {rec.priority !== undefined && (
                              <span className="text-[#c5a059] font-bold mr-1.5">[Prio: {rec.priority}]</span>
                            )}
                            <span>{rec.value}</span>
                          </td>

                          {/* TTL */}
                          <td className="py-3 px-4 text-zinc-400 text-[10px] whitespace-nowrap">
                            {rec.ttl}
                          </td>

                          {/* Purpose Description */}
                          <td className="py-3 px-4 text-zinc-400 font-sans text-[11px]">
                            {rec.purpose}
                          </td>

                          {/* Copy Action */}
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleCopy(rec.value, recordKey)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                              title="Copy Value"
                            >
                              {copiedId === recordKey ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: STEP BY STEP GODADDY GUIDE */}
          {activeTab === "steps" && (
            <div className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#c5a059] text-black font-bold text-xs flex items-center justify-center">1</span>
                    <h4 className="text-sm font-bold text-white">Log in to GoDaddy & Open DNS</h4>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    1. Visit <a href="https://godaddy.com" target="_blank" rel="noreferrer" className="text-[#c5a059] underline">godaddy.com</a> and sign in.<br />
                    2. Go to <strong>My Account &rarr; My Products &rarr; Domains</strong>.<br />
                    3. Click on <strong>locatepin.com</strong>, then click <strong>Manage DNS</strong> (or DNS Records).
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#c5a059] text-black font-bold text-xs flex items-center justify-center">2</span>
                    <h4 className="text-sm font-bold text-white">Add A & CNAME Records</h4>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Click <strong>Add New Record</strong>:<br />
                    &bull; Type: <strong>A</strong> | Name: <strong>@</strong> | Value: <code className="text-[#c5a059]">216.239.32.21</code> (repeat for .34, .36, .38)<br />
                    &bull; Type: <strong>CNAME</strong> | Name: <strong>www</strong> | Value: <code className="text-[#c5a059]">ghs.googlehosted.com.</code><br />
                    &bull; Type: <strong>CNAME</strong> | Name: <strong>app</strong> | Value: <code className="text-[#c5a059]">ghs.googlehosted.com.</code>
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#c5a059] text-black font-bold text-xs flex items-center justify-center">3</span>
                    <h4 className="text-sm font-bold text-white">Configure Google Workspace MX</h4>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Under Mail Exchange records, delete default GoDaddy mail records and add:<br />
                    &bull; Priority 1: <code className="text-[#c5a059]">ASPMX.L.GOOGLE.COM.</code><br />
                    &bull; Priority 5: <code className="text-[#c5a059]">ALT1.ASPMX.L.GOOGLE.COM.</code><br />
                    &bull; Priority 5: <code className="text-[#c5a059]">ALT2.ASPMX.L.GOOGLE.COM.</code>
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#c5a059] text-black font-bold text-xs flex items-center justify-center">4</span>
                    <h4 className="text-sm font-bold text-white">Add SPF & DMARC Security TXT</h4>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    This ensures welcome emails from <strong>locatepin.com</strong> land directly in the client's inbox:<br />
                    &bull; Type: <strong>TXT</strong> | Name: <strong>@</strong> | Value: <code className="text-[#c5a059]">"v=spf1 include:_spf.google.com ~all"</code><br />
                    &bull; Type: <strong>TXT</strong> | Name: <strong>_dmarc</strong> | Value: <code className="text-[#c5a059]">"v=DMARC1; p=quarantine..."</code>
                  </p>
                </div>
              </div>

              {/* Propagation Notice */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-sm text-white">DNS Propagation Timeline</strong>
                    <span>GoDaddy DNS changes typically propagate globally across Google DNS & Cloudflare within 10 to 30 minutes.</span>
                  </div>
                </div>
                <a
                  href="https://dnschecker.org/#A/locatepin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Check Live DNS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: RAW BIND ZONE FILE */}
          {activeTab === "zonefile" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-mono text-[11px]">
                  Standard RFC 1035 BIND Zone File for GoDaddy Import:
                </span>
                <button
                  onClick={handleCopyZoneFile}
                  className="px-3 py-1 rounded-lg bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedZoneFile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedZoneFile ? "Copied" : "Copy Raw Zone File"}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto selection:bg-[#c5a059] selection:text-black">
                {generateZoneFileText()}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Domain: <strong className="text-white">locatepin.com</strong> &bull; Registrar: <strong>GoDaddy</strong></span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Done & Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
