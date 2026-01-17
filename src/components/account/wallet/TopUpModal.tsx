"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Lock, X, Upload, CheckCircle2 } from "lucide-react";
import { topUpMethods } from "@/app/(app)/data/walletData";
import { submitTopUpRequest } from "@/actions/wallet-actions";
import { toast } from "sonner";

import { compressImage } from "@/lib/utils/image-compression";
import Link from "next/link";

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState<string>("");
    const [selectedMethodId, setSelectedMethodId] = useState<string>(topUpMethods[0]?.id || "");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [compressing, setCompressing] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setAmount("");
            setProofFile(null);
            setLoading(false);
            setCompressing(false);
        }
    }, [isOpen]);

    // Close modal on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const presets = [500, 1000, 2500, 5000];
    const handlePresetClick = (val: number) => setAmount(val.toString());

    const selectedMethod = topUpMethods.find(m => m.id === selectedMethodId);

    // Step validation
    const isStep1Valid = amount && parseFloat(amount) >= 50;
    const isStep2Valid = !!selectedMethodId;
    const isStep3Valid = !!proofFile && !compressing;

    const handleNext = () => {
        if (step === 1 && isStep1Valid) setStep(2);
        else if (step === 2 && isStep2Valid) setStep(3);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setCompressing(true);
            const compressed = await compressImage(file);
            setProofFile(compressed);
        } catch (error) {
            console.error("Compression failed", error);
            setProofFile(file); // Fallback
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedMethod || !proofFile) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("method", selectedMethod.label);
            formData.append("proof", proofFile);

            const result = await submitTopUpRequest(formData);

            if (result.success) {
                toast.success(result.message);
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-accent rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        {step > 1 && (
                            <button onClick={handleBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-gray-400" />
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-white font-serif">
                            {step === 1 && "Top-up Amount"}
                            {step === 2 && "Select Method"}
                            {step === 3 && "Confirm Transfer"}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

                    {/* Step 1: Amount */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="relative">
                                <label className="text-xs font-bold text-amber-500/80 tracking-widest uppercase mb-2 block">
                                    Enter Amount (Min 500 LE)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                    min={500}
                                    className="w-full bg-black/20 text-white text-4xl font-bold py-4 px-4 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-center placeholder-gray-700"
                                    placeholder="0"
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {presets.map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handlePresetClick(val)}
                                        className={`py-2 rounded-lg text-sm font-bold border transition-all ${amount === val.toString()
                                            ? "bg-amber-500 text-black border-amber-500"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        LE {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Method */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <label className="text-xs font-bold text-amber-500/80 tracking-widest uppercase block mb-2">
                                Available Methods
                            </label>
                            {topUpMethods.map((method) => {
                                const isActive = selectedMethodId === method.id;
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethodId(method.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${isActive
                                            ? "bg-[#3A1C20] border-amber-500 shadow-md"
                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${isActive ? "bg-amber-500 text-black" : "bg-white/10 text-gray-400"}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <p className={`font-bold ${isActive ? "text-white" : "text-gray-300"}`}>{method.label}</p>
                                                <p className="text-xs text-gray-500">Manual Transfer</p>
                                            </div>
                                            <Link
                                                className="bg-secondary p-2 rounded text-center  text-white/80 hover:text-white font-bold"
                                                href={method.link}
                                            >
                                                Pay Now
                                            </Link>
                                        </div>
                                        {isActive && <CheckCircle2 className="text-amber-500" size={20} />}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Step 3: Proof */}
                    {step === 3 && selectedMethod && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* Instruction Card */}
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                                <h3 className="text-amber-500 font-bold mb-2">Transfer Instructions</h3>
                                <p className="text-sm text-gray-300 mb-2">
                                    Please transfer <strong className="text-white">LE {parseFloat(amount).toFixed(2)}</strong> to the following account:
                                </p>
                                <div className="bg-black/40 rounded-lg p-3 flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">{selectedMethod.label}:</span>
                                    <span className="text-white font-mono font-bold tracking-wide">{selectedMethod.sub}</span>
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Upload Payment Screenshot
                                </label>
                                <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 hover:bg-white/5 transition-colors text-center cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                                        {proofFile ? (
                                            <>
                                                <CheckCircle2 size={32} className="text-green-500" />
                                                <span className="text-sm font-medium text-white break-all">{proofFile.name} (Compressed)</span>
                                            </>
                                        ) : compressing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                                                <span className="text-sm font-medium">Optimizing image...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={32} />
                                                <span className="text-sm font-medium">Click to upload screenshot</span>
                                                <span className="text-xs text-gray-500">Supports JPG, PNG</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-white/5">
                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!isStep3Valid || loading || compressing}
                            className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
                        >
                            {loading ? "Processing..." : "Confirm Transfer"}
                        </button>
                    )}

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                        <Lock size={12} />
                        <span>Transactions are manually verified by admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
