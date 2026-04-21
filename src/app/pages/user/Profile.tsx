import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  User, 
  Phone, 
  Mail, 
  Edit, 
  ArrowLeft, 
  X, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Lock,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Compass,
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { cn } from '../../components/ui/utils';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { SessionManager } from '../../utils/SessionManager';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { Loader2, Camera } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog";

type ProfileState = 'MENU' | 'DISPLAY' | 'EDIT' | 'PASSWORD';

export function UserProfile() {
    const navigate = useNavigate();
    
    const [profileState, setProfileState] = useState<ProfileState>('MENU');
    const [isLoading, setIsLoading] = useState(false);
    
    // Core Profile State
    const [name, setName] = useState(SessionManager.getUserName() || 'User');
    const [email, setEmail] = useState(SessionManager.getUserEmail() || '');
    const [phone, setPhone] = useState(SessionManager.getUserPhone() || '');
    const [profileImage, setProfileImage] = useState(SessionManager.getUserProfileImage() || '');
    const [isPdsVerified, setIsPdsVerified] = useState(SessionManager.isIdentityVerified());
    const [isDealerSelected, setIsDealerSelected] = useState(SessionManager.getAssignedDealerId() !== null);
    const [dealerName, setDealerName] = useState(SessionManager.getAssignedDealerName() || '');
    const [dealerLocation, setDealerLocation] = useState(SessionManager.getAssignedDealerLocation() || '');
    
    // File upload ref
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Additional Fields (Synced with Register)
    const [age, setAge] = useState(SessionManager.getUserAge() || '');
    const [gender, setGender] = useState(SessionManager.getUserGender() || 'Male');
    const [education, setEducation] = useState(SessionManager.getUserEducation() || '');
    const [employment, setEmployment] = useState(SessionManager.getUserEmployment() || '');
    const [pdsCardNo, setPdsCardNo] = useState(SessionManager.getUserPdsCard() || '');
    const [streetAddress, setStreetAddress] = useState(SessionManager.getUserAddress() || '');
    
    // Password change states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isVerified = SessionManager.isIdentityVerified();
    const role = isVerified ? "Verified Household User" : "Primary Household User";

    const userId = SessionManager.getUserId();

    // Fetch full profile on mount
    useEffect(() => {
        if (userId > 0) {
            fetchProfile();
        }
    }, [userId]);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const data = await RetrofitClient.apiService.getUserProfile(userId);
            if (data) {
                // Sync State
                setName(data.name || data.fullName || name);
                setEmail(data.email || email);
                setPhone(data.phone || phone);
                setAge(String(data.age || ''));
                setGender(data.gender || 'Male');
                setEducation(data.education || '');
                setEmployment(data.employment || '');
                setPdsCardNo(data.pds_card_no || data.pdsCardNo || '');
                setStreetAddress(data.address || data.streetAddress || '');
                setIsPdsVerified(data.is_identity_verified || data.identityVerified || SessionManager.isIdentityVerified());
                setIsDealerSelected(!!data.assigned_dealer_id || !!data.dealerId || SessionManager.getAssignedDealerId() !== null);
                
                const dName = data.assigned_dealer_name || data.dealer_name || data.dealerName || '';
                const dLoc = data.assigned_dealer_location || data.dealer_location || data.dealerLocation || '';
                setDealerName(dName || SessionManager.getAssignedDealerName() || '');
                setDealerLocation(dLoc || SessionManager.getAssignedDealerLocation() || '');
                
                if (dName) SessionManager.setAssignedDealerName(dName);
                if (dLoc) SessionManager.setAssignedDealerLocation(dLoc);
                
                if (data.profile_image) {
                    setProfileImage(data.profile_image);
                    SessionManager.setUserProfileImage(data.profile_image);
                }

                // Sync SessionManager
                SessionManager.setUserName(data.name || data.fullName || name);
                SessionManager.setUserEmail(data.email || email);
                SessionManager.setUserPhone(data.phone || phone);
                SessionManager.setUserAge(String(data.age || ''));
                SessionManager.setUserGender(data.gender || 'Male');
                SessionManager.setUserEducation(data.education || '');
                SessionManager.setUserEmployment(data.employment || '');
                SessionManager.setUserPdsCard(data.pds_card_no || data.pdsCardNo || '');
                SessionManager.setUserAddress(data.address || data.streetAddress || '');
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!name || !phone) {
            toast.error("Please fill in all mandatory fields");
            return;
        }

        setIsLoading(true);
        try {
            const updateData = {
                name,
                email,
                phone,
                age: parseInt(age) || 0,
                gender,
                education,
                employment,
                pds_card_no: pdsCardNo,
                address: streetAddress
            };

            await RetrofitClient.apiService.updateUserProfile(userId, updateData);
            
            // Success - manually sync SessionManager as well
            SessionManager.setUserName(name);
            SessionManager.setUserEmail(email);
            SessionManager.setUserPhone(phone);
            SessionManager.setUserAge(age);
            SessionManager.setUserGender(gender);
            SessionManager.setUserEducation(education);
            SessionManager.setUserEmployment(employment);
            SessionManager.setUserPdsCard(pdsCardNo);
            SessionManager.setUserAddress(streetAddress);

            toast.success("Identity Profile Updated Successfully");
            setProfileState('DISPLAY');
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("profile_image", file);

        setIsLoading(true);
        try {
            const res = await RetrofitClient.apiService.updateUserProfileImage(userId, formData);
            if (res.isSuccessful && res.body) {
                let newImg = res.body.profileImage || (res.body as any).profile_image;
                
                // Normalize URL if it's relative
                if (newImg && !newImg.startsWith('http')) {
                    const baseUrl = RetrofitClient.apiService.getBaseUrl();
                    newImg = `${baseUrl}/${newImg.startsWith('/') ? newImg.slice(1) : newImg}`;
                }

                setProfileImage(newImg);
                SessionManager.setUserProfileImage(newImg);
                toast.success("Profile photo updated successfully");
            } else {
                toast.error("Failed to upload identity photo");
            }
        } catch (error) {
            toast.error("An error occurred during upload protocol");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please complete all password fields");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setIsUpdatingPassword(true);
        RetrofitClient.apiService.changePassword({
            currentPassword: currentPassword,
            newPassword: newPassword
        }).then(res => {
            setIsUpdatingPassword(false);
            if (res.isSuccessful) {
                toast.success("Security credentials updated successfully");
                setProfileState('MENU');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(res.errorBody?.string() || "Failed to update security credentials. Please check your current password.");
            }
        }).catch(err => {
            setIsUpdatingPassword(false);
            toast.error(err.message || "An error occurred while updating security credentials");
        });
    };
    
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const res = await RetrofitClient.apiService.deleteUserAccount(userId);
            if (res.isSuccessful) {
                toast.success("Account permanently deleted. Session terminated.");
                SessionManager.clearSession();
                navigate('/role-selection');
            } else {
                toast.error(res.errorBody?.string() || "Integrity error: Failed to delete identity account");
            }
        } catch (error: any) {
            toast.error(error.message || "A network error occurred during the deletion protocol");
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const PrimaryBlue = "#1E3A8A";
    const CyanGradient = "#3B82F6";

    return (
        <DashboardLayout role="user" title="">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                className="hidden"
                accept="image/*"
            />
            <div className="flex flex-col min-h-screen bg-[#F8FAFC] -m-6 sm:-m-8 pb-20">
                {/* Immersive Gradient Header - 200px */}
                <div 
                    className="w-full h-[200px] rounded-b-[32px] flex flex-col p-8 pt-12 relative overflow-hidden shadow-2xl"
                    style={{ background: `linear-gradient(135deg, ${PrimaryBlue}, ${CyanGradient})` }}
                >
                    <div className="flex items-center justify-between z-10 transition-all duration-500">
                        <button 
                            onClick={() => {
                                if (profileState === 'MENU') navigate(-1);
                                else if (profileState === 'DISPLAY') setProfileState('MENU');
                                else setProfileState('DISPLAY');
                            }}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all active:scale-95"
                        >
                            {profileState === 'EDIT' || profileState === 'PASSWORD' ? <X className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                        </button>

                        {profileState === 'MENU' && (
                            <button 
                                onClick={() => setProfileState('EDIT')}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all active:scale-95"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="mt-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {profileState === 'MENU' ? (
                            <div className="flex items-center gap-4">
                                <InitialsAvatar 
                                    name={name} 
                                    imageUrl={profileImage}
                                    editable={false}
                                />
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{name}</h2>
                                    <div className="flex items-center gap-1.5">
                                        {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />}
                                        <p className="text-[11px] font-black text-white/70 uppercase tracking-widest">{role}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                                {profileState === 'DISPLAY' ? "Personal Information" : 
                                 profileState === 'EDIT' ? "Edit Profile" : "Security Update"}
                            </h2>
                        )}
                    </div>

                    {/* Abstract elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>
                </div>

                {/* Content Section */}
                <div className="px-6 -mt-6 z-20 pb-10">
                    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {profileState === 'MENU' && (
                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">My Verification Status</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <StatusActionCard 
                                            label="PDS Card Linked"
                                            isVerified={isPdsVerified}
                                            onAction={() => navigate('/user/link-identity')}
                                            actionLabel="Link Card Now"
                                        />
                                        <StatusActionCard 
                                            label="Dealer Selection"
                                            isVerified={isDealerSelected}
                                            onAction={() => navigate('/user/select-location')}
                                            actionLabel="Select Dealer"
                                            details={isDealerSelected ? `${dealerName}${dealerLocation ? ` • ${dealerLocation}` : ''}` : undefined}
                                        />
                                    </div>
                                </section>

                                <div className="h-px bg-gray-100 w-full" />

                                <section>
                                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Account Settings</h3>
                                    <div className="space-y-2">
                                        <ModernOption 
                                            icon={User} 
                                            label="Personal Information" 
                                            onClick={() => setProfileState('DISPLAY')} 
                                        />
                                        <ModernOption 
                                            icon={Lock} 
                                            label="Change Password" 
                                            onClick={() => setProfileState('PASSWORD')} 
                                        />
                                        <ModernOption 
                                            icon={FileText} 
                                            label="About Program" 
                                            onClick={() => navigate('/user/about')} 
                                        />
                                        <ModernOption 
                                            icon={Trash2} 
                                            label="Delete Account" 
                                            onClick={() => setShowDeleteConfirm(true)} 
                                            danger={true}
                                        />
                                    </div>
                                </section>

                                <div className="pt-8 text-center border-t border-gray-50 mt-4">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mukh Swasthya v1.0.4</p>
                                </div>
                            </div>
                        )}

                        {profileState === 'DISPLAY' && (
                            <div className="space-y-8">
                                {/* Integrated Avatar Action (READ-ONLY) */}
                                <div className="flex flex-col items-center pb-8 border-b border-gray-50">
                                    <InitialsAvatar 
                                        name={name} 
                                        imageUrl={profileImage}
                                        editable={false}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <DisplayRow icon={User} label="Full Name" value={name} />
                                    <DisplayRow icon={Phone} label="Phone Number" value={phone} />
                                    <DisplayRow icon={Mail} label="Email Address" value={email} />
                                    <DisplayRow icon={Calendar} label="Age" value={age ? `${age} Years` : ''} />
                                    <DisplayRow icon={Compass} label="Gender" value={gender} />
                                    <DisplayRow icon={GraduationCap} label="Educational Level" value={education} />
                                    <DisplayRow icon={Briefcase} label="Employment Status" value={employment} />
                                </div>
                                <div className="h-px bg-gray-100 w-full" />
                                <DisplayRow icon={MapPin} label="Residential Street Address" value={streetAddress} />
                            </div>
                        )}

                        {profileState === 'EDIT' && (
                            <div className="space-y-8 pb-4">
                                {/* Integrated Avatar Action (EDITABLE) */}
                                <div className="flex flex-col items-center pb-8 border-b border-gray-50">
                                    <InitialsAvatar 
                                        name={name} 
                                        imageUrl={profileImage}
                                        onClick={handleImageClick}
                                        isLoading={isLoading}
                                        editable={true}
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={handleImageClick}
                                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-900 transition-all"
                                    >
                                        Update Identity Photo
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <EditField icon={User} label="Full Name" value={name} onChange={setName} />
                                    <EditField icon={Phone} label="Phone Number" value={phone} onChange={setPhone} type="tel" />
                                    <EditField icon={Mail} label="Email Address" value={email} onChange={setEmail} type="email" />
                                    <EditField icon={Calendar} label="Age" value={age} onChange={setAge} type="number" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender Identification</Label>
                                        <RadioGroup 
                                            value={gender} 
                                            onValueChange={setGender} 
                                            className="flex items-center gap-8 h-14"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Male" id="m_gender" />
                                                <Label htmlFor="m_gender" className="font-bold text-sm cursor-pointer">Male</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Female" id="f_gender" />
                                                <Label htmlFor="f_gender" className="font-bold text-sm cursor-pointer">Female</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Educational Level</Label>
                                        <Select value={education} onValueChange={setEducation}>
                                            <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 p-6 font-bold">
                                                <SelectValue placeholder="Select education" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl shadow-premium">
                                                <SelectItem value="Primary" className="font-bold py-3">Primary Education</SelectItem>
                                                <SelectItem value="Secondary" className="font-bold py-3">Secondary Education</SelectItem>
                                                <SelectItem value="Higher" className="font-bold py-3">Higher Education</SelectItem>
                                                <SelectItem value="None" className="font-bold py-3">No formal education</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Employment Protocol</Label>
                                        <Select value={employment} onValueChange={setEmployment}>
                                            <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 p-6 font-bold">
                                                <SelectValue placeholder="Select employment" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl shadow-premium">
                                                <SelectItem value="Employed" className="font-bold py-3">Employed</SelectItem>
                                                <SelectItem value="Self-Employed" className="font-bold py-3">Self-Employed</SelectItem>
                                                <SelectItem value="Unemployed" className="font-bold py-3">Unemployed</SelectItem>
                                                <SelectItem value="Student" className="font-bold py-3">Student</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <EditField icon={MapPin} label="Residential Street Address" value={streetAddress} onChange={setStreetAddress} />

                                <Button 
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                    className="w-full h-16 rounded-3xl bg-blue-900 hover:bg-black text-white font-black text-[13px] uppercase tracking-[0.2em] mt-6 shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Update Identity"}
                                </Button>
                            </div>
                        )}

                        {profileState === 'PASSWORD' && (
                            <div className="space-y-8">
                                <EditField icon={Lock} label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" />
                                <div className="h-px bg-gray-100 w-full" />
                                <EditField icon={ShieldCheck} label="New Password" value={newPassword} onChange={setNewPassword} type="password" />
                                <EditField icon={ShieldCheck} label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} type="password" />

                                <Button 
                                    onClick={handleUpdatePassword}
                                    disabled={isUpdatingPassword}
                                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[12px] uppercase tracking-widest mt-10"
                                >
                                    {isUpdatingPassword ? "Processing..." : "Update Security Passkey"}
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="rounded-[2.5rem] p-8 border-none bg-white shadow-2xl animate-in zoom-in-95 duration-300">
                    <AlertDialogHeader className="mb-4">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 animate-pulse">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                            Permanent Deletion Protocol
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-bold text-gray-400 mt-2 leading-relaxed">
                            Are you absolutely sure? This will permanently erase your digital identity, linked family members, and health history from the Digital PDS node. This action cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 mt-6">
                        <AlertDialogCancel className="h-14 rounded-2xl border-gray-100 font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 flex-1">
                            Abort Deletion
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteAccount();
                            }}
                            disabled={isDeleting}
                            className="h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 flex-1"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Deletion"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}

function InitialsAvatar({ 
    name, 
    imageUrl, 
    onClick,
    isLoading = false,
    editable = false
}: { 
    name: string, 
    imageUrl?: string, 
    onClick?: () => void,
    isLoading?: boolean,
    editable?: boolean
}) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    return (
        <div 
            onClick={editable ? onClick : undefined}
            className={cn(
                "relative w-[72px] h-[72px] rounded-full bg-white/20 backdrop-blur-xl border-4 border-white/40 flex items-center justify-center shadow-lg group overflow-hidden transition-all",
                editable ? "cursor-pointer" : "cursor-default"
            )}
        >
            {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            ) : (
                <span className="text-3xl font-black text-white tracking-widest">{initials}</span>
            )}
            
            {editable && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                        <Camera className="w-6 h-6 text-white" />
                    )}
                </div>
            )}
        </div>
    );
}

