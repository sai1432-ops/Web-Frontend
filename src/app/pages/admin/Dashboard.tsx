import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { 
  Zap, 
  ArrowRight, 
  Activity, 
  HeartPulse, 
  Store, 
  Users2, 
  Box, 
  Undo2, 
  Loader2
} from 'lucide-react';
import { Link } from 'react-router';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { AdminDashboardStats } from '../../network/RetrofitClient';

import { cn } from '../../components/ui/utils';

export function AdminDashboard() {
  const [statsData, setStatsData] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const stats = await RetrofitClient.apiService.getAdminDashboardStats();
        setStatsData(stats);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = [
    { 
      label: 'Regional Dealers', 
      value: (statsData?.totalDealers ?? 0).toString(), 
      icon: Store, 
      bgGradient: 'from-blue-600 to-blue-900',
      lightBg: 'bg-blue-50',
      iconColor: 'text-blue-900'
    },
    { 
      label: 'Active Beneficiaries', 
      value: (statsData?.totalBeneficiaries ?? 0).toLocaleString(), 
      icon: Users2, 
      bgGradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    { 
      label: 'Active Distributions', 
      value: (statsData?.totalDistributions ?? 0).toLocaleString(), 
      icon: Box,
      bgGradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'System Returns', 
      value: (statsData?.returnedKits ?? 0).toString(), 
      icon: Undo2,
      bgGradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
  ];

  const quickActions = [
    {
      title: 'Clinical Partners',
      description: 'Manage authorized medical nodes and consultation portals',
      icon: HeartPulse,
      color: 'bg-emerald-50 text-emerald-600',
      link: '/admin/clinics'
    }
  ];

  if (isLoading) {
    return (
      <DashboardLayout role="admin" title="Control Center">
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-900 animate-spin" />
          <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-[10px]">Authorizing Secure Session...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" title="Control Center">
      <div className="space-y-10 max-w-[1600px] mx-auto">
        {/* Professional Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-8 lg:p-14 text-white shadow-premium">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                Live Hub Command Overide
              </div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter">System Administrator</h1>
              <p className="text-blue-100/60 text-lg font-bold leading-relaxed max-w-2xl">
                Global oversight of Mukh Swasthya Hub operations. Real-time telemetry from <span className="text-white">{statsData?.totalDealers} active nodes</span> and <span className="text-white">{statsData?.totalBeneficiaries} identities</span>.
              </p>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const cardContent = (
              <Card key={idx} className="card-premium group p-8 border-none h-full">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-md", stat.lightBg)}>
                      <Icon className={cn("w-8 h-8", stat.iconColor)} />
                    </div>

                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-gray-900">{stat.label}</h3>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );

            if (stat.label.includes('Distributions')) {
              return <Link key={idx} to="/admin/distributions">{cardContent}</Link>;
            }
            return <div key={idx}>{cardContent}</div>;
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Priority Actions */}
          <div className="space-y-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight px-2 uppercase">Priority Actions</h3>
            <div className="grid gap-6">
              {quickActions.map((action, idx) => (
                <Link key={idx} to={action.link}>
                  <Card className="card-premium group p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-none bg-white relative overflow-hidden">
                    <div className="flex items-start gap-5 relative z-10">
                      <div className={cn("p-5 rounded-2xl transition-transform group-hover:scale-110 duration-300 shadow-sm", action.color)}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-black text-gray-900 group-hover:text-blue-900 transition-colors uppercase tracking-tight text-sm">{action.title}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Performance Indicators */}
          <Card className="p-10 bg-gray-900 text-white rounded-[2.5rem] border-none shadow-premium relative overflow-hidden h-full flex flex-col justify-center">
            <div className="relative z-10 space-y-8">
                <h4 className="font-black text-lg flex items-center gap-3 tracking-tighter">
                  <Activity className="w-6 h-6 text-blue-400" />
                  Network Integrity
                </h4>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      <span>Utilization Velocity</span>
                      <span className="text-emerald-400">92%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      <span>Node Active Ratio</span>
                      <span className="text-blue-400">78%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          </Card>
        </div>


      </div>
    </DashboardLayout>
  );
}