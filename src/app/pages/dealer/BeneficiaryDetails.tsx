import { useParams, useNavigate } from 'react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  ArrowLeft, Phone, MapPin, 
  User, Mail, CheckCircle2, Clock, 
  Edit, Trash2, Shield, Info, Briefcase, 
  GraduationCap, Globe, Camera, Plus,
  Users, ChevronRight, AlertCircle, Store,
  Package2, History
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { cn } from '../../components/ui/utils';
import { toast } from 'sonner';
import { RetrofitClient } from '../../network/RetrofitClient';

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relation: string;
}

interface KitHistoryItem {
  id: string;
  name: string;
  type: string;
  quantity: string;
  date: string;
  status: 'GIVEN' | 'PENDING' | 'RETURNED';
  givenBy?: string;
  returnDate?: string;
  returnReason?: string;
  notes?: string;
}

interface BeneficiaryData {
  id: string;
  name: string;
  username: string;
  pdsCardNo: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  education: string;
  employment: string;
  createdAt: string;
  status: 'GIVEN' | 'PENDING' | 'RETURNED';
  createdByName: string;
  createdByRole: 'Admin' | 'Dealer';
  pdsCardFront?: string;
  pdsCardBack?: string;
  dealerNote?: string;
  familyMembers: FamilyMember[];
  history: KitHistoryItem[];
}