function ModernOption({ 
    icon: Icon, 
    label, 
    onClick, 
    danger = false 
}: { 
    icon: any, 
    label: string, 
    onClick: () => void, 
    danger?: boolean 
}) {
    return (
        <div 
            onClick={onClick}
            className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-all cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    danger ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white' 
                           : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                }`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-black tracking-tight ${danger ? 'text-red-500' : 'text-gray-900'}`}>
                    {label}
                </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
        </div>
    );
}

function DisplayRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <p className="text-[17px] font-black text-gray-900 tracking-tight leading-none">{value || 'Not provided'}</p>
            </div>
        </div>
    );
}

function EditField({ 
    icon: Icon, 
    label, 
    value, 
    onChange, 
    type = 'text' 
}: { 
    icon: any, 
    label: string, 
    value: string, 
    onChange: (val: string) => void,
    type?: string
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <Input 
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-100 font-bold transition-all"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            </div>
        </div>
    );
}

function StatusActionCard({ 
    label, 
    isVerified, 
    onAction, 
    actionLabel,
    details
}: { 
    label: string, 
    isVerified: boolean, 
    onAction: () => void, 
    actionLabel: string,
    details?: string
}) {
    return (
        <div className={cn(
            "p-5 rounded-3xl border-2 flex flex-col gap-4 transition-all duration-300",
            isVerified 
                ? "bg-emerald-50/30 border-emerald-100/50" 
                : "bg-amber-50/40 border-amber-100/60 shadow-sm"
        )}>
            <div className="flex items-start justify-between">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    isVerified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                )}>
                    {isVerified ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    isVerified ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                )}>
                    {isVerified ? "Verified" : "Pending"}
                </div>
            </div>
            
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className={cn(
                    "text-sm font-black tracking-tight",
                    isVerified ? "text-emerald-900" : "text-amber-900"
                )}>
                    {isVerified ? (details || "Successfully Synced") : "Instruction Required"}
                </p>
            </div>

            {!isVerified && (
                <Button 
                    onClick={onAction}
                    className="w-full h-11 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] uppercase tracking-widest shadow-amber-600/20 shadow-lg transition-all active:scale-95"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}