"use client";

import { useToastStore } from "@/lib/toast-store";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const icons = {
    success: CheckCircle2,
    info: Info,
    error: AlertTriangle,
};

const styles = {
    success: "from-emerald-500 to-green-600",
    info: "from-blue-500 to-violet-600",
    error: "from-red-500 to-rose-600",
};

export default function Toast() {
    const { message, type, visible, hideToast } = useToastStore();
    const Icon = icons[type];

    return (
        <div
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl bg-gradient-to-r ${styles[type]} px-5 py-3.5 text-white shadow-2xl transition-all duration-500 ease-out ${visible
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-8 opacity-0 scale-95 pointer-events-none"
                }`}
            style={{ minWidth: 260, maxWidth: 400 }}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium flex-1">{message}</span>
            <button onClick={hideToast} className="shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
