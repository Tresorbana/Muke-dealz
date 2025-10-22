'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import vehiclesFile from '../data/vehicles.json';

type Vehicle = {
  id: string;
  vin: string;
  stockNumber: string;
  make: string;
  model: string;
  trim?: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  drivetrain: string;
  transmission: string;
  bodyStyle: string;
  exteriorColor: string;
  interiorColor: string;
  horsepower: number;
  torque: number;
  zeroToSixty: number;
  topSpeed: number;
  range: number;
  efficiency: string;
  seating: number;
  features: string[];
  description: string;
  image: string;
  gallery: string[];
  location: { city: string; state: string };
  certified: boolean;
  categories: string[];
};

const vehicles: Vehicle[] = vehiclesFile.vehicles as Vehicle[];

function formatVehicleName(vehicle: Vehicle): string {
  const parts = [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean);
  return parts.join(' ');
}

function formatCategoryLabel(category: string): string {
  const normalized = category.replace(/-/g, ' ');
  if (category.toLowerCase() === 'suv') {
    return 'SUVs';
  }
  return normalized
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function formatMileage(value: number): string {
  return `${value.toLocaleString()} miles`;
}

const highlights = [
  {
    title: 'Quality Guaranteed',
    description: 'Every vehicle is inspected end-to-end, certified when eligible, and backed by comprehensive history reports.'
  },
  {
    title: 'Transparent Pricing',
    description: 'Access upfront pricing, financing-ready figures, and tailored payment plans without hidden fees.'
  },
  {
    title: 'Expert Concierge',
    description: 'Work with seasoned specialists who curate vehicles that match your lifestyle, budget, and must-have features.'
  },
  {
    title: 'Seamless Delivery',
    description: 'Schedule virtual walk-throughs, reserve vehicles online, and arrange delivery or pickup on your timeline.'
  }
];

type FeaturedVehicle = Vehicle & {
  displayName: string;
  formattedPrice: string;
  formattedMileage: string;
  featureHighlights: string[];
};

type CategoryShowcaseItem = {
  category: string;
  label: string;
  vehicle: Vehicle;
  displayName: string;
  formattedPrice: string;
};

const baseCategoryOrder = [
  'luxury',
  'electric',
  'hybrid',
  'performance',
  'suv',
  'sedan',
  'coupe',
  'convertible',
  'wagon',
  'truck',
  'adventure'
];

const featuredVehiclesData: FeaturedVehicle[] = (() => {
  const certified = vehicles
    .filter((vehicle) => vehicle.certified)
    .sort((a, b) => a.price - b.price);
  const additional = vehicles
    .filter((vehicle) => !vehicle.certified)
    .sort((a, b) => a.mileage - b.mileage);
  const showcase = [...certified, ...additional].slice(0, 4);

  return showcase.map((vehicle) => ({
    ...vehicle,
    displayName: formatVehicleName(vehicle),
    formattedPrice: formatCurrency(vehicle.price),
    formattedMileage: formatMileage(vehicle.mileage),
    featureHighlights: vehicle.features.slice(0, 3)
  }));
})();

const categoryShowcaseData: CategoryShowcaseItem[] = (() => {
  const categoryMap = new Map<string, Vehicle>();

  vehicles.forEach((vehicle) => {
    vehicle.categories
      .filter((category) => category !== 'all')
      .forEach((category) => {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, vehicle);
        }
      });
  });

  return Array.from(categoryMap.entries())
    .sort((a, b) => {
      const indexA = baseCategoryOrder.indexOf(a[0]);
      const indexB = baseCategoryOrder.indexOf(b[0]);
      if (indexA === -1 && indexB === -1) {
        return a[0].localeCompare(b[0]);
      }
      if (indexA === -1) {
        return 1;
      }
      if (indexB === -1) {
        return -1;
      }
      return indexA - indexB;
    })
    .slice(0, 4)
    .map(([category, vehicle]) => ({
      category,
      label: formatCategoryLabel(category),
      vehicle,
      displayName: formatVehicleName(vehicle),
      formattedPrice: formatCurrency(vehicle.price)
    }));
})();

const totalInventory = vehicles.length;
const certifiedCount = vehicles.filter((vehicle) => vehicle.certified).length;
const electricCount = vehicles.filter((vehicle) => vehicle.categories.includes('electric')).length;
const hybridCount = vehicles.filter((vehicle) => vehicle.categories.includes('hybrid')).length;
const destinationsServed = new Set(vehicles.map((vehicle) => `${vehicle.location.city}, ${vehicle.location.state}`)).size;

