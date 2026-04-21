import { Link } from 'react-router';
import { 
  Users, 
  TrendingUp, 
  ChevronRight, 
  ArrowRight,
  Package,
  Zap,
  Globe,
  Star,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { PublicLayout } from '../components/layouts/PublicLayout';

export function LandingPage() {
    const stats = [
        { label: "Beneficiaries", val: "5.2M+", icon: Users },
        { label: "Verified Dealers", val: "12,400+", icon: ShieldCheck },
        { label: "Monthly Kits", val: "4.8M+", icon: Package },
        { label: "Efficiency Rate", val: "99.2%", icon: TrendingUp },
    ];

    const features = [
        {
            title: "AI-Powered Verification",
            desc: "Advanced facial and document recognition ensuring kit reaching the right hands.",
            icon: Zap,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Real-time Tracking",
            desc: "End-to-end supply chain visibility from warehouse to beneficiary doorstep.",
            icon: Globe,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            title: "Transparent Distribution",
            desc: "Blockchain-inspired logging of every transaction for zero leak transparency.",
            icon: ShieldCheck,
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        }
    ];

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="pt-40 pb-24 px-6 relative">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mb-6">
                            <Star className="w-4 h-4 text-blue-600 fill-current" />
                            <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">National Public Distribution Hub</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tighter">
                            Modernizing <span className="text-blue-700">Distribution</span> for Every Citizen.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mb-10">
                            Experience the future of Mukh Swasthya. Seamless kit tracking, instant digital verification, and uncompromising transparency built for a billion people.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link 
                                to="/role-selection"
                                className="group h-14 px-8 bg-blue-900 text-white rounded-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                to="/features"
                                className="h-14 px-8 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl flex items-center font-black text-sm uppercase tracking-widest hover:border-gray-900 transition-all"
                            >
                                Platform Overview
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl bg-white p-4">
                             <div className="aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-900 flex items-center justify-center relative overflow-hidden">
                                <ShieldCheck className="w-32 h-32 text-white/90" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1 text-center">Identity Verified Successfully</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px] -z-10"></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-6 relative z-30">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl">
                    {stats.map((s, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-6 rounded-3xl hover:bg-blue-50/50 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                                <s.icon className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{s.val}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6">Uncompromising Infrastructure</h2>
                        <p className="text-gray-500 font-medium max-w-2xl mx-auto">Built on a foundation of security and speed to ensure every citizen gets what they deserve.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="group p-10 bg-white rounded-[3rem] border border-gray-100 hover:border-blue-500 transition-all shadow-sm">
                                <div className={`w-16 h-16 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform`}>
                                    <f.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">{f.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed mb-8">{f.desc}</p>
                                <Link to="/features" className="flex items-center gap-2 text-sm font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                    Learn More <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-blue-900 rounded-[4rem] mx-6 mb-24 relative overflow-hidden shadow-2xl">
                <div className="max-w-4xl mx-auto text-center relative z-10 py-12">
                    <CheckCircle className="w-16 h-16 text-blue-400 mx-auto mb-8" />
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
                        Join the Digital Transformation
                    </h2>
                    <p className="text-blue-100 text-lg md:text-xl font-medium mb-12 opacity-80 max-w-2xl mx-auto">
                        Secure, fast, and 100% paperless distribution system for a modern India.
                    </p>
                    <div className="flex justify-center">
                        <Link 
                            to="/role-selection"
                            className="h-16 px-12 bg-white text-blue-900 rounded-2xl flex items-center gap-4 font-black text-[15px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                        >
                            Link My Account
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 to-indigo-900 -z-10 opacity-50"></div>
            </section>
        </PublicLayout>
    );
}

