"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import LoginForm from "@/components/ui/Forms/LoginForm";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    // Close modal on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md animate-in zoom-in-50 duration-200">
                {/* Render the Login Form */}
                <div className="bg-transparent">
                    <LoginForm onSuccess={onClose} />
                </div>
            </div>
        </div>
    );
}
