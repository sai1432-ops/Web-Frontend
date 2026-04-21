import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Bell, Store, Target, Users, Shield, Mail, Phone, Globe, Award, CheckCircle, Package } from 'lucide-react';
import { Link } from 'react-router';

export function About() {
  const achievements = [
    { label: 'Active Dealers', value: '1,200+' },
    { label: 'Monthly Distribution', value: '50,000+' },
    { label: 'Coverage Areas', value: '250+' },
    { label: 'Families Served', value: '150,000+' }
  ];

  const responsibilities = [
    {
      icon: Package,
      title: 'Stock Management',
      description: 'Maintain optimal inventory levels and ensure timely kit availability'
    },
    {
      icon: Users,
      title: 'Family Distribution',
      description: 'Distribute dental kits to assigned beneficiary families in your zone'
    },
    {
      icon: Target,
      title: 'Quality Assurance',
      description: 'Verify kit quality and ensure proper distribution protocols'
    },
    {
      icon: Shield,
      title: 'Data Accuracy',
      description: 'Maintain accurate records of all distributions and stock movements'
    }
  ];

  return (
    <DashboardLayout role="dealer" title="">
      <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/dealer/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About Dealer Portal</h1>
              <p className="text-sm text-gray-600 mt-1">Your role in Mukh Swasthya</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Hero Card */}
        <Card className="p-8 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white border-0">
          <div className="text-center space-y-3">
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
              Distribution Partner
            </Badge>
            <h2 className="text-3xl font-bold">Mukh Swasthya Dealer Portal</h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              As an authorized dealer, you play a crucial role in making dental care accessible to families across your coverage area
            </p>
          </div>
        </Card>

        {/* Impact Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="p-5 text-center hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-emerald-600 mb-1">{achievement.value}</div>
              <div className="text-sm text-gray-600">{achievement.label}</div>
            </Card>
          ))}
        </div>

        {/* Dealer Role */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Store className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Role as a Dealer</h3>
              <p className="text-gray-600 leading-relaxed">
                Dealers are authorized distribution partners who manage the last-mile delivery of dental kits to beneficiary
                families. You are the vital link between the Mukh Swasthya program and the families you serve, ensuring
                timely distribution, maintaining quality standards, and fostering trust in the community.
              </p>
            </div>
          </div>
        </Card>

        {/* Key Responsibilities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {responsibilities.map((responsibility, index) => {
              const Icon = responsibility.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{responsibility.title}</h4>
                    <p className="text-sm text-gray-600">{responsibility.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Distribution Guidelines */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            Distribution Guidelines
          </h3>
          <div className="space-y-3">
            {[
              'Verify beneficiary identity before kit distribution',
              'Scan QR codes to log all distributions in the system',
              'Ensure kits are in good condition before distribution',
              'Maintain accurate stock records and request replenishment timely',
              'Report any quality issues or discrepancies immediately',
              'Follow scheduled distribution timelines for monthly kits',
              'Maintain confidentiality of beneficiary information',
              'Provide assistance to families with app-related queries'
            ].map((guideline, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{guideline}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Support & Training */}
        <Card className="p-6 bg-emerald-50 border-emerald-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Support & Training</h3>
          <p className="text-gray-700 mb-4">
            We provide comprehensive training and ongoing support to all dealers. Access training materials,
            guidelines, and reach out to our support team whenever you need assistance.
          </p>
          <div className="flex gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Training Resources
            </Button>
            <Button variant="outline">
              Contact Support
            </Button>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dealer Support Contacts</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-emerald-600" />
              <span>dealer-support@mukhswasthya.in</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>1800-XXX-DEAL (Dealer Helpline)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>www.mukhswasthya.in/dealers</span>
            </div>
          </div>
        </Card>

        {/* Version Info */}
        <Card className="p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Portal Information</h3>
              <p className="text-sm text-gray-600">Dealer Portal v1.0.0 • Last Updated: March 2026</p>
            </div>
            <Badge variant="outline" className="bg-white">
              Active Dealer
            </Badge>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
