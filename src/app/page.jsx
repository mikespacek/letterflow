'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from './landing/page';

export default function Home() {
  const router = useRouter();
  
  // If user is not authenticated, show landing page
  // For demo purposes, we'll just show the landing page directly
  
  // In a real app, you might check for authentication and redirect accordingly
  // useEffect(() => {
  //   // Check if user is authenticated
  //   const isAuthenticated = localStorage.getItem('auth_token');
  //   
  //   if (isAuthenticated) {
  //     router.push('/dashboard');
  //   }
  // }, [router]);
  
  return (
    <LandingPage />
  );
} 