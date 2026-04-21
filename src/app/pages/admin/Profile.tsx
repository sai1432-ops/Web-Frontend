import { useNavigate } from 'react-router';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Shield, FileText, ChevronRight } from 'lucide-react';

export function AdminProfile() {
  const navigate = useNavigate();

  // Mock data matching the compose specification
  const adminName = "Super Admin";
  const adminEmail = "admin@mukhswasthya.gov.in";
  const adminPhone = "+91 98765 43210";
  const adminLocation = "Central Headquarters";
  const adminId = "AD-7721";

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <DashboardLayout role="admin" title="Admin Profile">
      <div className="max-w-[1600px] mx-auto pb-12 relative overflow-x-hidden pt-4">
        {/* Top Header - mimics TopAppBar in Compose */}
        <div className="flex items-center gap-4 px-4 sm:px-8 mb-4 relative z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10 rounded-full"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">Admin Profile</h1>
        </div>

        {/* Premium Gradient Header block */}
        <div className="absolute top-0 left-0 right-0 h-[260px] bg-gradient-to-b from-[#D32F2F] via-[#D32F2F]/90 to-[#D32F2F]/60 rounded-b-[40px] z-0 pointer-events-none shadow-lg"></div>

        <div className="relative z-10 px-4 sm:px-8 mt-12 max-w-2xl mx-auto space-y-6">
          {/* Profile Card Overlapping */}
          <Card className="p-8 border-none shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] rounded-3xl bg-white flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#FFFFEBEE] flex items-center justify-center font-black text-4xl text-[#D32F2F] mb-4 border-4 border-white shadow-sm ring-2 ring-red-50">
              {getInitials(adminName)}
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">{adminName}</h2>
            
            <div className="bg-[#FFFFEBEE] text-[#D32F2F] font-bold text-xs tracking-wider px-3 py-1 rounded-full mb-4 uppercase">
              ADMIN
            </div>
            
            <p className="text-gray-500 font-medium text-sm mb-1">{adminEmail}</p>
            <p className="text-gray-500 font-medium text-sm mb-3">{adminPhone}</p>
            <p className="text-gray-300 font-bold text-xs tracking-wider">ID: {adminId}</p>
          </Card>

          {/* Account Details Section */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3 px-1">Account Details</h3>
            <Card className="border-none shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] rounded-3xl bg-white overflow-hidden py-2">
              <ProfileInfoRow label="Full Name" value={adminName} />
              <ProfileInfoRow label="Email Address" value={adminEmail} />
              <ProfileInfoRow label="Phone Number" value={adminPhone} />
              <ProfileInfoRow label="Region" value={adminLocation} isLast />
            </Card>
          </div>

          {/* Support & Privacy Section */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3 px-1">Support & Privacy</h3>
            <Card className="border-none shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] rounded-3xl bg-white overflow-hidden py-2">
              <ProfileMenuRow 
                icon={Shield} 
                label="Privacy Policy" 
                iconBg="bg-fuchsia-50" 
                iconColor="text-fuchsia-700" 
              />
              <ProfileMenuRow 
                icon={FileText} 
                label="Terms & Conditions" 
                iconBg="bg-cyan-50" 
                iconColor="text-cyan-700"
                isLast
              />
            </Card>
          </div>


        </div>
      </div>
    </DashboardLayout>
  );
}

// Subcomponents mapped strictly from Compose logic

function ProfileInfoRow({ label, value, isLast = false }: { label: string, value: string, isLast?: boolean }) {
  return (
    <div className="px-5 py-3.5 flex flex-col group hover:bg-gray-50/50 transition-colors cursor-default">
      <span className="text-xs text-gray-500 font-medium mb-1">{label}</span>
      <span className="text-[15px] font-bold text-gray-900">{value}</span>
      {!isLast && (
        <div className="h-px bg-gray-100 w-full mt-4 -mb-3.5" />
      )}
    </div>
  );
}

function ProfileMenuRow({ 
  icon: Icon, label, iconBg, iconColor, isLast = false 
}: { 
  icon: any, label: string, iconBg: string, iconColor: string, isLast?: boolean 
}) {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-[16px] font-semibold text-gray-900">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
      {!isLast && (
        <div className="h-px bg-gray-100 w-full absolute bottom-0 right-0 left-0 hidden" />
      )}
    </div>
  );
}