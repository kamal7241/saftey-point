import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
export const routing = defineRouting({
  locales: ['en', 'ar'], // Regular mutable array
  localeDetection: false,
  localePrefix: 'as-needed',
  defaultLocale: 'en',
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

// Export locales and defaultLocale for use in other parts of the app
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
