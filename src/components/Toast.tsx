"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Bell } from "lucide-react";

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
                >
                    <div className="bg-white/90 backdrop-blur-md border border-emerald-100 shadow-xl rounded-full px-6 py-3 flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                            <Bell size={16} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{message}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
