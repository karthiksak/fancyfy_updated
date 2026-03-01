"use client";

import { create } from "zustand";

export type ToastType = "success" | "info" | "error";

interface ToastState {
    message: string;
    type: ToastType;
    visible: boolean;
    showToast: (message: string, type?: ToastType) => void;
    hideToast: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>()((set) => ({
    message: "",
    type: "success",
    visible: false,
    showToast: (message, type = "success") => {
        if (timer) clearTimeout(timer);
        set({ message, type, visible: true });
        timer = setTimeout(() => {
            set({ visible: false });
        }, 3000);
    },
    hideToast: () => {
        if (timer) clearTimeout(timer);
        set({ visible: false });
    },
}));
