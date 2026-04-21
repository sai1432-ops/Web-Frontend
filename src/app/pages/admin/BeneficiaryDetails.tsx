import { useParams, useNavigate } from 'react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  ArrowLeft, Phone, MapPin, 
  User, Mail, Activity, CheckCircle2, Clock, 
  Edit, Trash2, Shield, Info, Briefcase, 
  GraduationCap, Globe, Camera, Save, Plus,
  Users, ChevronRight, AlertCircle, Store,
  Package2, History
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { useState, useEffect } from 'react';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';

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
  adminNote?: string;
  familyMembers: FamilyMember[];
  history: KitHistoryItem[];
}


export function AdminBeneficiaryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('PENDING');
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [beneficiary, setBeneficiary] = useState<BeneficiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPdsCardNo, setEditPdsCardNo] = useState('');
  const [editAge, setEditAge] = useState<string | number>('');
  const [editGender, setEditGender] = useState('');
  const [editEducation, setEditEducation] = useState('');
  const [editEmployment, setEditEmployment] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await RetrofitClient.apiService.getBeneficiary(id);
        // Robust mapping to ensure all needed fields are present for UI
        setBeneficiary({
          ...data,
          id: String(data.id ?? id),
          name: data.name ?? data.fullName ?? 'Unknown',
          username: data.username ?? '',
          pdsCardNo: data.pdsCardNo ?? data.pds_card_no ?? data.rationId ?? 'N/A',
          phone: data.phone ?? data.phoneNumber ?? 'N/A',
          email: data.email ?? 'N/A',
          location: data.location ?? data.location_name ?? 'N/A',
          status: data.status ?? 'PENDING',

          familyMembers: (data.familyMembers ?? data.family_members ?? []).map((member: any) => ({
            id: String(member.id ?? ''),
            name: member.name ?? member.member_name ?? 'Unknown',
            age: member.age ?? 0,
            relation: member.relation ?? 'Unknown'
          })),

          history: (data.history ?? []).map((record: any) => ({
            id: String(record.id ?? ''),
            name: record.name ?? record.kitName ?? 'Kit',
            type: record.type ?? record.kitType ?? 'Standard',
            quantity: record.quantity ?? 'N/A',
            date: record.date ?? 'N/A',
            status: record.status ?? 'PENDING',
            givenBy: record.givenBy ?? 'N/A',
            returnDate: record.returnDate,
            returnReason: record.returnReason,
            notes: record.notes
          })),

          age: data.age ?? 0,
          gender: data.gender ?? 'N/A',
          education: data.education ?? 'N/A',
          employment: data.employment ?? 'N/A',
          address: data.address ?? 'N/A',
          createdAt: data.createdAt ?? data.created_at ?? 'N/A',
          createdByName: data.createdByName ?? data.created_by_name ?? 'System',
          createdByRole: data.createdByRole ?? data.created_by_role ?? 'Admin',
          pdsCardFront: data.pdsCardFront ?? data.pds_card_front ?? undefined,
          pdsCardBack: data.pdsCardBack ?? data.pds_card_back ?? undefined,
        });
      } catch (error) {
        console.error("Failed to fetch beneficiary details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (beneficiary) {
      setUpdateStatus(beneficiary.status);
      
      // Initialize edit fields
      setEditName(beneficiary.name);
      setEditPhone(beneficiary.phone);
      setEditEmail(beneficiary.email);
      setEditPdsCardNo(beneficiary.pdsCardNo);
      setEditAge(beneficiary.age);
      setEditGender(beneficiary.gender);
      setEditEducation(beneficiary.education);
      setEditEmployment(beneficiary.employment);
      setEditAddress(beneficiary.address);
    }
  }, [beneficiary]);

  const handleUpdate = async () => {
    if (!id) return;
    setIsUpdating(true);
    try {
      await RetrofitClient.apiService.updateBeneficiaryStatus(id, {
        status: updateStatus,
        note: adminNote
      });
      alert("Status updated successfully");
      // Refresh data
      const data = await RetrofitClient.apiService.getBeneficiary(id);
      setBeneficiary({
        ...data,
        id: String(data.id ?? id),
        name: data.name ?? data.fullName ?? 'Unknown',
        username: data.username ?? '',
        pdsCardNo: data.pdsCardNo ?? data.pds_card_no ?? data.rationId ?? 'N/A',
        phone: data.phone ?? data.phoneNumber ?? 'N/A',
        email: data.email ?? 'N/A',
        location: data.location ?? data.location_name ?? 'N/A',
        status: data.status ?? 'PENDING',

        familyMembers: (data.familyMembers ?? data.family_members ?? []).map((member: any) => ({
          id: String(member.id ?? ''),
          name: member.name ?? member.member_name ?? 'Unknown',
          age: member.age ?? 0,
          relation: member.relation ?? 'Unknown'
        })),

        history: (data.history ?? []).map((record: any) => ({
          id: String(record.id ?? ''),
          name: record.name ?? record.kitName ?? 'Kit',
          type: record.type ?? record.kitType ?? 'Standard',
          quantity: record.quantity ?? 'N/A',
          date: record.date ?? 'N/A',
          status: record.status ?? 'PENDING',
          givenBy: record.givenBy ?? 'N/A',
          returnDate: record.returnDate,
          returnReason: record.returnReason,
          notes: record.notes
        })),

        age: data.age ?? 0,
        gender: data.gender ?? 'N/A',
        education: data.education ?? 'N/A',
        employment: data.employment ?? 'N/A',
        address: data.address ?? 'N/A',
        createdAt: data.createdAt ?? data.created_at ?? 'N/A',
        createdByName: data.createdByName ?? data.created_by_name ?? 'System',
        createdByRole: data.createdByRole ?? data.created_by_role ?? 'Admin',
        pdsCardFront: data.pdsCardFront ?? data.pds_card_front ?? undefined,
        pdsCardBack: data.pdsCardBack ?? data.pds_card_back ?? undefined,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const res = await RetrofitClient.apiService.deleteBeneficiary(id);
      if (res.isSuccessful) {
        toast.success("Beneficiary profile deleted successfully");
        setShowDeleteDialog(false);
        navigate('/admin/users?tab=beneficiaries');
      } else {
        toast.error(res.errorBody?.string() || "Failed to delete beneficiary");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const payload = {
        name: editName,
        phone: editPhone,
        email: editEmail,
        pds_card_no: editPdsCardNo, 
        age: editAge,
        gender: editGender,
        education: editEducation,
        employment: editEmployment,
        address: editAddress
      };
      
      const res = await RetrofitClient.apiService.updateBeneficiary(id, payload);
      if (res.isSuccessful) {
        toast.success("Beneficiary profile updated successfully");
        setShowEditDialog(false);
        // Refresh local data
        const data = await RetrofitClient.apiService.getBeneficiary(id);
        setBeneficiary({
          ...data,
          id: String(data.id ?? id),
          name: data.name ?? data.fullName ?? 'Unknown',
          pdsCardNo: data.pdsCardNo ?? data.pds_card_no ?? data.rationId ?? 'N/A',
          phone: data.phone ?? data.phoneNumber ?? 'N/A',
          location: data.location ?? data.location_name ?? 'N/A',
          // Preserve these or map from data if backend returns them
          familyMembers: data.familyMembers ?? beneficiary?.familyMembers ?? [],
          history: data.history ?? beneficiary?.history ?? []
        });
      } else {
        toast.error(res.errorBody?.string() || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Profile Data...</p>
      </div>
    );
  }

  if (!beneficiary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-12 text-center border-0 shadow-2xl rounded-3xl">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-[#1E3A8A]" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Beneficiary Not Found</h3>
          <p className="text-gray-500 mb-8 font-medium">The beneficiary profile you are looking for has been moved or does not exist.</p>
          <Button 
            onClick={() => navigate('/admin/users?tab=beneficiaries')} 
            className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Users
          </Button>
        </Card>
      </div>
    );
  }

  const firstLetter = (beneficiary.name?.charAt(0) || '?').toUpperCase();

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case 'GIVEN':
        return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" />, label: 'CONFIRMED' };
      case 'PENDING':
        return { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-4 h-4" />, label: 'PENDING' };
      case 'RETURNED':
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertCircle className="w-4 h-4" />, label: 'RETURNED' };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Info className="w-4 h-4" />, label: status };
    }
  };

  const statusInfo = getStatusInfo(beneficiary.status);

  return (
    <div className="min-h-screen bg-[#F8FBFF] pb-12">
      {/* Premium Sticky Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] sticky top-0 z-50 shadow-xl">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/admin/users?tab=beneficiaries')}
              variant="ghost" 
              className="text-white hover:bg-white/10 rounded-xl"
              size="icon"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Beneficiary Profile</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <p className="text-blue-50 text-xs font-bold uppercase tracking-widest opacity-80">Admin View Mode</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowEditDialog(true)}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-xl font-bold px-4 transition-all"
            >
              <Edit className="w-4.5 h-4.5 mr-2" />
              Edit
            </Button>
            <Button 
              onClick={() => setShowDeleteDialog(true)}
              className="bg-white hover:bg-red-50 text-[#D32F2F] rounded-xl font-black px-4 shadow-lg transition-all"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card & Quick Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Beneficiary Hero Card */}
            <Card className="border-0 shadow-2xl shadow-blue-900/5 rounded-[2rem] overflow-hidden bg-white">
              <div className="h-32 bg-gradient-to-br from-[#1E3A8A]/5 to-[#1e40af]/10 relative">
                <div className="absolute top-6 right-8">
                  <Badge className={`${statusInfo.color} px-4 py-2 rounded-xl font-black border-2 flex items-center gap-2 shadow-sm`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
              <div className="px-8 pb-10">
                <div className="flex items-end gap-6 -mt-12 mb-8">
                  <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-8 border-white group transition-transform hover:scale-105 duration-500">
                    {firstLetter}
                  </div>
                  <div className="pb-2">
                    <h2 className="text-3xl font-black text-gray-900 mb-1">{beneficiary.name}</h2>
                    <div className="flex items-center gap-2 font-bold text-gray-400 uppercase tracking-tighter text-sm">
                      <span className="text-[#1E3A8A]">ID: {beneficiary.pdsCardNo}</span>
                      <span>•</span>
                      <span>{beneficiary.username}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Info Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoItem icon={<Phone className="text-blue-500" />} label="Phone" value={beneficiary.phone} />
                  <InfoItem icon={<Mail className="text-purple-500" />} label="Email" value={beneficiary.email} />
                  <InfoItem icon={<User className="text-emerald-500" />} label="Age / Gender" value={`${beneficiary.age} Yrs • ${beneficiary.gender}`} />
                  <InfoItem icon={<GraduationCap className="text-amber-500" />} label="Education" value={beneficiary.education} />
                  <InfoItem icon={<Briefcase className="text-indigo-500" />} label="Employment" value={beneficiary.employment} />
                  <InfoItem icon={<Globe className="text-rose-500" />} label="Location" value={beneficiary.location} />
                  <div className="sm:col-span-2">
                    <InfoItem icon={<MapPin className="text-orange-500" />} label="Full Address" value={beneficiary.address} />
                  </div>
                </div>

                {/* Registration Metadata */}
                <div className="mt-8 p-6 bg-gray-50 rounded-[1.5rem] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      {beneficiary.createdByRole === 'Dealer' ? <Store className="w-6 h-6 text-emerald-600" /> : <Shield className="w-6 h-6 text-red-600" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Registered By</p>
                      <p className="text-sm font-bold text-gray-900">{beneficiary.createdByName} <span className="text-gray-400">({beneficiary.createdByRole})</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Enrollment Date</p>
                    <p className="text-sm font-bold text-gray-900">{beneficiary.createdAt}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* PDS Card Images */}
            {(beneficiary.pdsCardFront || beneficiary.pdsCardBack) && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Camera className="w-5 h-5 text-[#1E3A8A]" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">PDS Verification Documents</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {beneficiary.pdsCardFront && (
                    <Card className="p-4 border-0 shadow-xl rounded-3xl bg-white overflow-hidden group">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Front Side Image</p>
                      <div className="aspect-[1.6/1] bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-blue-500/30 transition-colors">
                        <img src={beneficiary.pdsCardFront} alt="PDS Front" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '/placeholder.png')} />
                      </div>
                    </Card>
                  )}
                  {beneficiary.pdsCardBack && (
                    <Card className="p-4 border-0 shadow-xl rounded-3xl bg-white overflow-hidden group">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Back Side Image</p>
                      <div className="aspect-[1.6/1] bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-blue-500/30 transition-colors">
                        <img src={beneficiary.pdsCardBack} alt="PDS Back" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '/placeholder.png')} />
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Status & Family */}
          <div className="space-y-8">
            {/* Status Update Card */}
            <Card className="border-0 shadow-2xl shadow-blue-500/5 rounded-[2rem] p-8 bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 -z-0"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#1E3A8A]" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">Update Status</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Beneficiary Status</Label>
                    <Select defaultValue={beneficiary.status} onValueChange={setUpdateStatus}>
                      <SelectTrigger className="h-12 rounded-xl border-gray-100 font-bold focus:ring-[#1E3A8A]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GIVEN" className="font-bold text-emerald-600">GIVEN (Confirmed)</SelectItem>
                        <SelectItem value="PENDING" className="font-bold text-amber-600">PENDING</SelectItem>
                        <SelectItem value="RETURNED" className="font-bold text-red-600">RETURNED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Admin Note</Label>
                    <Textarea 
                      placeholder="Add a reason for status change or general observation..."
                      className="rounded-xl border-gray-100 min-h-[100px] focus:ring-[#1E3A8A] font-medium text-sm"
                      defaultValue={beneficiary.adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="w-full h-12 bg-[#1E3A8A] hover:bg-blue-900 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
                    {isUpdating ? "Updating..." : "Publish Changes"}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-2xl shadow-blue-500/5 rounded-[2rem] p-8 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">Family Members</h3>
                </div>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-blue-600 hover:bg-blue-50 ring-1 ring-blue-100">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {beneficiary.familyMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 font-bold text-sm">No members linked yet.</p>
                  </div>
                ) : (
                  beneficiary.familyMembers.map((member: FamilyMember) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 group hover:bg-white hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs uppercase">
                          {(member.name?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none mb-1">{member.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{member.age} Yrs • {member.relation}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section: Distribution History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between ml-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Distribution Timeline</h3>
            </div>
            {beneficiary.history.length > 0 && (
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 px-4 py-1.5 rounded-xl font-black">
                {beneficiary.history.length} RECORDS
              </Badge>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {beneficiary.history.length === 0 ? (
              <Card className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white/50">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package2 className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="text-xl font-black text-gray-900">No Distribution Records</h4>
                <p className="text-gray-500 font-medium">This beneficiary hasn't received any kits in the current cycle.</p>
              </Card>
            ) : (
              beneficiary.history.map((record: KitHistoryItem) => {
                const hStatus = getStatusInfo(record.status);
                return (
                  <Card key={record.id} className="border-0 shadow-xl rounded-[2rem] overflow-hidden bg-white hover:shadow-2xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Package2 className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-gray-900">{record.name}</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{record.type} Kit</p>
                          </div>
                        </div>
                        <Badge className={`${hStatus.color} px-3 py-1.5 rounded-xl font-black text-[10px] border-2`}>
                          {hStatus.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-[1.25rem]">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
                          <p className="text-sm font-black text-gray-900">{record.quantity}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-[1.25rem]">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Distributed On</p>
                          <p className="text-sm font-black text-gray-900">{record.date}</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-[#1E3A8A]" />
                          <p className="text-xs font-bold text-gray-500">Issued by <span className="text-gray-900">{record.givenBy || 'N/A'}</span></p>
                        </div>
                        {record.notes && (
                          <div className="flex items-start gap-2 italic text-xs text-gray-400 font-medium">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>Note: {record.notes}</p>
                          </div>
                        )}
                        {record.status === 'RETURNED' && (
                          <div className="p-4 bg-red-50 rounded-[1.25rem] border border-red-100 mt-4">
                            <div className="flex items-center gap-2 text-red-700 mb-2">
                              <AlertCircle className="w-4 h-4" />
                              <p className="text-xs font-black uppercase tracking-widest">Returned on {record.returnDate}</p>
                            </div>
                            <p className="text-xs font-bold text-red-900 opacity-80 leading-relaxed">Reason: {record.returnReason}</p>
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

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-8 border-none overflow-hidden bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 capitalize">Edit Beneficiary Profile</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 my-6 max-h-[60vh] overflow-y-auto px-1 pr-4 custom-scrollbar">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-12 rounded-xl focus:ring-[#1E3A8A]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Phone Number</Label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="h-12 rounded-xl focus:ring-[#1E3A8A]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Address</Label>
                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="h-12 rounded-xl focus:ring-[#1E3A8A]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">PDS Card Number</Label>
                <Input value={editPdsCardNo} onChange={(e) => setEditPdsCardNo(e.target.value)} className="h-12 rounded-xl focus:ring-[#1E3A8A]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Age</Label>
                <Input value={editAge} onChange={(e) => setEditAge(e.target.value)} className="h-12 rounded-xl focus:ring-[#1E3A8A]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Gender</Label>
                <Input value={editGender} onChange={(e) => setEditGender(e.target.value)} className="h-12 rounded-xl focus:ring-[#1E3A8A]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Education</Label>
                <Input value={editEducation} onChange={(e) => setEditEducation(e.target.value)} className="h-12 rounded-xl focus:ring-[#1E3A8A]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Employment</Label>
                <Input value={editEmployment} onChange={(e) => setEditEmployment(e.target.value)} className="h-12 rounded-xl focus:ring-[#1E3A8A]" />
              </div>
            </div>
            <div className="col-span-full space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Street Address</Label>
              <Textarea value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="rounded-xl min-h-[80px] focus:ring-[#1E3A8A]" />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="rounded-xl font-bold h-12 flex-1 border-gray-100">Cancel</Button>
            <Button 
              onClick={handleEditSave}
              disabled={isSaving}
              className="bg-[#1E3A8A] hover:bg-blue-900 rounded-xl font-black h-12 flex-[2] shadow-xl shadow-blue-500/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin mr-2" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-10 border-none bg-white">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Confirm Deletion</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-gray-900">{beneficiary.name}</span>? 
              This action will permanently remove all distribution history and family records.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="rounded-2xl font-bold h-14 flex-1 order-2 sm:order-1 border-gray-100">Cancel</Button>
            <Button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-[#D32F2F] hover:bg-red-700 rounded-2xl font-black h-14 flex-1 order-1 sm:order-2 shadow-xl shadow-red-500/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin mr-2" />
                  Deleting...
                </>
              ) : "Delete Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className={`flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group`}>
      <div className={`p-2 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-900 leading-tight">{value || 'Not Available'}</p>
      </div>
    </div>
  );
}

export default AdminBeneficiaryDetails;