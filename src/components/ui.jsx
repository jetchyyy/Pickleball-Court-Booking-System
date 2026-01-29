import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
    const variants = {
        primary: 'bg-brand-green text-brand-green-dark hover:bg-brand-green/90 shadow-sm',
        secondary: 'bg-brand-orange text-white hover:bg-brand-orange/90 shadow-sm',
        outline: 'border-2 border-brand-green text-brand-green-dark hover:bg-brand-green-light',
        ghost: 'hover:bg-black/5 text-brand-green-dark',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg',
    };

    return (
        <button
            className={cn(
                'rounded-full font-display font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                'bg-bg-surface rounded-2xl shadow-sm border border-black/5 overflow-hidden hover:shadow-md transition-shadow duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function Badge({ className, variant = 'green', children }) {
    const variants = {
        green: 'bg-brand-green-light text-brand-green-dark',
        orange: 'bg-brand-orange-light text-orange-800',
        gray: 'bg-gray-100 text-gray-700',
    };

    return (
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
            {children}
        </span>
    );
}
