import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CurrencyInfo,
  SUPPORTED_CURRENCIES,
  getCurrencyByCode,
  convertInrToCurrency,
  convertCurrencyToInr,
  formatDualCurrencyPrice,
  detectCurrencyFromCountry,
} from "../utils/currencyUtils";
import { useAccessLocation } from "./AccessLocationContext";

interface CurrencyContextType {
  selectedCurrency: string;
  currencyInfo: CurrencyInfo;
  allCurrencies: CurrencyInfo[];
  setSelectedCurrency: (code: string) => void;
  convertInr: (amountINR: number) => { amount: number; formatted: string; symbol: string; rate: number };
  convertToInr: (foreignAmount: number, sourceCode?: string) => number;
  getDualDisplay: (amountINR: number) => ReturnType<typeof formatDualCurrencyPrice>;
  exchangeRateText: string;
}

const STORAGE_KEY = "locatepin_preferred_currency_v1";

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { location } = useAccessLocation();

  const [selectedCurrency, setCurrencyState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch (e) {
      // ignore
    }
    return "INR";
  });

  // Auto-detect based on visitor's country if user hasn't explicitly set one yet
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved && location?.country) {
      const detected = detectCurrencyFromCountry(location.country);
      if (detected && detected !== "INR") {
        setCurrencyState(detected);
      }
    }
  }, [location?.country]);

  const setSelectedCurrency = (code: string) => {
    const valid = getCurrencyByCode(code).code;
    setCurrencyState(valid);
    try {
      localStorage.setItem(STORAGE_KEY, valid);
    } catch (e) {
      // ignore
    }
  };

  const currencyInfo = getCurrencyByCode(selectedCurrency);

  const convertInr = (amountINR: number) => convertInrToCurrency(amountINR, selectedCurrency);

  const convertToInr = (foreignAmount: number, sourceCode?: string) =>
    convertCurrencyToInr(foreignAmount, sourceCode || selectedCurrency);

  const getDualDisplay = (amountINR: number) => formatDualCurrencyPrice(amountINR, selectedCurrency);

  const exchangeRateText =
    selectedCurrency === "INR"
      ? "Base Currency: Indian Rupee (₹)"
      : `1 ${selectedCurrency} = ₹${currencyInfo.rateToINR.toFixed(2)} INR (Fixed Conversion)`;

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        currencyInfo,
        allCurrencies: SUPPORTED_CURRENCIES,
        setSelectedCurrency,
        convertInr,
        convertToInr,
        getDualDisplay,
        exchangeRateText,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
