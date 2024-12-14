import { fetchMessages } from '@/i18n/server';
import { NextIntlClientProvider } from 'next-intl';

export default async function AuthLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await fetchMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="auth-layout">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}

