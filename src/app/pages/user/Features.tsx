import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Bell, Scan, Brain, Package, Calendar, MapPin, BookOpen, Users, Award, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router';

export function Features() {
  const features = [
    {
      icon: Scan,
      title: 'QR Code Scanning',
      description: 'Scan QR codes on dental kits to track distribution and verify authenticity',
      gradient: 'from-blue-500 to-indigo-600',
      benefits: ['Quick verification', 'Instant tracking', 'Fraud prevention']
    },
    {
      icon: Brain,
      title: 'AI Teeth Analysis',
      description: 'Upload teeth photos for AI-powered health analysis and personalized recommendations',
      gradient: 'from-purple-500 to-pink-600',
      benefits: ['Instant analysis', 'Smart recommendations', 'Track progress']
    },
    {
      icon: Package,
      title: 'Kit Management',
      description: 'Track your monthly dental kit distribution history and upcoming deliveries',
      gradient: 'from-emerald-500 to-teal-600',
      benefits: ['Distribution history', 'Next kit alerts', 'Stock availability']
    },
    {
      icon: Users,
      title: 'Family Management',
      description: 'Add and manage family members, track their dental health individually',
      gradient: 'from-orange-500 to-red-600',
      benefits: ['Multiple profiles', 'Individual tracking', 'Family insights']
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Schedule dental checkups and consultations at nearby clinics',
      gradient: 'from-cyan-500 to-blue-600',
      benefits: ['Online booking', 'Reminders', 'Calendar sync']
    },
    {
      icon: MapPin,
      title: 'Clinic Finder',
      description: 'Find nearby dental clinics and authorized distribution centers',
      gradient: 'from-green-500 to-emerald-600',
      benefits: ['GPS location', 'Reviews & ratings', 'Directions']
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Access articles, videos, and guides on oral health and hygiene',
      gradient: 'from-violet-500 to-purple-600',
      benefits: ['Expert articles', 'Video tutorials', 'Health tips']
    },
    {
      icon: Award,
      title: 'Rewards Program',
      description: 'Earn points for consistent dental care and unlock benefits',
      gradient: 'from-yellow-500 to-orange-600',
      benefits: ['Earn points', 'Unlock rewards', 'Track milestones']
    },
    {
      icon: Heart,
      title: 'Health Tracking',
      description: 'Monitor daily brushing habits, health scores, and progress over time',
      gradient: 'from-rose-500 to-pink-600',
      benefits: ['Daily tracking', 'Progress charts', 'Health insights']
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Your health data is encrypted and securely stored with privacy protection',
      gradient: 'from-gray-700 to-gray-900',
      benefits: ['End-to-end encryption', 'HIPAA compliant', 'Privacy controls']
    }
  ];

  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/user/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Features</h1>
              <p className="text-sm text-gray-600 mt-1">Explore all the tools available to you</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Header Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white border-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                Family Portal
              </Badge>
              <h2 className="text-2xl font-bold">Mukh Swasthya Features</h2>
              <p className="text-blue-100 max-w-2xl">
                Comprehensive dental care management tools designed to help you and your family maintain excellent oral health.
              </p>
            </div>
            <Package className="w-16 h-16 text-white/30" />
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group border border-gray-200">
                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="pl-16 space-y-1.5">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help Getting Started?</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Visit our support center for tutorials, FAQs, and step-by-step guides on using all features.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/user/support">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Visit Support Center
              </Button>
            </Link>
            <Link to="/user/learn">
              <Button variant="outline">
                View Tutorials
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
