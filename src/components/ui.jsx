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
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
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
        red: 'bg-red-100 text-red-800',
    };

    return (
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
            {children}
        </span>
    );
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="flex-1 flex justify-between sm:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => onPageChange(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                                    ? 'z-10 bg-brand-green-light border-brand-green text-brand-green-dark'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
