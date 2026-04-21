import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { 
  ArrowLeft, 
  Trash2, 
  User, 
  Calendar, 
  Users,
  Save,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RetrofitClient, type FamilyMemberResponse } from '../../network/RetrofitClient';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';

import { SessionManager } from '../../utils/SessionManager';

export function EditFamilyMember() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const userId = SessionManager.getUserId();
  
  const [member, setMember] = useState<FamilyMemberResponse | null>(location.state?.member || null);
  const [name, setName] = useState(location.state?.member?.memberName || '');
  const [age, setAge] = useState(location.state?.member?.age?.toString() || '');
  const [relation, setRelation] = useState(location.state?.member?.relation || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(!location.state?.member);

  const PrimaryBlue = "#3B82F6";
  const ThemeGradientEnd = "#1E3A8A";

  useEffect(() => {
    if (!member && id) {
      fetchMemberDetails();
    }
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      const response = await RetrofitClient.apiService.getFamilyMembers(userId);
      if (response.isSuccessful && response.body) {
        const found = response.body.find((m: FamilyMemberResponse) => m.id === parseInt(id!));
        if (found) {
          setMember(found);
          setName(found.memberName);
          setAge(found.age.toString());
          setRelation(found.relation);
        } else {
          toast.error("Family member not found");
          navigate('/user/family');
        }
      }
    } catch (error) {
      toast.error("Failed to fetch member details");
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age.trim() || !relation.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.updateFamilyMember({
        memberId: parseInt(id!),
        name,
        age: parseInt(age) || 0,
        relation
      });

      if (response.isSuccessful) {
        toast.success("Member updated successfully");
        navigate('/user/family');
      } else {
        toast.error(response.message || "Failed to update member");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove this family member?")) return;

    setIsDeleting(true);
    try {
      const response = await RetrofitClient.apiService.deleteFamilyMember(parseInt(id!), userId);
      if (response.isSuccessful) {
        toast.success("Member removed");
        navigate('/user/family');
      } else {
        toast.error(response.message || "Failed to remove member");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPageLoading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="min-h-screen bg-[#F8FBFF] relative overflow-hidden">
        {/* Gradient Header */}
        <div 
          className="absolute top-0 left-0 right-0 h-[260px] z-0"
          style={{ 
            background: `linear-gradient(to bottom, ${PrimaryBlue}, ${ThemeGradientEnd})` 
          }}
        />

        <div className="relative z-10 w-full max-w-lg mx-auto px-6">
          {/* Top Bar */}
          <header className="flex items-center justify-between h-20 mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/user/family')}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-white tracking-tight">Edit Family Member</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-white/10 hover:bg-white/20 text-[#FFCDD2] disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            </Button>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Overlapping Card */}
            <Card className="rounded-[2rem] border-none shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] bg-white overflow-hidden p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Update Details</h2>
                <p className="text-sm font-medium text-gray-400">
                  Modify the family member's registered details.
                </p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Age</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter age"
                      className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relation" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Relation</Label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      id="relation"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      placeholder="Spouse, Child, etc."
                      className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: PrimaryBlue }}
                    className="w-full h-14 rounded-2xl text-white font-black tracking-widest uppercase text-xs shadow-[0_12px_24px_-8px_rgba(59,130,246,0.4)] hover:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>

          <footer className="mt-8 text-center pb-12">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Dental Health Management System
            </p>
          </footer>
        </div>
      </div>
    </DashboardLayout>
  );
}
