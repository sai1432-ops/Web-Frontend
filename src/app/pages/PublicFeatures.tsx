import { PublicLayout } from '../components/layouts/PublicLayout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Scan, 
  Brain, 
  Package, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Users, 
  Award, 
  Heart, 
  Shield 
} from 'lucide-react';

export function PublicFeatures() {
  const features = [
    {
      icon: Scan,
      title: 'QR Code Scanning',
      description: 'Scan QR codes on dental kits to track distribution and verify authenticity instantly.',
      gradient: 'from-blue-500 to-indigo-600',
      benefits: ['Quick verification', 'Instant tracking', 'Fraud prevention']
    },
    {
      icon: Brain,
      title: 'AI Teeth Analysis',
      description: 'Advanced AI-powered dental health assessment through simple photo uploads.',
      gradient: 'from-purple-500 to-pink-600',
      benefits: ['Instant feedback', 'Smart recommendations', 'Progress tracking']
    },
    {
      icon: Package,
      title: 'Kit Management',
      description: 'End-to-end visibility of dental kit availability and distribution timelines.',
      gradient: 'from-emerald-500 to-teal-600',
      benefits: ['Real-time stock', 'Supply chain transparency', 'Predictive alerts']
    },
    {
      icon: Users,
      title: 'Family Health Hub',
      description: 'Manage oral health for the entire family from a single, unified dashboard.',
      gradient: 'from-orange-500 to-red-600',
      benefits: ['Individual profiles', 'Family health scoring', 'Unified management']
    },
    {
      icon: Calendar,
      title: 'Digital Appointments',
      description: 'Seamlessly schedule consultations with verified healthcare providers.',
      gradient: 'from-cyan-500 to-blue-600',
      benefits: ['Online booking', 'Automated reminders', 'Clinic integration']
    },
    {
      icon: MapPin,
      title: 'Locator Service',
      description: 'Instantly find nearest authorized distribution points and dental clinics.',
      gradient: 'from-green-500 to-emerald-600',
      benefits: ['GPS tracking', 'Verified locations', 'Turn-by-turn navigation']
    },
    {
      icon: BookOpen,
      title: 'Health Education',
      description: 'Comprehensive library of oral hygiene resources for all age groups.',
      gradient: 'from-violet-500 to-purple-600',
      benefits: ['Video tutorials', 'Expert articles', 'Interactive guides']
    },
    {
      icon: Award,
      title: 'Citizen Rewards',
      description: 'Earn points and badges for maintaining consistent oral health habits.',
      gradient: 'from-yellow-500 to-orange-600',
      benefits: ['Habit gamification', 'Health milestones', 'Unlockable benefits']
    },
    {
      icon: Heart,
      title: 'Vital Monitoring',
      description: 'Daily tracking systems for brushing habits and oral health metrics.',
      gradient: 'from-rose-500 to-pink-600',
      benefits: ['Habit streaks', 'Trend analysis', 'Personalized insights']
    },
    {
      icon: Shield,
      title: 'Secure Infrastructure',
      description: 'Enterprise-grade security ensuring your health data remains private.',
      gradient: 'from-gray-700 to-gray-900',
      benefits: ['Encrypted storage', 'Privacy first', 'Secure verification']
    }
  ];

  return (
    <PublicLayout>
      <div className="pt-32 pb-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-100 px-4 py-1 font-black uppercase tracking-widest text-[10px]">
              Platform Capabilities
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 bg-gradient-to-r from-blue-900 to-indigo-700 bg-clip-text text-transparent">
              Unified Dental <br /> Infrastructure.
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Mukh Swasthya combines cutting-edge AI with a robust distribution network to ensure 
              oral healthcare reaches every citizen with absolute transparency.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-500 group border-0 bg-white shadow-xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent -mr-16 -mt-16 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{feature.title}</h3>
                        <div className="h-1 w-12 bg-blue-500 mt-2 rounded-full"></div>
                      </div>
                    </div>

                    <p className="text-gray-500 font-medium leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-tight">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
