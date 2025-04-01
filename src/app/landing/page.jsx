'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  FileText, 
  Upload,
  MapPin,
  BarChart2, 
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const features = [
    {
      title: 'CSV Property Data Processing',
      description: 'Upload and process property data from CSV files in seconds',
      icon: Upload,
      color: 'bg-blue-500'
    },
    {
      title: 'Neighborhood Organization',
      description: 'Organize properties into neighborhoods for better targeting',
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      title: 'Letter Generation',
      description: 'Generate personalized letters to property owners with custom templates',
      icon: Mail,
      color: 'bg-purple-500'
    },
    {
      title: 'Custom Templates',
      description: 'Create and save your own letter templates for future use',
      icon: FileText,
      color: 'bg-amber-500'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Track your campaigns and response rates',
      icon: BarChart2,
      color: 'bg-indigo-500'
    }
  ];

  const testimonials = [
    {
      quote: "LetterFlow has completely transformed how I reach out to property owners. The response rate has doubled since I started using it.",
      author: "Alex Morgan",
      role: "Real Estate Investor"
    },
    {
      quote: "Being able to organize neighborhoods and target specific property types has been game-changing for my business.",
      author: "Sarah Johnson",
      role: "Property Manager"
    },
    {
      quote: "The letter templates and personalization options help me stand out from other investors in my market.",
      author: "Michael Chen",
      role: "Real Estate Agent"
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For individuals just getting started',
      features: [
        '1 Neighborhood',
        'Up to 100 properties',
        'Basic letter templates',
        'CSV processing',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Starter',
      price: '$29',
      period: 'per month',
      description: 'For growing real estate businesses',
      features: [
        'Unlimited neighborhoods',
        'Up to 1,000 properties',
        'Custom letter templates',
        'Advanced CSV processing',
        'Priority email support',
        'Response tracking'
      ],
      cta: 'Start 14-day Trial',
      popular: true
    },
    {
      name: 'Pro',
      price: '$49',
      period: 'per month',
      description: 'For professional investors and teams',
      features: [
        'Everything in Starter',
        'Unlimited properties',
        'API access',
        'Team collaboration',
        'Advanced analytics',
        'Priority phone support',
        'White-label options'
      ],
      cta: 'Start 14-day Trial',
      popular: false
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would connect to your signup/waitlist API
    console.log('Submitted email:', email);
    alert('Thanks for signing up! We\'ll be in touch soon.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-xl">
                  LF
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  LetterFlow
                </span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a href="#features" className="text-base font-medium text-gray-700 hover:text-blue-600">Features</a>
              <a href="#testimonials" className="text-base font-medium text-gray-700 hover:text-blue-600">Testimonials</a>
              <a href="#pricing" className="text-base font-medium text-gray-700 hover:text-blue-600">Pricing</a>
            </nav>
            <div>
              <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50">
                Sign in
              </Link>
              <Link href="/signup" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                Streamlined letter generation and property data sorting
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl">
                Turn property data into effective communication campaigns. LetterFlow helps real estate professionals organize properties and generate personalized letters with just a few clicks.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="flex items-center justify-center px-8 py-3 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Get started for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="#demo" className="flex items-center justify-center px-8 py-3 rounded-md text-base font-medium text-blue-600 bg-white border border-blue-200 hover:bg-blue-50">
                  Watch demo
                </Link>
              </div>
            </div>
            <div className="rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              <img 
                src="/dashboard-preview.svg" 
                alt="LetterFlow Dashboard" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful features to streamline your process
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage property data and generate effective communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              See LetterFlow in action
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how easy it is to import data, organize neighborhoods, and generate personalized letters
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
            <img 
              src="/demo-animation.svg" 
              alt="LetterFlow process animation" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Loved by real estate professionals
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear what our users have to say about LetterFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-gray-800 italic">"{testimonial.quote}"</p>
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees or long-term contracts. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`
                rounded-lg overflow-hidden shadow-lg bg-white
                ${plan.popular ? 'ring-2 ring-blue-600 transform scale-105 z-10' : ''}
              `}>
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-center text-sm py-1">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="ml-1 text-xl text-gray-600">/{plan.period}</span>}
                  </div>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8">
                    <Link 
                      href={plan.name === 'Free' ? '/signup' : '/signup?plan=' + plan.name.toLowerCase()}
                      className={`
                        w-full flex items-center justify-center px-5 py-3 rounded-md text-base font-medium
                        ${plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }
                      `}
                    >
                      {plan.cta}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to streamline your property communication?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of real estate professionals already using LetterFlow.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 sm:flex justify-center">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:max-w-xs px-5 py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              />
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-blue-800 hover:bg-blue-900"
                >
                  Get started for free
                </button>
              </div>
            </form>
            
            <p className="mt-3 text-sm text-blue-100">
              Free plan available. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-xl">
                  LF
                </div>
                <span className="text-2xl font-bold text-white">
                  LetterFlow
                </span>
              </div>
              <p className="mt-4 text-gray-400">
                Streamlined letter generation and property data sorting for real estate professionals.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} LetterFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 