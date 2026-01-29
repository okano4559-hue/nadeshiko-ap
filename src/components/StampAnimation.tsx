"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StampType } from "@/lib/types";
import { useEffect, useState } from "react";

interface StampAnimationProps {
    stamp: StampType;
    isVisible: boolean;
    onComplete: () => void;
}

export function StampAnimation({ stamp, isVisible, onComplete }: StampAnimationProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                onComplete();
            }, 2000); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    if (!show || !stamp) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1.5, rotate: 0, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        duration: 0.5
                    }}
                    className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                >
                    <div className="filter drop-shadow-2xl text-[150px]">
                        {getStampEmoji(stamp)}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function getStampEmoji(type: StampType): string {
    switch (type) {
        case 'soccer_ball': return '⚽️';
        case 'fire': return '🔥';
        case 'star': return '⭐️';
        case 'thumbs_up': return '👍';
        default: return '';
    }
}
