import { Link } from 'react-router';
import { 
  Users, 
  Store, 
  Shield, 
  ArrowRight,
  ChevronLeft, 
  CheckCircle,
  Star
} from 'lucide-react';
import GovEmblem from '../../assets/gov_emblem_pds.png';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  path: string;
  accent: string;
  accentText: string;
  features: string[];
}

function RoleCard({ 
  icon, 
  title, 
  subtitle, 
  description, 
  gradient, 
  path, 
  accent,
  accentText,
  features
}: RoleCardProps) {
  return (
    <Link to={path} className="group">
      <div className="relative h-full bg-white rounded-[3rem] p-4 border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(30,58,138,0.2)] hover:-translate-y-2">
        {/* Design Element: Inner Gradient Container */}
        <div className={`h-full rounded-[2.2rem] bg-white p-8 flex flex-col relative overflow-hidden border border-gray-50`}>
            {/* Icon Bubble */}
            <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl transform group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}>
                {icon}
            </div>

            <div className="mb-6">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentText} mb-2 block`}>{subtitle}</span>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                    {description}
                </p>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 mb-8">
                    {features.map((feature, i) => (
                        <span key={i} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 ${accent} ${accentText} rounded-lg`}>
                            {feature}
                        </span>
                    ))}
                </div>

                <div className={`h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 transition-all duration-300 shadow-xl`}>
                    Access Portal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className={`absolute top-0 right-0 p-8 transform rotate-12 translate-x-4 -translate-y-4 opacity-[0.05] grayscale`}>
                {icon}
            </div>
        </div>
      </div>
    </Link>
  );
}

export function RoleSelection() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 relative overflow-hidden">
      {/* Dynamic Background elements */}
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-[1.25rem] shadow-xl flex items-center justify-center p-3 border border-gray-100">
                <img src={GovEmblem} alt="Gov Logo" className="w-full h-auto" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-blue-900 leading-none tracking-tighter uppercase">Mukh Swasthya HUB</h1>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1.5">Official National Portal</p>
              </div>
           </div>

           <Link 
            to="/" 
            className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all group"
           >
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Back to Main</span>
           </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mb-6 font-black text-[10px] text-blue-700 tracking-wider uppercase">
             <Star className="w-3 h-3 fill-current" />
             Select Role for Authentication
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 leading-[1.05]">
            One Hub. Every <span className="text-blue-700">Citizen.</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
            Securely access Mukh Swasthya. Choose your role to proceed with verified authentication and real-time kit management.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard 
              icon={<Users className="w-10 h-10 text-white" />}
              title="User"
              subtitle="Citizens & Families"
              description="Access family dental health services"
              gradient="from-blue-600 to-indigo-700"
              path="/login/user"
              accent="bg-blue-50"
              accentText="text-blue-600"
              features={["Digital Card", "Live Tracking", "AI Feedback"]}
            />

            <RoleCard 
              icon={<Store className="w-10 h-10 text-white" />}
              title="Dealer"
              subtitle="PDS Retailers"
              description="Manage kit distribution and inventory"
              gradient="from-emerald-500 to-teal-800"
              path="/login/dealer"
              accent="bg-emerald-50"
              accentText="text-emerald-600"
              features={["Stock Hub", "QR Scan", "Reports"]}
            />

            <RoleCard 
              icon={<Shield className="w-10 h-10 text-white" />}
              title="Admin"
              subtitle="State & Central"
              description="Oversee system operations and users"
              gradient="from-red-500 to-rose-800"
              path="/login/admin"
              accent="bg-rose-50"
              accentText="text-rose-600"
              features={["Analytics", "Control Tower", "Security"]}
            />
        </div>

        {/* Verified Banner */}
        <div className="mt-32 p-12 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-600 ring-4 ring-blue-50/50">
               <CheckCircle className="w-8 h-8" />
             </div>
             <div>
                <h4 className="text-2xl font-black text-gray-900 tracking-tight mb-1">State-of-the-Art Security</h4>
                <p className="text-gray-500 font-medium">All interactions are encrypted and verified via multiple security check gates.</p>
             </div>
          </div>
          <div className="flex items-center gap-10">
             <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
             <div className="flex flex-col gap-1 items-end text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="hover:text-blue-600 transition-colors cursor-pointer">Security Protocol v4.2</span>
                <span className="hover:text-blue-600 transition-colors cursor-pointer">support@mukhswasthya.gov.in</span>
             </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-gray-100 text-center relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          © 2026 Mukh Swasthya • GOVERNMENT OF INDIA
        </p>
      </footer>
    </div>
  );
}