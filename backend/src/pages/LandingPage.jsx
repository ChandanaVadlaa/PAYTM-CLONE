import React, { useState } from "react";
import {
  ArrowRight,
  CreditCard,
  Smartphone,
  Shield,
  Users,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                PayTM App
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#contact">Contact</NavLink>
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-600"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink href="#features" onClick={toggleMenu}>
                Features
              </MobileNavLink>
              <MobileNavLink href="#about" onClick={toggleMenu}>
                About
              </MobileNavLink>
              <MobileNavLink href="#contact" onClick={toggleMenu}>
                Contact
              </MobileNavLink>
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="block w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-300"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-300"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Send Money Instantly
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the fastest and most secure way to transfer money. Join
            millions of satisfied users today!
          </p>{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            <button className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition duration-300">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </section>

        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              Why Choose PayTM App?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Smartphone className="h-10 w-10 text-blue-600" />}
                title="Easy Mobile Transfers"
                description="Send money to anyone, anytime with just a few taps on your smartphone."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-blue-600" />}
                title="Secure Transactions"
                description="Bank-grade encryption and security measures to keep your money and data safe."
              />
              <FeatureCard
                icon={<CreditCard className="h-10 w-10 text-blue-600" />}
                title="Connect & Pay with Friends Seamlessly"
                description="Enjoy a friendly, intuitive interface that makes it easy to stay connected and handle payments with just a few clicks."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-blue-600" />}
                title="Effortless Payments & Friend Connections"
                description="Quickly access your contacts, split bills, and send money, making transactions with friends easier than ever before."
              />
            </div>
          </div>
        </section>

        <section id="about" className="bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                  About PayTM App
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  PayTM App is a leading digital payment and financial services
                  platform, offering fast and secure money transfers for
                  millions of users worldwide. Our mission is to make financial
                  transactions simple, quick, and accessible to everyone.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Learn more about us <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <img
                  src="https://img.freepik.com/free-vector/people-using-online-payment-mobile-app-cartoon-illustration_74855-14481.jpg?t=st=1730965131~exp=1730968731~hmac=220282cae9051770877e029124251fdbd63a1a1f991c4b7f242900754695968f&w=740"
                  alt="About PayTM App"
                  className="m-2 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              Get in Touch
            </h2>
            <div className="max-w-lg mx-auto">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        {/* Footer content */}
      </footer>
    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
    </a>
  );
}

function MobileNavLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
    >
      {children}
    </a>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
