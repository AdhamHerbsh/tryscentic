"use client";

import { CreditCard, Wallet, Smartphone, Landmark } from "lucide-react";
import { useState } from "react";

export type PaymentMethod = "apple_pay" | "instapay" | "vodafone_cash" | "wallet";

interface PaymentFormProps {
    onNext: (method: PaymentMethod) => void;
    onBack: () => void;
    initialMethod?: PaymentMethod;
    walletBalance: number;
    onFileChange: (file: File | null) => void;
}

import { compressImage } from "@/lib/utils/image-compression";
import { toast } from "sonner";
import Link from "next/link";

export default function PaymentForm({ onNext, onBack, initialMethod, walletBalance, onFileChange }: PaymentFormProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(initialMethod || "apple_pay");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [compressing, setCompressing] = useState(false);

    const methods = [
        // {
        //     id: "apple_pay",
        //     name: "Apple Pay",
        //     icon: <Smartphone className="text-[#000000]" />,
        //     description: "Pay securely with Apple Pay",
        // },

        {
            id: "instapay",
            name: "Insta Pay",
            icon: <Landmark className="text-[#1a73e8]" />,
            description: "Transfer via InstaPay",
            details: "Send to: username@instapay (01012345678)"
        },
        {
            id: "vodafone_cash",
            name: "Vodafone Cash",
            icon: <PhoneWrapper />,
            description: "Pay with Vodafone Cash",
            details: "Send to: 01012345678"
        },
        {
            id: "wallet",
            name: "Scentic Wallet",
            icon: <Wallet />,
            description: `Available balance: LE ${walletBalance.toFixed(2)}`,
        },
    ];

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            try {
                setCompressing(true);
                const compressed = await compressImage(file);
                onFileChange(compressed);
                setPreviewUrl(URL.createObjectURL(compressed));
                if (compressed.size < file.size) {
                    // Optional: Notify user of optimisation
                    // toast.success("Image optimized for faster upload");
                }
            } catch (error) {
                console.error("Compression warning:", error);
                toast.warning("Warning:" + error);
                // Fallback to original
                onFileChange(file);
                setPreviewUrl(URL.createObjectURL(file));
            } finally {
                setCompressing(false);
            }
        } else {
            onFileChange(null);
            setPreviewUrl(null);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>

            <div className="grid gap-4">
                {methods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                        className={`flex flex-col gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === method.id
                            ? "border-secondary bg-secondary/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${selectedMethod === method.id ? "bg-secondary text-white" : "bg-white/10 text-white/70"}`}>
                                {method.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-white">{method.name}</p>
                                <p className="text-sm text-white/60">{method.description}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? "border-secondary" : "border-white/20"
                                }`}>
                                {selectedMethod === method.id && <div className="w-3 h-3 rounded-full bg-secondary" />}
                            </div>
                        </div>

                        {/* Manual Payment Details & Upload */}
                        {selectedMethod === method.id && (method.id === 'vodafone_cash' || method.id === 'instapay') && (
                            <div className="mt-2 p-4 bg-black/20 rounded-lg border border-white/10 animate-in fade-in slide-in-from-top-2">
                                <p className="text-sm text-white/80 mb-3 font-mono bg-white/5 p-2 rounded text-center select-all">{method.details}</p>
                                <hr />
                                <div className="flex items-center justify-center gap-4 py-2 px-4">
                                    <div className="flex-1">
                                        <Link
                                            className="bg-secondary p-2 rounded text-center  text-white/80 hover:text-white font-bold"
                                            href={method.id === 'vodafone_cash' ? 'http://vf.eg/vfcash?id=mt&qrId=0rWzo7' : 'https://ipn.eg/S/ibrahimali123/instapay/7s3MST'}
                                        >
                                            Pay Now
                                        </Link>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <label className="block text-xs font-medium text-gray-400 uppercase">Upload Transaction Screenshot</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary/80 cursor-pointer"
                                        />
                                        {previewUrl && (
                                            <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-white/20">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="text-white/70 hover:text-white font-medium transition-colors"
                >
                    Back to Shipping
                </button>
                <button
                    onClick={() => onNext(selectedMethod)}
                    className="bg-secondary px-6 py-3 text-white font-semibold rounded hover:opacity-90 transition-opacity"
                >
                    Review Order
                </button>
            </div>
        </div>
    );
}

function PhoneWrapper() {
    return (
        <div className="relative">
            <Smartphone className="text-[#E60000]" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full" />
            </div>
        </div>
    );
}
