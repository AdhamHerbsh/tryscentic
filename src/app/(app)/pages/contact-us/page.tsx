export default function ContactPage() {


  return (
    <>
      <div className="relative bg-accent text-white">
        {/* HERO بنفس الحجم الأصلي تمامًا */}
        <section className="h-80 flex items-center justify-center text-center">
          <div className="max-w-xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="opacity-70 text-lg">We’d love to hear from you</p>
          </div>
        </section>

        {/* الفورم ظاهر من الأول — ويتحرك بس مع السكروول */}
        <div className="px-6 py-16 bg-primary relative z-10 -mt-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
            {/* FORM */}
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded border border-secondary outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded border border-secondary outline-none"
              />
              <textarea
                placeholder="Message"
                className="w-full p-3 rounded border border-secondary h-35 max-h-70 outline-none"
              />

              <div className="flex space-x-6 pt-4">
                <button className="bg-green-500 px-6 py-3 rounded font-semibold hover:bg-green-600 transition">
                  Send WhatsApp
                </button>
                <button className="bg-secondary px-6 py-3 rounded font-semibold hover:bg-amber-700 transition">
                  Send Message
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
