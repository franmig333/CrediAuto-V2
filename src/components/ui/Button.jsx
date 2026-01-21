import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    return (
        <button
            className={twMerge(
                clsx(
                    "px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-900 border",
                    {
                        'bg-brand-600 hover:bg-brand-500 text-white border-transparent focus:ring-brand-500': variant === 'primary',
                        'bg-transparent border-brand-600 text-brand-600 hover:bg-brand-600/10': variant === 'outline',
                        'bg-white text-brand-900 hover:bg-tech-white border-transparent': variant === 'white',
                        'bg-red-600 hover:bg-red-700 text-white border-transparent': variant === 'danger',
                    }
                ),
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
