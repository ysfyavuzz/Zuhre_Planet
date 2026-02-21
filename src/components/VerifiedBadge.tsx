import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerifiedBadgeProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
    size = 'md',
    showText = true
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const textClasses = {
        sm: 'text-[10px]',
        md: 'text-xs',
        lg: 'text-sm'
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1.5"
        >
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full animate-pulse" />

                {/* Badge Icon */}
                <div className="relative bg-gradient-to-br from-cyan-300 via-cyan-500 to-cyan-600 p-1 rounded-full border border-cyan-200/50 shadow-lg">
                    <ShieldCheck className={`${sizeClasses[size]} text-black fill-black/10`} strokeWidth={2.5} />
                </div>
            </div>

            {showText && (
                <span className={`font-orbitron font-bold bg-gradient-to-r from-cyan-200 to-cyan-500 bg-clip-text text-transparent uppercase tracking-wider ${textClasses[size]}`}>
                    Onaylı Üye
                </span>
            )}
        </motion.div>
    );
};
