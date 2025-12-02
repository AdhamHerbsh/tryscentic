
"use client";
import { useState } from "react";


// =======================
// 1 — PaymentOption Component
// =======================
function PaymentOption({
  label,
  description,
  value,
  disabled = false,
  active,
  onSelect,
  children,
}: any) {
  return (
    <div
      className={`
        transition-all border rounded-xl p-4 mb-4 cursor-pointer 
        ${
          disabled
            ? "opacity-40 cursor-not-allowed bg-[#3a3a3a]"
            : active
            ? "bg-[#3C2573] border-[#6240c0] text-white shadow-lg"
            : "bg-[#473033] text-white border-transparent hover:bg-[#b6b1b1]/30"
        }
      `}
      onClick={() => !disabled && onSelect(value)}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            w-4 h-4 rounded-full border 
            ${active ? "border-white bg-white" : "border-gray-300 bg-transparent"}
          `}
        />
        <div>
          <h3 className="font-semibold tracking-wide">{label}</h3>
          <p className="text-sm opacity-70">{description}</p>
        </div>
      </div>

      {active && children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}


// =======================
// 2 — ScreenshotUpload Component
// =======================
function ScreenshotUpload({ uploadedFile, setUploadedFile }: any) {
  return (
    <div className="border border-dashed border-gray-400/40 p-5 rounded-xl text-center bg-white/5">
      <p className="font-medium mb-3 tracking-wide">UPLOAD SCREENSHOT TO VERIFY YOUR ORDER</p>

      <input
        className="w-full text-sm"
        type="file"
        onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
      />

      {uploadedFile ? (
        <p className="text-sm mt-2 opacity-80">{uploadedFile.name}</p>
      ) : null}
    </div>
  );
}



// =======================
// 3 — PaymentSection Main Component
// =======================
export default function PaymentSection() {
  const [selected, setSelected] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="w-full flex justify-center px-4 md:px-0">
      <div className="flex flex-col md:flex-row gap-10 justify-center items-start max-w-6xl w-full">
        
        <div className="w-full md:w-3/4 ">
          <h2 className="text-3xl font-extrabold mb-6 tracking-wide text-white">
            SELECT YOUR PAYMENT METHOD
          </h2>

          <PaymentOption
            label="Credit or Debit Card"
            description="Pay with Visa, MasterCard or AMEX"
            value="card"
            active={selected === "card"}
            onSelect={setSelected}
          />

          <PaymentOption
            label="Apple Pay"
            description="Use your saved Apple Pay details"
            value="apple"
            active={selected === "apple"}
            onSelect={setSelected}
          />

          <PaymentOption
            label="Insta Pay"
            description="Pay instantly with InstaPay"
            value="instapay"
            active={selected === "instapay"}
            onSelect={setSelected}
          >
            <ScreenshotUpload
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
          </PaymentOption>

          <PaymentOption
            label="Vodafone Cash"
            description="Pay instantly with Vodafone"
            value="vodafone"
            active={selected === "vodafone"}
            onSelect={setSelected}
          >
            <ScreenshotUpload
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
          </PaymentOption>

          <PaymentOption
            label="Cash on Delivery"
            description="This option is currently unavailable"
            value="cod"
            disabled
            active={false}
            onSelect={setSelected}
          />

          <div className="mt-6 flex justify-end">
            <button className="bg-[#F4A028] hover:bg-[#e08e1c] transition text-white font-semibold p-3 rounded-xl tracking-wide">
              CONTINUE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
