import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, PersonStanding, Phone, Mail, Store, Home, Map, MapPin, Save } from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

const mockDealers = {
  "1": {
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john@example.com",
    companyName: "Doe Enterprises",
    address: "123 Main St",
    city: "Chennai",
    state: "Tamil Nadu",

  }
};

export function AdminEditDealer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Simulated fetch
  const initialDealer = mockDealers[id as keyof typeof mockDealers] || mockDealers["1"];

  const [name, setName] = useState(initialDealer.name);
  const [phone, setPhone] = useState(initialDealer.phone);
  const [email, setEmail] = useState(initialDealer.email);
  const [companyName, setCompanyName] = useState(initialDealer.companyName);
  const [address, setAddress] = useState(initialDealer.address);
  const [city, setCity] = useState(initialDealer.city);
  const [state, setState] = useState(initialDealer.state);


  const handleSave = () => {
    // Mock save
    console.log("Saving dealer profile", { name, phone, email, companyName, address, city, state });
    navigate(`/admin/dealers/${id}`);
  };

  const EditSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Card className="p-6 border-none shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] mb-6 rounded-2xl bg-white">
      <h3 className="text-sm font-black text-[#D32F2F] tracking-tight uppercase mb-6">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );

  const ModernInput = ({ 
    label, icon: Icon, value, onChange, type = "text" 
  }: { 
    label: string, icon: any, value: string, onChange: (val: string) => void, type?: string 
  }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
        <Input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-11 h-14 bg-gray-50/50 border-gray-200 focus-visible:ring-1 focus-visible:ring-[#D32F2F] focus-visible:border-[#D32F2F] font-medium text-gray-900 rounded-xl"
        />
      </div>
    </div>
  );

  return (
    <DashboardLayout role="admin" title="Edit Dealer">
      <div className="max-w-3xl mx-auto pb-12">
        {/* Header Scaffold mimicking Compose logic */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#D32F2F] to-[#B71C1C] p-8 lg:p-12 text-white shadow-xl flex flex-col items-center justify-center text-center">
           <Button 
             variant="ghost" 
             size="icon" 
             className="absolute top-6 left-6 text-white hover:bg-white/10 rounded-full"
             onClick={() => navigate(`/admin/dealers/${id}`)}
           >
             <ArrowLeft className="w-6 h-6" />
           </Button>
           
           <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mb-4 border border-white/30 text-white">
             <Store className="w-8 h-8" />
           </div>
           
           <h1 className="text-3xl font-black tracking-tight mb-2">Edit Dealer Profile</h1>
           <p className="text-white/80 font-medium">Updating information for {name}</p>

           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
        </div>

        {/* Form Content - offset to overlap the top section */}
        <div className="relative z-10 -mt-6 px-4 sm:px-8">
          <EditSection title="Personal Details">
            <ModernInput label="Dealer Name" icon={PersonStanding} value={name} onChange={setName} />
            <ModernInput label="Phone Number" icon={Phone} value={phone} onChange={setPhone} type="tel" />
            <ModernInput label="Email Address" icon={Mail} value={email} onChange={setEmail} type="email" />
          </EditSection>

          <EditSection title="Business Details">
             <ModernInput label="Agency/Shop Name" icon={Store} value={companyName} onChange={setCompanyName} />
             <ModernInput label="Address" icon={Home} value={address} onChange={setAddress} />
             <div className="grid grid-cols-2 gap-4">
               <ModernInput label="City" icon={MapPin} value={city} onChange={setCity} />
               <ModernInput label="State" icon={Map} value={state} onChange={setState} />
             </div>

          </EditSection>



          <Button 
            onClick={handleSave}
            className="w-full h-14 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-lg font-bold rounded-2xl shadow-lg mt-8 mb-12 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Dealer Profile
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
