"use client";

import { Building2, Calendar, Globe, Home, Phone, User } from "lucide-react";
import { InputField } from "./InputField";
import { useState } from "react";
import { toast } from "sonner";

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  deliveryOption: 'standard' | 'express' | 'custom';
  deliveryDate?: string;
}

interface ShippingFormProps {
  onNext: (data: ShippingData) => void;
  initialData?: ShippingData;
}

export default function ShippingForm({ onNext, initialData }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingData>(initialData || {
    fullName: "",
    address: "",
    city: "",
    country: "Egypt",
    phone: "",
    deliveryOption: "standard",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleOptionChange = (option: 'standard' | 'express' | 'custom') => {
    setFormData(prev => ({ ...prev, deliveryOption: option }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!formData.fullName || !formData.address || !formData.city || !formData.phone) {
      toast.error("Please fill in all contact details.");
      return;
    }

    if (formData.deliveryOption === 'custom' && !formData.deliveryDate) {
      toast.error("Please select a delivery date.");
      return;
    }

    onNext(formData);
  };

  // Min date for custom calculation (2 days from now)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Contact Details */}
        <div className="space-y-4">
          <div className="flex flex-col relative">
            <label className="text-sm text-gray-400 mb-1" htmlFor="fullName">
              Full Name
            </label>
            <InputField
              id="fullName"
              icon={<User />}
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm text-gray-400 mb-1" htmlFor="address">
              Address
            </label>
            <InputField
              id="address"
              icon={<Home />}
              type="text"
              placeholder="123 Perfume Lane"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col relative">
              <label className="text-sm text-gray-400 mb-1" htmlFor="city">
                City
              </label>
              <InputField
                id="city"
                icon={<Building2 />}
                type="text"
                placeholder="Fragranceville"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm text-gray-400 mb-1" htmlFor="country">
                Country
              </label>
              <InputField
                id="country"
                icon={<Globe className="text-white" />}
                type="text"
                placeholder="Egypt"
                value={formData.country}
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm text-gray-400 mb-1" htmlFor="phone">
              Phone Number
            </label>
            <InputField
              id="phone"
              icon={<Phone />}
              type="text"
              placeholder="+20 10 2880 6961"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Delivery Options */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h3 className="text-lg font-medium text-white mb-2">Delivery Options</h3>



          {/* Express */}
          <label
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.deliveryOption === 'express'
              ? 'bg-secondary/10 border-secondary ring-1 ring-secondary'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                className="accent-secondary"
                checked={formData.deliveryOption === 'express'}
                onChange={() => handleOptionChange('express')}
              />
              <div>
                <p className="font-semibold text-white">Express Delivery</p>
                <p className="text-sm text-gray-400">Within 4 hours</p>
              </div>
            </div>
            <span className="text-amber-400 font-bold">+90 LE</span>
          </label>
          {/* Standard */}
          <label
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.deliveryOption === 'standard'
              ? 'bg-secondary/10 border-secondary ring-1 ring-secondary'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                className="accent-secondary"
                checked={formData.deliveryOption === 'standard'}
                onChange={() => handleOptionChange('standard')}
              />
              <div>
                <p className="font-semibold text-white">Standard Delivery</p>
                <p className="text-sm text-gray-400">Within 24 hours</p>
              </div>
            </div>
            <span className="text-amber-400 font-bold">Free</span>
          </label>
          {/* Custom */}
          <label
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.deliveryOption === 'custom'
              ? 'bg-secondary/10 border-secondary ring-1 ring-secondary'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                className="accent-secondary"
                checked={formData.deliveryOption === 'custom'}
                onChange={() => handleOptionChange('custom')}
              />
              <div>
                <p className="font-semibold text-white">Custom Date</p>
                <p className="text-sm text-gray-400">Select a specific date (+2 days)</p>
              </div>
            </div>
            <span className="text-amber-400 font-bold">Standard</span>
          </label>

          {/* Date Picker for Custom */}
          {formData.deliveryOption === 'custom' && (
            <div className="animate-in fade-in slide-in-from-top-2 pt-2">
              <label htmlFor="deliveryDate" className="text-sm text-gray-200 mb-1 block">Preferred Date</label>
              <InputField
                id="deliveryDate"
                type="date"
                icon={<Calendar />}
                min={minDateStr}
                value={formData.deliveryDate || ''}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                required
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-secondary px-8 py-3 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-amber-600/20"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </>
  );
}

