import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Bell, Shield, Users, Package, BarChart3, FileText, Database, Settings, Lock, Activity, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router';

export function Features() {
  const features = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage all users including dealers, families, and admin accounts with role-based access',
      gradient: 'from-red-500 to-rose-600',
      benefits: ['User creation & editing', 'Role assignment', 'Account status control']
    },
    {
      icon: Package,
      title: 'Stock Request Management',
      description: 'Review, approve, or reject dealer stock requests and manage inventory allocation',
      gradient: 'from-orange-500 to-red-600',
      benefits: ['Request approval', 'Inventory allocation', 'Request history']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Access comprehensive analytics, reports, and insights across the entire system',
      gradient: 'from-purple-500 to-pink-600',
      benefits: ['System-wide metrics', 'Custom reports', 'Export capabilities']
    },
    {
      icon: Shield,
      title: 'Beneficiary Oversight',
      description: 'View and manage all beneficiary families across all dealers and zones',
      gradient: 'from-blue-500 to-indigo-600',
      benefits: ['Global beneficiary view', 'Distribution tracking', 'Health analytics']
    },
    {
      icon: FileText,
      title: 'Report Generation',
      description: 'Generate detailed reports on distribution, inventory, performance, and compliance',
      gradient: 'from-cyan-500 to-blue-600',
      benefits: ['Multiple report types', 'Scheduled reports', 'Custom filters']
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Manage master data including dealers, zones, products, and system configurations',
      gradient: 'from-green-500 to-emerald-600',
      benefits: ['Master data control', 'Bulk operations', 'Data import/export']
    },
    {
      icon: Settings,
      title: 'System Configuration',
      description: 'Configure system settings, parameters, and operational rules',
      gradient: 'from-violet-500 to-purple-600',
      benefits: ['Global settings', 'Feature toggles', 'Parameter management']
    },
    {
      icon: Activity,
      title: 'Activity Monitoring',
      description: 'Monitor real-time system activity, user actions, and distribution events',
      gradient: 'from-yellow-500 to-orange-600',
      benefits: ['Live activity feed', 'Event tracking', 'Audit trails']
    },
    {
      icon: Lock,
      title: 'Security & Access Control',
      description: 'Manage security settings, permissions, and access control policies',
      gradient: 'from-gray-700 to-gray-900',
      benefits: ['Permission management', 'Security policies', 'Access logs']
    },
    {
      icon: AlertTriangle,
      title: 'Issue Management',
      description: 'Track and resolve system issues, complaints, and quality concerns',
      gradient: 'from-rose-500 to-pink-600',
      benefits: ['Issue tracking', 'Resolution workflow', 'Escalation management']
    },
    {
      icon: Users,
      title: 'Dealer Performance',
      description: 'Monitor dealer performance, set targets, and track achievement metrics',
      gradient: 'from-indigo-500 to-purple-600',
      benefits: ['Performance metrics', 'Target setting', 'Incentive tracking']
    },
    {
      icon: BarChart3,
      title: 'Dashboard Analytics',
      description: 'Customize admin dashboard with key metrics, charts, and performance indicators',
      gradient: 'from-emerald-500 to-teal-600',
      benefits: ['Custom dashboards', 'Real-time metrics', 'Visual analytics']
    }
  ];

  return (
    <DashboardLayout role="admin" title="">
      <div className="max-w-7xl mx-auto space-y-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal Features</h1>
              <p className="text-sm text-gray-600 mt-1">Complete system control and oversight</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Header Card */}
        <Card className="p-6 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 text-white border-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                Admin Portal
              </Badge>
              <h2 className="text-2xl font-bold">System Management & Control</h2>
              <p className="text-red-100 max-w-2xl">
                Comprehensive administrative tools to manage users, oversee operations, analyze performance, and maintain the entire Mukh Swasthya ecosystem.
              </p>
            </div>
            <Shield className="w-16 h-16 text-white/30" />
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 text-sm mb-1">Administrator Access</h4>
              <p className="text-xs text-red-800">
                These features provide full system control. All actions are logged and require proper authorization.
              </p>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="space-y-1.5">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* System Status */}
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-red-50 border-red-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Status & Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">1.2M</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">1,250</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-br from-gray-900 to-red-900 text-white border-0">
          <Shield className="w-12 h-12 mx-auto mb-4 text-white/80" />
          <h3 className="text-xl font-bold mb-2">System Administration Support</h3>
          <p className="text-white/80 mb-4 max-w-2xl mx-auto">
            Need assistance with system configuration or have questions about admin features? Contact our technical support team.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button className="bg-white text-red-600 hover:bg-gray-100">
              Technical Support
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Documentation
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
