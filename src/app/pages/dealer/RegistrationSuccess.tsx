import { useLocation, useNavigate } from 'react-router';
import { 
  Check, 
  ArrowLeft, 
  Copy, 
  LayoutDashboard, 
  Home, 
  PlusCircle,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export default function RegistrationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { householdId = "#HH-98210" } = location.state || {};

  const handleCopyId = () => {
    navigator.clipboard.writeText(householdId);
    toast.success("Household ID copied to clipboard");
  };

  return (
    <DashboardLayout role="dealer" title="">
      <div className="flex flex-col min-h-screen bg-[#FDFDFD] -m-6 sm:-m-8 pb-32">
        {/* Soft Header with Back Action */}
        <div className="px-8 pt-12 pb-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <button 
                onClick={() => navigate('/dealer/beneficiaries')} 
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 bg-white shadow-sm hover:bg-gray-50 transition-all active:scale-95"
            >
                <ArrowLeft className="w-5 h-5 font-black" />
            </button>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Registration Successful</h1>
        </div>

        <div className="px-6 lg:px-12 max-w-2xl mx-auto w-full space-y-12 py-8">
            {/* Massive Success Hero Section */}
            <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-700">
                <div className="relative">
                    <div className="w-48 h-48 rounded-[3rem] bg-green-50 flex items-center justify-center border border-green-100 shadow-2xl shadow-green-900/5 relative overflow-hidden group">
                        <Check className="w-24 h-24 text-green-600 relative z-10 transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    {/* Pulsing Outer Ring */}
                    <div className="absolute -inset-4 border-2 border-green-500/10 rounded-[3.5rem] animate-pulse"></div>
                </div>

                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Registration Successful!</h2>
                    <p className="text-sm font-bold text-gray-400 tracking-tight leading-relaxed max-w-xs mx-auto uppercase">
                        The household has been verified and added to the National Health Registry.
                    </p>
                </div>
            </div>

            {/* Dynamic Information Tiles */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {/* Household ID Tile */}
                <Card className="p-8 rounded-[2.5rem] border border-gray-50 bg-white shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">New Household ID</p>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight font-mono">{householdId}</h3>
                            <button 
                                onClick={handleCopyId}
                                className="flex items-center gap-1.5 text-blue-600 text-[11px] font-black uppercase tracking-widest hover:underline pt-2"
                            >
                                <Copy className="w-3 h-3" />
                                Copy ID
                            </button>
                        </div>
                        <div className="w-20 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all overflow-hidden rotate-3 group-hover:rotate-0">
                            <ShieldCheck className="w-8 h-8 text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </Card>

                {/* Login Credentials Info Card */}
                <Card className="p-8 rounded-[2.5rem] border-none bg-blue-900 shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Login Credentials</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-blue-200/60 uppercase tracking-widest">Username</p>
                                <p className="text-xs font-bold text-white">Registered Mobile Number</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[9px] font-black text-blue-200/60 uppercase tracking-widest">Password</p>
                                <p className="text-xs font-bold text-white font-mono">welcome@123</p>
                            </div>
                        </div>
                        
                        <div className="pt-2">
                            <p className="text-[9px] font-black text-blue-200/40 uppercase tracking-[0.2em] leading-relaxed">
                                Please advise the beneficiary to change their password upon first login for security.
                            </p>
                        </div>
                    </div>
                    {/* Decorative Background for Card */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>

            </div>

            {/* Smart Action Hub */}
            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                <Button 
                    onClick={() => navigate('/dealer/beneficiaries')}
                    className="w-full h-16 rounded-2xl bg-[#1E3A8A] hover:bg-blue-900 shadow-2xl shadow-blue-900/10 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 border-none"
                >
                    <LayoutDashboard className="w-5 h-5" />
                    View Household Dashboard
                </Button>

                <Button 
                    onClick={() => navigate('/dealer/dashboard')}
                    variant="secondary"
                    className="w-full h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 border-none text-gray-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Home className="w-4 h-4" />
                    Go Home
                </Button>

                <div className="flex justify-center pt-2">
                    <button 
                        onClick={() => navigate('/dealer/beneficiaries/register')}
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Register Another Household
                    </button>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
