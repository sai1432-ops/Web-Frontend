import { Link, useLocation } from 'react-router';
import { Home, Package, User, BookOpen, Users, Archive, MessageSquare } from 'lucide-react';
import { cn } from '../ui/utils';

interface BottomNavProps {
  role: 'user' | 'dealer' | 'admin';
}

export function BottomNav({ role }: BottomNavProps) {
  const location = useLocation();

  const navConfigs = {
    user: [
      { path: '/user/dashboard', label: 'Home', icon: Home },
      { path: '/user/kit-hub', label: 'Kits', icon: Package },
      { path: '/user/consult', label: 'Consult', icon: MessageSquare },
      { path: '/user/learn', label: 'Learn', icon: BookOpen },
      { path: '/user/profile', label: 'Profile', icon: User },
    ],
    dealer: [
      { path: '/dealer/dashboard', label: 'Home', icon: Home },
      { path: '/dealer/beneficiaries', label: 'People', icon: Users },
      { path: '/dealer/stock-management', label: 'Stock', icon: Archive },
      { path: '/dealer/profile', label: 'Profile', icon: User },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Home', icon: Home },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/stock-requests', label: 'Requests', icon: Package },
      { path: '/admin/profile', label: 'Profile', icon: User },
    ]
  };

  const navItems = navConfigs[role];

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[60]">
      <div className="glass rounded-[2rem] shadow-premium px-4 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className="flex flex-col items-center gap-1 group relative transition-all duration-300 active:scale-90"
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-blue-900 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 group-hover:text-blue-900"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  isActive ? "text-blue-900 opacity-100" : "text-gray-400 opacity-0 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>
                {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-blue-900 rounded-full animate-in zoom-in duration-300"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}