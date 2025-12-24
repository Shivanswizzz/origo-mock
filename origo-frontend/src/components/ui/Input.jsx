import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
          <Icon size={18} />
        </div>
      )}
      <input
        className={cn(
          "flex h-10 w-full rounded-xl border bg-bg-secondary/50 px-3 py-2 text-sm text-text-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          "glass-input backdrop-blur-sm", // Applying glass utility
          error 
            ? "border-red-500 focus:ring-red-500/50" 
            : "border-white/10 focus:border-primary-600/50 focus:ring-primary-600/20",
          Icon ? "pl-10" : "",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 mt-1 ml-1 animate-fade-in-up block">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
