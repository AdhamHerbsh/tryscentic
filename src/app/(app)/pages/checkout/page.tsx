"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ShippingForm from "@/components/ui/Forms/ShippingForm";
import PaymentForm, { PaymentMethod } from "@/components/ui/Forms/PaymentForm";
import ReviewOrder from "@/components/parts/ReviewOrder";
import OrderSummary from "@/components/parts/OrderSummary";
import PromoCodeInput from "@/components/parts/PromoCodeInput";
import WalletBalanceSection from "@/components/parts/WalletBalanceSection";
import { useCart } from "@/lib/context/CartContext";
import { createOrder } from "@/actions/order-actions";
import { validatePromoCode } from "@/actions/promo-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import ProcessingOverlay from "@/components/ui/ProcessingOverlay";
import FailureModal from "@/components/ui/Modals/FailureModal";
import { AnimatePresence } from "framer-motion";

type Step = "shipping" | "payment" | "review";


interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  deliveryOption: 'standard' | 'express' | 'custom';
  deliveryDate?: string;
}

export default function CheckoutPage() {

  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("apple_pay");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { cartItems, subtotal, clearCart, isInitialized } = useCart();
  const router = useRouter();
  const supabase = createClient();

  // Redirect if cart is empty
  useEffect(() => {
    if (isInitialized && cartItems.length === 0) {
      router.push("/pages/shop");
    }
  }, [isInitialized, cartItems, router]);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("wallet_balance")
          .eq("id", user.id)
          .single();
        if (profile) setWalletBalance(profile.wallet_balance);
      }
    };
    fetchBalance();
  }, [supabase]);


  const handleShippingNext = (data: ShippingData) => {
    setShippingData(data);
    setCurrentStep("payment");
  };

  const handlePaymentNext = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setCurrentStep("review");
  };

  const handleApplyPromo = async (code: string) => {
    const res = await validatePromoCode(code, subtotal);
    if (res.success) {
      setDiscountAmount(res.discount || 0);
      setAppliedPromo(res.code || code);
      toast.success(res.message);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  const handleRemovePromo = () => {
    setDiscountAmount(0);
    setAppliedPromo(null);
    toast.info("Promo code removed");
  };

  const handlePlaceOrder = async () => {
    if (!shippingData) return;

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map(item => ({
        variant_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const realShippingCost = shippingData.deliveryOption === 'express' ? 90.0 : 0.0;
      const finalWalletDeduction = useWallet ? Math.min(walletBalance, subtotal + realShippingCost - discountAmount) : 0;

      const formData = new FormData();
      formData.append("shipping_info", JSON.stringify(shippingData));
      formData.append("total_amount", String(subtotal + realShippingCost - discountAmount));
      formData.append("payment_method", paymentMethod);
      formData.append("shipping_method", shippingData.deliveryOption);
      formData.append("items", JSON.stringify(orderItems));

      if (appliedPromo) {
        formData.append("promo_code", appliedPromo);
      }

      if (useWallet) {
        formData.append("wallet_deduction", String(finalWalletDeduction));
      }

      if (shippingData.deliveryDate) {
        formData.append("scheduled_delivery_date", shippingData.deliveryDate);
      }

      if (proofFile) {
        formData.append("proof_file", proofFile);
      }

      // @ts-ignore - Action logic will be updated to handle promo/wallet
      const res = await createOrder(formData);

      if (!res.success) {
        setOrderError(res.message || "Failed to place order");
        setShowErrorModal(true);
      } else {
        clearCart();
        const status = (paymentMethod === "vodafone_cash" || paymentMethod === "instapay") ? "pending" : "instant";
        router.push(`/pages/checkout/success/${res.orderId}?status=${status}`);
      }
    } catch (error: any) {
      setOrderError(error.message || "Something went wrong. Please try again.");
      setShowErrorModal(true);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "shipping": return "33.33%";
      case "payment": return "66.66%";
      case "review": return "100%";
      default: return "0%";
    }
  };

  const currentShippingCost = shippingData?.deliveryOption === 'express' ? 90.0 : 0.0;

  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      {/* Main content */}
      <main className={"flex-1 px-4 lg:px-10 mt-20"}>
        <div className="max-w-7xl mx-auto relative">

          {/* رابط Back to Shop */}
          <Link
            href="/pages/shop"
            className="inline-block w-full text-sm text-white/70 hover:text-white transition-colors border-b border-white/20 pb-1 mb-4 text-right"
          >
            Back to Shop
          </Link>

          {/* الصفحة الفعلية */}
          <div className="pt-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className={`lg:col-span-2 text-white`}>

                <h1 className="text-3xl font-bold mb-6">Checkout</h1>

                <div className="mb-10 w-full">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={`font-semibold transition-colors ${currentStep === "shipping" ? "text-secondary" : "text-white"}`}>Shipping Information</span>
                    <span className={`font-semibold transition-colors ${currentStep === "payment" ? "text-secondary" : (currentStep === "shipping" ? "text-white/50" : "text-white")}`}>Payment</span>
                    <span className={`font-semibold transition-colors ${currentStep === "review" ? "text-secondary" : "text-white/50"}`}>Review Order</span>
                  </div>

                  <div className="w-full h-2 relative rounded overflow-hidden bg-white/10">
                    <div
                      className="h-full bg-secondary transition-all duration-500 ease-in-out"
                      style={{ width: getStepProgress() }}
                    ></div>
                  </div>
                </div>

                {currentStep === "shipping" && (
                  <ShippingForm
                    onNext={handleShippingNext}
                    initialData={shippingData || undefined}
                  />
                )}

                {currentStep === "payment" && (
                  <PaymentForm
                    onNext={handlePaymentNext}
                    onBack={() => setCurrentStep("shipping")}
                    initialMethod={paymentMethod}
                    walletBalance={walletBalance}
                    onFileChange={setProofFile}
                  />
                )}

                {currentStep === "review" && shippingData && (
                  <ReviewOrder
                    shippingData={shippingData}
                    paymentMethod={paymentMethod}
                    onBack={() => setCurrentStep("payment")}
                    onPlaceOrder={handlePlaceOrder}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <OrderSummary
                shippingCost={currentShippingCost}
                discountAmount={discountAmount}
                walletDeduction={useWallet ? Math.min(walletBalance, subtotal + currentShippingCost - discountAmount) : 0}
              />

              <PromoCodeInput
                onApply={handleApplyPromo}
                onRemove={handleRemovePromo}
                appliedCode={appliedPromo}
              />

              <WalletBalanceSection
                balance={walletBalance}
                isUsing={useWallet}
                onToggle={() => setUseWallet(!useWallet)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Overlays & Modals */}
      <AnimatePresence>
        {isSubmitting && <ProcessingOverlay message={proofFile ? "Uploading receipt & crafting order..." : "Finalizing your fragrance order..."} />}
      </AnimatePresence>

      <FailureModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={orderError || ""}
      />
    </div>
  );
}

