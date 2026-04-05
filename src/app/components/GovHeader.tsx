// Pakistan Government Official Header Component

import { Bell, Globe, LogOut, User, ChevronDown, Languages, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { EnvironmentControls } from './EnvironmentControls';
import { NotificationPanel } from './NotificationPanel';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import logoImage from '@/assets/c673552f7748d800c656a4166ccbeadb19bd4dd2.png';

interface GovHeaderProps {
  unreadCount?: number;
}

export function GovHeader({ unreadCount = 0 }: GovHeaderProps) {
  const { currentUser, isAuthenticated, logout } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };

    if (showUserMenu || showLangMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showLangMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const toggleLanguage = (lang: 'en' | 'ur') => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <div>
      {/* Top Bar - Official Green */}
      <div className="bg-gradient-to-r from-[#01411C] via-[#0B5D1E] to-[#01411C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1.5 text-xs">
            <div className="flex items-center space-x-4">
              <span>{t('gov.header.pakistan')}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">حکومتِ پاکستان</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative" ref={langRef}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-white hover:bg-white/10 h-7 text-xs"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                >
                  <Languages className="w-3 h-3 mr-1" />
                  <span>{language === 'en' ? 'English' : 'اردو'}</span>
                </Button>
                
                {/* Language Dropdown */}
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border-2 border-[#01411C]/20 rounded-lg shadow-xl z-50">
                    <div className="p-1">
                      <button
                        onClick={() => toggleLanguage('en')}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-[#DFF5E1] text-sm ${
                          language === 'en' ? 'bg-[#DFF5E1] text-[#01411C] font-semibold' : 'text-gray-700'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => toggleLanguage('ur')}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-[#DFF5E1] text-sm ${
                          language === 'ur' ? 'bg-[#DFF5E1] text-[#01411C] font-semibold' : 'text-gray-700'
                        }`}
                        style={{ direction: 'rtl' }}
                      >
                        اردو
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b-4 border-[#01411C] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Title Section - Clickable Home Button */}
            <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              {/* Official Logo with text below */}
              <div className="flex flex-col items-center">
                <img 
                  src={logoImage} 
                  alt="National Complaint Center Logo" 
                  className="h-16 w-auto object-contain"
                />
                <div className="text-center mt-1">
                  <p className="text-xs text-[#01411C] font-semibold leading-tight">
                    قومی شکایت سینٹر
                  </p>
                  <p className="text-[10px] text-[#0B5D1E] leading-tight">
                    Government of Pakistan
                  </p>
                </div>
              </div>
            </Link>

            {/* Right Side - Environment Controls and Actions */}
            <div className="flex items-center gap-3">
              <EnvironmentControls />
              
              {/* Notifications */}
              <Button 
                variant="outline" 
                size="icon"
                className="border-[#01411C]/30 hover:bg-[#DFF5E1] relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5 text-[#01411C]" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-[#DC3545]">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {/* User Profile / Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <Button
                    variant="outline"
                    className="border-[#01411C]/30 hover:bg-[#DFF5E1] flex items-center gap-2 h-10"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#01411C] to-[#1F7A3A] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-xs font-semibold text-[#01411C] leading-tight">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-[#0B5D1E] leading-tight">
                        {currentUser.role}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#01411C] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-[#01411C]/20 rounded-lg shadow-xl z-50">
                      <div className="p-4 border-b border-[#01411C]/10">
                        <p className="font-semibold text-[#01411C]">{currentUser.name}</p>
                        <p className="text-sm text-[#0B5D1E]">{currentUser.email}</p>
                        <Badge className="mt-2 bg-[#01411C] text-white">
                          {currentUser.role}
                        </Badge>
                      </div>
                      <div className="p-2">
                        {/* Mobile App Link */}
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[#01411C] hover:bg-[#DFF5E1]"
                          onClick={() => {
                            const mobileAppPath = currentUser.role === 'Citizen' 
                              ? '/mobile-citizen' 
                              : '/mobile-management';
                            navigate(mobileAppPath);
                            setShowUserMenu(false);
                          }}
                        >
                          <Smartphone className="w-4 h-4 mr-2" />
                          {currentUser.role === 'Citizen' ? 'Citizen App' : 'Management App'}
                        </Button>
                        
                        <div className="my-1 border-t border-[#01411C]/10"></div>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[#DC3545] hover:bg-[#DC3545]/10 hover:text-[#DC3545]"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  className="bg-[#01411C] hover:bg-[#0B5D1E] text-white"
                  onClick={() => {
                    // Will be handled by the login page
                    window.location.href = '/login';
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb / Info Bar */}
      <div className="bg-gradient-to-r from-[#DFF5E1] to-[#f0f9f1] border-b border-[#01411C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-[#01411C]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </div>
            <div className="text-xs text-[#0B5D1E]">
              Secure • Transparent • Efficient
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}