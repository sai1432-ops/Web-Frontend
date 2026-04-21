import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Shield, 
  Store, 
  Users, 
  Package, 
  Activity, 
  Heart,
  Sparkles,
  BarChart3,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Smile,
  Globe,
  Award,
  TrendingUp
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function Welcome() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Smile className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mukh Swasthya
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  Home
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  Features
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  About
                </Button>
              </Link>
              <Link to="/role-selection">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 -z-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg border border-blue-100">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Digital Healthcare Distribution Platform</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Transform Dental
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Healthcare Delivery
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Empowering communities with intelligent dental care distribution, 
                  real-time tracking, and AI-powered health insights.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/role-selection">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 px-8 text-base shadow-xl shadow-blue-500/30 hover:shadow-2xl transition-all">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50">
                    Learn More
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="space-y-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    10K+
                  </div>
                  <div className="text-sm text-gray-600">Beneficiaries</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    500+
                  </div>
                  <div className="text-sm text-gray-600">Dealers</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    98%
                  </div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Content - Role Cards */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <RoleCard
                  icon={<Users className="w-8 h-8 text-white" />}
                  title="For Families"
                  description="Track dental kits, monitor health, and access AI-powered teeth analysis"
                  gradient="from-blue-500 to-indigo-600"
                  features={['Health Tracking', 'AI Analysis', 'Kit Management']}
                />
                <RoleCard
                  icon={<Store className="w-8 h-8 text-white" />}
                  title="For Dealers"
                  description="Manage inventory, distribute kits, and track stock requests"
                  gradient="from-emerald-500 to-teal-600"
                  features={['Stock Control', 'Distribution', 'Reports']}
                />
                <RoleCard
                  icon={<Shield className="w-8 h-8 text-white" />}
                  title="For Admins"
                  description="Oversee operations, manage users, and analyze system metrics"
                  gradient="from-red-500 to-rose-600"
                  features={['User Management', 'Analytics', 'System Control']}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
              Platform Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dental Care Distribution
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to streamline healthcare delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="w-6 h-6" />}
              title="AI Teeth Analysis"
              description="Advanced AI-powered dental health assessment and personalized recommendations"
              iconBg="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={<Package className="w-6 h-6" />}
              title="Smart Distribution"
              description="Efficient dental kit distribution with QR code verification and tracking"
              iconBg="from-blue-500 to-indigo-600"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-time Analytics"
              description="Comprehensive reports and insights for data-driven decision making"
              iconBg="from-emerald-500 to-teal-600"
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="Health Monitoring"
              description="Track brushing habits, health records, and family dental wellness"
              iconBg="from-red-500 to-rose-600"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Multi-language Support"
              description="Available in multiple languages for wider accessibility"
              iconBg="from-amber-500 to-orange-600"
            />
            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="Quality Assurance"
              description="Verified products and certified distribution processes"
              iconBg="from-cyan-500 to-blue-600"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                About Mukh Swasthya
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900">
                Revolutionizing Healthcare{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Distribution
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Mukh Swasthya is a comprehensive digital platform designed to 
                transform dental healthcare delivery in communities. We connect families, dealers, 
                and administrators in a seamless ecosystem that ensures efficient distribution of 
                dental care products and services.
              </p>
              <div className="space-y-4">
                <BenefitItem text="Streamlined stock management and distribution" />
                <BenefitItem text="AI-powered health insights and recommendations" />
                <BenefitItem text="Real-time tracking and transparent processes" />
                <BenefitItem text="Comprehensive family health management" />
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={<Users className="w-8 h-8" />}
                  value="10,000+"
                  label="Active Users"
                  gradient="from-blue-500 to-indigo-600"
                />
                <StatCard
                  icon={<Package className="w-8 h-8" />}
                  value="50,000+"
                  label="Kits Distributed"
                  gradient="from-emerald-500 to-teal-600"
                />
                <StatCard
                  icon={<Store className="w-8 h-8" />}
                  value="500+"
                  label="Verified Dealers"
                  gradient="from-purple-500 to-pink-600"
                />
                <StatCard
                  icon={<TrendingUp className="w-8 h-8" />}
                  value="98%"
                  label="Satisfaction Rate"
                  gradient="from-amber-500 to-orange-600"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families and healthcare providers transforming dental care delivery
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/role-selection">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8 text-base shadow-2xl">
                Start as User
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/role-selection">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-14 px-8 text-base">
                Register as Dealer
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Mukh Swasthya</h3>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Transforming dental healthcare distribution for communities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">For Families</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Dealers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Admins</a></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/impact" className="hover:text-white transition-colors">Impact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Mukh Swasthya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  features: string[];
}

function RoleCard({ icon, title, description, gradient, features }: RoleCardProps) {
  return (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200">
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}

function FeatureCard({ icon, title, description, iconBg }: FeatureCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="p-6 space-y-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  gradient: string;
}

function StatCard({ icon, value, label, gradient }: StatCardProps) {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
      <div className="p-6 space-y-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </Card>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-4 h-4 text-white" />
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}