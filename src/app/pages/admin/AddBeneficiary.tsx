import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft, Plus, Trash2, 
  Camera, ShieldCheck,
  Users2, CreditCard, Store
} from 'lucide-react';
import { BeneficiaryForm, type BeneficiaryData } from '../../components/forms/BeneficiaryForm';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { RetrofitClient } from '../../network/RetrofitClient';

import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  age: string;
  relation: string;
}

export function AdminAddBeneficiary() {
  const [beneficiary, setBeneficiary] = useState({
    name: '',
    email: '',
    phone: '',
    pdsCardNumber: '',
    dealerId: ''
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Card Upload State
  const [cardFront, setCardFront] = useState<File | null>(null);
  const [cardBack, setCardBack] = useState<File | null>(null);
  const [previews, setPreviews] = useState({ front: '', back: '' });
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Cleanup previews
  useEffect(() => {
    return () => {
      if (previews.front) URL.revokeObjectURL(previews.front);
      if (previews.back) URL.revokeObjectURL(previews.back);
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (side === 'front') {
        if (previews.front) URL.revokeObjectURL(previews.front);
        setCardFront(file);
        setPreviews(prev => ({ ...prev, front: preview }));
      } else {
        if (previews.back) URL.revokeObjectURL(previews.back);
        setCardBack(file);
        setPreviews(prev => ({ ...prev, back: preview }));
      }
    }
  };

  const removeFile = (side: 'front' | 'back') => {
    if (side === 'front') {
      if (previews.front) URL.revokeObjectURL(previews.front);
      setCardFront(null);
      setPreviews(prev => ({ ...prev, front: '' }));
    } else {
      if (previews.back) URL.revokeObjectURL(previews.back);
      setCardBack(null);
      setPreviews(prev => ({ ...prev, back: '' }));
    }
  };

  const [dealers, setDealers] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchDealers = async () => {
        try {
            const data = await RetrofitClient.apiService.getDealers();
            // Map DealerInfo to the simplified format used in the dropdown
            setDealers(data.map(d => ({
                id: String(d.id),
                name: `${d.name} - ${d.location || 'No Location'}`
            })));
        } catch (e) {
            console.error("Failed to fetch dealers:", e);
        }
    };
    fetchDealers();
  }, []);

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { id: Date.now().toString(), name: '', age: '', relation: '' }
    ]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(familyMembers.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const primaryRed = "#D32F2F";
  const softRed = "#E53935";

  return (
    <DashboardLayout role="admin" title="">
      <div className="min-h-screen bg-[#F8F9FA] pb-24 lg:pb-12">
        {/* Premium Red Gradient Header */}
        <div 
          className="relative w-full h-[320px] flex flex-col items-center justify-start p-8 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-700"
          style={{ background: `linear-gradient(180deg, ${primaryRed}, ${softRed})` }}
        >
          {/* Header Content */}
          <div className="relative z-10 w-full max-w-5xl pt-4">
            <div className="flex items-center gap-4 text-white">
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-black tracking-tight uppercase">Enroll New Beneficiary</h1>
            </div>
            
            <div className="mt-12 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <p className="text-red-50 font-medium opacity-90 max-w-md">
                Enrolling a new household for kit distribution and oral health monitoring.
              </p>
            </div>
          </div>
          
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        </div>

        {/* Main Application Card */}
        <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
          <Card className="border-0 shadow-2xl shadow-red-900/10 rounded-[2.5rem] p-8 lg:p-12 bg-white overflow-hidden space-y-12">
            <div className="space-y-12">
              
              {/* Section 1: Dealer Assignment */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <Store className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Dealer Assignment</h3>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Select Local Dealer</Label>
                  <Select onValueChange={(val) => setBeneficiary({...beneficiary, dealerId: val})}>
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 p-6 focus:ring-red-500/20 focus:border-red-500 font-bold text-gray-900 transition-all">
                      <SelectValue placeholder="Assign a dealer to this beneficiary" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                      {dealers.map(d => (
                        <SelectItem key={d.id} value={d.id} className="font-bold py-3 focus:bg-red-50 transition-colors">
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Beneficiary Form Integration */}
              <BeneficiaryForm 
                isLoading={isLoading}
                submitButtonText="Enroll Beneficiary"
                buttonColor="bg-[#D32F2F] hover:bg-red-700"
                onSubmit={async (data: BeneficiaryData) => {
                  if (!beneficiary.dealerId) {
                    toast.error("Please select a dealer first");
                    return;
                  }
                  setIsLoading(true);
                  try {
                    const response = await RetrofitClient.apiService.registerBeneficiary(
                      { ...data, dealerId: beneficiary.dealerId },
                      JSON.stringify(familyMembers),
                      cardFront,
                      cardBack
                    );

                    if (response.isSuccessful) {
                      toast.success("Beneficiary enrolled successfully!");
                      navigate('/admin/users?tab=beneficiaries');
                    } else {
                      toast.error(response.errorBody?.string() || "Failed to enroll beneficiary");
                    }
                  } catch (e) {
                    console.error("Enrollment Error:", e);
                    toast.error("An unexpected error occurred during enrollment");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <div className="space-y-12 mt-12">
                  {/* Section 3: PDS Verification Documents */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Mukh Swasthya Card Verification</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <input 
                        type="file" 
                        ref={frontInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'front')}
                      />
                      <input 
                        type="file" 
                        ref={backInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'back')}
                      />

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Front Side Image</p>
                        <div 
                          onClick={() => frontInputRef.current?.click()}
                          className="relative h-40 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100/50 hover:border-red-200 transition-all cursor-pointer group overflow-hidden"
                        >
                          {previews.front ? (
                            <>
                              <img src={previews.front} className="w-full h-full object-cover" alt="Front Preview" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  className="h-8 rounded-lg font-black text-[10px] uppercase"
                                  onClick={(e) => { e.stopPropagation(); frontInputRef.current?.click(); }}
                                >
                                  Change
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="h-8 rounded-lg font-black text-[10px] uppercase"
                                  onClick={(e) => { e.stopPropagation(); removeFile('front'); }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                                <Camera className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                              </div>
                              <span className="text-xs font-black text-gray-400 group-hover:text-red-400 uppercase tracking-widest">Upload Front</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Back Side Image</p>
                        <div 
                          onClick={() => backInputRef.current?.click()}
                          className="relative h-40 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100/50 hover:border-red-200 transition-all cursor-pointer group overflow-hidden"
                        >
                          {previews.back ? (
                            <>
                              <img src={previews.back} className="w-full h-full object-cover" alt="Back Preview" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  className="h-8 rounded-lg font-black text-[10px] uppercase"
                                  onClick={(e) => { e.stopPropagation(); backInputRef.current?.click(); }}
                                >
                                  Change
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="h-8 rounded-lg font-black text-[10px] uppercase"
                                  onClick={(e) => { e.stopPropagation(); removeFile('back'); }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                                <Camera className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                              </div>
                              <span className="text-xs font-black text-gray-400 group-hover:text-red-400 uppercase tracking-widest">Upload Back</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Household Composition */}
                  <div className="space-y-6 pb-8">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                          <Users2 className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Household Composition</h3>
                      </div>
                      <Button 
                        type="button"
                        onClick={addFamilyMember}
                        className="bg-red-50 text-red-600 hover:bg-red-100 font-black rounded-xl gap-2 h-10 px-4"
                      >
                        <Plus className="w-4 h-4" />
                        Add Member
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {familyMembers.length === 0 ? (
                        <div className="py-10 text-center bg-gray-50/50 rounded-3xl border-2 border-dotted border-gray-100">
                          <Users2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                          <p className="text-sm font-bold text-gray-400">No family members added yet</p>
                          <p className="text-xs text-gray-400 mt-1">Add household members to include them in kit distribution</p>
                        </div>
                      ) : (
                        familyMembers.map((member) => (
                          <div key={member.id} className="grid md:grid-cols-[1fr,80px,1fr,50px] gap-4 items-end p-6 bg-gray-50/30 rounded-2xl border border-gray-50 group">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Member Name</Label>
                              <Input 
                                value={member.name}
                                onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                                className="h-12 rounded-xl border-gray-100 bg-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</Label>
                              <Input 
                                type="number"
                                value={member.age}
                                onChange={(e) => updateFamilyMember(member.id, 'age', e.target.value)}
                                className="h-12 rounded-xl border-gray-100 bg-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Relation</Label>
                              <Input 
                                value={member.relation}
                                onChange={(e) => updateFamilyMember(member.id, 'relation', e.target.value)}
                                className="h-12 rounded-xl border-gray-100 bg-white"
                              />
                            </div>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeFamilyMember(member.id)}
                              className="h-12 w-12 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </BeneficiaryForm>
            </div>
            
            {/* Background Branding Elements */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-50 rounded-full opacity-30 -z-10"></div>
            <div className="absolute top-40 -right-20 w-60 h-60 bg-red-50 rounded-full opacity-20 -z-10"></div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
