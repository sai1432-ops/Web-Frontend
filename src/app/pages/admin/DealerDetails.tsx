import { useParams, useNavigate, Link } from 'react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, Phone, 
  User, Mail, AtSign, 
  Store, Home, 
  Edit, Trash2,
  Landmark,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { RetrofitClient } from '../../network/RetrofitClient';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../../components/ui/alert-dialog";
import { toast } from 'sonner';

interface DealerData {
  id: string | number;
  name: string;
  username: string;
  handle: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  city: string;
  state: string;

  companyName: string;
  status: string;
}

export function AdminDealerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dealer, setDealer] = useState<DealerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    async function fetchDealer() {
      if (!id) return;
      setIsLoading(true);

      try {
        const data = await RetrofitClient.apiService.getDealer(id);
        console.log("DEALER DETAIL RESPONSE:", data);

        setDealer({
          id: String(data.id ?? id),
          name: data.name ?? 'Unknown Dealer',
          username: data.username ? `@${data.username}` : 'N/A',
          handle: data.handle ?? data.username ?? 'N/A',
          companyName: data.companyName ?? 'N/A',
          phone: data.phone ?? 'N/A',
          email: data.email ?? 'N/A',
          location: data.location ?? 'N/A',
          address: data.address ?? 'N/A',
          city: data.city ?? 'N/A',
          state: data.state ?? 'N/A',
          status: data.activeStatus ?? (data.isEnabled ? 'Active' : 'Inactive')
        });
      } catch (error) {
        console.error("Failed to fetch dealer details:", error);
        setDealer(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDealer();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-[#D32F2F] animate-spin mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Retrieving Dealer Profile...</p>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center border-none shadow-2xl rounded-3xl">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Dealer Not Found</h3>
          <p className="text-gray-500 mb-8 font-medium">The dealer profile you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/admin/users?tab=dealers')} 
            className="w-full h-14 bg-[#D32F2F] hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Management
          </Button>
        </Card>
      </div>
    );
  }

  const firstLetter = dealer.name.charAt(0).toUpperCase();

  const avatarColors = [
    'bg-red-400', 'bg-pink-400', 'bg-purple-400', 
    'bg-indigo-400', 'bg-blue-400', 'bg-cyan-400'
  ];
  const avatarBg = avatarColors[Math.abs(dealer.name.length) % avatarColors.length];

  const handleDelete = async () => {
    if (!dealer) return;
    
    setIsDeleting(true);
    try {
      const res = await RetrofitClient.apiService.deleteDealer(dealer.id);
      if (res.isSuccessful) {
        toast.success("Dealer deleted successfully");
        setShowDeleteDialog(false);
        navigate('/admin/users?tab=dealers');
      } else {
        toast.error(res.errorBody?.string() || "Failed to delete dealer");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error("An unexpected error occurred during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-12">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-[#D32F2F] text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 rounded-full"
              onClick={() => navigate('/admin/users?tab=dealers')}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Dealer Profile</h1>
          </div>
          <div className="flex items-center gap-1">
            <Link to={`/admin/dealers/${id}/edit`}>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Edit className="w-5 h-5" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 rounded-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Header Section with Red Gradient */}
      <div className="bg-gradient-to-b from-[#D32F2F] to-[#B71C1C] pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-white p-1 shadow-2xl mb-6">
            <div className={`w-full h-full rounded-full ${avatarBg} flex items-center justify-center text-white text-4xl font-black`}>
              {firstLetter}
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{dealer.name}</h2>
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-4 rounded-full font-bold text-xs uppercase tracking-widest backdrop-blur-sm">
            {dealer.status}
          </Badge>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6">
        {/* General Information */}
        <InfoSection title="General Information">
          <InfoRow icon={<User className="w-4.5 h-4.5" />} label="Full Name" value={dealer.name} />
          <InfoRow icon={<AtSign className="w-4.5 h-4.5" />} label="Handle" value={dealer.handle} />
          <InfoRow icon={<Phone className="w-4.5 h-4.5" />} label="Phone" value={dealer.phone} />
          <InfoRow icon={<Mail className="w-4.5 h-4.5" />} label="Email" value={dealer.email} />
        </InfoSection>

        <InfoSection title="Business Details">
          <InfoRow icon={<Store className="w-4.5 h-4.5" />} label="Agency/Shop Name" value={dealer.companyName} />

          <InfoRow icon={<Home className="w-4.5 h-4.5" />} label="Address" value={dealer.address} />
          <InfoRow icon={<Landmark className="w-4.5 h-4.5" />} label="City/State" value={`${dealer.city || ''} ${dealer.state || ''}`} />

        </InfoSection>




      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-gray-900">Delete Dealer</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-medium text-lg leading-relaxed">
              Are you sure you want to delete <span className="text-[#D32F2F] font-bold">{dealer.name}</span>? This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="h-14 px-8 rounded-2xl border-gray-100 hover:bg-gray-50 font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="h-14 px-8 rounded-2xl bg-[#D32F2F] hover:bg-red-700 text-white font-bold"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </div>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-8">
      <h3 className="text-[#D32F2F] font-black text-sm uppercase tracking-widest mb-8">{title}</h3>
      <div className="space-y-6">
        {children}
      </div>
    </Card>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-5 group">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#D32F2F] shadow-sm transform transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-0.5">{label}</p>
        <p className="text-base font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default AdminDealerDetails;
