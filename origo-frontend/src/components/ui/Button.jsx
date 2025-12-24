import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  disabled,
  ...props 
}, ref) => {
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white shadow-lg shadow-primary-600/20 border-transparent',
    secondary: 'bg-bg-tertiary hover:bg-bg-secondary text-text-primary border-transparent',
    outline: 'border-primary-600 text-primary-600 hover:bg-primary-600/10',
    ghost: 'hover:bg-white/5 text-text-primary border-transparent',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20',
    glass: 'glass-card hover:bg-white/10 text-white border-white/10'
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10 p-2 flex items-center justify-center'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
