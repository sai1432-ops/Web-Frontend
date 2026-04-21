import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SessionManager } from '../../utils/SessionManager';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Loader2,
  ChevronRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Key,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male',
    education: '',
    employment: '',
    streetAddress: '',
    password: '',
    confirmPassword: ''
  });

  // Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const isValidEmail = (em: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(em);
  };

  const handleSendCode = async () => {
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address first");
      return;
    }
    setIsSendingCode(true);
    try {
      const resp = await RetrofitClient.apiService.sendRegistrationOtp(formData.email);
      if (resp.isSuccessful) {
        toast.success("Verification code sent to your email!");
        setShowOtpField(true);
      } else {
        toast.error(resp.errorBody?.string() || "Failed to send code");
      }
    } catch (err) {
      toast.error("Network error while sending code");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Enter 6-digit code");
      return;
    }
    setIsVerifying(true);
    try {
      const resp = await RetrofitClient.apiService.verifyRegistrationOtp(formData.email, verificationCode);
      if (resp.isSuccessful) {
        toast.success("Email Identity Verified!");
        setIsVerified(true);
        setShowOtpField(false);
      } else {
        toast.error("Invalid verification code");
      }
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      toast.error("Please verify your email address first");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.age || !formData.streetAddress || !formData.password || !formData.email) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Real API call for registration
      const response = await RetrofitClient.apiService.userRegister({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        age: formData.age,
        gender: formData.gender,
        education: formData.education,
        employment: formData.employment,
        address: formData.streetAddress,
        profile_image: profileImage || undefined
      });

      if (response.isSuccessful && response.body) {
        toast.success("Account created successfully!");
        
        // Store full session
        const newUserId = response.body.userId || (response.body as any).user_id || -1;
        SessionManager.saveSession(
          Number(newUserId),
          formData.fullName,
          formData.email,
          formData.phone,
          'user',
          true, // Marked as verified because we passed the OTP
          response.body.access_token || null
        );

        // Store additional fields
        if (formData.age) SessionManager.setUserAge(formData.age);
        if (formData.gender) SessionManager.setUserGender(formData.gender);
        if (formData.education) SessionManager.setUserEducation(formData.education);
        if (formData.employment) SessionManager.setUserEmployment(formData.employment);
        if (formData.streetAddress) SessionManager.setUserAddress(formData.streetAddress);

        // Navigate to link identity as the account is now fully verified
        navigate('/user/link-identity');
      } else {
        const errMsg = response.errorBody?.string() || "Registration failed. Please try again.";
        toast.error(errMsg);
      }
    } catch (error: any) {
      toast.error(error.message || "Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] relative overflow-hidden py-12 px-6 flex flex-col items-center">
      {/* Decorative Branding */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-50 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-indigo-100/20 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-soft border border-gray-100 mb-6">
           <Sparkles className="w-4 h-4 text-blue-600" />
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Official Registration Terminal</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight uppercase">Registration Form</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <Card className="card-premium p-8 md:p-14 rounded-[3.5rem] border-none bg-white/70 backdrop-blur-3xl shadow-premium overflow-hidden relative">
          
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* PROFILE IMAGE UPLOAD */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative group">
                <div 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-premium overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-100 transition-all"
                  onClick={() => document.getElementById('profile-upload')?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                      <User className="w-12 h-12" />
                      <span className="text-[10px] font-black uppercase mt-1">Upload Photo</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('profile-upload')?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white hover:bg-black transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  id="profile-upload"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-4">Professional identification Photo</p>
            </div>
            
            {/* Form Section Identifier */}
            <div className="flex items-center gap-5 border-b border-gray-100 pb-8">
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-lg shadow-inner">1</div>
               <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-none">Primary Beneficiary</h2>
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-2 opacity-60">Identity & Vital Analytics</p>
               </div>
            </div>

            <div className="space-y-8">
               {/* Tier 1: Personal Identity */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</Label>
                    <div className="relative group">
                      <Input 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="Enter full name"
                        className="h-16 pl-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white text-sm font-bold shadow-inner-premium transition-all"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-900" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</Label>
                    <div className="relative group">
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="10-digit mobile number"
                        className="h-16 pl-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white text-sm font-bold shadow-inner-premium transition-all"
                      />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-900" />
                    </div>
                  </div>

                  <div className="col-span-full space-y-2.5">
                    <div className="flex justify-between items-end pr-1">
                      <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
                      {isVerified && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest animate-in fade-in zoom-in-95">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Email Verified
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <Input 
                        value={formData.email}
                        disabled={isVerified}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="example@mail.com"
                        className="h-16 pl-12 pr-32 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white text-sm font-bold shadow-inner-premium transition-all"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-900" />
                      
                      {!isVerified && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Button
                            type="button"
                            onClick={handleSendCode}
                            disabled={isSendingCode}
                            className="h-12 px-5 bg-blue-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                          >
                            {isSendingCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Get Code"}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* OTP Field Section */}
                    {showOtpField && !isVerified && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-5 bg-blue-50/50 border border-blue-100 rounded-3xl space-y-4"
                      >
                         <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Secure Identity Verification
                            </Label>
                            <span className="text-[9px] font-bold text-blue-400">Time-sensitive credential</span>
                         </div>
                         <div className="flex gap-3">
                            <div className="relative flex-1">
                               <Input 
                                  placeholder="6-DIGIT OTP"
                                  maxLength={6}
                                  value={verificationCode}
                                  onChange={(e) => setVerificationCode(e.target.value)}
                                  className="h-14 pl-12 bg-white border-blue-100 rounded-2xl text-base font-black tracking-[0.5em] text-blue-900 placeholder:tracking-normal placeholder:text-[10px]"
                               />
                               <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                            </div>
                            <Button
                               type="button"
                               onClick={handleVerifyCode}
                               disabled={isVerifying || verificationCode.length !== 6}
                               className="h-14 px-8 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                            >
                               {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
                            </Button>
                         </div>
                      </motion.div>
                    )}
                  </div>
               </div>

               {/* Tier 2: Vital Analytics */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</Label>
                    <Input 
                      placeholder="00"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="h-16 rounded-2xl border-gray-100 bg-gray-50/50 p-6 font-bold text-gray-900 text-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(val) => setFormData({...formData, gender: val})} 
                      className="flex items-center gap-10 h-16 px-4"
                    >
                       <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Male" id="m_gender" className="border-blue-900 text-blue-900" />
                          <Label htmlFor="m_gender" className="font-bold text-sm text-gray-700 cursor-pointer">Male</Label>
                       </div>
                       <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Female" id="f_gender" className="border-blue-900 text-blue-900" />
                          <Label htmlFor="f_gender" className="font-bold text-sm text-gray-700 cursor-pointer">Female</Label>
                       </div>
                    </RadioGroup>
                  </div>
               </div>

               {/* Tier 3: Socio-Economic Protocol */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                     <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Educational Level
                     </Label>
                     <Select onValueChange={(val) => setFormData({...formData, education: val})}>
                        <SelectTrigger className="h-16 rounded-2xl border-gray-100 bg-gray-50/50 p-6 font-bold text-gray-900 transition-all">
                           <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-100 shadow-premium">
                           <SelectItem value="Primary" className="font-bold py-3">Primary Education</SelectItem>
                           <SelectItem value="Secondary" className="font-bold py-3">Secondary Education</SelectItem>
                           <SelectItem value="Higher" className="font-bold py-3">Higher Education</SelectItem>
                           <SelectItem value="None" className="font-bold py-3">No formal education</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2.5">
                     <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" />
                        Employment Status
                     </Label>
                     <Select onValueChange={(val) => setFormData({...formData, employment: val})}>
                        <SelectTrigger className="h-16 rounded-2xl border-gray-100 bg-gray-50/50 p-6 font-bold text-gray-900 transition-all">
                           <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-100 shadow-premium">
                           <SelectItem value="Employed" className="font-bold py-3">Employed</SelectItem>
                           <SelectItem value="Self-Employed" className="font-bold py-3">Self-Employed</SelectItem>
                           <SelectItem value="Unemployed" className="font-bold py-3">Unemployed</SelectItem>
                           <SelectItem value="Student" className="font-bold py-3">Student</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               {/* Tier 4: Identity & Residence */}
               <div className="space-y-8 pt-4">
                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</Label>
                    <div className="relative group">
                       <Input 
                         value={formData.streetAddress}
                         onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                         placeholder="House no, Street name, etc."
                         className="h-16 pl-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white text-sm font-bold shadow-inner-premium transition-all"
                       />
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-900" />
                    </div>
                  </div>
               </div>

               {/* Tier 5: Account Security Protocol */}
               <div className="space-y-8 pt-8 border-t border-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2.5">
                        <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</Label>
                        <div className="relative group">
                           <Input 
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              placeholder="••••••••"
                              className="h-16 pl-12 pr-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white text-sm font-bold shadow-inner-premium transition-all"
                           />
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-900" />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-900">
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                           </button>
                        </div>
                     </div>
                     <div className="space-y-2.5">
                        <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</Label>
                        <div className="relative group">
                           <Input 
                              type={showPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                              placeholder="••••••••"
                              className="h-16 pl-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white text-sm font-bold shadow-inner-premium transition-all"
                           />
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-900" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-10">
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-18 bg-blue-900 hover:bg-black rounded-3xl text-white font-black tracking-[0.3em] uppercase text-xs shadow-2xl shadow-blue-900/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-4 group"
              >
                {isLoading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <>
                    Complete Registration
                    <ChevronRight className="w-6 h-6 opacity-30 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-50/50 rounded-full blur-[100px] -z-10" />
        </Card>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/user/login')}
        className="mt-12 flex items-center gap-4 text-[10px] font-black text-gray-400 hover:text-blue-900 transition-all uppercase tracking-[0.3em] group"
      >
        <div className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        Return to Portal Terminal
      </motion.button>
    </div>
  );
}
