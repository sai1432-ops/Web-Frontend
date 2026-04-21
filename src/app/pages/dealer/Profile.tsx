import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  User, 
  Lock, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { RetrofitClient } from '../../network/RetrofitClient';

export function DealerProfile() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 0;
  
  const [profile, setProfile] = useState<any>(currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await RetrofitClient.apiService.getDealerProfile('', dealerId);
        if (res.isSuccessful && res.body) {
           setProfile(res.body);
           localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.body }));
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      } finally {
        setIsLoading(false);
      }
    };
    if (dealerId) fetchProfile();
    else setIsLoading(false);
  }, [dealerId]);

  const dealerName = profile.name || "Dealer Name";
  const dealerEmail = profile.email || "dealer@example.com";
  const dealerPhone = profile.phone || "+91 00000 00000";
  
  const companyName = profile.companyName || profile.company_name || "Official Merchant Center";
  const address = profile.address || "";
  const city = profile.city || "";
  const state = profile.state || "";
  const pincode = profile.pincode || "";

  const DealerGreen = "#047857";

  const fullAddress = [address, city, state, pincode].filter(Boolean).join(", ") || "Address not provided";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative flex flex-col items-center">
      {/* Enhanced Gradient Header Background */}
      <div 
        className="absolute top-0 left-0 right-0 h-[280px] z-0"
        style={{ 
          background: `linear-gradient(to bottom, ${DealerGreen}, ${DealerGreen}CC, #F8F9FA)` 
        }}
      ></div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-2xl flex items-center px-6 py-8 text-white">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dealer/dashboard')}
          className="rounded-full bg-white/20 hover:bg-white/30 text-white mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-black tracking-tight uppercase">Dealer Profile</h1>
      </header>

      <main className="relative z-10 w-full max-w-lg px-6 pb-12">
        <div className="flex flex-col items-center">
          {/* Modern Profile Image Section */}
          <div className="relative group cursor-pointer">
            <div className="w-[130px] h-[130px] rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-100">
              <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                <User className="w-16 h-16" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-9 h-9 bg-emerald-500 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-5 text-center">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{dealerName}</h2>
            
            <div className="mt-3 flex items-center justify-center gap-3">
              <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-800 tracking-wider uppercase">Official Dealer</span>
              </div>
              <span className="text-xs font-bold text-gray-400">ID: D-{dealerId > 0 ? dealerId : "9824"}</span>
            </div>
          </div>

          <div className="w-full mt-10 space-y-4">
            {/* Account Info Card */}
            <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-black/5 bg-white">
              <div className="space-y-6">
                <InfoRow 
                  icon={<Mail className="w-5 h-5" />} 
                  label="Business Email" 
                  value={dealerEmail} 
                  color={DealerGreen} 
                />
                <div className="h-px bg-gray-50"></div>
                <InfoRow 
                  icon={<Phone className="w-5 h-5" />} 
                  label="Contact Number" 
                  value={dealerPhone} 
                  color="#10B981" 
                />
              </div>
            </Card>

            {/* Business Info Card */}
            <div className="pt-4 space-y-4">
              <h3 className="px-2 text-sm font-black text-gray-400 uppercase tracking-widest leading-none">Business Information</h3>
              <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-black/5 bg-white">
                <div className="space-y-6">
                  <InfoRow 
                    icon={<Building className="w-5 h-5" />} 
                    label="Company Name" 
                    value={companyName} 
                    color={DealerGreen} 
                  />
                  <div className="h-px bg-gray-50"></div>
                  <InfoRow 
                    icon={<MapPin className="w-5 h-5" />} 
                    label="Location" 
                    value={fullAddress} 
                    color="#10B981" 
                  />
                </div>
              </Card>
            </div>

            {/* Account Settings */}
            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">Account Settings</h3>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Manage</span>
              </div>
              
              <div className="space-y-3">
                <SettingsItem 
                  icon={<User className="w-5 h-5" />} 
                  title="Edit Profile" 
                  subtitle="Modify store and contact info" 
                  onClick={() => navigate('/dealer/edit-profile')} 
                />
                <SettingsItem 
                  icon={<Lock className="w-5 h-5" />} 
                  title="Change Password" 
                  subtitle="Update your security credentials" 
                  onClick={() => navigate('/dealer/change-password')} 
                />
              </div>
            </div>



            <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] pt-4">
              Mukh Swasthya Version 2.4.0
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
        <span className="text-sm font-black text-gray-900 truncate leading-tight">{value}</span>
      </div>
    </div>
  );
}

function SettingsItem({ icon, title, subtitle, onClick }: { icon: any, title: string, subtitle: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-emerald-200 transition-all active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
        {icon}
      </div>
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="text-sm font-black text-gray-900 leading-tight">{title}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{subtitle}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
    </button>
  );
}