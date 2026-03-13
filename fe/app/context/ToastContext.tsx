"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                            className={`relative pointer-events-auto flex items-start gap-4 px-6 py-5 rounded-sm shadow-2xl backdrop-blur-xl border ${toast.type === "error"
                                    ? "bg-midnight/80 border-red-900/50 text-red-50"
                                    : "bg-midnight/80 border-gold/30 text-gold"
                                }`}
                        >
                            {/* Luxury gradient background accent */}
                            <div className={`absolute inset-0 rounded-sm overflow-hidden pointer-events-none -z-10`}>
                                <div className={`absolute -left-[50%] -top-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(212,175,55,0.1)_360deg)] animate-[spin_4s_linear_infinite] ${toast.type === 'error' ? 'hidden' : 'block'}`} />
                                <div className={`w-full h-full bg-gradient-to-br ${toast.type === "error" ? 'from-red-950/40 via-transparent to-transparent' : 'from-gold/5 via-transparent to-transparent'}`}></div>
                            </div>

                            <div className="flex-shrink-0 mt-0.5">
                                {toast.type === "error" ? (
                                    <AlertCircle className="w-5 h-5 text-red-400" strokeWidth={1.5} />
                                ) : (
                                    <CheckCircle className="w-5 h-5 text-gold" strokeWidth={1.5} />
                                )}
                            </div>
                            <div className="max-w-[300px]">
                                <h4 className={`font-serif text-xs tracking-[0.2em] uppercase mb-1.5 ${toast.type === 'error' ? 'text-red-300' : 'text-gold'}`}>
                                    {toast.type === "error" ? "Notification" : "Success"}
                                </h4>
                                <p className="text-sm font-light leading-relaxed text-mist">{toast.message}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
