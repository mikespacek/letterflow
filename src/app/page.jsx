'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from './landing/page';

export default function Home() {
  const router = useRouter();
  
  // Check if user is authenticated and redirect to dashboard if they are
  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('auth_token');
    
    // For demo purposes, we'll also check if they just registered (came from signup page)
    const justRegistered = sessionStorage.getItem('just_registered');
    
    if (token || justRegistered) {
      // Clear the registration flag
      if (justRegistered) {
        sessionStorage.removeItem('just_registered');
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);
  
  return (
    <LandingPage />
  );
} 