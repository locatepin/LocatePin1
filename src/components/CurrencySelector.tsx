import React, { useState, useRef, useEffect } from "react";
import { Globe, Search, ChevronDown, Check, Coins } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

interface CurrencySelectorProps {
  className?: string;
  variant?: "pill" | "button" | "minimal" | "compact";
  showRateBadge?: boolean;
}

const POPULAR_CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD", "CAD", "AUD", "SAR"];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = "",
  variant = "pill",
  showRateBadge = false,
}) => {
  const { selectedCurrency, currencyInfo, allCurrencies, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredCurrencies = allCurrencies.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
    );
  });

  const handleSelect = (code: string) => {
    setSelectedCurrency(code);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      {variant === "pill" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#c5a059]/60 text-zinc-200 text-xs font-mono transition-all cursor-pointer shadow-sm group"
          title="Select currency to display subscription value"
        >
          <span className="text-sm leading-none">{currencyInfo.flag}</span>
          <span className="font-bold text-white group-hover:text-[#c5a059] transition-colors">
            {currencyInfo.code} ({currencyInfo.symbol})
          </span>
          <ChevronDown className={`w-3 h-3 text-zinc-400 group-hover:text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "compact" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-mono cursor-pointer"
        >
          <span>{currencyInfo.flag}</span>
          <span className="font-semibold text-white">{currencyInfo.code}</span>
          <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
        </button>
      )}

      {variant === "button" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-3 w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#c5a059]/60 text-left text-xs cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{currencyInfo.flag}</span>
            <div>
              <span className="font-bold text-white block">{currencyInfo.code} - {currencyInfo.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {currencyInfo.code === "INR" ? "Base Currency (₹)" : `1 ${currencyInfo.code} = ₹${currencyInfo.rateToINR} INR`}
              </span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Rate text badge if requested */}
      {showRateBadge && currencyInfo.code !== "INR" && (
        <span className="text-[10px] font-mono text-zinc-400 block mt-1">
          1 {currencyInfo.code} = ₹{currencyInfo.rateToINR} INR
        </span>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-zinc-800 bg-[#121212]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Select Subscription Currency</span>
              </span>
              <span className="text-[10px] font-mono text-[#c5a059]">Base: ₹ INR</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currency (e.g. USD, EUR, AED)..."
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#c5a059]"
                autoFocus
              />
            </div>

            {/* Quick Popular Chips */}
            <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-zinc-800/80">
              {POPULAR_CURRENCIES.map((code) => {
                const isCurrent = selectedCurrency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelect(code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-[#c5a059] text-black font-bold"
                        : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of Currencies */}
          <div className="max-h-64 overflow-y-auto divide-y divide-zinc-900/60 p-1">
            {filteredCurrencies.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">
                No matching currency found.
              </div>
            ) : (
              filteredCurrencies.map((c) => {
                const isSelected = selectedCurrency === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c.code)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#211a0c] text-[#c5a059]"
                        : "hover:bg-zinc-900 text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-white">
                            {c.code}
                          </span>
                          <span className="text-xs text-zinc-400">({c.symbol})</span>
                          {c.code === "INR" && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                              BASE
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 block truncate max-w-[170px]">
                          {c.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500">
                        {c.code === "INR" ? "1.00" : `₹${c.rateToINR}`}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-2 bg-black/60 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>Accepting all global currencies</span>
            <span className="text-[#c5a059] font-mono">Live RBI / Forex Base</span>
          </div>
        </div>
      )}
    </div>
  );
};
