import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import React from 'react';

const SupportPage: React.FC = () => {
    const t = useTranslations('support_page');
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <Link
                    href="/dashboard"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    {t('back_to_dashboard')}
                </Link>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">{t('getting_started_title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('getting_started_text')}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">{t('common_questions_title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('common_questions_text')}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">{t('contact_support_title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('contact_support_text')}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">{t('resources_title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('resources_text')}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default SupportPage;
