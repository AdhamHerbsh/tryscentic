"use client";

export default function ShippingForm() {
  const PrimaryOrange = "#F0A020";
  const InputBgColor = "#473033";
  const FormMaxWidth = "max-w-4xl";
  const inputStyle = {
    backgroundColor: InputBgColor,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3))",
  };

  return (
    <div className={`lg:col-span-2 text-white ${FormMaxWidth}`}>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>


      <div className="mb-10 w-full">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-white">Shipping Information</span>
          <span className="text-white/80">Payment</span>
          <span className="text-white/80">Review Order</span>
        </div>

        <div className="w-full h-3 relative rounded overflow-hidden">
          <div
            className="h-full"
            style={{ backgroundColor: PrimaryOrange, width: "33.33%" }}
          ></div>
          <div
            className="h-full absolute top-0 right-0"
            style={{ backgroundColor: "white", width: "66.67%" }}
          ></div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

      <form className="space-y-4">

        <div className="flex flex-col relative">
          <label className="text-sm text-gray-400 mb-1" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            className="w-full p-3 rounded text-white focus:outline-none relative z-10"
            style={inputStyle}
            placeholder="John Doe"
          />
        </div>


        <div className="flex flex-col relative">
          <label className="text-sm text-gray-400 mb-1" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            className="w-full p-3 rounded text-white focus:outline-none relative z-10"
            style={inputStyle}
            placeholder="123 Perfume Lane"
          />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col relative">
            <label className="text-sm text-gray-400 mb-1" htmlFor="city">
              City
            </label>
            <input
              id="city"
              className="p-3 rounded text-white focus:outline-none relative z-10"
              style={inputStyle}
              placeholder="Fragranceville"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col relative">
            <label className="text-sm text-gray-400 mb-1" htmlFor="country">
              Country
            </label>
            <input
              id="country"
              className="p-3 rounded text-white focus:outline-none relative z-10"
              style={inputStyle}
              value="Egypt"
              disabled
              readOnly
            />
          </div>
        </div>


        <div className="flex flex-col relative">
          <label className="text-sm text-gray-400 mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            className="w-full p-3 rounded text-white focus:outline-none relative z-10"
            style={inputStyle}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className="px-6 py-3 text-white font-semibold rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: PrimaryOrange }}
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
