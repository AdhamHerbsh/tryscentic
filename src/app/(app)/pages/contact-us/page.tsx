"use client";
import Link from "next/link";
import { useState } from "react";
import { submitContactForm } from "@/actions/contact-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ContactPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await submitContactForm(formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="relative text-white">
        {/* HERO بنفس الحجم الأصلي تمامًا */}
        <section className="h-80 flex items-center justify-center text-center">
          <div className="max-w-xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="opacity-70 text-lg">We’d love to hear from you</p>
          </div>
        </section>

        {/* الفورم ظاهر من الأول — ويتحرك بس مع السكروول */}
        <div className="px-6 py-16 relative z-10 -mt-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
            {/* FORM */}
            <div className="space-y-6">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full p-3 rounded border border-secondary outline-none bg-transparent"
                disabled={loading}
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full p-3 rounded border border-secondary outline-none bg-transparent"
                disabled={loading}
              />
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Message"
                className="w-full p-3 rounded border border-secondary h-35 max-h-70 outline-none bg-transparent"
                disabled={loading}
              />

              <div className="flex space-x-6 pt-4">
                <Link href={`https://wa.me/+201090767839?text=${formData.name}:%0A${formData.email}:%0A${formData.message}`} className="bg-green-500 px-6 py-3 rounded font-semibold hover:bg-green-600 transition flex items-center justify-center">
                  Send WhatsApp
                </Link>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-secondary px-6 py-3 rounded font-semibold hover:bg-amber-700 transition flex items-center justify-center min-w-[140px]"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Message"}
                </button>
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-30">
              <div>
                <h2 className="text-xl font-semibold">Contact</h2>
                <p>hi@green.com</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Location</h2>
                <p>Cairo, Egypt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
