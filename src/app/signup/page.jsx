'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const features = [
    'CSV processing and property data organization',
    'Neighborhood management and categorization',
    'Template creation and letter generation',
    'Basic analytics and tracking',
    'Free tier with no credit card required'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would call your API to create a user
    // For demo purposes, we'll just simulate a delay
    setTimeout(() => {
      // Store authentication data
      localStorage.setItem('auth_token', 'demo_token_' + Date.now());
      sessionStorage.setItem('just_registered', 'true');
      
      setIsSubmitting(false);
      setStep(2); // Move to success state
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/landing" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-xl">
              LF
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              LetterFlow
            </span>
          </Link>
          <Link 
            href="/landing" 
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex">
        {step === 1 ? (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row">
            {/* Form Section */}
            <div className="w-full md:w-1/2 md:pr-12">
              <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
                <p className="mt-2 text-gray-600">
                  Get started with LetterFlow for free. No credit card required.
                </p>
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Choose a secure password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Password must be at least 8 characters
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </>
                      ) : (
                        'Create free account'
                      )}
                    </button>
                  </div>
                </form>
                
                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
            
            {/* Information Section */}
            <div className="hidden md:block w-1/2 bg-blue-50 p-12 rounded-xl mt-8 md:mt-0">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-900">The easy way to reach property owners</h2>
                <p className="mt-4 text-gray-600">
                  LetterFlow helps real estate professionals organize property data and generate personalized letters with just a few clicks.
                </p>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Included in the free plan:</h3>
                  <ul className="mt-4 space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="ml-2 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-12 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Current Plan</span>
                      <h4 className="text-lg font-bold text-gray-900">Free</h4>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      No Credit Card
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      You can upgrade to a paid plan at any time to access more features and higher limits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center max-w-md">
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Account created successfully!</h1>
              <p className="mt-2 text-gray-600">
                Welcome to LetterFlow! Your free account has been created and is ready to use.
              </p>
              <div className="mt-8">
                <Link 
                  href="/dashboard"
                  className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to dashboard
                </Link>
                <p className="mt-4 text-sm text-gray-500">
                  We've sent a confirmation email to {email}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} LetterFlow. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 