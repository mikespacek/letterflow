'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Mail, 
  CheckCircle, 
  Calendar,
  Download,
  ChevronDown,
  Filter,
  ArrowUpRight,
  Mail as MailIcon
} from 'lucide-react';

// Mock data for charts
const monthlyData = [
  { month: 'Jan', letters: 85, responses: 12 },
  { month: 'Feb', letters: 102, responses: 15 },
  { month: 'Mar', letters: 145, responses: 18 },
  { month: 'Apr', letters: 120, responses: 20 },
  { month: 'May', letters: 210, responses: 32 },
  { month: 'Jun', letters: 188, responses: 28 },
  { month: 'Jul', letters: 175, responses: 25 },
  { month: 'Aug', letters: 220, responses: 30 },
];

const campaignPerformance = [
  { 
    id: 1, 
    name: 'Spring Outreach', 
    performance: 85, 
    letters: 245, 
    responses: 32,
    status: 'Completed'
  },
  { 
    id: 2, 
    name: 'Commercial Properties', 
    performance: 68, 
    letters: 120, 
    responses: 8,
    status: 'In Progress'
  },
  { 
    id: 3, 
    name: 'Vacant Land Outreach', 
    performance: 48, 
    letters: 75, 
    responses: 0,
    status: 'Scheduled'
  },
  { 
    id: 4, 
    name: 'Residential Multifamily', 
    performance: 92, 
    letters: 180, 
    responses: 28,
    status: 'Completed'
  },
  { 
    id: 5, 
    name: 'Distressed Properties', 
    performance: 78, 
    letters: 95, 
    responses: 14,
    status: 'Completed'
  },
];

// Components
const AnalyticsCard = ({ title, value, icon: Icon, trend, color, footer }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-1">
          <span className={`text-xs font-medium flex items-center ${
            trend.type === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <ArrowUpRight size={12} className={`mr-1 ${trend.type === 'down' ? 'transform rotate-90' : ''}`} />
            {trend.value}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">vs last period</span>
        </div>
      )}
      
      {footer && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">{footer}</p>
        </div>
      )}
    </div>
  );
};

// Bar chart component
const BarChart = ({ data }) => {
  const maxLetters = Math.max(...data.map(d => d.letters));
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Performance</h3>
        <div className="flex space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-blue-500 mr-1.5"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Letters</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-green-500 mr-1.5"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Responses</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-end space-x-6 h-64 mb-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end">
            <div className="flex flex-col items-center w-full">
              <div 
                className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-sm" 
                style={{ height: `${(item.letters / maxLetters) * 200}px` }}
              ></div>
              <div 
                className="w-full bg-green-500 dark:bg-green-600 mt-0.5 rounded-t-sm" 
                style={{ height: `${(item.responses / maxLetters) * 200}px` }}
              ></div>
            </div>
            <div className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">{item.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Campaign performance component
const CampaignPerformanceTable = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Campaign</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Letters</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Responses</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {campaign.name}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 max-w-[150px]">
                    <div 
                      className={`h-2.5 rounded-full ${
                        campaign.performance >= 80 ? 'bg-green-500' : 
                        campaign.performance >= 60 ? 'bg-blue-500' : 
                        campaign.performance >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${campaign.performance}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{campaign.performance}%</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {campaign.letters}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {campaign.responses}
                <span className="ml-1 text-xs text-gray-500">
                  ({Math.round((campaign.responses / campaign.letters || 0) * 100)}%)
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  campaign.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  campaign.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {campaign.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main analytics page
export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          {/* Header with filters */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">Detailed insights into your campaign performance</p>
            </div>
            
            <div className="flex space-x-3">
              <div className="relative">
                <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center">
                  <Filter size={16} className="mr-2 text-gray-500" />
                  <span>Filter</span>
                </button>
              </div>
              
              <div className="relative">
                <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center">
                  <span>{timeRange}</span>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>
              </div>
              
              <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center">
                <Download size={16} className="mr-2 text-gray-500" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          {/* Analytics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnalyticsCard 
              title="Total Properties" 
              value={isLoading ? "—" : "389"} 
              icon={Users}
              trend={{ type: 'up', value: '+12%' }}
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              footer="All tracked properties" 
            />
            
            <AnalyticsCard 
              title="Total Letters" 
              value={isLoading ? "—" : "1,243"} 
              icon={Mail}
              trend={{ type: 'up', value: '+8%' }}
              color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              footer="Letters sent this year" 
            />
            
            <AnalyticsCard 
              title="Response Rate" 
              value={isLoading ? "—" : "16.8%"} 
              icon={TrendingUp}
              trend={{ type: 'up', value: '+2.4%' }}
              color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
              footer="Average response rate" 
            />
            
            <AnalyticsCard 
              title="Campaigns" 
              value={isLoading ? "—" : "5"} 
              icon={CheckCircle}
              trend={{ type: 'up', value: '+1' }}
              color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              footer="Active and completed" 
            />
          </div>
          
          {/* Charts and tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Bar chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <BarChart data={monthlyData} />
              )}
            </div>
            
            {/* Monthly stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Breakdown</h3>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {[
                    { label: 'Letters Sent', value: '220', icon: MailIcon, change: '+15%', color: 'text-blue-500' },
                    { label: 'Response Rate', value: '13.6%', icon: TrendingUp, change: '+1.2%', color: 'text-green-500' },
                    { label: 'Avg. Response Time', value: '4.2 days', icon: Calendar, change: '-0.5 days', color: 'text-purple-500' },
                    { label: 'Conversion Rate', value: '8.3%', icon: CheckCircle, change: '+0.8%', color: 'text-amber-500' },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <stat.icon className={`w-5 h-5 ${stat.color} mr-3`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{stat.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">{stat.value}</div>
                        <div className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-blue-500'}`}>
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Campaign performance table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Performance</h3>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                View All Campaigns
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <CampaignPerformanceTable data={campaignPerformance} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 