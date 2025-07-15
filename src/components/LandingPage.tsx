"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "./ui/Button";
import Shield from "./ui/icons/Shield";
import Users from "./ui/icons/Users";
import BookOpen from "./ui/icons/BookOpen";
import Award from "./ui/icons/Award";
import CheckCircle from "./ui/icons/CheckCircle";
import ArrowRight from "./ui/icons/ArrowRight";

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    router.push("/authentication/login");
  };

  const features = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Comprehensive safety training programs designed to protect your workforce and ensure compliance with industry standards.",
      color: "bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30",
      gradient: "from-primary to-primary/80"
    },
    {
      icon: Users,
      title: "Easy Management",
      description: "Streamlined course management, user tracking, and progress monitoring for efficient training administration.",
      color: "bg-gradient-to-br from-secondary/10 to-secondary/20 border-secondary/30",
      gradient: "from-secondary to-secondary/80"
    },
    {
      icon: BookOpen,
      title: "Rich Content",
      description: "Diverse course library with interactive content, assessments, and real-world scenarios for effective learning.",
      color: "bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30",
      gradient: "from-primary to-primary/80"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Automated certificate generation and tracking to validate training completion and maintain records.",
      color: "bg-gradient-to-br from-secondary/10 to-secondary/20 border-secondary/30",
      gradient: "from-secondary to-secondary/80"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: "👥" },
    { number: "500+", label: "Available Courses", icon: "📚" },
    { number: "50+", label: "Partner Companies", icon: "🏢" },
    { number: "99%", label: "Satisfaction Rate", icon: "⭐" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Safety Manager",
      company: "TechCorp Industries",
      content: "Safety Point Academy transformed our training program. The platform is intuitive and our compliance rates improved significantly.",
      avatar: "/images/user-profile.png"
    },
    {
      name: "Michael Chen",
      role: "HR Director",
      company: "Global Manufacturing",
      content: "The comprehensive course library and automated certification system saved us countless hours of manual work.",
      avatar: "/images/user-profile.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Header with gradient background */}
      <header className="bg-gradient-to-r from-white via-primary/5 to-white shadow-lg border-b border-primary/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo/logo.webp"
                alt="Safety Point Academy"
                width={200}
                height={100}
                className="h-10 w-auto transition-transform hover:scale-105"
              />
              <div className="hidden md:block">
                <div className="text-xl text-primary font-medium">Safety Training Platform</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                label="Login"
                onClick={handleLoginClick}
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-6 py-2 rounded-lg hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with animations */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  🚀 Trusted by 10,000+ organizations
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Empower Your{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-primary">
                    Safety Training
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Comprehensive safety training platform for organizations. Manage courses, track progress, and ensure compliance with ease.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  label="Get Started Free"
                  onClick={handleLoginClick}
                  icon={<div className="w-5 h-5"><ArrowRight /></div>}
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                />
                <Button
                  label="Watch Demo"
                  variant="transparent"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                />
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 text-green-500">
                    <CheckCircle />
                  </div>
                  <span className="text-gray-900">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 text-green-500">
                    <CheckCircle />
                  </div>
                  <span className="text-gray-900">Free 14-day trial</span>
                </div>
              </div>
            </div>
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl transform rotate-6 scale-105 opacity-20"></div>
                <Image
                  src="/images/pages/dashboard.png"
                  alt="Safety Dashboard"
                  fill
                  className="object-cover rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with animations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with interactive cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-primary">
                Safety Point Academy
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides everything you need to manage safety training effectively and ensure compliance across your organization.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border ${feature.color} hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer group ${
                  activeFeature === index ? 'ring-4 ring-primary/20 scale-105' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-black">
                    <feature.icon />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-900 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied organizations using our platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="py-20 bg-gradient-to-br from-gray-500 to-primary/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                About{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-primary">
                  Safety Point Academy
                </span>
              </h2>
              <p className="text-xl text-gray-900 leading-relaxed">
                We are dedicated to providing world-class safety training solutions that help organizations create safer work environments. Our platform combines cutting-edge technology with industry expertise to deliver comprehensive training programs.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 text-white">
                      <CheckCircle />
                    </div>
                  </div>
                  <span className="text-gray-900">Industry-leading safety training content</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 text-white">
                      <CheckCircle />
                    </div>
                  </div>
                  <span className="text-gray-900">Advanced analytics and reporting tools</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 text-white">
                      <CheckCircle />
                    </div>
                  </div>
                  <span className="text-gray-900">24/7 support and expert guidance</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-video max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl transform rotate-6 scale-105 opacity-20"></div>
                <Image
                  src="/images/cert-template.jpg"
                  alt="Safety Training"
                  fill
                  className="object-cover rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/50 to-secondary/50"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Safety Training?
          </h2>
          <p className="text-xl text-primary-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of organizations that trust Safety Point Academy for their safety training needs. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              label="Start Free Trial"
              onClick={handleLoginClick}
              icon={<div className="w-5 h-5 text-white"><ArrowRight /></div>}
              className="bg-secondary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            />
            <Button
              label="Schedule Demo"
              variant="transparent"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300"
            />
          </div>
          <p className="text-primary-foreground/80 text-sm mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/logo/logo.webp"
                  alt="Safety Point Academy"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-400 leading-relaxed">
                Leading safety training platform helping organizations create safer work environments through comprehensive training solutions.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer">
                  <span className="text-white font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer">
                  <span className="text-white font-bold">t</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-white transition-colors cursor-pointer">System Status</li>
                <li className="hover:text-white transition-colors cursor-pointer">API Reference</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">Cookie Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">GDPR</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>Copyright © {new Date().getFullYear()} Safety Point Academy. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 