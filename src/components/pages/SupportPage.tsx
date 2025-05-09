import { Link } from '@/i18n/routing';
import React from 'react';

const SupportPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Support Center</h1>
                <Link
                    href="/dashboard"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">Getting Started</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {"Welcome to our support center. Here you'll find everything you need to get started with our safety dashboard. Our platform is designed to help you monitor and manage workplace safety effectively."}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Common Questions</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {"Having trouble navigating the dashboard? Our comprehensive FAQ section covers the most common questions about using the platform, managing reports, and accessing analytics. If you can't find what you're looking for, don't hesitate to reach out to our support team."}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Contact Support</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Our dedicated support team is available 24/7 to help you with any issues you might encounter. You can reach us through email at support@safetydashboard.com or use our live chat feature during business hours.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Resources</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Access our library of tutorials, guides, and best practices to make the most of your safety dashboard. We regularly update our resources to ensure you have the latest information and tips for workplace safety management.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default SupportPage;
