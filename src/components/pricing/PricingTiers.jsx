'use client';

import { useState } from 'react';
import { Check, X, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';

const pricingTiers = [
  {
    name: 'Free',
    price: 0,
    description: 'Basic features for individuals getting started',
    features: [
      { name: '1 CSV upload per month', included: true },
      { name: 'Basic filtering (Owner, Renter, Investor)', included: true },
      { name: 'Export in CSV format', included: true },
      { name: 'Save neighborhoods', included: false },
      { name: 'Letter templates', included: false },
      { name: 'Export in Excel & Numbers formats', included: false },
      { name: 'AI-powered letter customization', included: false },
      { name: 'Custom branding on letters', included: false },
      { name: 'Automated letter sending', included: false },
    ],
    ctaText: 'Get Started',
    ctaLink: '/sign-up',
    highlight: false,
    color: 'border-gray-200 dark:border-gray-700',
    badge: null
  },
  {
    name: 'Starter',
    price: 19,
    description: 'Perfect for real estate agents with regular mailings',
    features: [
      { name: '5 CSV uploads per month', included: true },
      { name: 'Basic filtering (Owner, Renter, Investor)', included: true },
      { name: 'Export in CSV format', included: true },
      { name: 'Save neighborhoods', included: true },
      { name: 'Basic letter templates', included: true },
      { name: 'Export in Excel & Numbers formats', included: true },
      { name: 'AI-powered letter customization', included: false },
      { name: 'Custom branding on letters', included: false },
      { name: 'Automated letter sending', included: false },
    ],
    ctaText: 'Subscribe',
    ctaLink: '/sign-up?plan=starter',
    highlight: true,
    color: 'border-blue-500 dark:border-blue-400',
    badge: { text: 'Popular', icon: Sparkles, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' }
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For professionals with high-volume outreach needs',
    features: [
      { name: 'Unlimited CSV uploads', included: true },
      { name: 'Advanced filtering & market insights', included: true },
      { name: 'Export in all formats', included: true },
      { name: 'Save and manage neighborhoods', included: true },
      { name: 'Full template library access', included: true },
      { name: 'Export in Excel & Numbers formats', included: true },
      { name: 'AI-powered letter customization', included: true },
      { name: 'Custom branding on letters', included: true },
      { name: 'Bulk letter sending automation', included: true },
      { name: 'Advanced analytics & tracking', included: true },
    ],
    ctaText: 'Go Pro',
    ctaLink: '/sign-up?plan=pro',
    highlight: false,
    color: 'border-purple-500 dark:border-purple-400',
    badge: { text: 'Premium', icon: Crown, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' }
  }
];

export default function PricingTiers() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="py-12">
      {/* Billing toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annually')}
            className={`py-2 px-4 text-sm font-medium rounded-md transition-colors flex items-center ${
              billingCycle === 'annually' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Annually
            <span className="ml-2 text-xs font-semibold py-0.5 px-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <div 
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 ${tier.color} ${
              tier.highlight ? 'shadow-lg transform md:-translate-y-4' : 'shadow-sm'
            } transition-all`}
          >
            {tier.badge && (
              <div className={`${tier.badge.color} px-3 py-1 flex justify-center items-center`}>
                <tier.badge.icon size={14} className="mr-1" />
                <span className="text-xs font-medium">{tier.badge.text}</span>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{tier.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tier.description}</p>
              
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  ${tier.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check size={18} className="text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={tier.ctaLink}
                className={`block w-full py-2.5 px-4 text-center rounded-lg font-medium transition-colors ${
                  tier.highlight 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : tier.name === 'Pro'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                {tier.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 