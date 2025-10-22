'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const faqItems = [
  {
    question: 'What services does Muke Deals provide?',
    answer:
      'We offer concierge-level support for sourcing, inspecting, financing, and delivering premium pre-owned and luxury vehicles.'
  },
  {
    question: 'Can I schedule a virtual consultation?',
    answer:
      'Absolutely. Book a video consultation with our concierge team to review vehicles, financing, and delivery options from home.'
  },
  {
    question: 'Do you accept trade-ins?',
    answer:
      'Yes. We provide trade-in evaluations, coordinate appraisals, and apply the value toward your next Muke Deals vehicle.'
  }
];

const interestOptions = [
  'Select a vehicle',
  'SUVs & Crossovers',
  'Luxury Sedans',
  'Electric Vehicles',
  'Family Vans',
  'Trucks & Utility'
];

export default function ContactPage() {
  const [message, setMessage] = useState('');
  const messageLimit = 500;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-semibold text-primary">
            Muke Deals
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            <Link href="/" className="transition hover:text-primary">
              Home
            </Link>
            <Link href="/inventory" className="transition hover:text-primary">
              Inventory
            </Link>
            <Link href="/about" className="transition hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-primary transition hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-semibold text-slate-600 md:inline">(555) 123-4567</span>
            <Link
              href="tel:5551234567"
              className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Call Us
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Contact Muke Deals</p>
              <h1 className="text-4xl font-bold text-slate-900">Let&apos;s Drive Your Vision Forward</h1>
              <p className="text-base text-slate-600">
                Reach out to our concierge team for personalized assistance. We&apos;re here to help you explore vehicles, schedule
                appointments, and answer every question along the way.
              </p>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
              <form className="rounded-3xl bg-light p-8 shadow-lg shadow-slate-900/5">
                <h2 className="text-2xl font-semibold text-slate-900">Send Us a Message</h2>
                <p className="mt-3 text-sm text-slate-600">
                  Share your goals, preferred vehicles, or desired appointment time and our concierge will respond within 24 hours.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Full Name
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Email Address
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Phone Number
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Preferred Vehicle Type
                    <select
                      defaultValue={interestOptions[0]}
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {interestOptions.map((option) => (
                        <option key={option} disabled={option === interestOptions[0]} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-600">
                    How can we help?
                    <textarea
                      rows={4}
                      maxLength={messageLimit}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Tell us about your dream car, timeline, or any questions you have..."
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-xs text-slate-500">{message.length} / {messageLimit} characters</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                >
                  Submit Message
                </button>
              </form>

              <div className="space-y-8">
                <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-900/5">
                  <h2 className="text-2xl font-semibold text-slate-900">Showroom & Concierge</h2>
                  <div className="mt-6 space-y-4 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 3-3 3.003 3.003 0 0 1-3 3Z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900">Visit Our Showroom</p>
                        <p>123 Auto Plaza, Car City, CC 12345</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M6.62 10.79a15.09 15.09 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1 17 17 0 0 1-17-17 1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.25 1Z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900">Call the Concierge</p>
                        <p>(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M2.062 6.5A1.5 1.5 0 0 1 3.5 5h17a1.5 1.5 0 0 1 1.438 1.88l-2.25 9A1.5 1.5 0 0 1 18.25 17H5.75a1.5 1.5 0 0 1-1.438-1.12l-2.25-9A1.5 1.5 0 0 1 2.062 6.5ZM12 12.75 19.413 7H4.587Z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900">Email Us</p>
                        <p>info@mkudeals.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 7a5 5 0 1 1-5 5 5.006 5.006 0 0 1 5-5Zm0 12c-3.315 0-10 1.665-10 5v1h20v-1c0-3.335-6.685-5-10-5Z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900">Hours</p>
                        <p>Mon - Sat: 9AM - 7PM</p>
                        <p>Sunday: 11AM - 5PM</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 overflow-hidden rounded-2xl">
                    <Image
                      src="/images/pexels-stephanlouis-5381501.jpg"
                      alt="Stylized map showing the Muke Deals showroom location"
                      width={960}
                      height={640}
                      sizes="(min-width: 768px) 480px, 100vw"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                </div>

                <div className="rounded-3xl bg-light p-8 shadow-lg shadow-slate-900/5">
                  <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
                  <div className="mt-6 space-y-4">
                    {faqItems.map((item) => (
                      <details key={item.question} className="rounded-2xl bg-white p-5 shadow-sm shadow-blue-900/10">
                        <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                          {item.question}
                        </summary>
                        <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm shadow-blue-900/10">
                    Prefer a personal touch? Call our concierge at{' '}
                    <a href="tel:5551234567" className="font-semibold text-primary hover:text-accent">
                      (555) 123-4567
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:info@mkudeals.com" className="font-semibold text-primary hover:text-accent">
                      info@mkudeals.com
                    </a>
                    .
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-dark py-12 text-blue-100">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-semibold text-white">
              Muke Deals
            </Link>
            <p className="text-sm leading-relaxed text-blue-200">
              Your trusted partner in finding the perfect vehicle. We offer a wide selection of quality pre-owned cars with
              transparent pricing and exceptional service.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                aria-label="Visit our Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-primary"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12a10 10 0 1 0-11.563 9.875v-7h-2v-2.875h2v-2.2c0-2 1.2-3.11 3.033-3.11.88 0 1.8.157 1.8.157v1.98h-1.013c-.997 0-1.307.62-1.307 1.258v1.916h2.23L14.4 14.88h-1.95v7A10 10 0 0 0 22 12Z" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="Visit our Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-primary"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 5.924a6.788 6.788 0 0 1-1.885.517 3.295 3.295 0 0 0 1.443-1.816 6.555 6.555 0 0 1-2.082.783 3.28 3.28 0 0 0-5.63 2.248 3.4 3.4 0 0 0 .084.748 9.324 9.324 0 0 1-6.767-3.43 3.28 3.28 0 0 0 1.016 4.381 3.242 3.242 0 0 1-1.487-.41v.041a3.283 3.283 0 0 0 2.632 3.218 3.3 3.3 0 0 1-1.485.056 3.287 3.287 0 0 0 3.067 2.28 6.587 6.587 0 0 1-4.862 1.36A9.29 9.29 0 0 0 8.29 19c6.036 0 9.33-5.002 9.33-9.337 0-.142-.004-.283-.011-.423A6.675 6.675 0 0 0 22 5.924Z" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="Visit our Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-primary"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 7a5 5 0 1 0 5 5 5.006 5.006 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3 3.007 3.007 0 0 1-3 3Zm6.5-8.75a1.25 1.25 0 1 1-1.25-1.25 1.25 1.25 0 0 1 1.25 1.25ZM12 2c-2.7 0-3.042.011-4.105.06a6.012 6.012 0 0 0-4.233 1.638A6 6 0 0 0 2.06 7.939C2.011 9.007 2 9.35 2 12s.011 3 .06 4.061a6 6 0 0 0 1.6 4.232 6 6 0 0 0 4.239 1.6C8.965 21.989 9.305 22 12 22s3.042-.011 4.1-.06a6 6 0 0 0 4.239-1.6 6 6 0 0 0 1.6-4.232C21.989 15.035 22 14.695 22 12s-.011-3-.06-4.1a6 6 0 0 0-1.6-4.239 6 6 0 0 0-4.232-1.6C15.039 2.011 14.7 2 12 2Zm0 2c2.639 0 2.957.01 4.005.058a4 4 0 0 1 2.666.98 4 4 0 0 1 1 2.658C19.719 8.753 19.73 9.051 19.73 12s-.01 3.247-.059 4.305a4 4 0 0 1-.98 2.666 4 4 0 0 1-2.658 1c-1.05.05-1.357.059-4.033.059s-2.984-.01-4.033-.06a4 4 0 0 1-2.658-.98 4 4 0 0 1-1-2.658C4.28 15.2 4.27 14.9 4.27 12s.01-3.247.059-4.305a4 4 0 0 1 .98-2.666 4 4 0 0 1 2.658-1C9.015 4.011 9.322 4 12 4Z" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-blue-200">
              <Link href="/inventory" className="transition hover:text-white">
                View Inventory
              </Link>
              <Link href="/services" className="transition hover:text-white">
                Financing Options
              </Link>
              <Link href="/trade-in" className="transition hover:text-white">
                Trade-In Value
              </Link>
              <Link href="/warranty" className="transition hover:text-white">
                Warranty Info
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3 text-sm text-blue-200">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 3-3 3.003 3.003 0 0 1-3 3Z" />
                </svg>
                <span>123 Auto Plaza, Car City, CC 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.62 10.79a15.09 15.09 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1 17 17 0 0 1-17-17 1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.25 1Z" />
                </svg>
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M2.062 6.5A1.5 1.5 0 0 1 3.5 5h17a1.5 1.5 0 0 1 1.438 1.88l-2.25 9A1.5 1.5 0 0 1 18.25 17H5.75a1.5 1.5 0 0 1-1.438-1.12l-2.25-9A1.5 1.5 0 0 1 2.062 6.5ZM12 12.75 19.413 7H4.587Z" />
                </svg>
                <span>info@mkudeals.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 7a5 5 0 1 1-5 5 5.006 5.006 0 0 1 5-5Zm0 12c-3.315 0-10 1.665-10 5v1h20v-1c0-3.335-6.685-5-10-5Z" />
                </svg>
                <span>Mon - Sat: 9AM - 7PM · Sunday: 11AM - 5PM</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Stay Connected</h4>
            <p className="text-sm text-blue-200">
              Join our newsletter to receive the latest arrivals, exclusive offers, and car buying tips.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-blue-300 sm:flex-row">
          <p>© {new Date().getFullYear()} Muke Deals. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="transition hover:text-white">
              Financing Options
            </Link>
          </div>
        </div>
      </footer>

      <Link
        href="/contact"
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/40 transition hover:bg-primary"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
        </span>
        Talk with Us
      </Link>
    </div>
  );
}
