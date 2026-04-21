import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Hospital, 
  Phone, 
  Globe, 
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { RetrofitClient, type ClinicResponse } from '../../network/RetrofitClient';
import { cn } from '../../components/ui/utils';
import { toast } from 'sonner';

export function Consult() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allClinics, setAllClinics] = useState<ClinicResponse[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<ClinicResponse | null>(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const data = await RetrofitClient.apiService.viewClinics();
      setAllClinics(data);
    } catch (error) {
      console.error("Failed to fetch clinics", error);
    }
  };

  const handleClinicClick = (clinic: ClinicResponse) => {
    if (clinic.website) {
      let url = clinic.website.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(clinic.clinicName)}`, '_blank');
    }
  };

  const filteredRecommended = useMemo(() => {
    return allClinics.filter(clinic => 
      clinic.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.district.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allClinics, searchQuery]);

  return (
    <DashboardLayout role="user" title="">
      <div className="min-h-[calc(100vh-80px)] bg-[#F8F9FA] relative flex flex-col pb-24 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl overflow-hidden shadow-sm border border-gray-100/50">
        
        {/* Immersive Header Backdrop */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-8 sm:p-10 pb-20 rounded-b-[4rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-[80px]"></div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Network Telemetry Active</span>
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-white">Consultation Hub</h1>
                  <p className="text-blue-100/60 font-bold text-sm tracking-tight capitalize mt-1">Connect with specialized oral care institutes</p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Hospital className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder="Search institutes, clinics, or specific addresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-18 bg-white border-none rounded-[2rem] shadow-2xl shadow-blue-900/30 text-gray-900 placeholder:text-gray-300 font-black text-base focus-visible:ring-4 focus-visible:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-12 space-y-12 max-w-5xl mx-auto w-full">

          {/* Recommended Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Recommended Dental Services</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
              {filteredRecommended.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                  <ServiceCard clinic={item} onClick={() => handleClinicClick(item)} />
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* Clinic Detail Drawer/Bottom Sheet Equivalent */}
        <AnimatePresence>
          {selectedClinic && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setSelectedClinic(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-[40px] z-[70] shadow-2xl p-8 pt-10"
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-100 rounded-full" />
                
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1.5 flex-1 pr-8">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">{selectedClinic.clinicName}</h2>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500 font-bold leading-relaxed">{selectedClinic.address}</p>
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner shrink-0">
                      <Hospital className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <QuickActionButton 
                      icon={<Navigation className="w-6 h-6 stroke-[2.5px]" />} 
                      label="Route" 
                      color="#2563EB" 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedClinic.clinicName + ", " + selectedClinic.address)}`, '_blank')}
                    />
                    <QuickActionButton 
                      icon={<Phone className="w-6 h-6 stroke-[2.5px]" />} 
                      label="Connect" 
                      color="#10B981" 
                      onClick={() => window.location.href = `tel:${selectedClinic.contactNumber}`}
                      disabled={!selectedClinic.contactNumber}
                    />
                    <QuickActionButton 
                      icon={<Globe className="w-6 h-6 stroke-[2.5px]" />} 
                      label="Portal" 
                      color="#F59E0B" 
                      onClick={() => {
                        let url = selectedClinic.website?.trim();
                        if (url) {
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://' + url;
                          }
                          window.open(url, '_blank');
                        } else {
                          window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedClinic.clinicName)}`, '_blank');
                        }
                      }}
                    />
                  </div>

                   <Button 
                    className="w-full h-20 rounded-[2rem] bg-indigo-600 hover:bg-black text-white font-black tracking-[0.2em] uppercase text-xs shadow-2xl flex items-center justify-center gap-4 group transition-all active:scale-[0.98]"
                    onClick={() => {
                      let url = selectedClinic.website?.trim();
                      if (url) {
                        toast.success("Redirecting to clinical portal...");
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                          url = 'https://' + url;
                        }
                        window.open(url, '_blank');
                      } else {
                        toast.error("Clinical portal URL not found");
                      }
                    }}
                  >
                    <ExternalLink className="w-5 h-5 text-indigo-200" />
                    Visit Clinical Portal
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function ServiceCard({ clinic, onClick }: { clinic: ClinicResponse, onClick: () => void }) {
  return (
    <Card 
      onClick={onClick}
      className="min-w-[180px] p-8 rounded-[2.5rem] border-none shadow-xl shadow-gray-200/40 bg-white flex flex-col items-center gap-6 cursor-pointer hover:translate-y-[-8px] transition-all duration-500 group"
    >
      <div className="w-20 h-20 rounded-[1.75rem] bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-inner border border-gray-100/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <Hospital className="w-10 h-10 text-blue-600 group-hover:text-white relative z-10 transition-all duration-500" />
      </div>
      <div className="text-center space-y-1 flex-1 flex flex-col justify-center">
        <p className="text-sm font-black text-gray-900 tracking-tight line-clamp-1">{clinic.clinicName}</p>
      </div>
    </Card>
  );
}


function QuickActionButton({ icon, label, color, onClick, disabled }: { icon: any, label: string, color: string, onClick: () => void, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-4 p-5 rounded-[2rem] transition-all duration-300 active:scale-95 flex-1 relative group",
        disabled ? "opacity-30 p-2" : "hover:bg-gray-50/50"
      )}
      style={{ color }}
    >
      <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-current/5 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: `${color}10`, color }}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}