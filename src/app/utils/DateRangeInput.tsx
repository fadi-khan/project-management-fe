import React from "react";

interface InputProps {
  value?: string;
  onClick?: () => void;
}

export const DateRangeInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onClick }, ref) => (
    <button
      onClick={onClick}
      ref={ref as any}
      className="border border-black px-4 py-2 rounded-full font-bold text-black min-w-[250px]"
    >
      {value || "Select dates"}
    </button>
  )
);

DateRangeInput.displayName = "DateRangeInput";
