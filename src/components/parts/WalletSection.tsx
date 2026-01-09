"use client";
import { useEffect, useState } from "react";
import { Plus, History, Wallet, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/utils/supabase/client";
import { useUser } from "@/lib/context/UserContext";

interface Transaction {
  id: string;
  type: "deposit" | "purchase" | "refund";
  amount: number;
  description: string;
  created_at: string;
  status: string;
}

export default function WalletSection() {
  const { profile, refreshProfile } = useUser();
  const balance = profile?.wallet_balance || 0;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [giftCode, setGiftCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  const supabase = createClient();

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get Transactions
      const { data: txs } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (txs) setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedeem = async () => {
    if (!giftCode) return;
    setRedeeming(true);
    try {
      const { data, error } = await supabase.rpc('redeem_gift_code', {
        code_input: giftCode
      });

      if (error) throw error;

      toast.success(`Successfully added LE ${data} to your wallet!`);
      setGiftCode("");
      await refreshProfile();
      fetchTransactions();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Invalid gift code");
      }
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <section className="mb-10 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Wallet className="text-amber-500" /> My Wallet
      </h2>

      {/* Balance Card */}
      <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} />
        </div>

        <p className="text-gray-400 mb-1">Total Balance</p>
        <h3 className="text-4xl font-bold mb-6">LE {balance.toFixed(2)}</h3>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full">
          <div className="flex-1 bg-white/10 rounded-lg p-1.5 flex items-center">
            <input
              type="text"
              placeholder="Enter Gift Code"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 w-full px-3 text-sm"
            />
            <button
              onClick={handleRedeem}
              disabled={redeeming || !giftCode}
              className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-1.5 rounded-md font-bold text-sm transition-colors disabled:opacity-50"
            >
              {redeeming ? "..." : "Redeem"}
            </button>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <History size={18} /> Transaction History
        </h3>

        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No transactions yet</div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' :
                    tx.type === 'refund' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                    {tx.type === 'deposit' ? <Plus size={16} /> : <CreditCard size={16} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 capitalize">{tx.type}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border border-opacity-20 capitalize font-medium ${tx.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500' :
                        tx.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500' :
                          'bg-amber-500/10 text-amber-500 border-amber-500'
                        }`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-800">{new Date(tx.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-700">{tx.description}</p>
                  </div>
                </div>
                <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {tx.amount > 0 ? '+' : ''}LE {tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