const inventoryInsights = [
  {
    title: 'Vehicles Available',
    value: `${totalInventory}`,
    description: 'Curated models spanning sedans, SUVs, performance cars, and family-ready rides ready for immediate delivery.'
  },
  {
    title: 'Certified Listings',
    value: `${certifiedCount}`,
    description: 'Multipoint inspected vehicles with service records, warranty options, and concierge delivery support.'
  },
  {
    title: 'Electric & Hybrid',
    value: `${electricCount + hybridCount}`,
    description: 'Plug-in and hybrid selections featuring extended range, rapid charging capability, and smart connectivity.'
  },
  {
    title: 'Cities Served',
    value: `${destinationsServed}`,
    description: 'Vehicles sourced from showrooms across major metro areas to match your location and driving style.'
  }
];

const interestOptions = [
  'Select a vehicle',
  ...featuredVehiclesData.map((vehicle) => vehicle.displayName),
  'Schedule a custom search'
];

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messageLimit = 500;
  const featuredVehicles = featuredVehiclesData;
  const categoryShowcase = categoryShowcaseData;
  const insights = inventoryInsights;

  const primaryNavLinks = useMemo(
    () => [
      { href: '/', label: 'Home' },
      { href: '/inventory', label: 'Inventory' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' }
    ],
    []
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-semibold text-primary">
            Muke Deals
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-primary ${link.href === '/' ? 'text-primary' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-semibold text-slate-600 md:inline">(555) 123-4567</span>
            <Link
              href="/contact"
              className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Visit Our Showroom
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary md:hidden"
              aria-label="Open navigation menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 6h16a1 1 0 0 0 0-2H4a1 1 0 1 0 0 2Zm16 5H4a1 1 0 1 0 0 2h16a1 1 0 0 0 0-2Zm0 7H4a1 1 0 1 0 0 2h16a1 1 0 0 0 0-2Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden" aria-labelledby="hero-heading">
          <div className="relative min-h-[70vh]">
            <Image
              src="/images/pexels-adrian-dorobantu-989175-2127733.jpg"
              alt="Luxury car showroom"
              fill
              priority
              sizes="100vw"
              className="object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-transparent" />
            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 py-24 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Premium Auto Concierge</p>
              <h1 id="hero-heading" className="mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
                Find Your Perfect <span className="text-primary">Dream Car</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-blue-100">
                Discover premium quality vehicles at unbeatable prices. Your next adventure starts right here with Muke Deals.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="#inventory"
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-accent"
                >
                  Browse Inventory
                </Link>
                <Link
                  href="#contact"
                  className="flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-dark"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="inventory" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Premium Inventory</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Explore Our Featured Vehicles</h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Explore our carefully curated selection of quality vehicles, each inspected and certified for your peace of mind.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                <span className="rounded-full bg-primary/10 px-4 py-2 text-primary">All Vehicles</span>
                {Array.from(new Set(featuredVehicles.flatMap((vehicle) => vehicle.categories)))
                  .filter((category) => category !== 'all')
                  .slice(0, 3)
                  .map((category) => (
                    <span key={category} className="rounded-full border border-slate-200 px-4 py-2">
                      {formatCategoryLabel(category)}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredVehicles.map((vehicle: FeaturedVehicle) => (
                <article key={vehicle.id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-48">
                    <Image src={vehicle.image} alt={vehicle.displayName} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      {vehicle.year}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{vehicle.displayName}</h3>
                      <p className="mt-1 text-primary text-xl font-bold">{vehicle.formattedPrice}</p>
                      <p className="mt-2 text-sm text-slate-600">{vehicle.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-primary">
                        {vehicle.featureHighlights.map((feature: string) => (
                          <span key={feature} className="rounded-full bg-primary/10 px-3 py-1">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm0 16a7 7 0 1 1 7-7 7.008 7.008 0 0 1-7 7Zm.5-11h-1v5l4.25 2.52.5-.86-3.75-2.18Z" />
                        </svg>
                        {vehicle.formattedMileage}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17 3H7a2 2 0 0 0-2 2v14l7-3 7 3V5a2 2 0 0 0-2-2Zm0 13.17-5-2.15-5 2.15V5h10Z" />
                        </svg>
                        {vehicle.fuelType}
                      </span>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <Link
                        href="/inventory"
                        className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-accent"
                      >
                        View Details
                      </Link>
                      <Link
                        href="/contact"
                        className="flex-1 rounded-full border border-primary px-4 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4 text-sm text-slate-600">
                <p className="text-base font-semibold text-slate-900">Why these models?</p>
                <p>
                  We highlight certified and low-mileage arrivals first, ensuring you get access to vehicles with the best warranty
                  coverage, maintenance history, and long-term value. Explore the full catalog for additional trims, specs, and colors.
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{certifiedCount} certified vehicles</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{electricCount} electric</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{hybridCount} hybrid</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Serving {destinationsServed} cities</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                  Showing {featuredVehicles.length} spotlight vehicles · Explore all {totalInventory} models in our inventory
                </p>
                <Link
                  href="/inventory"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                >
                  Load More Vehicles
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="why-us" className="bg-light py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why Choose Muke Deals?</p>
              <h2 className="text-3xl font-bold text-slate-900">Built on Trust, Quality, and Exceptional Service</h2>
              <p className="text-slate-600">
                With over 15 years of experience in the automotive industry, we have built our reputation on delivering exceptional customer service and premium vehicles.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <div key={highlight.title} className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.285 6.709a1 1 0 0 0-1.414-1.414l-8.864 8.863-4.293-4.292a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 1.414 0Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{highlight.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <Image
                  src="/images/pexels-mikebirdy-1054211.jpg"
                  alt="Muke Deals team in showroom"
                  width={620}
                  height={520}
                  sizes="(min-width: 768px) 620px, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -right-6 top-6 rounded-2xl bg-white px-6 py-4 text-center shadow-lg shadow-slate-900/10">
                <p className="text-3xl font-bold text-primary">2500+</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Happy Customers</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Browse by Category</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Tailored Selections for Every Lifestyle</h2>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>Featured:</span>
                <span className="rounded-full border border-slate-200 px-4 py-2">Top categories this week</span>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {categoryShowcase.map((item: CategoryShowcaseItem) => (
                <article key={item.vehicle.id} className="group rounded-3xl bg-light p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative mb-4 h-40 overflow-hidden rounded-2xl">
                    <Image src={item.vehicle.image} alt={item.displayName} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      {item.vehicle.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.displayName}</h3>
                  <p className="mt-1 text-primary text-xl font-bold">{item.formattedPrice}</p>
                  <p className="mt-3 text-sm text-slate-600">{item.vehicle.description}</p>
                  <div className="mt-4 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm shadow-blue-200">
                    {item.label}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-light py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Get In Touch</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Ready to find your perfect vehicle?</h2>
              <p className="mt-3 text-base text-slate-600">
                Contact us today and let our experts help you drive away in your dream car.
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <form className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-900/5">
                <h3 className="text-xl font-semibold text-slate-900">Send Us a Message</h3>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Full Name
                    <input
                      type="text"
                      placeholder="Your name"
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Email Address
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
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
                    Interested Vehicle
                    <select
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      defaultValue={interestOptions[0]}
                    >
                      {interestOptions.map((option) => (
                        <option key={option} disabled={option === interestOptions[0]} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Message
                    <textarea
                      rows={4}
                      placeholder="Tell us about your vehicle needs, preferred features, budget range, or any questions you have..."
                      maxLength={messageLimit}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-right text-xs font-medium text-slate-400">
                      {message.length}/{messageLimit} characters
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                >
                  Submit Inquiry
                </button>
              </form>
              <div className="grid gap-6">
                <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-900/5">
                  <h3 className="text-xl font-semibold text-slate-900">Visit Our Showroom</h3>
                  <div className="mt-4 space-y-4 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 3-3 3.003 3.003 0 0 1-3 3Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Address</p>
                        <p>123 Auto Plaza, Car City, CC 12345</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M6.62 10.79a15.09 15.09 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1 17 17 0 0 1-17-17 1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.25 1Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Phone</p>
                        <p>(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M16 2H8a2 2 0 0 0-2 2v16l6-3 6 3V4a2 2 0 0 0-2-2Zm0 13.17-4-2-4 2V4h8Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Email</p>
                        <p>info@mkudeals.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Hours</p>
                        <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                        <p>Sunday: 11:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg shadow-slate-900/10">
                  <Image
                    src="/images/pexels-quintingellar-313779.jpg"
                    alt="Map placeholder highlighting the Muke Deals showroom neighborhood"
                    width={960}
                    height={640}
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="h-[260px] w-full object-cover"
                  />
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

      {isMenuOpen ? (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm md:hidden">
          <div className="ml-auto flex h-full w-72 max-w-full flex-col bg-white shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <span className="text-lg font-semibold text-slate-900">Muke Deals</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Close navigation menu"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="m13.41 12 4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42L10.59 12l-4.3 4.29a1 1 0 1 0 1.42 1.42L12 13.41l4.29 4.3a1 1 0 0 0 1.42-1.42Z" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-4 text-sm font-semibold text-slate-700">
                {primaryNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block rounded-full px-4 py-2 transition hover:bg-primary hover:text-white ${
                        link.href === '/' ? 'bg-primary/10 text-primary' : 'bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-slate-200 px-6 py-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Need assistance?</p>
              <p className="mt-2">Call us at (555) 123-4567 or visit our showroom to explore vehicles in person.</p>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      ) : null}

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
