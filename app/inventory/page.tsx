
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import vehiclesFile from '../../data/vehicles.json';

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

type CategoryKey = string;

type InventoryVehicle = Vehicle & {
  displayName: string;
  fuelLabel: string;
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

const inventoryVehicles: InventoryVehicle[] = vehicles.map((vehicle) => ({
  ...vehicle,
  displayName: formatVehicleName(vehicle),
  fuelLabel: vehicle.fuelType
}));

const baseCategoryOrder: string[] = [
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

const derivedCategoryKeys = Array.from(
  new Set(inventoryVehicles.flatMap((vehicle) => vehicle.categories))
).filter((category) => category !== 'all');

const categories: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All Vehicles' },
  ...derivedCategoryKeys
    .sort((a, b) => {
      const indexA = baseCategoryOrder.indexOf(a);
      const indexB = baseCategoryOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }
      if (indexA === -1) {
        return 1;
      }
      if (indexB === -1) {
        return -1;
      }
      return indexA - indexB;
    })
    .map((category) => ({
      key: category,
      label: formatCategoryLabel(category)
    }))
];

const sortOptions = [
  { key: 'name', label: 'Name' },
  { key: 'priceAsc', label: 'Price: Low to High' },
  { key: 'priceDesc', label: 'Price: High to Low' },
  { key: 'year', label: 'Year: Newest' }
] as const;

type SortKey = (typeof sortOptions)[number]['key'];


const highlights = [
  {
    title: 'Quality Guaranteed',
    description: 'Every vehicle undergoes comprehensive inspection and comes with our quality guarantee.'
  },
  {
    title: 'Best Prices',
    description: 'Competitive pricing with transparent costs and no hidden fees. Get the best value for your money.'
  },
  {
    title: 'Expert Service',
    description: 'Our experienced team provides personalized service to help you find your perfect vehicle.'
  },
  {
    title: 'Quick Process',
    description: 'Streamlined buying process that gets you behind the wheel faster with minimal paperwork.'
  }
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);

