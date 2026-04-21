import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Bell, Search } from 'lucide-react';
import GovEmblem from '../../../assets/gov_emblem_pds.png';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router';
import { cn } from '../ui/utils';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SessionManager } from '../../utils/SessionManager';

interface DashboardLayoutProps {
  role: 'user' | 'dealer' | 'admin';
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ role, children, title }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const profilePath = `/${role}/profile`;
  
  return (
    <div className="flex min-h-screen bg-[#F8FBFF] selection:bg-blue-100 relative overflow-hidden">
      {/* Premium Background Elements for User */}
      {role === 'user' && (
        <>
          <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
          <div className="absolute top-20 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-[120px] -z-10 animate-pulse duration-5000" />
          <div className="absolute bottom-40 -left-24 w-72 h-72 bg-indigo-50/50 rounded-full blur-[100px] -z-10" />
        </>
      )}

      {/* Sidebar - hidden on mobile (lg:block) */}
      <div className="hidden lg:block relative z-[60]">
        <Sidebar role={role} />
      </div>
      
      <div className="flex-1 flex flex-col lg:ml-64 relative z-10">
        {/* Top Header - Premium Glassmorphism */}
        <header className="hidden lg:flex h-20 bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-[50] px-8 items-center justify-between shadow-soft-premium">
          <div className="flex items-center gap-8 flex-1">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Search resources, records, history..."
                className="pl-11 border-gray-100/50 bg-gray-50/50 focus:bg-white focus:border-blue-500/50 h-11 rounded-2xl transition-all shadow-inner-premium"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            {role === 'user' && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/user/notifications', { replace: false })}
                className="relative hover:bg-blue-50/50 w-11 h-11 rounded-2xl text-gray-400 hover:text-blue-600 transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </Button>
            )}
            
            <div className="h-8 w-px bg-gray-100/50 mx-1"></div>
            
            <Link to={profilePath} className="relative group">
              <Avatar className="h-11 w-11 ring-2 ring-white shadow-premium transition-all group-hover:scale-110 group-active:scale-95">
                <AvatarImage src={SessionManager.getUserProfileImage()} className="object-cover" />
                <AvatarFallback className={cn(
                  "font-black text-xs uppercase tracking-tighter",
                  role === 'admin' 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-blue-900 text-white'
                )}>
                  {role === 'admin' ? 'AD' : role === 'dealer' ? 'DL' : 'US'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm ring-1 ring-emerald-500/20" />
            </Link>
          </div>
        </header>

        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white/80 backdrop-blur-xl flex items-center px-6 justify-between sticky top-0 z-[50] border-b border-white/20">
             <div className="flex items-center gap-2">
                <img src={GovEmblem} alt="Gov Logo" className="h-7 w-auto" />
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter">Mukh Swasthya hub</span>
             </div>
             {role === 'user' && (
               <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/user/notifications')}
                className="w-10 h-10 rounded-xl"
               >
                   <Bell className="w-5 h-5 text-gray-400" />
               </Button>
             )}
        </div>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6 sm:p-10 pb-32 lg:pb-12"
        >
          {title && (
            <div className="mb-10 space-y-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">{title}</h1>
              <div className="h-1.5 w-12 bg-blue-600 rounded-full opacity-20"></div>
            </div>
          )}
          {children}
        </motion.main>
        
        {/* Bottom Navigation */}
        <BottomNav role={role} />
      </div>
    </div>
  );
}