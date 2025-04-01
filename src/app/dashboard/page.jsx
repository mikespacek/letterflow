'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart, 
  Upload, 
  Mail, 
  FileText, 
  MapPin, 
  TrendingUp,
  Users
} from 'lucide-react';

// Sidebar component with navigation
import Sidebar from '../../components/layout/Sidebar';
import PlanStatusCard from '../../components/subscription/PlanStatusCard';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    properties: 0,
    letters: 0,
    neighborhoods: 0,
    campaigns: 0
  });

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      // In a real app, we would fetch the user profile from an API
      const mockUser = {
        name: 'Mike Spacek',
        email: 'mike@example.com',
        plan: 'free',
        uploadsUsed: 0,
        uploadsTotal: 1
      };
      
      // Mock statistics
      const mockStats = {
        properties: 256,
        letters: 124,
        neighborhoods: 4,
        campaigns: 3
      };
      
      setUser(mockUser);
      setStats(mockStats);
      setIsLoading(false);
    }, 500);
    
    // Check authentication in a real app
    // const token = localStorage.getItem('auth_token');
    // if (!token) {
    //   router.push('/login');
    // }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user.name}. Here's an overview of your activity.
            </p>
          </header>

          {/* Subscription Status */}
          <div className="mb-8">
            <PlanStatusCard 
              plan={user.plan} 
              uploadsUsed={user.uploadsUsed} 
              uploadsTotal={user.uploadsTotal} 
              daysLeft={30} 
              renewalDate="Apr 30, 2023" 
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Properties</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.properties}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                  <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Letters Sent</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.letters}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Neighborhoods</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.neighborhoods}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Campaigns</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.campaigns}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                      <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">CSV data processed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">You uploaded properties.csv with 256 records</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                      <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Letters generated</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Created 124 letters for Oakwood neighborhood</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Template created</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Added "Spring Offer" letter template</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link href="/csv-processor" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="text-gray-800 dark:text-gray-200">Upload CSV Data</span>
                </Link>
                
                <Link href="/letter-generator" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-gray-800 dark:text-gray-200">Generate Letters</span>
                </Link>
                
                <Link href="/templates" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <span className="text-gray-800 dark:text-gray-200">Manage Templates</span>
                </Link>
                
                <Link href="/neighborhoods" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-3" />
                  <span className="text-gray-800 dark:text-gray-200">View Neighborhoods</span>
                </Link>
                
                <Link href="/analytics" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <BarChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                  <span className="text-gray-800 dark:text-gray-200">View Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 