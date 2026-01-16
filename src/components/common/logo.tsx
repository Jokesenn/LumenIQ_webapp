import { SVGProps } from 'react';

export function LumenIQLogo({ size = 32, className, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20" stroke="url(#paint0_linear)" strokeWidth="4" strokeLinecap="round" />
            <path d="M20 5V20L30.6066 30.6066" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <circle cx="20" cy="20" r="3" fill="white" />
            <defs>
                <linearGradient id="paint0_linear" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F5BD5" />
                    <stop offset="1" stopColor="#8B94E8" />
                </linearGradient>
            </defs>
        </svg>
    );
}
