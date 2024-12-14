import { fetchMessages } from '@/i18n/server';
import { NextIntlClientProvider } from 'next-intl';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Update params type
}) {
  const { locale } = await params; // Await the resolved params object
  const messages = await fetchMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="auth-layout">{children}</div>
    </NextIntlClientProvider>
  );
}
