"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(34, 197, 94, ${0.1 + i * 0.02})`, // Green colors
        width: 0.5 + i * 0.03,
        duration: 20 + (i * 0.3), // Deterministic duration based on index
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-green-600"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.15 + path.id * 0.02}
                        initial={{ pathLength: 0.3, opacity: 0.4 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.2, 0.5, 0.2],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: path.duration,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "AgriSakhi",
    subtitle = "AI-Powered Agriculture Assistant",
    showButton = true,
    buttonText = "Start Detection Now",
    buttonHref = "/detect",
}: {
    title?: string;
    subtitle?: string;
    showButton?: boolean;
    buttonText?: string;
    buttonHref?: string;
}) {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ur' || i18n.language === 'ar';
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 via-white to-green-50/50">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto space-y-6"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight">
                        {isRTL ? (
                            // For RTL languages, keep words whole (don't split letters)
                            <motion.span
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    delay: 0.1,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                }}
                                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-600 to-green-500"
                                style={{ verticalAlign: 'baseline' }}
                            >
                                {title}
                            </motion.span>
                        ) : (
                            // For LTR languages, animate letter by letter
                            words.map((word, wordIndex) => (
                                <span
                                    key={wordIndex}
                                    className="inline-block mr-4 last:mr-0"
                                >
                                    {word.split("").map((letter, letterIndex) => (
                                        <motion.span
                                            key={`${wordIndex}-${letterIndex}`}
                                            initial={{ y: 100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay:
                                                    wordIndex * 0.1 +
                                                    letterIndex * 0.03,
                                                type: "spring",
                                                stiffness: 150,
                                                damping: 25,
                                            }}
                                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-600 to-green-500"
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </span>
                            ))
                        )}
                    </h1>

                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-xl md:text-2xl text-green-700 font-medium"
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    {showButton && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="inline-block group relative bg-gradient-to-b from-green-500/10 to-green-600/10 p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <Button
                                variant="ghost"
                                onClick={() => window.location.href = buttonHref}
                                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md bg-white/95 hover:bg-white/100 text-green-700 hover:text-green-800 transition-all duration-300 group-hover:-translate-y-0.5 border border-green-200 hover:border-green-300 hover:shadow-md"
                            >
                                {isRTL && (
                                    <span className="mr-3 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1.5 transition-all duration-300">
                                        ←
                                    </span>
                                )}
                                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                    {buttonText}
                                </span>
                                {!isRTL && (
                                    <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                                        →
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
