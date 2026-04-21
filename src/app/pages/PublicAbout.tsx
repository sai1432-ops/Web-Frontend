import { PublicLayout } from '../components/layouts/PublicLayout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Target, 
  Eye, 
  Users, 
  ShieldCheck, 
  Zap,
  Globe
} from 'lucide-react';
import GovEmblem from '../../assets/gov_emblem_pds.png';

export function PublicAbout() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To ensure every Indian has access to affordable oral healthcare and essential hygiene products through digital innovation.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      desc: 'To become the global benchmark for digital healthcare distribution, ensuring 100% transparency and zero leakages.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: ShieldCheck,
      title: 'Integrity',
      desc: 'Built on a foundation of trust and government-verified security to protect citizen interests and data privacy.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <PublicLayout>
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8">
              <Badge className="bg-blue-50 text-blue-700 border-blue-100 px-4 py-1 font-black uppercase tracking-widest text-[10px]">
                About the Initiative
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight">
                Empowering a <span className="text-blue-700">Healthier</span> India.
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Mukh Swasthya is a transformative national initiative under the Government of India, 
                leveraging advanced technology to modernize the distribution of dental healthcare 
                necessities for millions of citizens.
              </p>
              <div className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50">
                <img src={GovEmblem} alt="Gov Logo" className="h-16 w-auto" />
                <div>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Official National Portal</p>
                   <p className="text-sm font-bold text-gray-900 leading-tight">A Digital India Initiative for Public Healthcare Distribution</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-[3.5rem] bg-gradient-to-br from-blue-600 to-indigo-900 p-1">
                <div className="w-full h-full bg-white rounded-[3.4rem] overflow-hidden flex items-center justify-center p-12">
                   <Globe className="w-48 h-48 text-blue-100 animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 rounded-full -z-10 blur-2xl opacity-50"></div>
            </div>
          </div>

          {/* Mission/Vision Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {values.map((v, i) => (
              <Card key={i} className="p-10 border-0 bg-white shadow-xl shadow-gray-100/50 rounded-[3rem] hover:-translate-y-2 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl ${v.bg} ${v.color} flex items-center justify-center mb-8`}>
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">{v.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{v.desc}</p>
              </Card>
            ))}
          </div>

          {/* Detailed Info */}
          <div className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
                Our Commitment to <br /> Digital Transparency
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-blue-400" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold mb-2">Real-time Accountability</h4>
                      <p className="text-gray-400 font-medium">Every kit distribution is logged on our secure digital ledger, ensuring 100% reach to the intended beneficiary.</p>
                   </div>
                </div>
                <div className="flex gap-6">
                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-400" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold mb-2">Inclusive Healthcare</h4>
                      <p className="text-gray-400 font-medium">Built for all citizens, with simple interfaces and multi-language support to ensure no one is left behind.</p>
                   </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
