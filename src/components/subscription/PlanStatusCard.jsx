'use client';

import { CreditCard, Crown, Upload, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const planConfig = {
  free: {
    name: 'Free Plan',
    color: 'border-gray-300 dark:border-gray-700',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    icon: CreditCard,
    iconColor: 'text-gray-500 dark:text-gray-400',
    buttonText: 'Upgrade Now',
    buttonLink: '/pricing',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    description: 'Limited to 1 upload per month',
    upgradeTarget: 'Starter'
  },
  starter: {
    name: 'Starter Plan',
    color: 'border-blue-300 dark:border-blue-700',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    icon: Upload,
    iconColor: 'text-blue-600 dark:text-blue-400',
    buttonText: 'Go Pro',
    buttonLink: '/pricing?upgrade=pro',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    description: '5 uploads per month',
    upgradeTarget: 'Pro'
  },
  pro: {
    name: 'Pro Plan',
    color: 'border-purple-300 dark:border-purple-700',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    icon: Crown,
    iconColor: 'text-purple-600 dark:text-purple-400',
    buttonText: 'Manage Plan',
    buttonLink: '/settings/billing',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
    description: '20 uploads per month',
    upgradeTarget: null
  }
};

export default function PlanStatusCard({ plan = 'free', uploadsUsed = 0, uploadsTotal = 1, daysLeft = 0, renewalDate = '', isExpiring = false }) {
  const planInfo = planConfig[plan] || planConfig.free;
  const usagePercentage = Math.min(100, Math.round((uploadsUsed / uploadsTotal) * 100));
  const isLimited = usagePercentage >= 80;

  return (
    <div className={`rounded-xl border ${planInfo.color} ${planInfo.bgColor} p-5 transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`rounded-lg p-2 ${planInfo.iconColor} bg-white dark:bg-gray-800 mr-3`}>
            <planInfo.icon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{planInfo.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{planInfo.description}</p>
          </div>
        </div>

        <Link 
          href={planInfo.buttonLink}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg text-white ${planInfo.buttonColor} transition-colors hidden sm:inline-block`}
        >
          {planInfo.buttonText}
        </Link>
      </div>

      {isExpiring && (
        <div className="flex items-start mb-4 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg text-amber-800 dark:text-amber-300 text-xs">
          <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
          <p>
            Your subscription expires in {daysLeft} days. Renews on {renewalDate}.
            <Link href="/settings/billing" className="ml-2 font-medium underline">
              Update billing info
            </Link>
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">CSV Uploads</span>
            <span className={isLimited ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-gray-600 dark:text-gray-400'}>
              {uploadsUsed}/{uploadsTotal} used
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                usagePercentage >= 90 ? 'bg-red-500 dark:bg-red-600' :
                usagePercentage >= 70 ? 'bg-amber-500 dark:bg-amber-600' :
                'bg-green-500 dark:bg-green-600'
              }`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>

        {plan !== 'pro' && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={planInfo.buttonLink}
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-between"
            >
              <span>Upgrade to {planInfo.upgradeTarget} for more features</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        )}

        <Link 
          href={planInfo.buttonLink}
          className={`text-xs font-medium w-full px-3 py-2 rounded-lg text-white ${planInfo.buttonColor} transition-colors text-center block sm:hidden mt-4`}
        >
          {planInfo.buttonText}
        </Link>
      </div>
    </div>
  );
} 