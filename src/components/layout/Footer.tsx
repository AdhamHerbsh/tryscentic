import SocialIcons from "@/components/parts/SocialIcons";
import NewsletterForm from "@/components/parts/NewsletterForm";

export default function Footer() {
  const shopLinks = [
    { name: "New Arrivals", href: "/#new-releases" },
    { name: "Fragrances", href: "/pagas/shop" },
    { name: "Best Sellers", href: "#best-sellers" },
    { name: "Gifts", href: "/pages/gifts" },
  ];

  const supportLinks = [
    { name: "Track Order", href: "/pages/account/orders" },
    { name: "Contact Us", href: "/pages/contact-us" },
    { name: "FAQ", href: "/#faq" },
  ];



  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Shop Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>



          {/* Stay Connected Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Stay Connected</h3>
            <p className="mb-4 text-sm text-gray-400">
              Subscribe to our newsletter for exclusive offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-800"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo */}
          <div className="px-3 py-2 bright-box">
            <h2 className="text-2xl font-serif font-bold tracking-wider">
              TRYSCENTIC™
            </h2>
            <h4>Genuine Scents, Genuine Value</h4>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © 2024 Scentify. All Rights Reserved.
          </div>

          {/* Social Media Icons */}
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}
