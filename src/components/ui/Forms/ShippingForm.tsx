"use client";

import { Building2, Calendar, Home, Phone, User, MapPin, Map, ArrowUp10, MapPinHouse } from "lucide-react";
import { InputField } from "./InputField";
import { useState } from "react";
import { toast } from "sonner";

export interface ShippingData {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  // Detailed Address
  streetName: string;
  buildingNumber: string;
  floorNumber: string;
  apartmentNumber: string;
  specialMarque?: string;
  // Computed legacy address for backward compat if needed, or strictly use new fields
  address: string;
  // Location
  latitude?: number;
  longitude?: number;
  locationLink?: string;
  // Delivery
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
    streetName: "",
    buildingNumber: "",
    floorNumber: "",
    apartmentNumber: "",
    specialMarque: "",
    deliveryOption: "standard",
    locationLink: "",
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Egyptian phone validation: +20 followed by 10 digits (total 13 characters)
  const validateEgyptianPhone = (phone: string): boolean => {
    const egyptianPhoneRegex = /^\+20\d{10}$/;
    return egyptianPhoneRegex.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Validate phone number on change
    if (id === 'phone') {
      if (value && !validateEgyptianPhone(value)) {
        setPhoneError('Phone must be in format: +20XXXXXXXXXX (Egyptian number)');
      } else {
        setPhoneError(null);
      }
    }

    setFormData(prev => {
      const next = { ...prev, [id]: value };
      // Auto-update legacy address field
      if (['streetName', 'buildingNumber', 'floorNumber', 'apartmentNumber', 'specialMarque'].includes(id)) {
        next.address = `${next.streetName || ''}${next.buildingNumber ? ', Bldg ' + next.buildingNumber : ''}${next.floorNumber ? ', Fl ' + next.floorNumber : ''}${next.apartmentNumber ? ', Apt ' + next.apartmentNumber : ''}`;
      }
      return next;
    });
  };

  const handleOptionChange = (option: 'standard' | 'express' | 'custom') => {
    setFormData(prev => ({ ...prev, deliveryOption: option }));
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          locationLink: link
        }));

        toast.success("Location retrieved successfully!");
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        toast.error("Unable to retrieve your location. Please enter address manually.");
        setIsLoadingLocation(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!formData.fullName || !formData.streetName || !formData.buildingNumber || !formData.city || !formData.phone) {
      toast.error("Please fill in all required address details (Street, Building, etc).");
      return;
    }

    // Validate Egyptian phone number
    if (!validateEgyptianPhone(formData.phone)) {
      toast.error("Please enter a valid Egyptian phone number (+20XXXXXXXXXX)");
      setPhoneError('Phone must be in format: +20XXXXXXXXXX (Egyptian number)');
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col relative">
              <label className="text-gray-200 mb-1" htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
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
              <label className="text-gray-200 mb-1" htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <InputField
                id="phone"
                icon={<Phone />}
                type="text"
                placeholder="+20 10 2880 6961"
                value={formData.phone}
                onChange={handleChange}
                maxLength={13}
                required
              />
              {phoneError && (
                <p className="text-red-400 text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                  {phoneError}
                </p>
              )}
              {!phoneError && formData.phone && (
                <p className="text-green-400 text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                  ✓ Valid Egyptian phone number
                </p>
              )}
            </div>
          </div>

          {/* Detailed Address Section */}
          <div className="pt-2 pb-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 font-medium">Address Details</label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLoadingLocation}
                className="text-sm bg-secondary/20 text-secondary hover:bg-secondary/30 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-secondary/30"
              >
                {isLoadingLocation ? 'Locating...' : '📍 Use Current Location'}
              </button>
            </div>

            <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
              {/* Street */}
              <div className="flex flex-col relative">
                <label className="text-sm text-gray-200 mb-1" htmlFor="streetName">
                  Street Name / Area <span className="text-red-500">*</span>
                </label>
                <InputField
                  id="streetName"
                  icon={<MapPinHouse />}
                  type="text"
                  placeholder="e.g. 123 Perfume Lane, Maadi"
                  value={formData.streetName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Building Details Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col relative">
                  <label className="text-sm text-gray-200 mb-1" htmlFor="buildingNumber">
                    Bldg No <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    id="buildingNumber"
                    icon={<Building2 />}
                    type="text"
                    placeholder="12"
                    value={formData.buildingNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col relative">
                  <label className="text-sm text-gray-200 mb-1" htmlFor="floorNumber">
                    Floor
                  </label>
                  <InputField
                    id="floorNumber"
                    icon={<ArrowUp10 />}
                    type="text"
                    placeholder="3"
                    value={formData.floorNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col relative">
                  <label className="text-sm text-gray-200 mb-1" htmlFor="apartmentNumber">
                    Apt No
                  </label>
                  <InputField
                    id="apartmentNumber"
                    icon={<Home />}
                    type="text"
                    placeholder="32"
                    value={formData.apartmentNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Special Marque & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col relative">
                  <label className="text-sm text-gray-200 mb-1" htmlFor="specialMarque">
                    Special Marque (Optional)
                  </label>
                  <InputField
                    id="specialMarque"
                    icon={<MapPin />} // Reusing icon
                    type="text"
                    placeholder="Near Gas Station"
                    value={formData.specialMarque || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col relative">
                  <label className="text-sm text-gray-200 mb-1" htmlFor="city">
                    City / Governorate <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    id="city"
                    icon={<Map />}
                    type="text"
                    placeholder="Cairo"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Auto-detected Location Info */}
              {(formData.locationLink || formData.latitude) && (
                <div className="mt-2 space-y-2">
                  {/* Map Preview */}
                  {formData.latitude && formData.longitude && (
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-white/10 shadow-inner relative bg-black/50">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&hl=en&z=14&output=embed`}
                        className="filter grayscale-[20%] opacity-90 hover:opacity-100 transition-opacity"
                        title="Location Preview"
                      ></iframe>
                    </div>
                  )}

                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">📍</span>
                    <div className="text-gray-300 break-all">
                      <p className="font-semibold text-green-400 mb-1">Location Pinned</p>
                      {formData.locationLink && (
                        <a href={formData.locationLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 hover:underline mt-1 block text-sm">
                          Open in Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                <p className="text-gray-200">Within 4 hours</p>
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
                <p className="text-gray-200">Within 24 hours</p>
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
                <p className="text-gray-200">Select a specific date (+2 days)</p>
              </div>
            </div>
            <span className="text-amber-400 font-bold">Standard</span>
          </label>

          {/* Date Picker for Custom */}
          {formData.deliveryOption === 'custom' && (
            <div className="animate-in fade-in slide-in-from-top-2 pt-2">
              <label htmlFor="deliveryDate" className="text-gray-200 mb-1 block">Preferred Date</label>
              <InputField
                id="deliveryDate"
                type="date"
                icon={<Calendar />}
                min={minDateStr}
                value={formData.deliveryDate || ''}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
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
