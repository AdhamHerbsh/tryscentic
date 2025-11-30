"use client";
import { useState } from "react";
import { Search, ShoppingCart, Menu, X, SquareArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const {
    cartItems,
    totalItems,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/pages/shop" },
    { name: "Wallet", href: "#wallet" },
    { name: "About Us", href: "/pages/about-us" },
    { name: "Contact Us", href: "/pages/contact-us" },
  ];

  return (
    <>
      <header
        className="fixed bg-accent text-white font-bold z-50 w-full"
        data-aos="slide-down"
      >
        <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <h1 className="text-2xl font-bold tracking-wider sm:text-3xl">
                TRYSCENTIC
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-amber-400 lg:text-base"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Top-Up Button - Hidden on small screens */}
              <button className="hidden sm:flex items-center gap-2 rounded-md bg-secondary text-black px-3 py-1.5 font-semibold transition-all hover:bg-amber-700 hover:border-amber-700 lg:px-4 lg:py-2 cursor-pointer">
                <span>Top-Up</span>
                <SquareArrowUp />
              </button>

              {/* Search Bar - Hidden on mobile, show on tablet+ */}
              <div className="hidden md:flex items-center gap-2 rounded-lg bg-black bg-opacity-30 px-4 py-2 lg:w-64">
                <Search className="h-4 w-4 text-orange-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-orange-400 outline-none"
                />
              </div>

              {/* Search Icon for Mobile */}
              <button className="md:hidden rounded-lg p-2 transition-colors hover:bg-white hover:bg-opacity-10">
                <Search className="h-5 w-5" />
              </button>

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-full p-2 transition-colors hover:bg-white hover:text-black"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
                  {totalItems}
                </span>
              </button>
              {/* User Avatar */}
              <Link
                href="/pages/user-dashboard"
                className="h-9 w-9 overflow-hidden rounded-full border-2 border-amber-600 transition-transform hover:scale-105 sm:h-10 sm:w-10"
              >
                <Image
                  className="h-full w-full object-cover"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  unoptimized
                />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden rounded-full p-2 transition-colors hover:bg-white hover:bg-opacity-10"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="border-t border-amber-900 py-4 md:hidden">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-base font-medium transition-colors hover:text-amber-400"
                  >
                    {link.name}
                  </a>
                ))}
                {/* Mobile Top-Up Button */}
                <button className="flex items-center justify-center gap-2 rounded-md border-2 border-amber-600 bg-amber-600 px-4 py-2 text-sm font-semibold transition-all hover:bg-amber-700">
                  <span>Top-Up</span>
                  <SquareArrowUp className="h-4 w-4" />
                </button>
                {/* Mobile Search */}
                <div className="flex items-center gap-2 rounded-lg bg-black bg-opacity-30 px-4 py-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none"
                  />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 z-100 backdrop-blur transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <aside
            className="fixed right-0 top-0 z-150 flex h-screen w-full max-w-md flex-col bg-white text-black shadow-2xl"
            data-aos="slide-left"
          >
            <header className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Bag
                </p>
                <h2 className="text-xl font-semibold">
                  {totalItems} item{totalItems !== 1 && "s"}
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100"
                aria-label="Close cart drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Your cart is empty. Start exploring our fragrances!
                </p>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-4 rounded-lg border p-3"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-semibold">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs uppercase tracking-widest text-gray-400 transition hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-full border">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-3 py-1 text-lg font-semibold text-gray-600 transition hover:bg-gray-100"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-4 text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-3 py-1 text-lg font-semibold text-gray-600 transition hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <footer className="border-t px-6 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-lg font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={clearCart}
                  className="w-1/3 rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-black hover:text-gray-50"
                >
                  Clear All
                </button>
                <Link
                  href="/pages/checkout"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold uppercase text-white transition hover:bg-gray-50 hover:text-gray-600"
                >
                  Checkout
                </Link>
              </div>
            </footer>
          </aside>
        </>
      )}
    </>
  );
}