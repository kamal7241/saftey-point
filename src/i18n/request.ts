import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Type guard to check if the locale is valid
function isValidLocale(locale: string | undefined): locale is "en" | "ar" {
  return locale === "en" || locale === "ar";
}

export default getRequestConfig(async ({ requestLocale }: { requestLocale: Promise<string | undefined> }) => {
  // Determine the locale (fallback to default if necessary)
  const resolvedLocale = await requestLocale;
  const locale: "en" | "ar" = isValidLocale(resolvedLocale) ? resolvedLocale : routing.defaultLocale;

  // Load the messages for the current locale
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});