import { PublicLayout } from '../components/layouts/PublicLayout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  CheckCircle2,
  LineChart
} from 'lucide-react';

export function PublicImpact() {
  const stats = [
    { label: "Beneficiaries Active", val: "5.2M+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Kits Distributed", val: "4.8M+", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "States Covered", val: "28", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Efficiency Gained", val: "+42%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const highlights = [
    {
      title: "Zero Leakage Goal",
      desc: "By implementing QR-based verification, we've reduced distribution discrepancies by 94% across pilot regions.",
      metric: "94% Support"
    },
    {
      title: "Health Improvement",
      desc: "Surveys show a 30% increase in daily brushing consistency among families using the Mukh Swasthya habitual tracker.",
      metric: "30% Increase"
    },
    {
      title: "Cost Transparency",
      desc: "Digital tracking has saved the exchequer over ₹200Cr annually by eliminating duplicate and ghost beneficiaries.",
      metric: "₹200Cr Saved"
    }
  ];

  return (
    <PublicLayout>
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-emerald-50 text-emerald-700 border-emerald-100 px-4 py-1 font-black uppercase tracking-widest text-[10px]">
              National Metrics
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 bg-gradient-to-r from-emerald-900 to-blue-700 bg-clip-text text-transparent">
              Measurable <br /> Transformation.
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Real-time data and transparency are at the heart of Mukh Swasthya. 
              Explore how we're changing the landscape of oral healthcare distribution in India.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-32">
            {stats.map((s, i) => (
              <Card key={i} className="p-10 border-0 bg-white shadow-xl shadow-gray-100/50 rounded-[3rem] text-center group hover:bg-blue-900 transition-all duration-500">
                <div className={`w-16 h-16 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-white transition-colors">{s.val}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-200 transition-colors">{s.label}</div>
              </Card>
            ))}
          </div>

          {/* Impact Stories/Highlights */}
          <div className="grid lg:grid-cols-3 gap-12 mb-32">
             {highlights.map((h, i) => (
               <div key={i} className="space-y-6">
                 <div className="h-2 w-20 bg-emerald-500 rounded-full"></div>
                 <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{h.title}</h3>
                 <p className="text-gray-500 font-medium leading-relaxed">{h.desc}</p>
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">{h.metric}</span>
                 </div>
               </div>
             ))}
          </div>

          {/* Visualization Placeholder Section */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[4rem] p-12 md:p-24 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
             <div className="relative z-10">
                <LineChart className="w-24 h-24 text-white/20 mx-auto mb-8" />
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
                   Driving Change with <br /> Every Distribution.
                </h2>
                <p className="text-blue-100 text-lg md:text-xl font-medium mb-12 opacity-80 max-w-2xl mx-auto">
                   Our platform integrates demographic analytics with supply chain data to optimize 
                   resource allocation for maximum social impact.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                   <div className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
                      <p className="text-3xl font-bold">99.8%</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Deliveries</p>
                   </div>
                   <div className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
                      <p className="text-3xl font-bold">14 Sec</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Verification Time</p>
                   </div>
                </div>
             </div>
             {/* Decorative Background */}
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-400 rounded-full blur-[80px]"></div>
             </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
