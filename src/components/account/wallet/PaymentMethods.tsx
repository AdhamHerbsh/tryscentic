import { Plus, Trash2, CreditCard, Landmark } from "lucide-react";
import { mockPaymentMethods } from "@/app/(app)/data/walletData";

export default function PaymentMethods() {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold text-white tracking-wide mb-6">PAYMENT METHODS</h2>

            <div className="flex-1 space-y-4">
                {mockPaymentMethods.map((method) => (
                    <div key={method.id} className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-white/10 text-gray-300">
                                {method.type === 'Bank' ? <Landmark size={20} /> : <CreditCard size={20} />}
                            </div>
                            <div className="flex flex-col font-[system-ui]">
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-lg tracking-widest leading-none">•••• {method.last4}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {method.label || `${method.type} • Expires ${method.expiry}`}
                                </span>
                            </div>
                        </div>

                        <button className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <button className="mt-6 w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-amber-500 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 font-[system-ui] text-sm">
                <Plus size={16} />
                Add Payment Method
            </button>
        </div>
    );
}
