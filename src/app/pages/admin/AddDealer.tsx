import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  ArrowLeft, Loader2, UserPlus, 
  User, Phone, Mail, Store,
  Home, Building2, Map,
  Shield,
  Lock, Eye, EyeOff,
  CheckCircle2, KeyRound
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export function AdminAddDealer() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const isValidPassword = (pwd: string) => {
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
    return passwordPattern.test(pwd);
  };

  const isValidEmail = (em: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(em);
  };

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setErrors({ ...errors, email: "Please enter a valid email first" });
      return;
    }
    setIsSendingCode(true);
    try {
      const resp = await RetrofitClient.apiService.sendDealerEmailCode(email);
      if (resp.isSuccessful) {
        toast.success("Verification code sent to email!");
        setShowOtpField(true);
      }
    } catch (err) {
      toast.error("Failed to send code");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Enter a valid 6-digit code");
      return;
    }
    setIsVerifying(true);
    try {
      const resp = await RetrofitClient.apiService.verifyDealerEmailCode(email, verificationCode);
      if (resp.isSuccessful) {
        toast.success("Email verified successfully!");
        setIsVerified(true);
        setShowOtpField(false);
      }
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!isValidEmail(email)) newErrors.email = "Valid email is required";
    if (!isVerified) newErrors.email = "Email must be verified";
    if (phone.length !== 10) newErrors.phone = "Invalid phone number (must be 10 digits)";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!isValidPassword(password)) newErrors.password = "Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, & 1 special character";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        company_name: companyName,
        address,
        city,
        state,
        username,
        password
      };

      const resp = await RetrofitClient.apiService.registerDealer(payload);
      if (resp.isSuccessful) {
        toast.success("Dealer account created successfully!");
        navigate('/admin/users');
      } else {
        toast.error(resp.body?.error || "Registration failed");
      }
    } catch (err) {
      console.error("Dealer registration error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const primaryRed = "#D32F2F";
  const darkRed = "#B71C1C";

  return (
    <DashboardLayout role="admin" title="">
      <div className="min-h-screen bg-[#F5F5F5] pb-24 lg:pb-12">
        {/* Premium Red Gradient Header */}
        <div 
          className="relative w-full h-[280px] flex flex-col items-center justify-start p-8 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-700"
          style={{ background: `linear-gradient(180deg, ${primaryRed}, ${darkRed})` }}
        >
          {/* Header Content */}
          <div className="relative z-10 w-full max-w-4xl pt-4">
            <div className="flex items-center gap-4 text-white">
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-black tracking-tight uppercase">Add New Dealer</h1>
            </div>
            
            <div className="mt-8 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <p className="text-red-50 font-medium opacity-90 max-w-md">
                Registering a new dealer entity for local operations.
              </p>
            </div>
          </div>
          
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-20 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Personal Details */}
            <Card className="border border-red-50 shadow-lg rounded-3xl p-6 bg-white overflow-hidden">
              <h3 className="text-sm font-bold text-[#D32F2F] tracking-tight uppercase mb-6 flex items-center gap-2">
                Personal Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 ml-1">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                    <Input 
                      className={`h-12 rounded-xl pl-12 pr-4 bg-red-50/30 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F]'} transition-all`}
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors({...errors, name: ''}); }}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 ml-1 font-medium">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 ml-1">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                    <Input 
                      type="tel"
                      className={`h-12 rounded-xl pl-12 pr-4 bg-red-50/30 border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F]'} transition-all`}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors({...errors, phone: ''}); }}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 ml-1 font-medium">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end pr-1">
                    <Label className="text-xs font-medium text-gray-500 ml-1">Email Address</Label>
                    {isVerified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                    <Input 
                      type="email"
                      disabled={isVerified}
                      className={`h-12 rounded-xl pl-12 pr-28 bg-red-50/30 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F]'} transition-all`}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: ''}); }}
                    />
                    {!isVerified && (
                      <Button
                        type="button"
                        onClick={handleSendCode}
                        disabled={isSendingCode || !isValidEmail(email)}
                        className="absolute right-1.5 top-1.5 h-9 px-4 bg-[#D32F2F] hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm"
                      >
                        {isSendingCode ? <Loader2 className="w-3 h-3 animate-spin" /> : "Get Code"}
                      </Button>
                    )}
                  </div>
                  {errors.email && <p className="text-xs text-red-500 ml-1 font-medium">{errors.email}</p>}
                </div>

                {showOtpField && !isVerified && (
                  <div className="space-y-2 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest ml-1">Verification Code</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                        <Input 
                          placeholder="6-digit OTP"
                          maxLength={6}
                          className="h-11 rounded-xl pl-11 bg-white border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 font-mono tracking-[0.2em]"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isVerifying || verificationCode.length !== 6}
                        className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
                      </Button>
                    </div>
                    <p className="text-[9px] text-emerald-600/70 font-medium ml-1">
                      Check your inbox for the 6-digit security credential.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Business / Shop Details */}
            <Card className="border border-red-50 shadow-lg rounded-3xl p-6 bg-white overflow-hidden">
              <h3 className="text-sm font-bold text-[#D32F2F] tracking-tight uppercase mb-6 flex items-center gap-2">
                Business / Shop Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 ml-1">Agency/Shop Name</Label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                    <Input 
                      className="h-12 rounded-xl pl-12 pr-4 bg-red-50/30 border border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F] transition-all"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 ml-1">Address</Label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                    <Input 
                      className="h-12 rounded-xl pl-12 pr-4 bg-red-50/30 border border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F] transition-all"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500 ml-1">City</Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                      <Input 
                        className="h-12 rounded-xl pl-12 pr-4 bg-red-50/30 border border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F] transition-all"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500 ml-1">State</Label>
                    <div className="relative">
                      <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                      <Input 
                        className="h-12 rounded-xl pl-12 pr-4 bg-red-50/30 border border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F] transition-all"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </Card>



            {/* Account Details */}
            <Card className="border border-red-50 shadow-lg rounded-3xl p-6 bg-white overflow-hidden">
              <h3 className="text-sm font-bold text-[#D32F2F] tracking-tight uppercase mb-6 flex items-center gap-2">
                Account Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 ml-1">Username</Label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                    <Input 
                      className={`h-12 rounded-xl pl-12 pr-4 bg-red-50/30 border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F]'} transition-all`}
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setErrors({...errors, username: ''}); }}
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-500 ml-1 font-medium">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 ml-1">Create Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      className={`h-12 rounded-xl pl-12 pr-12 bg-red-50/30 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F]'} transition-all`}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: ''}); }}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 ml-1 font-medium leading-tight">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 ml-1">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D32F2F]" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      className={`h-12 rounded-xl pl-12 pr-12 bg-red-50/30 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D32F2F] focus:ring-[#D32F2F]'} transition-all`}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors({...errors, confirmPassword: ''}); }}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 ml-1 font-medium">{errors.confirmPassword}</p>}
                </div>
              </div>
            </Card>

            <Button 
              type="submit"
              className="w-full h-14 bg-[#D32F2F] hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Dealer Account
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
