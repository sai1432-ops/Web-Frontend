import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  CheckCircle,
  CloudUpload,
  Image as ImageIcon
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { BeneficiaryForm } from '../../components/forms/BeneficiaryForm';
import type { BeneficiaryData } from '../../components/forms/BeneficiaryForm';
import { HouseholdCompositionForm } from '../../components/forms/HouseholdCompositionForm';
import type { FamilyMemberInput } from '../../components/forms/HouseholdCompositionForm';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export default function NewHouseholdRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [addedMembers, setAddedMembers] = useState<FamilyMemberInput[]>([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 1;

  const [cardFront, setCardFront] = useState<boolean>(false);
  const [cardBack, setCardBack] = useState<boolean>(false);

  const handleAddMember = (member: FamilyMemberInput) => {
    setAddedMembers([...addedMembers, member]);
  };

  const handleRemoveMember = (index: number) => {
    setAddedMembers(addedMembers.filter((_, i) => i !== index));
  };

  const handleRegistration = async (beneficiaryData: BeneficiaryData) => {
    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.registerHousehold({
        beneficiary: { ...beneficiaryData, dealerId },
        members: addedMembers,
        cardFront: cardFront ? "mock_card_front_uri" : null,
        cardBack: cardBack ? "mock_card_back_uri" : null
      });

      if (response.isSuccessful) {
        toast.success("Household successfully registered!");
        navigate("/dealer/beneficiaries/registration-success", { 
          state: { 
            householdId: response.body?.userId ? `#HH-${response.body.userId}` : "#HH-98210",
            count: addedMembers.length + 1
          } 
        });
      } else {
        const errorMsg = response.errorBody?.string();
        toast.error(errorMsg || "Registration failed. Please verify the input data.");
      }
    } catch (e) {
      toast.error("Secure network session interrupted during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const DealerGreen = "#2E7D32";

  return (
    <DashboardLayout role="dealer" title="">
      <div className="flex flex-col min-h-screen bg-[#FDFDFD] -m-6 sm:-m-8 pb-32">
        {/* DealerGreen Vertical Gradient Header - 200px Height per Spec */}
        <div 
          className="w-full h-[240px] flex flex-col p-8 pt-12 relative overflow-hidden"
          style={{ background: `linear-gradient(to bottom, ${DealerGreen}, rgba(46, 125, 50, 0.05))` }}
        >
            <div className="flex items-center gap-4 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all active:scale-95 shadow-lg"
                >
                    <ArrowLeft className="w-5 h-5 font-black" />
                </button>
                <h1 className="text-2xl font-black text-white tracking-tight">Add Beneficiary</h1>
            </div>

            {/* Abstract Decorative Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
            <div className="absolute -bottom-10 left-10 w-40 h-40 bg-green-900/10 rounded-full blur-2xl"></div>
        </div>

        {/* Form Container with Premium Overlap */}
        <div className="px-6 -mt-24 relative z-10">
            <Card className="w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] border-none shadow-[0_30px_70px_rgba(27,94,32,0.12)] p-10 overflow-hidden">
                <div className="space-y-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-[12px] font-black text-[#2E7D32] uppercase tracking-[0.4em] ml-1">REGISTRATION FORM</p>
                        <div className="h-1.5 w-12 bg-[#2E7D32]/20 rounded-full ml-1"></div>
                    </div>

                    <BeneficiaryForm 
                        isLoading={isLoading}
                        submitButtonText="CONFIRM & REGISTER HOUSEHOLD"
                        buttonColor="bg-[#2E7D32] hover:bg-[#1B5E20] shadow-xl shadow-green-900/20"
                        onSubmit={handleRegistration}
                    >
                        {/* Integrated Content Slot from Compose blueprint */}
                        <div className="space-y-12 py-6">
                            {/* PDS Card Images Section */}
                            <div className="space-y-5">
                                <h3 className="text-xl font-black text-[#2E7D32] tracking-tight flex items-center gap-3">
                                    <ImageIcon className="w-6 h-6 text-[#2E7D32]/60" />
                                    Mukh Swasthya Card Images
                                </h3>
                                <div className="grid grid-cols-2 gap-5">
                                    <ImagePickerSection 
                                        label="Front Side" 
                                        isSelected={cardFront} 
                                        onPick={() => setCardFront(!cardFront)} 
                                    />
                                    <ImagePickerSection 
                                        label="Back Side" 
                                        isSelected={cardBack} 
                                        onPick={() => setCardBack(!cardBack)} 
                                    />
                                </div>
                            </div>

                            <div className="h-px w-full bg-gray-100"></div>

                            {/* Household Composition Component integration */}
                            <HouseholdCompositionForm 
                                addedMembers={addedMembers}
                                onAddMember={handleAddMember}
                                onRemoveMember={handleRemoveMember}
                            />
                        </div>
                    </BeneficiaryForm>
                </div>

                {/* Decorative Icon Background */}
                <div className="absolute -right-8 bottom-24 opacity-[0.02] rotate-12 pointer-events-none">
                    <ImageIcon className="w-64 h-64" />
                </div>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ImagePickerSection({ label, isSelected, onPick }: { label: string, isSelected: boolean, onPick: () => void }) {
    return (
        <div className="space-y-3 group">
            <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block ml-1">{label}</Label>
            <button
                type="button"
                onClick={onPick}
                className={`w-full h-16 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden ${
                    isSelected 
                    ? 'bg-green-50 border-green-300 text-green-700 shadow-inner' 
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100 hover:border-gray-200'
                }`}
            >
                {isSelected ? (
                    <div className="flex flex-col items-center gap-1 scale-100 transition-transform duration-500">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                        <CloudUpload className="w-5 h-5 opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
                    </div>
                )}
            </button>
            {isSelected && (
                <div className="flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-left-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Selected</p>
                </div>
            )}
        </div>
    );
}
