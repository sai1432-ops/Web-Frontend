import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Bell, Package, Scan, BarChart3, Users, MapPin, FileText, CheckCircle, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router';

export function Features() {
  const features = [
    {
      icon: Package,
      title: 'Stock Management',
      description: 'Manage inventory levels, track stock movements, and receive low stock alerts',
      gradient: 'from-emerald-500 to-teal-600',
      benefits: ['Real-time inventory', 'Low stock alerts', 'Stock history']
    },
    {
      icon: Scan,
      title: 'QR Code Distribution',
      description: 'Scan and verify dental kits during distribution to families',
      gradient: 'from-blue-500 to-indigo-600',
      benefits: ['Quick scanning', 'Instant verification', 'Distribution logs']
    },
    {
      icon: Users,
      title: 'Beneficiary Management',
      description: 'View assigned families, track distribution history, and manage beneficiaries',
      gradient: 'from-purple-500 to-pink-600',
      benefits: ['Family profiles', 'Distribution tracking', 'Contact management']
    },
    {
      icon: FileText,
      title: 'Stock Requests',
      description: 'Submit stock requests to admin and track approval status',
      gradient: 'from-orange-500 to-red-600',
      benefits: ['Easy requests', 'Status tracking', 'Request history']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Access detailed reports on distribution, stock levels, and performance metrics',
      gradient: 'from-cyan-500 to-blue-600',
      benefits: ['Performance metrics', 'Export reports', 'Visual charts']
    },
    {
      icon: MapPin,
      title: 'Territory Management',
      description: 'View your assigned distribution zones and coverage areas',
      gradient: 'from-green-500 to-emerald-600',
      benefits: ['Zone mapping', 'Coverage stats', 'Location tracking']
    },
    {
      icon: CheckCircle,
      title: 'Distribution Verification',
      description: 'Verify and validate all kit distributions with digital signatures',
      gradient: 'from-violet-500 to-purple-600',
      benefits: ['Digital verification', 'Signature capture', 'Proof records']
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monitor your distribution performance and achievement metrics',
      gradient: 'from-yellow-500 to-orange-600',
      benefits: ['Achievement tracking', 'Performance goals', 'Leaderboards']
    },
    {
      icon: AlertCircle,
      title: 'Alerts & Notifications',
      description: 'Receive real-time alerts for stock requests, approvals, and updates',
      gradient: 'from-rose-500 to-pink-600',
      benefits: ['Push notifications', 'Email alerts', 'Priority flags']
    },
    {
      icon: Clock,
      title: 'Distribution Schedule',
      description: 'Plan and manage your kit distribution schedule and appointments',
      gradient: 'from-indigo-500 to-purple-600',
      benefits: ['Calendar view', 'Schedule planning', 'Reminders']
    }
  ];

  return (
    <DashboardLayout role="dealer" title="">
      <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/dealer/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dealer Portal Features</h1>
              <p className="text-sm text-gray-600 mt-1">Tools to manage distribution efficiently</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Header Card */}
        <Card className="p-6 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white border-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                Dealer Portal
              </Badge>
              <h2 className="text-2xl font-bold">Distribution Management Tools</h2>
              <p className="text-emerald-100 max-w-2xl">
                Comprehensive tools designed to streamline your dental kit distribution, inventory management, and beneficiary tracking operations.
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
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
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
        <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-emerald-50 border-emerald-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help with Distribution?</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Contact our support team for assistance with stock management, distribution tracking, or system issues.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Contact Support
            </Button>
            <Button variant="outline">
              View Guidelines
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
