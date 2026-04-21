import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Bell, Phone, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';

export function Support() {
  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/user/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
            <p className="text-sm text-gray-600">+91 1800-XXX-XXXX</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
            <p className="text-sm text-gray-600">support@stitchdental.com</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
            <p className="text-sm text-gray-600">Available 24/7</p>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <div className="pb-4 border-b">
              <h3 className="font-semibold text-gray-900 mb-2">How do I track my family's brushing habits?</h3>
              <p className="text-gray-600 text-sm">
                Use the Check-in Update button on your dashboard to log daily brushing sessions for morning and evening.
              </p>
            </div>
            <div className="pb-4 border-b">
              <h3 className="font-semibold text-gray-900 mb-2">How can I receive my monthly dental kit?</h3>
              <p className="text-gray-600 text-sm">
                Visit the Kit Hub section to confirm your kit receipt from authorized dealers and log monthly usage.
              </p>
            </div>
            <div className="pb-4 border-b">
              <h3 className="font-semibold text-gray-900 mb-2">What is the AI Health Analysis feature?</h3>
              <p className="text-gray-600 text-sm">
                The AI scan analyzes your teeth and provides personalized recommendations for better oral health.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I find nearby dental clinics?</h3>
              <p className="text-gray-600 text-sm">
                Go to the Consult section and use the "Find Nearby Clinics" feature to locate dental care providers near you.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="What do you need help with?" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                className="w-full min-h-[120px] px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue or question..."
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Submit Request
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
