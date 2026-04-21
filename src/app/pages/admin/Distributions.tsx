import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowLeft, CheckCircle, Calendar, FileText, HeartPulse, Palette, Inbox, Loader2, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { AdminDistributionDto } from '../../network/RetrofitClient';

export function AdminDistributions() {
  const navigate = useNavigate();
  const [distributions, setDistributions] = useState<AdminDistributionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await RetrofitClient.apiService.getAdminDistributions();
        setDistributions(data);
      } catch (error) {
        console.error("Failed to fetch distributions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="admin" title="Distributions">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-[#D32F2F] animate-spin" />
          <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Distribution History...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" title="Distributions">
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-[#D32F2F] p-6 lg:p-8 text-white shadow-xl flex items-center gap-4">
           <Button 
             variant="ghost" 
             size="icon" 
             className="text-white hover:bg-white/10 rounded-full"
             onClick={() => navigate('/admin/dashboard')}
           >
             <ArrowLeft className="w-6 h-6" />
           </Button>
           <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Confirmed Distributions</h1>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        {/* List */}
        {distributions.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
             <Inbox className="w-16 h-16 text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-900">No confirmed distributions found.</h3>
             <p className="text-gray-500 mt-2 font-medium">Kits that are distributed will appear here.</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {distributions.map((dist) => {
              // Construct items array from flat fields
              const items = [
                { name: 'Brush', quantity: dist.brush_received, color: '#10B981', icon: Palette },
                { name: 'Paste', quantity: dist.paste_received, color: '#E11D48', icon: HeartPulse },
                { name: 'Health Kit', quantity: dist.iec_received, color: '#2563EB', icon: FileText }
              ].filter(it => it.quantity > 0);

              return (
                <Card key={dist.id} className="p-6 border-none shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] transition-all rounded-2xl bg-white">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xl border border-emerald-100/50">
                           {getInitials(dist.dealer_name || "D")}
                         </div>
                         <div>
                           <h3 className="font-bold text-gray-900 text-lg">{dist.dealer_name || "Unknown Store"}</h3>
                           <p className="text-sm text-gray-500 font-medium">Beneficiary: {dist.beneficiary_name}</p>
                         </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                   </div>
                   
                   <div className="h-px w-full bg-gray-100 mb-6"></div>
  
                   <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        PDS Card: {dist.pds_card_no}
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Confirmed: {formatDate(dist.confirmed_at)}
                      </div>
                   </div>
  
                   <div className="flex flex-wrap gap-2 text-white">
                      {items.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div 
                            key={idx} 
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ backgroundColor: `${item.color}`, color: '#ffffff' }}
                          >
                             <Icon className="w-3.5 h-3.5" />
                             {item.quantity} {item.name}
                          </div>
                        );
                      })}
                   </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
