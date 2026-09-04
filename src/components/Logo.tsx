import React from "react";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  imageOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  showTagline = false,
  className = "",
  imageOnly = false,
}) => {
  const sizeMap = {
    xs: {
      box: "w-7 h-7 rounded-lg p-0.5",
      title: "text-sm",
      badge: "text-[10px]",
    },
    sm: {
      box: "w-8 h-8 rounded-lg p-0.5",
      title: "text-base",
      badge: "text-xs",
    },
    md: {
      box: "w-10 h-10 rounded-xl p-1",
      title: "text-lg sm:text-xl",
      badge: "text-sm",
    },
    lg: {
      box: "w-12 h-12 rounded-xl p-1.5",
      title: "text-2xl",
      badge: "text-base",
    },
    xl: {
      box: "w-20 h-20 rounded-2xl p-2",
      title: "text-3xl sm:text-4xl",
      badge: "text-lg",
    },
  };

  const currentSize = sizeMap[size];

  if (imageOnly) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-white rounded-xl shadow-md border border-white/20 overflow-hidden flex-shrink-0 ${currentSize.box} ${className}`}
      >
        <img
          src="/locatepin-logo.png"
          alt="LocatePin Official Logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`inline-flex items-center justify-center bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/20 overflow-hidden flex-shrink-0 hover:scale-105 transition-transform ${currentSize.box}`}
      >
        <img
          src="/locatepin-logo.png"
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
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium">
              Find &bull; Explore &bull; Reach
            </p>
          )}
        </div>
      )}
    </div>
  );
};
