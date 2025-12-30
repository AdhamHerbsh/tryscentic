"use client";
import { useEffect, useState } from "react";
import { Plus, History, Wallet, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/utils/supabase/client";

interface Transaction {
  id: string;
  type: "deposit" | "purchase" | "refund";
  amount: number;
  description: string;
  created_at: string;
}

export default function WalletSection() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [giftCode, setGiftCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  const supabase = createClient();

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get Balance
      const { data: profile } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

      if (profile) setBalance(profile.wallet_balance);

      // Get Transactions
      const { data: txs } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (txs) setTransactions(txs);
    } catch (error) {
      console.error("Error fetching wallet data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      fetchData(); // Refresh balance
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
                    <p className="font-semibold text-gray-900 capitalize">{tx.type}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">{tx.description}</p>
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
