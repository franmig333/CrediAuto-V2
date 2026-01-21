import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className }) => {
    return (
        <div className={twMerge("bg-brand-800 rounded-xl p-6 shadow-xl border border-brand-700 hover:border-brand-600 transition-colors", className)}>
            {children}
        </div>
    );
};