const formatMileage = (value: number) => `${value.toLocaleString()} miles`;

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const primaryNavLinks = useMemo(
    () => [
      { href: '/', label: 'Home' },
      { href: '/inventory', label: 'Inventory' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' }
    ],
    []
  );

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const vehiclesByCategory =
      selectedCategory === 'all'
        ? inventoryVehicles
        : inventoryVehicles.filter((vehicle) => vehicle.categories.includes(selectedCategory));

    const vehiclesBySearch = query
      ? vehiclesByCategory.filter((vehicle) => {
          const searchableText = [
            vehicle.displayName,
            vehicle.make,
            vehicle.model,
            vehicle.trim ?? '',
            vehicle.bodyStyle,
            vehicle.fuelLabel,
            vehicle.location.city,
            vehicle.location.state,
            vehicle.categories.join(' '),
            vehicle.features.join(' '),
            vehicle.description
          ]
            .join(' ')
            .toLowerCase();

          return searchableText.includes(query);
        })
      : vehiclesByCategory;

    const sortedVehicles = [...vehiclesBySearch].sort((a, b) => {
      switch (sortKey) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'year':
          return b.year - a.year;
        case 'name':
        default:
          return a.displayName.localeCompare(b.displayName);
      }
    });

    return sortedVehicles;
  }, [searchQuery, selectedCategory, sortKey]);

  const activeVehicle = useMemo(
    () => filteredVehicles.find((vehicle) => vehicle.id === activeVehicleId) ?? null,
    [filteredVehicles, activeVehicleId]
  );

  const closeActiveVehicle = () => setActiveVehicleId(null);

  return (
    <div className="flex min-h-screen flex-col bg-white">
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
                className={`transition hover:text-primary ${link.href === '/inventory' ? 'text-primary' : ''}`}
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
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Inventory</p>
              <h1 className="text-4xl font-bold text-slate-900">Our Premium Inventory</h1>
              <p className="text-base text-slate-600">
                Explore our carefully curated selection of quality vehicles, each inspected and certified for your peace of
                mind.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex w-full flex-col gap-4">
                <label htmlFor="inventory-search" className="sr-only">
                  Search inventory
                </label>
                <div className="relative max-w-xl">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M21.707 20.293 17.32 15.9A8 8 0 1 0 15.9 17.32l4.387 4.387a1 1 0 0 0 1.414-1.414ZM5 11a6 6 0 1 1 6 6 6.007 6.007 0 0 1-6-6Z" />
                  </svg>
                  <input
                    id="inventory-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by model, feature, location, or keyword"
                    className="w-full rounded-full border border-slate-200 bg-white py-3 ps-12 pe-5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                  {categories.map((category) => {
                    const isActive = selectedCategory === category.key;
                    return (
                      <button
                        key={category.key}
                        type="button"
                        onClick={() => setSelectedCategory(category.key)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-blue-900/30'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-primary/60 hover:text-primary'
                        }`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-slate-600 lg:justify-end">
                <span>Sort by:</span>
                <select
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value as SortKey)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              Showing {filteredVehicles.length} of {inventoryVehicles.length} vehicles
            </div>

            <div className="mt-10">
              {filteredVehicles.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm shadow-blue-900/10">
                  <h2 className="text-xl font-semibold text-slate-900">No vehicles match your search.</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Try adjusting your keywords or selecting a different category to explore more options.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredVehicles.map((vehicle) => (
                    <article
                      key={vehicle.id}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-56">
                        <Image
                          src={vehicle.image}
                          alt={vehicle.displayName}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                          {vehicle.year}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-4 p-6">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">{vehicle.displayName}</h2>
                          <p className="mt-1 text-primary text-xl font-bold">{formatCurrency(vehicle.price)}</p>
                          <p className="mt-3 text-sm text-slate-600">{vehicle.description}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm0 16a7 7 0 1 1 7-7 7.008 7.008 0 0 1-7 7Zm.5-11h-1v5l4.25 2.52.5-.86-3.75-2.18Z" />
                            </svg>
                            {formatMileage(vehicle.mileage)}
                          </span>
                          <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M17 3H7a2 2 0 0 0-2 2v14l7-3 7 3V5a2 2 0 0 0-2-2Zm0 13.17-5-2.15-5 2.15V5h10Z" />
                            </svg>
                            {vehicle.fuelLabel}
                          </span>
                        </div>
                        <div className="mt-auto flex gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveVehicleId(vehicle.id)}
                            className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-accent"
                          >
                            View Details
                          </button>
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
              )}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center">
            <div className="lg:w-1/2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why Choose Muke Deals?</p>
              <h2 className="text-3xl font-bold text-slate-900">Your Trusted Partner in the Car-Buying Journey</h2>
              <p className="text-slate-600">
                With over 15 years of experience in the automotive industry, we have built our reputation on delivering
                exceptional customer service and premium vehicles tailored to your needs.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="tel:5551234567"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                >
                  Call Us Today
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Visit Our Showroom
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl lg:w-1/2">
                <Image
                  src="/images/pexels-mikebirdy-170811.jpg"
                  alt="Muke Deals sales team ready to assist"
                  width={640}
                  height={480}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
              </div>
              <div className="absolute -top-6 right-6 rounded-2xl bg-white px-6 py-4 text-center shadow-lg shadow-slate-900/10">
                <p className="text-3xl font-bold text-primary">2500+</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Happy Customers</p>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl bg-primary px-6 py-4 text-center text-white shadow-lg shadow-blue-900/30">
                <p className="text-3xl font-bold">15+</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Years Experience</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Visit Us</p>
              <h2 className="text-3xl font-bold text-slate-900">Experience Muke Deals in Person</h2>
              <p className="text-base text-slate-600">
                Tour our showroom, test-drive your dream vehicle, and speak with our concierge team about exclusive financing
                and concierge services tailored to your needs.
              </p>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-center gap-3">
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
                    <path d="M12 7a5 5 0 1 1-5 5 5.006 5.006 0 0 1 5-5Zm0 12c-3.315 0-10 1.665-10 5v1h20v-1c0-3.335-6.685-5-10-5Z" />
                  </svg>
                  <span>Mon - Sat: 9AM - 7PM · Sunday: 11AM - 5PM</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="tel:5551234567"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                >
                  Call Us Today
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Schedule a Visit
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl shadow-lg shadow-slate-900/10">
              <Image
                src="/images/pexels-stephanlouis-5381501.jpg"
                alt="Stylized map graphic for the Muke Deals showroom"
                width={960}
                height={720}
                sizes="(min-width: 1024px) 480px, 100vw"
                className="h-[360px] w-full object-cover"
              />
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
                        link.href === '/inventory' ? 'bg-primary/10 text-primary' : 'bg-slate-50'
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
              <p className="mt-2">Call us at (555) 123-4567 or schedule a visit to experience our vehicles in person.</p>
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

      {activeVehicle ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl shadow-slate-900/30">
            <button
              type="button"
              onClick={closeActiveVehicle}
              className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              aria-label="Close vehicle details"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="m13.41 12 4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42L10.59 12l-4.3 4.29a1 1 0 1 0 1.42 1.42L12 13.41l4.29 4.3a1 1 0 0 0 1.42-1.42Z" />
              </svg>
            </button>

            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
                <Image
                  src={activeVehicle.image}
                  alt={activeVehicle.displayName}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              </div>

              <div className="space-y-6 p-8">
                <div>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {activeVehicle.year}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900">{activeVehicle.displayName}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {activeVehicle.location.city}, {activeVehicle.location.state} · Stock #{activeVehicle.stockNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Price</p>
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(activeVehicle.price)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Mileage</p>
                    <p className="text-lg font-semibold text-slate-900">{formatMileage(activeVehicle.mileage)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Fuel</p>
                    <p className="text-lg font-semibold text-slate-900">{activeVehicle.fuelLabel}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Drivetrain</p>
                    <p className="text-lg font-semibold text-slate-900">{activeVehicle.drivetrain}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Highlights</h3>
                  <p className="mt-2 text-sm text-slate-600">{activeVehicle.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Performance</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Horsepower</p>
                      <p className="text-base font-semibold text-slate-900">{activeVehicle.horsepower} hp</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Torque</p>
                      <p className="text-base font-semibold text-slate-900">{activeVehicle.torque} lb-ft</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">0-60 mph</p>
                      <p className="text-base font-semibold text-slate-900">{activeVehicle.zeroToSixty}s</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Top Speed</p>
                      <p className="text-base font-semibold text-slate-900">{activeVehicle.topSpeed} mph</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Features</h3>
                  <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    {activeVehicle.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <svg className="mt-1 h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M10.243 16.314 6.343 12.414a1 1 0 0 1 1.414-1.414l2.486 2.487 6.343-6.343a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeVehicle.gallery.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Gallery</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {activeVehicle.gallery.map((url) => (
                        <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100">
                          <Image
                            src={url}
                            alt={`${activeVehicle.displayName} gallery image`}
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 40vw, 90vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeActiveVehicle}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    Close
                  </button>
                  <Link
                    href="/contact"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                  >
                    Request Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

