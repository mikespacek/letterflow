'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Upload, 
  FileText, 
  Mail, 
  BarChart2, 
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  LogOut,
  CreditCard,
  Map
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'CSV Processor', href: '/csv-processor', icon: Upload },
  { name: 'Neighborhoods', href: '/neighborhoods', icon: Map },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Letter Generator', href: '/letter-generator', icon: Mail },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Check for dark mode preference on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  return (
    <aside 
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      } h-screen`}
    >
      {/* Logo and Collapse Button */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 text-white font-bold">
              RE
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Letters
            </span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        <div className={`mb-6 ${collapsed ? 'text-center' : 'px-2'}`}>
          <p className="text-xs uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider mb-3">
            {!collapsed && 'Main Navigation'}
          </p>
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all relative ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    title={collapsed ? item.name : ''}
                  >
                    <div className="relative flex items-center">
                      <Icon 
                        size={collapsed ? 20 : 18} 
                        className={`${
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`} 
                      />
                      {isActive && (
                        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                      )}
                    </div>
                    
                    {!collapsed && (
                      <span className="ml-3">{item.name}</span>
                    )}
                    
                    {/* Hover tooltip for collapsed mode */}
                    {collapsed && hoveredItem === item.name && (
                      <div className="absolute left-14 z-10 px-3 py-2 rounded-md shadow-md bg-gray-800 text-white text-sm whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {!collapsed && (
          <div className="mt-10 mb-4">
            <p className="px-2 text-xs uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider mb-3">
              Settings
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/settings"
                  className="flex items-center px-3 py-2.5 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings size={18} className="text-gray-500 dark:text-gray-400" />
                  <span className="ml-3">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="flex items-center px-3 py-2.5 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <HelpCircle size={18} className="text-gray-500 dark:text-gray-400" />
                  <span className="ml-3">Help & Support</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      
      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} w-full p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          title="Toggle dark mode"
        >
          {darkMode ? (
            <>
              <Sun size={18} className="text-amber-500" />
              {!collapsed && <span className="ml-3">Light Mode</span>}
            </>
          ) : (
            <>
              <Moon size={18} className="text-indigo-500" />
              {!collapsed && <span className="ml-3">Dark Mode</span>}
            </>
          )}
        </button>
        
        {!collapsed && (
          <button
            className="flex items-center justify-between w-full p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-2"
          >
            <div className="flex items-center">
              <LogOut size={18} className="text-gray-500" />
              <span className="ml-3">Log Out</span>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
} 