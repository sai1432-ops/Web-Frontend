import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Map, 
  Hash,
  UserCircle,
  Phone as Call,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export function DealerEditProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 1;

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    companyName: currentUser.companyName || '',
    address: currentUser.address || '',
    city: currentUser.city || '',
    state: currentUser.state || '',
    pincode: currentUser.pincode || '',
    contactPerson: currentUser.contactPerson || '',
    contactPhone: currentUser.contactPhone || ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await RetrofitClient.apiService.getDealerProfile('', dealerId);
        if (res.isSuccessful && res.body) {
          const p = res.body as any;
          setFormData({
            name: p.name || '',
            email: p.email || '',
            phone: p.phone || '',
            companyName: p.companyName || p.company_name || '',
            address: p.address || '',
            city: p.city || '',
            state: p.state || '',
            pincode: p.pincode || '',
            contactPerson: p.contactPerson || p.contact_person || '',
            contactPhone: p.contactPhone || p.contact_phone || ''
          });
          localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.body }));
        }
      } catch (e) {
        console.error("Failed to fetch profile for edit", e);
      }
    };
    if (dealerId) fetchProfile();
  }, [dealerId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.updateDealerProfile(dealerId, {
        dealer_id: dealerId,
        name: formData.name,
        phone: formData.phone,
        company_name: formData.companyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        contact_person: formData.contactPerson,
        contact_phone: formData.contactPhone
      });

      if (!response.isSuccessful) {
         throw new Error("Failed to update profile. Server returned an error.");
      }

      toast.success("Profile updated successfully!");
      // Update local storage with new info
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...formData }));
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const DealerGreen = "#047857";

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col pb-20">
      {/* Dynamic Header Background */}
      <div 
        className="absolute top-0 left-0 right-0 h-[240px] z-0"
        style={{ background: `linear-gradient(to bottom, ${DealerGreen}, #065f46)` }}
      ></div>

      {/* Navigation Header */}
      <header className="relative z-10 flex items-center px-6 py-8 text-white">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-white/10 text-white mr-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-black tracking-tight uppercase">Edit Profile</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 max-w-lg mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <form onSubmit={handleSave} className="space-y-6">
            {/* Personal Info Section */}
            <Section title="Personal Information">
              <EditField 
                label="Full Name"
                value={formData.name}
                onChange={(v: string) => setFormData({...formData, name: v})}
                icon={<User />}
                accent={DealerGreen}
              />
              <EditField 
                label="Email Address"
                value={formData.email}
                onChange={() => {}}
                icon={<Mail />}
                accent={DealerGreen}
                disabled
              />
              <EditField 
                label="Phone Number"
                value={formData.phone}
                onChange={(v: string) => setFormData({...formData, phone: v})}
                icon={<Phone />}
                accent={DealerGreen}
              />
            </Section>

            {/* Business Details Section */}
            <Section title="Business Details">
              <EditField 
                label="Company Name"
                value={formData.companyName}
                onChange={(v: string) => setFormData({...formData, companyName: v})}
                icon={<Building />}
                accent={DealerGreen}
              />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Complete Address</label>
                <div className="relative">
                  <Textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter business address"
                    className="min-h-[100px] pl-12 bg-white border-gray-100 rounded-2xl focus-visible:ring-2 text-gray-900 font-bold placeholder:text-gray-300"
                    style={{ '--tw-ring-color': `${DealerGreen}20` } as any}
                  />
                  <div className="absolute left-4 top-4" style={{ color: DealerGreen }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <EditField 
                  label="City"
                  value={formData.city}
                  onChange={(v: string) => setFormData({...formData, city: v})}
                  icon={<Building />}
                  accent={DealerGreen}
                />
                <EditField 
                  label="State"
                  value={formData.state}
                  onChange={(v: string) => setFormData({...formData, state: v})}
                  icon={<Map />}
                  accent={DealerGreen}
                />
              </div>
              <EditField 
                label="Pincode"
                value={formData.pincode}
                onChange={(v: string) => setFormData({...formData, pincode: v})}
                icon={<Hash />}
                accent={DealerGreen}
              />
            </Section>

            {/* Contact Person Section */}
            <Section title="Contact Person">
              <EditField 
                label="Contact Name"
                value={formData.contactPerson}
                onChange={(v: string) => setFormData({...formData, contactPerson: v})}
                icon={<UserCircle />}
                accent={DealerGreen}
              />
              <EditField 
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={(v: string) => setFormData({...formData, contactPhone: v})}
                icon={<Call />}
                accent={DealerGreen}
              />
            </Section>

            <div className="pt-4">
              <Button 
                disabled={isLoading}
                style={{ backgroundColor: DealerGreen }}
                className="w-full h-16 rounded-2xl hover:brightness-110 text-white font-black tracking-widest uppercase text-sm shadow-xl shadow-green-900/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Save Changes
                    <CheckCircle2 className="w-5 h-5 opacity-50" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-black/5 bg-white space-y-5">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );
}

function EditField({ label, value, onChange, icon, accent, disabled }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <Input 
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="h-14 pl-12 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 text-gray-900 font-bold placeholder:text-gray-300 transition-all disabled:opacity-50"
          style={{ '--tw-ring-color': `${accent}20` } as any}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: accent }}>
          {icon && (typeof icon === 'object' && 'type' in icon ? icon : <div className="w-5 h-5" />)}
        </div>
      </div>
    </div>
  );
}
