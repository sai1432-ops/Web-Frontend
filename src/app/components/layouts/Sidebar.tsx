import { Link, useLocation } from 'react-router';
import { 
  Home, Users, Package, 
  LogOut, User,
  BookOpen, Archive,
  MessageSquare
} from 'lucide-react';
import { cn } from '../ui/utils';

interface SidebarProps {
  role: 'user' | 'dealer' | 'admin';
}

const sidebarConfig = {
  user: {
    logo: 'Mukh Swasthya',
    subtitle: 'Beneficiary Portal',
    color: 'blue',
    links: [
      { path: '/user/dashboard', label: 'Dashboard', icon: Home },
      { path: '/user/consult', label: 'Consult', icon: MessageSquare },
      { path: '/user/learn', label: 'Learn', icon: BookOpen },
    ],
  },
  dealer: {
    logo: 'Mukh Swasthya',
    subtitle: 'Dealer Portal',
    color: 'emerald',
    links: [
      { path: '/dealer/dashboard', label: 'Dashboard', icon: Home },
      { path: '/dealer/beneficiaries', label: 'Beneficiaries', icon: Users },
      { path: '/dealer/stock-management', label: 'Stock Management', icon: Archive },
    ],
  },
  admin: {
    logo: 'Mukh Swasthya Admin',
    subtitle: 'Control Center',
    color: 'red',
    links: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
      { path: '/admin/users', label: 'User Management', icon: Users },
      { path: '/admin/stock-requests', label: 'Stock Requests', icon: Package },
    ],
  },
};

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const config = sidebarConfig[role];

  return (
    <aside className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col fixed left-0 top-0 shadow-soft-premium z-[60]">
      {/* Logo Section */}
      <div className="h-24 border-b border-gray-100/50 flex items-center px-8 flex-shrink-0">
        <div className="flex flex-col">
            <span className={cn(
              "font-black text-xl tracking-tighter uppercase",
              role === 'admin' ? "text-rose-600" : role === 'dealer' ? "text-emerald-600" : "text-blue-900"
            )}>
              {config.logo}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5 px-0.5">
              {config.subtitle}
            </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-5 space-y-2 overflow-y-auto pt-10">
        {config.links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                isActive
                  ? role === 'admin'
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                    : role === 'dealer'
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-xl shadow-blue-900/20"
                  : "text-gray-400 hover:bg-white hover:text-blue-900 hover:shadow-soft transition-all"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                isActive ? "bg-white/10" : "bg-gray-50/50 group-hover:bg-blue-50"
              )}>
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400 group-hover:text-blue-900")} />
              </div>
              <span className="text-[13px] font-black tracking-tight">{link.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout / Exit */}
      <div className="p-6 border-t border-gray-100/50 flex-shrink-0">
        <Link
          to="/role-selection"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-rose-50/50 hover:text-rose-600 transition-all duration-300 font-bold text-sm group"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50/50 flex items-center justify-center group-hover:bg-rose-100/50 transition-all">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[13px] font-black uppercase tracking-widest">Logout</span>
        </Link>
      </div>
    </aside>
  );
}