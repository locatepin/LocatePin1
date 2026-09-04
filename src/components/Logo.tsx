import React from "react";

const locatePinLogo = "/locatepin-logo.png";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "hero";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  imageOnly?: boolean;
  boxClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  showTagline = false,
  className = "",
  imageOnly = false,
  boxClassName = "",
}) => {
  const sizeMap = {
    xs: {
      box: "w-7 h-7 rounded-lg p-0.5",
      title: "text-sm",
      badge: "text-[10px]",
      tagline: "text-[8px] tracking-wider",
    },
    sm: {
      box: "w-8 h-8 rounded-lg p-0.5",
      title: "text-base",
      badge: "text-xs",
      tagline: "text-[9px] tracking-wider",
    },
    md: {
      box: "w-10 h-10 rounded-xl p-1",
      title: "text-lg sm:text-xl",
      badge: "text-sm",
      tagline: "text-[10px] tracking-wider",
    },
    lg: {
      box: "w-14 h-14 rounded-2xl p-1.5",
      title: "text-2xl",
      badge: "text-base",
      tagline: "text-[10px] tracking-widest",
    },
    xl: {
      box: "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-2 sm:p-2.5",
      title: "text-2xl sm:text-3xl",
      badge: "text-base sm:text-lg",
      tagline: "text-[11px] sm:text-xs tracking-[0.22em]",
    },
    "2xl": {
      box: "w-48 h-48 sm:w-56 sm:h-56 rounded-[36px] sm:rounded-[44px] p-5 sm:p-6",
      title: "text-3xl sm:text-4xl lg:text-5xl",
      badge: "text-lg sm:text-xl lg:text-2xl",
      tagline: "text-xs sm:text-sm tracking-[0.25em]",
    },
    hero: {
      box: "w-40 h-40 sm:w-48 sm:h-48 rounded-[28px] sm:rounded-[36px] p-3.5 sm:p-5",
      title: "text-2xl sm:text-3xl lg:text-4xl",
      badge: "text-base sm:text-lg lg:text-xl",
      tagline: "text-xs sm:text-sm tracking-[0.22em]",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (imageOnly) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden flex-shrink-0 ${currentSize.box} ${boxClassName} ${className}`}
      >
        <img
          src={locatePinLogo || "/locatepin-logo.png"}
          alt="LocatePin Official Logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 sm:gap-5 ${className}`}>
      <div
        className={`inline-flex items-center justify-center bg-white shadow-[0_10px_35px_rgba(255,255,255,0.22)] border border-white/40 overflow-hidden flex-shrink-0 hover:scale-105 transition-transform ${currentSize.box} ${boxClassName}`}
      >
        <img
          src={locatePinLogo || "/locatepin-logo.png"}
          alt="LocatePin Logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif italic font-bold tracking-tight text-white ${currentSize.title}`}
            >
              LocatePin
            </span>
            <span
              className={`text-[#c5a059] font-sans font-bold not-italic ${currentSize.badge}`}
            >
              .ai
            </span>
          </div>
          {showTagline && (
            <p className={`uppercase text-zinc-400 font-semibold mt-1 ${currentSize.tagline}`}>
              Rank Higher &bull; Faster.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
