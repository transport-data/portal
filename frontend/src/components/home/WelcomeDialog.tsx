import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenWelcome");
    if (!seen) {
      setTimeout(() => setIsOpen(true), 500);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  const handleChoice = (choice: "user" | "provider") => {
    localStorage.setItem("hasSeenWelcome", "true");
    localStorage.setItem("userType", choice);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#006064] px-4 py-3 text-white shadow-lg transition-all hover:bg-[#006064]/90 hover:shadow-xl hover:scale-105 group"
          aria-label="Open Quick Start Guide"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:max-w-xs">
            Quick Start
          </span>
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full Header */}
            <div className="relative bg-[#006064] px-8 py-8 md:px-12 md:py-10">
              {/* Decorative circles */}
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-10 right-24 h-28 w-28 rounded-full bg-white/5" />
              <div className="absolute bottom-4 right-8 h-12 w-12 rounded-full bg-[#DFF64D]/20" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Logo + Title */}
              <div className="flex flex-col items-center gap-4 text-center">
                <Image
                  src="/images/logos/tdc-logo.svg"
                  alt="TDC"
                  width={180}
                  height={20}
                  className="brightness-0 invert"
                />
                <div className="h-0.5 w-12 rounded-full bg-[#DFF64D]" />
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Welcome to the Transport Data Commons
                </h2>
                <p className="text-base text-white/75">
                  How would you like to get started?
                </p>
              </div>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2">
              {/* Data User Card */}
              <Link
                href="/datasets"
                onClick={() => handleChoice("user")}
                className="group relative flex flex-col overflow-hidden border-r border-gray-100 transition-all hover:bg-[#006064]/5"
              >
                {/* Illustration */}
                <div className="relative w-full h-64 overflow-hidden bg-[#EBF8FF]">
                  <Image
                    src="/images/data-user-viz.png"
                    alt="Data User"
                    width={576}
                    height={576}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Bottom fade */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#EBF8FF] to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-col px-7 pb-7 pt-2">
                  <div className="mb-2 inline-flex w-fit rounded-full bg-[#006064]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#006064]">
                    Data User
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold text-gray-900">
                    I want to explore data
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">
                    Browse and download transport datasets from around the
                    world. Explore visualizations, reports, and data for your
                    research or projects.
                  </p>
                  <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#006064] px-4 py-2 text-sm font-semibold text-white transition-all group-hover:gap-2.5">
                    Browse Datasets
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-1 w-0 bg-[#006064] transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Data Provider Card */}
              <Link
                href="/data-provider"
                onClick={() => handleChoice("provider")}
                className="group relative flex flex-col overflow-hidden transition-all hover:bg-[#DFF64D]/5"
              >
                {/* Illustration */}
                <div className="relative w-full h-64 overflow-hidden bg-[#EBF8FF]">
                  <Image
                    src="/images/data-provider-viz.png"
                    alt="Data Provider"
                    width={576}
                    height={576}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Bottom fade */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#EBF8FF] to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-col px-7 pb-7 pt-2">
                  <div className="mb-2 inline-flex w-fit rounded-full bg-[#DFF64D]/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#006064]">
                    Data Provider
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold text-gray-900">
                    I want to share data
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">
                    Share your transport data with the global community.
                    Learn how to contribute datasets and join our network of
                    data providers.
                  </p>
                  <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#DFF64D] px-4 py-2 text-sm font-semibold text-[#006064] transition-all group-hover:gap-2.5">
                    Start Contributing
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-1 w-0 bg-[#DFF64D] transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-8 py-3 text-center">
              <button
                onClick={handleClose}
                className="text-sm text-gray-400 transition-colors hover:text-gray-600"
              >
                Skip and explore the homepage →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}