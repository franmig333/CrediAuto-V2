import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = ({ label, className, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-tech-gray">{label}</label>}
            <input
                className={twMerge(
                    "bg-brand-900 border border-brand-700 rounded-lg px-4 py-2 text-white placeholder-brand-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all",
                    className
                )}
                {...props}
            />
        </div>
    );
};
