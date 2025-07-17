import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className, 
  error = false,
  label,
  variant = "default",
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
<textarea
        ref={ref}
        className={cn(
          "w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none",
          error && "border-red-500 focus:ring-red-500",
          variant === "story" && "bg-transparent border-white/20 text-white placeholder-white/60 focus:ring-white/50",
          className
        )}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;