import { Link } from '@/i18n/routing';
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">About Safety Dashboard</h1>
        <Link
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            The Safety Dashboard is a comprehensive platform designed to revolutionize how organizations manage and monitor workplace safety. Our mission is to create safer work environments through data-driven insights and proactive safety measures.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What We Do</h2>
          <p className="text-gray-700 leading-relaxed">
            We provide real-time monitoring, advanced analytics, and actionable insights to help organizations identify potential safety risks before they become incidents. Our platform combines cutting-edge technology with industry best practices to deliver a robust safety management solution.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Commitment</h2>
          <p className="text-gray-700 leading-relaxed">
            Safety is not just a priority - it&apos;s a core value. We are committed to continuous improvement and innovation in workplace safety management. By leveraging the latest technologies and industry expertise, we help organizations build a strong safety culture and achieve their safety goals.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            {"Have questions about how we can help improve safety in your organization? We'd love to hear from you. Reach out to our team of safety experts, and we'll be happy to discuss your specific needs and requirements."}
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