export function DealerBeneficiaryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [beneficiary, setBeneficiary] = useState<BeneficiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  const DealerGreen = "#1B5E20";

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const fetchDetails = async () => {
    try {
      setError("");
      setIsLoading(true);

      if (!id) {
        throw new Error("Invalid beneficiary ID");
      }

      console.log("Beneficiary ID from URL:", id);

      const data = await RetrofitClient.apiService.getDealerBeneficiary(id);
      setBeneficiary(data);
    } catch (error: any) {
      console.error("Failed to load beneficiary details:", error);
      setError(error?.response?.data?.error || error?.message || "Record Not Found");
      setBeneficiary(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    toast.success(`Beneficiary ${beneficiary?.name} has been deleted from the database`);
    setShowDeleteDialog(false);
    navigate('/dealer/beneficiaries');
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout role="dealer" title="">
        <div className="flex items-center justify-center p-6 h-[60vh]">
          <div className="text-center">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-600 rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !beneficiary) {
    return (
      <DashboardLayout role="dealer" title="">
        <div className="flex items-center justify-center p-6 h-[60vh]">
          <Card className="max-w-md w-full p-12 text-center border-0 shadow-2xl rounded-[2.5rem] bg-white">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Record Not Found</h3>
            <p className="text-gray-500 mb-8 font-medium italic">
              {error || "This identity record might have been archived or transferred."}
            </p>
            <Button 
              onClick={() => navigate('/dealer/beneficiaries')} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-14 px-10 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all uppercase tracking-widest text-xs w-full"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Return to Catalog
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const firstLetter = beneficiary.name?.charAt(0).toUpperCase() || "B";

  const getStatusInfo = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'GIVEN':
        return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" />, label: 'DISTRIBUTED' };
      case 'PENDING':
        return { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-4 h-4" />, label: 'PENDING' };
      case 'RETURNED':
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertCircle className="w-4 h-4" />, label: 'RETURNED' };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Info className="w-4 h-4" />, label: status || 'UNKNOWN' };
    }
  };

  const statusInfo = beneficiary ? getStatusInfo(beneficiary.status) : null;

  return (
    <DashboardLayout role="dealer" title="">
      <div className="min-h-screen bg-[#F8F9FA] -mt-10 -mx-6 lg:m-0 h-full">
        {/* Premium Header Backdrop */}
        <div 
          className="relative w-full h-[280px] lg:h-[320px] flex flex-col items-center justify-start p-8 overflow-hidden rounded-b-[4rem]"
          style={{ background: `linear-gradient(180deg, ${DealerGreen}, #2E7D32)` }}
        >
          <div className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-4">
            <div className="flex items-center gap-6">
                <Button 
                    onClick={() => navigate('/dealer/beneficiaries')}
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/10 rounded-2xl h-12 w-12 backdrop-blur-sm ring-1 ring-white/20"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Beneficiary Record</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <p className="text-emerald-50/70 text-[10px] font-black uppercase tracking-[0.2em]">Live Dealer Authorization</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button 
                    onClick={() => setShowEditDialog(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 shadow-xl backdrop-blur-md"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
                <Button 
                    onClick={() => setShowDeleteDialog(true)}
                    className="bg-rose-500/20 hover:bg-rose-500 text-rose-100 border border-rose-500/30 rounded-2xl font-black text-xs uppercase tracking-widest px-6 h-12 shadow-xl backdrop-blur-md transition-all"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 p-12 opacity-10">
            <Store className="w-64 h-64 text-white" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 -mt-32 lg:-mt-40 relative z-20 pb-20 space-y-8 h-full">
            {/* Main Action Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Information Core */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-0 shadow-2xl shadow-green-900/10 rounded-[3rem] overflow-hidden bg-white">
                        <div className="px-10 py-12">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12 text-center md:text-left">
                                    <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white text-6xl font-black shadow-2xl border-8 border-white ring-1 ring-gray-100 group transition-all hover:scale-105 duration-500 relative">
                                        {firstLetter}
                                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-50">
                                            <Badge className={`${statusInfo?.color} p-2 rounded-xl flex items-center justify-center border-0`}>
                                                {statusInfo?.icon}
                                            </Badge>
                                        </div>
                                    </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{beneficiary.name}</h2>
                                        <Badge className={`${statusInfo?.color} px-4 py-1.5 rounded-full font-black border-2 hidden md:flex`}>
                                            {statusInfo?.label}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 font-bold text-gray-400 uppercase tracking-widest text-[11px]">
                                        <span className="text-[#1B5E20]">Identity No: {beneficiary.pdsCardNo}</span>
                                        <span className="opacity-30">•</span>
                                        <span>Handle: {beneficiary.username}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <DetailItem icon={<Phone className="text-green-600" />} label="Contact" value={beneficiary.phone} color="green" />
                                <DetailItem icon={<Mail className="text-blue-600" />} label="Email Node" value={beneficiary.email} color="blue" />
                                <DetailItem icon={<User className="text-amber-600" />} label="Demographics" value={`${beneficiary.age} Yrs • ${beneficiary.gender}`} color="amber" />
                                <DetailItem icon={<GraduationCap className="text-purple-600" />} label="Academic" value={beneficiary.education} color="purple" />
                                <DetailItem icon={<Briefcase className="text-indigo-600" />} label="Engagement" value={beneficiary.employment} color="indigo" />
                                <DetailItem icon={<Globe className="text-rose-600" />} label="Regional Node" value={beneficiary.location} color="rose" />
                                <div className="sm:col-span-2">
                                    <DetailItem icon={<MapPin className="text-orange-600" />} label="Permanent Residence" value={beneficiary.address} color="orange" />
                                </div>
                            </div>

                            <div className="mt-10 p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md ring-1 ring-gray-100">
                                        {beneficiary.createdByRole === 'Dealer' ? <Store className="w-7 h-7 text-green-600" /> : <Shield className="w-7 h-7 text-rose-600" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Registration Authority</p>
                                        <p className="text-sm font-black text-gray-900">{beneficiary.createdByName} <span className="text-gray-400">({beneficiary.createdByRole})</span></p>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">System Enrollment</p>
                                    <p className="text-sm font-black text-gray-900 leading-none">{beneficiary.createdAt}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* ID Card Assets */}
                    {(beneficiary.pdsCardFront || beneficiary.pdsCardBack) && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 ml-4">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shadow-inner">
                                    <Camera className="w-5 h-5 text-[#1B5E20]" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Identity Documents</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="p-6 border-0 shadow-xl rounded-[2.5rem] bg-white group overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Identity Front</p>
                                    <div className="aspect-[1.58/1] bg-gray-50 rounded-[1.5rem] flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-green-500/30 transition-all cursor-zoom-in">
                                        <img src={beneficiary.pdsCardFront} alt="ID Front" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                    </div>
                                </Card>
                                <Card className="p-6 border-0 shadow-xl rounded-[2.5rem] bg-white group overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Identity Rear</p>
                                    <div className="aspect-[1.58/1] bg-gray-50 rounded-[1.5rem] flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-green-500/30 transition-all cursor-zoom-in">
                                        <img src={beneficiary.pdsCardBack} alt="ID Back" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side Controls */}
                <div className="space-y-8">


                    {/* Network Links */}
                    <Card className="border-0 shadow-2xl shadow-green-900/5 rounded-[3rem] p-10 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Household</h3>
                            </div>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl text-blue-600 hover:bg-blue-50 ring-1 ring-blue-100 transition-all">
                                <Plus className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {beneficiary.familyMembers.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-50 rounded-[2rem]">
                                    <p className="text-gray-300 font-black uppercase tracking-widest text-[10px]">No Members Linked</p>
                                </div>
                            ) : (
                                beneficiary.familyMembers.map((member: FamilyMember) => (
                                    <div key={member.id} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-gray-50/80 group hover:bg-white hover:shadow-xl transition-all cursor-pointer ring-1 ring-transparent hover:ring-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1B5E20] font-black text-base transition-transform group-hover:scale-110">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-tight mb-0.5">{member.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{member.age} Yrs • {member.relation}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#1B5E20] transition-colors" />
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* History Timeline */}
            <div className="space-y-8 h-full">
                <div className="flex items-center justify-between ml-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-xl">
                            <History className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Supply Chain History</h3>
                    </div>
                    <Badge className="bg-white text-[#1B5E20] border-gray-100 px-6 py-2 rounded-2xl font-black text-xs shadow-sm uppercase tracking-widest">
                        {beneficiary.history.length || 0} Transactions
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {beneficiary.history.length === 0 ? (
                        <Card className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 rounded-[3rem] bg-white/50 space-y-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto opacity-50">
                                <Package2 className="w-12 h-12 text-gray-300" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Network Silent</h4>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No transaction telemetry detected for this ID</p>
                            </div>
                        </Card>
                    ) : (
                        beneficiary.history.map((record: KitHistoryItem) => {
                            const rStatus = getStatusInfo(record.status);
                            return (
                                <Card key={record.id} className="border-0 shadow-2xl shadow-gray-200/50 rounded-[3rem] overflow-hidden bg-white hover:translate-y-[-4px] transition-all duration-500 group">
                                    <div className="p-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-gray-50 rounded-[1.25rem] flex items-center justify-center group-hover:bg-green-50 transition-colors">
                                                    <Package2 className="w-7 h-7 text-[#1B5E20]" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">{record.name}</h4>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">{record.type} Supply Unit</p>
                                                </div>
                                            </div>
                                            <Badge className={cn("px-4 py-2 rounded-xl font-black text-[10px] border-2", rStatus.color)}>
                                                {rStatus.label}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            <div className="p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Volume</p>
                                                <p className="text-base font-black text-gray-900">{record.quantity}</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Timestamp</p>
                                                <p className="text-base font-black text-gray-900">{record.date}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-8 border-t border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <Store className="w-4 h-4 text-green-600" />
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Verified by <span className="text-gray-900 font-black">{record.givenBy}</span></p>
                                            </div>
                                            {record.notes && (
                                                <div className="p-4 bg-gray-50/50 rounded-2xl flex items-start gap-3">
                                                    <Info className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] font-medium text-gray-400 leading-relaxed italic">"{record.notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>

        {/* Profile Edit Overlay */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-3xl rounded-[3rem] p-10 border-none overflow-hidden bg-white shadow-2xl">
                <DialogHeader className="mb-8">
                    <DialogTitle className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Edit Digital Identity</DialogTitle>
                    <p className="text-sm font-bold text-gray-400 tracking-tight uppercase tracking-widest">Update information for {beneficiary.name}</p>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-8 py-2 max-h-[55vh] overflow-y-auto px-1 pr-6 custom-scrollbar group">
                    <div className="space-y-6">
                        <InputGroup label="Identity Name" value={beneficiary.name} />
                        <InputGroup label="Phone Sequence" value={beneficiary.phone} />
                        <InputGroup label="Electronic Mail" value={beneficiary.email} />
                        <InputGroup label="Unique ID Card Number" value={beneficiary.pdsCardNo} />
                    </div>
                    <div className="space-y-6">
                        <InputGroup label="Enrollment Age" value={beneficiary.age.toString()} />
                        <InputGroup label="Gender Logic" value={beneficiary.gender} />
                        <InputGroup label="Education History" value={beneficiary.education} />
                        <InputGroup label="Active Employment" value={beneficiary.employment} />
                    </div>
                    <div className="col-span-full space-y-3">
                        <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Residence Mapping</Label>
                        <Textarea defaultValue={beneficiary.address} className="rounded-3xl min-h-[100px] border-gray-100 bg-gray-50 focus:bg-white transition-all p-5 text-sm font-bold shadow-inner" />
                    </div>
                </div>
                <DialogFooter className="gap-4 mt-10">
                    <Button variant="outline" onClick={() => setShowEditDialog(false)} className="rounded-[1.5rem] font-black h-16 flex-1 border-gray-100 text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Cancel Operation</Button>
                    <Button className="bg-[#1B5E20] hover:bg-[#123E15] rounded-[1.5rem] font-black h-16 flex-[2] text-xs uppercase tracking-[0.2em] shadow-2xl shadow-green-900/20 active:scale-95 transition-all">Synchronize Database</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Overlay */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="max-w-md rounded-[3rem] p-10 border-none overflow-hidden bg-white shadow-2xl">
                <DialogHeader className="mb-6">
                    <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-rose-100">
                        <Trash2 className="w-10 h-10 text-rose-600" />
                    </div>
                    <DialogTitle className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-tight">Delete Digital Identity?</DialogTitle>
                    <p className="text-sm font-bold text-gray-400 tracking-tight uppercase tracking-widest mt-2">This operation is irreversible. {beneficiary.name}'s record will be purged from the active node.</p>
                </DialogHeader>
                <DialogFooter className="gap-4 mt-4">
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="rounded-[1.5rem] font-black h-16 flex-1 border-gray-100 text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Abort</Button>
                    <Button onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 rounded-[1.5rem] font-black h-16 flex-1 text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-900/20 active:scale-95 transition-all text-white">Delete Record</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number, color?: string }) {
  return (
    <div className="flex items-center gap-5 p-5 bg-white rounded-[1.75rem] border border-gray-50 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-900/5 transition-all group cursor-default">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] mb-1 leading-none">{label}</p>
        <p className="text-sm font-black text-gray-900 tracking-tight truncate">{value || 'UNSPECIFIED'}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">{label}</Label>
            <Input defaultValue={value} className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all px-5 font-bold shadow-inner" />
        </div>
    );
}
