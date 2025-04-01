'use client';

import Sidebar from '@/components/layout/Sidebar';
import PricingTiers from '@/components/pricing/PricingTiers';
import { CreditCard, Star, BadgeCheck, Trophy, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'Simplify Your Real Estate Outreach',
    description: 'Save time with our powerful tools designed for busy real estate professionals.',
    icon: Star,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Access Premium Letter Templates',
    description: 'Get professionally crafted templates designed to maximize responses from property owners.',
    icon: BadgeCheck,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    title: 'AI-Powered Personalization',
    description: 'Our Pro plan uses AI to dynamically personalize letters based on property details.',
    icon: Trophy,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    title: 'Secure Data Processing',
    description: 'Your data never leaves your computer - we process files locally for maximum privacy.',
    icon: ShieldCheck,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
];

const FAQs = [
  {
    question: 'How do the subscription plans work?',
    answer: 'Our subscription plans are billed monthly or annually. You can upgrade, downgrade, or cancel at any time. When you upgrade, you immediately get access to all features of your new plan.'
  },
  {
    question: 'What happens when I reach my monthly CSV upload limit?',
    answer: 'For Free and Starter plans, once you reach your monthly upload limit, you\'ll need to wait until the next billing cycle or upgrade to a higher tier plan. The Pro plan includes unlimited CSV uploads with no monthly restrictions.'
  },
  {
    question: 'Can I save my processed data for future use?',
    answer: 'Yes, with our Starter and Pro plans, you can save neighborhoods for future reference. This allows you to build a database of property information that you can refer to or update later.'
  },
  {
    question: 'How secure is my property data?',
    answer: 'Very secure. We never store your property data on our servers. All CSV processing happens locally in your browser, and exported files are downloaded directly to your computer.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and PayPal. For annual subscriptions, we also offer invoice payments.'
  },
  {
    question: 'Is there a refund policy?',
    answer: 'Yes, we offer a 14-day money-back guarantee if you\'re not satisfied with our service. Simply contact our support team within 14 days of your subscription purchase.'
  },
];

export default function PricingPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Pricing Plans</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the right plan for your real estate outreach needs
            </p>
          </header>
          
          {/* Pricing Tiers */}
          <PricingTiers />
          
          {/* Features */}
          <div className="mt-20 mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Why Choose Our Real Estate Letter Generator?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className={`rounded-lg p-3 mr-5 ${feature.color} self-start`}>
                    <feature.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQs */}
          <div className="mt-20 mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {FAQs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-16 text-center py-12 px-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to streamline your real estate outreach?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Start with our free plan today and upgrade anytime as your business grows.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/sign-up"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                <CreditCard size={18} className="mr-2" />
                Get Started Free
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 