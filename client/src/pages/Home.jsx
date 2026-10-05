import React, { useState } from "react";

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: "⚡",
      title: "Instant Delivery",
      desc: "Get deliveries in under 60 minutes in your city",
      color: "bg-[#0500FF]",
    },
    {
      icon: "📍",
      title: "Live Tracking",
      desc: "Track your driver live on the map with GPS precision",
      color: "bg-[#0D3483]",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      desc: "Multiple payment options & cash on delivery available",
      color: "bg-[#FFD426]",
    },
    {
      icon: "📦",
      title: "Package Safety",
      desc: "100% insurance coverage on all deliveries",
      color: "bg-[#16C9FF]",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      rating: 5,
      text: "PICK4U has revolutionized my business deliveries. Fast, reliable, and professional service every time!",
    },
    {
      name: "Priya Sharma",
      role: "Regular Customer",
      rating: 5,
      text: "The live tracking feature is amazing. I always know exactly where my package is. Highly recommended!",
    },
    {
      name: "Amit Singh",
      role: "Driver Partner",
      rating: 5,
      text: "Great platform to earn extra income. Flexible hours and good support from the PICK4U team.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers", icon: "👥" },
    { number: "5K+", label: "Deliveries Done", icon: "📦" },
    { number: "500+", label: "Driver Partners", icon: "🚚" },
    { number: "30min", label: "Avg Delivery Time", icon: "⏱️" },
  ];

  const services = [
    {
      title: "Same Hour Delivery",
      desc: "Ultra-fast delivery for urgent packages",
      icon: "⚡",
      price: "Starting ₹99",
    },
    {
      title: "Same Day Delivery",
      desc: "Deliver within the same day across city",
      icon: "📦",
      price: "Starting ₹49",
    },
    {
      title: "Standard Delivery",
      desc: "Economical delivery in 24-48 hours",
      icon: "🚚",
      price: "Starting ₹29",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#000000] to-[#0500FF] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <span className="mr-2">🚚</span>
                India's Fastest Growing Delivery Platform
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Fast. Reliable.
                <br />
                <span className="text-[#FFD426]">Local Deliveries.</span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                Book same-hour, same-day or standard deliveries with real-time
                tracking, trusted drivers, and unbeatable service across India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 bg-[#FFD426] text-black rounded-xl font-bold hover:bg-[#ffd426]/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  <span>📦</span>
                  Book Delivery Now
                  <span>→</span>
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/30 flex items-center justify-center gap-2">
                  <span>▶️</span>
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="flex-1 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFD426]/20 rounded-full filter blur-3xl"></div>
                <div className="relative text-9xl text-center">🚚</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-[#0500FF]">PICK4U</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of delivery services with our cutting-edge
              technology and dedicated support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-gray-100"
              >
                <div
                  className={`${feature.color} bg-opacity-10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 text-3xl`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-[#0500FF]">Services</span>
            </h2>
            <p className="text-xl text-gray-600">
              Choose the delivery speed that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.desc}</p>
                <div className="text-[#0500FF] font-bold text-xl mb-4">
                  {service.price}
                </div>
                <button className="w-full py-3 bg-[#0500FF] text-white rounded-lg font-semibold hover:bg-[#0500FF]/90 transition-all flex items-center justify-center gap-2">
                  Select Service
                  <span>›</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0500FF] to-[#0D3483] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              What Our <span className="text-[#FFD426]">Community</span> Says
            </h2>
            <p className="text-xl text-gray-200">
              Real feedback from real customers and partners
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4 gap-1">
                {Array.from(
                  { length: testimonials[activeTestimonial].rating },
                  (_, i) => (
                    <span key={i} className="text-2xl">
                      ⭐
                    </span>
                  )
                )}
              </div>
              <blockquote className="text-xl italic mb-6 text-white">
                "{testimonials[activeTestimonial].text}"
              </blockquote>
              <div className="font-bold text-white text-lg">
                {testimonials[activeTestimonial].name}
              </div>
              <div className="text-sm text-gray-300">
                {testimonials[activeTestimonial].role}
              </div>
            </div>

            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === activeTestimonial
                      ? "bg-[#FFD426] w-8"
                      : "bg-white/30 w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#FFD426] to-[#FF6B35]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers or become a driver partner and
            start earning today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-[#0500FF] text-white rounded-xl font-bold hover:bg-[#0500FF]/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <span>📦</span>
              Book Your First Delivery
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <span>🚚</span>
              Become a Driver Partner
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-bold mb-4">
            <span className="text-white">PICK</span>
            <span className="text-[#0500FF]">4U</span>
          </div>
          <p className="text-gray-400 mb-6">
            India's most trusted delivery platform connecting customers with
            reliable drivers.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 PICK4U. All rights reserved. Made in India with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
