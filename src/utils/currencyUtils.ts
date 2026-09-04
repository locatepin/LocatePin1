// Multi-currency definition, rates, and conversion helpers

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateToINR: number; // 1 unit of foreign currency = X INR
  formatDecimals: number;
}

// Major global currencies with current base rates to INR
// 1 Foreign Unit = rateToINR in Indian Rupees
export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rateToINR: 1.0, formatDecimals: 0 },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rateToINR: 86.85, formatDecimals: 2 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rateToINR: 93.40, formatDecimals: 2 },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rateToINR: 109.70, formatDecimals: 2 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", rateToINR: 23.65, formatDecimals: 2 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", rateToINR: 65.10, formatDecimals: 2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", rateToINR: 62.20, formatDecimals: 2 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rateToINR: 56.40, formatDecimals: 2 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦", rateToINR: 23.16, formatDecimals: 2 },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", flag: "🇶🇦", rateToINR: 23.86, formatDecimals: 2 },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼", rateToINR: 282.50, formatDecimals: 3 },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", flag: "🇧🇭", rateToINR: 230.40, formatDecimals: 3 },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", flag: "🇴🇲", rateToINR: 225.80, formatDecimals: 3 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rateToINR: 0.58, formatDecimals: 0 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", rateToINR: 98.20, formatDecimals: 2 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", rateToINR: 19.65, formatDecimals: 2 },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", rateToINR: 2.52, formatDecimals: 2 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿", rateToINR: 51.70, formatDecimals: 2 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rateToINR: 12.02, formatDecimals: 2 },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦", rateToINR: 4.80, formatDecimals: 2 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪", rateToINR: 8.20, formatDecimals: 2 },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴", rateToINR: 8.10, formatDecimals: 2 },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺", rateToINR: 0.95, formatDecimals: 2 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", rateToINR: 0.062, formatDecimals: 0 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", rateToINR: 15.20, formatDecimals: 2 },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷", rateToINR: 2.45, formatDecimals: 2 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", rateToINR: 0.0053, formatDecimals: 0 },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭", rateToINR: 1.51, formatDecimals: 2 },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", rateToINR: 0.0034, formatDecimals: 0 },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬", rateToINR: 1.78, formatDecimals: 2 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰", rateToINR: 0.31, formatDecimals: 2 },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩", rateToINR: 0.72, formatDecimals: 2 },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰", rateToINR: 0.29, formatDecimals: 2 },
  { code: "NPR", name: "Nepalese Rupee", symbol: "रू", flag: "🇳🇵", rateToINR: 0.62, formatDecimals: 2 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬", rateToINR: 0.058, formatDecimals: 2 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪", rateToINR: 0.67, formatDecimals: 2 },
];

export const getCurrencyByCode = (code: string): CurrencyInfo => {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (found) return found;
  // Fallback for custom code
  return {
    code: code.toUpperCase(),
    name: `${code.toUpperCase()} Currency`,
    symbol: code.toUpperCase(),
    flag: "🌐",
    rateToINR: 1.0,
    formatDecimals: 2,
  };
};

/**
 * Convert an INR base amount into the target currency
 */
export const convertInrToCurrency = (
  inrAmount: number,
  targetCurrencyCode: string
): { amount: number; formatted: string; symbol: string; rate: number } => {
  const currency = getCurrencyByCode(targetCurrencyCode);
  if (currency.code === "INR") {
    return {
      amount: inrAmount,
      formatted: inrAmount.toLocaleString("en-IN"),
      symbol: "₹",
      rate: 1.0,
    };
  }

  const converted = inrAmount / currency.rateToINR;
  // Round nicely: for small currencies like JPY / KRW keep 0 decimals, else 2 or 3
  const rounded = currency.formatDecimals === 0 ? Math.round(converted) : Number(converted.toFixed(currency.formatDecimals));

  return {
    amount: rounded,
    formatted: rounded.toLocaleString("en-US", {
      minimumFractionDigits: currency.formatDecimals > 0 ? currency.formatDecimals : 0,
      maximumFractionDigits: currency.formatDecimals,
    }),
    symbol: currency.symbol,
    rate: currency.rateToINR,
  };
};

/**
 * Convert foreign currency amount back into INR equivalent
 */
export const convertCurrencyToInr = (foreignAmount: number, sourceCurrencyCode: string): number => {
  const currency = getCurrencyByCode(sourceCurrencyCode);
  if (currency.code === "INR") return foreignAmount;
  return Math.round(foreignAmount * currency.rateToINR);
};

/**
 * Formatted dual-display representation
 * e.g. for USD: primary = "$58 USD", secondary = "approx. ₹5,000 INR"
 * e.g. for INR: primary = "₹5,000", secondary = "Base INR"
 */
export const formatDualCurrencyPrice = (inrAmount: number, currencyCode: string) => {
  const currency = getCurrencyByCode(currencyCode);
  if (currency.code === "INR") {
    return {
      primary: `₹${inrAmount.toLocaleString("en-IN")}`,
      secondary: "Base INR Rate",
      code: "INR",
      symbol: "₹",
    };
  }

  const converted = convertInrToCurrency(inrAmount, currency.code);
  return {
    primary: `${converted.symbol}${converted.formatted} ${currency.code}`,
    secondary: `~ ₹${inrAmount.toLocaleString("en-IN")} INR Value`,
    code: currency.code,
    symbol: converted.symbol,
    rateText: `1 ${currency.code} = ₹${currency.rateToINR} INR`,
  };
};

/**
 * Auto-detect likely currency based on country name or code
 */
export const detectCurrencyFromCountry = (country: string): string => {
  const c = country.toLowerCase();
  if (c.includes("india") || c.includes("bharat")) return "INR";
  if (c.includes("united states") || c.includes("usa") || c.includes("america")) return "USD";
  if (c.includes("united kingdom") || c.includes("britain") || c.includes("england") || c.includes("scotland")) return "GBP";
  if (c.includes("emirates") || c.includes("dubai") || c.includes("abu dhabi") || c.includes("uae")) return "AED";
  if (c.includes("singapore")) return "SGD";
  if (c.includes("canada")) return "CAD";
  if (c.includes("australia")) return "AUD";
  if (c.includes("saudi")) return "SAR";
  if (c.includes("qatar")) return "QAR";
  if (c.includes("kuwait")) return "KWD";
  if (c.includes("germany") || c.includes("france") || c.includes("italy") || c.includes("spain") || c.includes("netherlands") || c.includes("europe")) return "EUR";
  if (c.includes("japan")) return "JPY";
  if (c.includes("switzerland")) return "CHF";
  if (c.includes("malaysia")) return "MYR";
  if (c.includes("thailand")) return "THB";
  if (c.includes("china")) return "CNY";
  if (c.includes("new zealand")) return "NZD";
  return "INR"; // Default base
};
