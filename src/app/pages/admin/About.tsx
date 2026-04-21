import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Bell, Shield, Target, Database, Lock, Mail, Phone, Globe, Award, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router';

export function About() {
  const systemMetrics = [
    { label: 'System Uptime', value: '99.9%' },
    { label: 'Total Users', value: '51,200+' },
    { label: 'Monthly Transactions', value: '250,000+' },
    { label: 'Data Centers', value: '3' }
  ];

  const adminRoles = [
    {
      icon: Database,
      title: 'System Oversight',
      description: 'Monitor and manage all system operations, data integrity, and performance'
    },
    {
      icon: Shield,
      title: 'Security Management',
      description: 'Ensure platform security, manage access controls, and maintain compliance'
    },
    {
      icon: Activity,
      title: 'Operations Control',
      description: 'Oversee daily operations, resolve issues, and optimize workflows'
    },
    {
      icon: Target,
      title: 'Strategic Planning',
      description: 'Set goals, track performance, and drive program expansion initiatives'
    }
  ];

  return (
    <DashboardLayout role="admin" title="">
      <div className="max-w-4xl mx-auto space-y-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About Admin Portal</h1>
              <p className="text-sm text-gray-600 mt-1">System overview & administration</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 text-sm mb-1">Administrator Access</h4>
              <p className="text-xs text-red-800">
                You are accessing the Mukh Swasthya Admin Portal. All activities are logged and monitored for security purposes.
              </p>
            </div>
          </div>
        </Card>

        {/* Hero Card */}
        <Card className="p-8 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 text-white border-0">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-2">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
              System Administration
            </Badge>
            <h2 className="text-3xl font-bold">Mukh Swasthya Admin Portal</h2>
            <p className="text-red-100 text-lg max-w-2xl mx-auto">
              Central command center for managing the entire Mukh Swasthya ecosystem, ensuring smooth operations and optimal performance
            </p>
          </div>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="p-5 text-center hover:shadow-lg transition-shadow border-red-100">
              <div className="text-2xl font-bold text-red-600 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </Card>
          ))}
        </div>

        {/* Admin Purpose */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Administrator Role & Purpose</h3>
              <p className="text-gray-600 leading-relaxed">
                The Admin Portal provides complete oversight and control of the Mukh Swasthya platform. As an administrator,
                you manage the entire ecosystem including users, dealers, beneficiaries, inventory, distribution operations,
                and system performance. Your role is critical in ensuring program success, maintaining data integrity,
                and delivering value to all stakeholders.
              </p>
            </div>
          </div>
        </Card>

        {/* Key Responsibilities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Responsibilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminRoles.map((role, index) => {
              const Icon = role.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{role.title}</h4>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* System Capabilities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            Platform Capabilities
          </h3>
          <div className="space-y-3">
            {[
              'Complete user and dealer management with role-based access control',
              'Real-time monitoring of distribution operations and inventory levels',
              'Advanced analytics and reporting across all system metrics',
              'Stock request approval workflow and inventory allocation',
              'Beneficiary oversight and health data management',
              'System configuration and parameter management',
              'Security audits, access logs, and compliance tracking',
              'Multi-level data backup and disaster recovery systems',
              'API management and third-party integrations',
              'Performance optimization and system health monitoring'
            ].map((capability, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{capability}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Security & Compliance */}
        <Card className="p-6 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security & Compliance</h3>
              <p className="text-gray-700 mb-3">
                The admin portal implements industry-leading security measures including end-to-end encryption,
                two-factor authentication, role-based access control, and comprehensive audit logging.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-red-600 text-white">ISO 27001 Compliant</Badge>
                <Badge className="bg-red-600 text-white">HIPAA Compliant</Badge>
                <Badge className="bg-red-600 text-white">SOC 2 Certified</Badge>
                <Badge className="bg-red-600 text-white">GDPR Ready</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Best Practices */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Administrator Best Practices
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Always use strong passwords and enable two-factor authentication</li>
            <li>• Review system logs regularly for unusual activity</li>
            <li>• Verify all major actions before approval (stock requests, user changes)</li>
            <li>• Keep backup copies of critical reports and data exports</li>
            <li>• Limit admin access to authorized personnel only</li>
            <li>• Document all major system configuration changes</li>
          </ul>
        </Card>

        {/* Admin Support */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrator Support</h3>
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-red-600" />
              <span>admin-support@mukhswasthya.in</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-red-600" />
              <span>1800-XXX-ADMIN (24/7 Support)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Globe className="w-5 h-5 text-red-600" />
              <span>admin.mukhswasthya.in</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-red-600 hover:bg-red-700">
              Technical Documentation
            </Button>
            <Button variant="outline">
              System Guidelines
            </Button>
          </div>
        </Card>

        {/* Version & Audit */}
        <Card className="p-6 bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">System Information</h3>
                <p className="text-sm text-gray-600">Admin Portal v1.0.0 • Last Updated: March 2026</p>
              </div>
              <Badge variant="outline" className="bg-white border-red-200 text-red-600">
                Administrator
              </Badge>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Last Audit: March 20, 2026</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Security Status: Active
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
