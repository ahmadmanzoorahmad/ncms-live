// Root Layout with Navigation

import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { GovHeader } from '../components/GovHeader';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import {
  Home,
  Ticket,
  Users,
  Wrench,
  UserCheck,
  Briefcase,
  BarChart3,
  Shield,
  Settings,
  Smartphone,
  Menu,
  X,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Navigation items based on role
const navItems = [
  { path: '/', label: 'Dashboard', desc: 'Overview', icon: Home },
  { path: '/tickets', label: 'Tickets', desc: 'Manage', icon: Ticket },
  { path: '/analytics', label: 'Analytics', desc: 'Reports', icon: BarChart3 },
];

// Get mobile apps based on user role
const getMobileApps = (userRole: string) => {
  if (userRole === 'Citizen') {
    return [
      { path: '/mobile-citizen', label: 'Citizen App', icon: Smartphone },
    ];
  } else {
    // All government roles get the management app
    return [
      { path: '/mobile-management', label: 'Management App', icon: Smartphone },
    ];
  }
};

export default function Root() {
  const { isAuthenticated, currentUser, unreadNotificationCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#DFF5E1]/30">
      <Toaster richColors position="top-right" />
      <GovHeader unreadCount={unreadNotificationCount} />

      {/* Navigation Sidebar - Government Style */}
      <div className="bg-[#01411C] border-b border-[#0B5D1E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path} className="flex-1">
                    <div
                      className={`px-4 py-2 rounded-lg transition-all ${
                        active 
                          ? 'bg-white text-[#01411C] shadow-lg' 
                          : 'text-white hover:bg-[#0B5D1E]'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <div className="text-left">
                          <div className="text-sm font-semibold">{item.label}</div>
                          <div className={`text-xs ${active ? 'text-[#0B5D1E]' : 'text-white/70'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-[#0B5D1E]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#0B5D1E] bg-[#01411C]">
            <div className="px-4 py-4 space-y-2">
              <p className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wider">
                Dashboards
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`px-4 py-3 rounded-lg transition-all ${
                        active 
                          ? 'bg-white text-[#01411C]' 
                          : 'text-white hover:bg-[#0B5D1E]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-semibold">{item.label}</div>
                          <div className={`text-xs ${active ? 'text-[#0B5D1E]' : 'text-white/70'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              <div className="pt-3 border-t border-[#0B5D1E] mt-3">
                <p className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wider">
                  Mobile Applications
                </p>
                {getMobileApps(currentUser?.role || 'Citizen').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="px-4 py-3 rounded-lg text-white hover:bg-[#0B5D1E] transition-all">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Bar - Desktop Only */}
      <div className="hidden md:block bg-gradient-to-r from-[#DFF5E1] to-[#f0f9f1] border-b border-[#01411C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-4 text-xs text-[#0B5D1E]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>24/7 Service</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Government Verified</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs text-[#0B5D1E]">
              <span>Powered by AI • Blockchain-Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern - Subtle Crescent/Star Watermark */}
      <div className="relative min-h-[calc(100vh-300px)]">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#01411C] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#1F7A3A] rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>

      {/* Footer - Government Style */}
      <footer className="bg-[#01411C] text-white mt-12 border-t-4 border-[#1F7A3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold mb-3 text-[#DFF5E1]">About System</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                National Complaint Center enables citizens to register, track, and resolve complaints efficiently through AI-powered automation and transparent processes.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-3 text-[#DFF5E1]">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-[#DFF5E1] transition-colors">How to Register Complaint</a></li>
                <li><a href="#" className="hover:text-[#DFF5E1] transition-colors">Track Your Complaint</a></li>
                <li><a href="#" className="hover:text-[#DFF5E1] transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-[#DFF5E1] transition-colors">Contact Support</a></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-bold mb-3 text-[#DFF5E1]">Contact Us</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>📧 complaints@gov.pk</li>
                <li>📞 051-9000000</li>
                <li>🕐 24/7 Support Available</li>
                <li>🔒 Secure & Confidential</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-white/70">
              <div>
                <p>© 2026 Government of Pakistan. All Rights Reserved.</p>
                <p className="text-xs mt-1">
                  Powered by AI • Blockchain-Ready Architecture • ISO 27001 Certified
                </p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-[#DFF5E1] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#DFF5E1] transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-[#DFF5E1] transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}