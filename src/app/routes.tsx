import { lazy } from 'react';
import { createBrowserRouter, redirect } from "react-router";
import { ErrorBoundary } from './components/ErrorBoundary';

// Helper for lazy loading components
// (Removed unused lazyLoad helper)

// Core Pages
const LandingPage = lazy(() => import('./pages/Landing').then(m => ({ default: m.LandingPage })));
const RoleSelection = lazy(() => import('./pages/RoleSelection').then(m => ({ default: m.RoleSelection })));
const UserLogin = lazy(() => import('./pages/UserLogin').then(m => ({ default: m.UserLogin })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const DealerLogin = lazy(() => import('./pages/dealer/Login').then(m => ({ default: m.DealerLogin })));

// Public Pages
const PublicFeatures = lazy(() => import('./pages/PublicFeatures').then(m => ({ default: m.PublicFeatures })));
const PublicAbout = lazy(() => import('./pages/PublicAbout').then(m => ({ default: m.PublicAbout })));
const PublicImpact = lazy(() => import('./pages/PublicImpact').then(m => ({ default: m.PublicImpact })));

// User Pages
const Register = lazy(() => import('./pages/user/Register').then(m => ({ default: m.Register })));
const DailyCheckIn = lazy(() => import('./pages/user/DailyCheckIn').then(m => ({ default: m.DailyCheckIn })));
const UserDashboard = lazy(() => import('./pages/user/Dashboard').then(m => ({ default: m.UserDashboard })));
const FamilyManagement = lazy(() => import('./pages/user/FamilyManagement').then(m => ({ default: m.FamilyManagement })));
const AddFamilyMember = lazy(() => import('./pages/user/AddFamilyMember').then(m => ({ default: m.AddFamilyMember })));
const EditFamilyMember = lazy(() => import('./pages/user/EditFamilyMember').then(m => ({ default: m.EditFamilyMember })));
const BeneficiaryManagement = lazy(() => import('./pages/user/BeneficiaryManagement').then(m => ({ default: m.BeneficiaryManagement })));
const ScanVerification = lazy(() => import('./pages/user/ScanVerification').then(m => ({ default: m.ScanVerification })));
const UserProfile = lazy(() => import('./pages/user/Profile').then(m => ({ default: m.UserProfile })));
const Notifications = lazy(() => import('./pages/user/Notifications').then(m => ({ default: m.default })));
const Settings = lazy(() => import('./pages/user/Settings').then(m => ({ default: m.Settings })));
const Feedback = lazy(() => import('./pages/user/Feedback').then(m => ({ default: m.Feedback })));
const HealthRecords = lazy(() => import('./pages/user/HealthRecords').then(m => ({ default: m.HealthRecords })));
const KitHub = lazy(() => import('./pages/user/KitHub').then(m => ({ default: m.KitHub })));
const Consult = lazy(() => import('./pages/user/Consult').then(m => ({ default: m.Consult })));
const Learn = lazy(() => import('./pages/user/Learn').then(m => ({ default: m.Learn })));
const About = lazy(() => import('./pages/user/About').then(m => ({ default: m.About })));
const Support = lazy(() => import('./pages/user/Support').then(m => ({ default: m.Support })));
const BrushingCheckIn = lazy(() => import('./pages/user/BrushingCheckIn').then(m => ({ default: m.BrushingCheckIn })));
const InstantAnalysis = lazy(() => import('./pages/user/InstantAnalysis').then(m => ({ default: m.InstantAnalysis })));
const AIAnalysisLoading = lazy(() => import('./pages/user/AIAnalysisLoading').then(m => ({ default: m.AIAnalysisLoading })));
const AIAnalysisResult = lazy(() => import('./pages/user/AIAnalysisResult').then(m => ({ default: m.AIAnalysisResult })));
const ConfirmKitReceipt = lazy(() => import('./pages/user/ConfirmKitReceipt').then(m => ({ default: m.ConfirmKitReceipt })));
const ScanDealerQR = lazy(() => import('./pages/user/ScanDealerQR').then(m => ({ default: m.ScanDealerQR })));
const SelectLocation = lazy(() => import('./pages/user/SelectLocation').then(m => ({ default: m.default })));
const KitReceived = lazy(() => import('./pages/user/KitReceived').then(m => ({ default: m.KitReceived })));
const UserForgotPassword = lazy(() => import('./pages/user/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const UserVerifyOTP = lazy(() => import('./pages/user/VerifyOTP').then(m => ({ default: m.VerifyOTP })));
const UserResetPassword = lazy(() => import('./pages/user/ResetPassword').then(m => ({ default: m.ResetPassword })));
const DetailedAIReport = lazy(() => import('./pages/user/DetailedAIReport').then(m => ({ default: m.DetailedAIReport })));
const LastAIScanReport = lazy(() => import('./pages/user/LastAIScanReport').then(m => ({ default: m.LastAIScanReport })));
const MemberHealthStatus = lazy(() => import('./pages/user/MemberHealthStatus').then(m => ({ default: m.default })));
const MonthlyUsage = lazy(() => import('./pages/user/MonthlyUsage').then(m => ({ default: m.default })));
const QRScanner = lazy(() => import('./pages/user/QRScanner').then(m => ({ default: m.default })));
const ScanHistory = lazy(() => import('./pages/user/ScanHistory').then(m => ({ default: m.default })));
const LinkIdentity = lazy(() => import('./pages/user/LinkIdentity').then(m => ({ default: m.LinkIdentity })));
const VerificationSuccess = lazy(() => import('./pages/user/VerificationSuccess').then(m => ({ default: m.default })));
const UserFeatures = lazy(() => import('./pages/user/Features').then(m => ({ default: m.Features })));

// Dealer Pages
const DealerDashboard = lazy(() => import('./pages/dealer/Dashboard').then(m => ({ default: m.DealerDashboard })));
const DealerChangePassword = lazy(() => import('./pages/dealer/ChangePassword').then(m => ({ default: m.DealerChangePassword })));
const DealerStockList = lazy(() => import('./pages/dealer/StockList').then(m => ({ default: m.DealerStockList })));
const DealerEditProfile = lazy(() => import('./pages/dealer/EditProfile').then(m => ({ default: m.DealerEditProfile })));
const DealerGenerateQR = lazy(() => import('./pages/dealer/GenerateQR').then(m => ({ default: m.DealerGenerateQR })));
const StockRequest = lazy(() => import('./pages/dealer/StockRequest').then(m => ({ default: m.StockRequest })));
const StockConfirmation = lazy(() => import('./pages/dealer/StockConfirmation').then(m => ({ default: m.StockConfirmation })));
const Distribution = lazy(() => import('./pages/dealer/Distribution').then(m => ({ default: m.Distribution })));
const StockManagement = lazy(() => import('./pages/dealer/StockManagement').then(m => ({ default: m.default })));
const DealerProfile = lazy(() => import('./pages/dealer/Profile').then(m => ({ default: m.DealerProfile })));
const DealerBeneficiaries = lazy(() => import('./pages/dealer/Beneficiaries').then(m => ({ default: m.default })));
const NewHouseholdRegistration = lazy(() => import('./pages/dealer/NewHouseholdRegistration').then(m => ({ default: m.default })));
const RegistrationSuccess = lazy(() => import('./pages/dealer/RegistrationSuccess').then(m => ({ default: m.default })));
const RequestNewStock = lazy(() => import('./pages/dealer/RequestNewStock').then(m => ({ default: m.RequestNewStock })));
const StockRequestSuccess = lazy(() => import('./pages/dealer/StockRequestSuccess').then(m => ({ default: m.default })));
const DealerReports = lazy(() => import('./pages/dealer/Reports').then(m => ({ default: m.default })));
const HouseholdEligibility = lazy(() => import('./pages/dealer/HouseholdEligibility').then(m => ({ default: m.default })));
const FinalDistribution = lazy(() => import('./pages/dealer/FinalDistribution').then(m => ({ default: m.default })));
const DistributionSuccess = lazy(() => import('./pages/dealer/DistributionSuccess').then(m => ({ default: m.default })));
const DealerFeatures = lazy(() => import('./pages/dealer/Features').then(m => ({ default: m.Features })));
const DealerAbout = lazy(() => import('./pages/dealer/About').then(m => ({ default: m.About })));
const DealerForgotPassword = lazy(() => import('./pages/dealer/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const DealerVerifyOTP = lazy(() => import('./pages/dealer/VerifyOTP').then(m => ({ default: m.VerifyOTP })));
const DealerResetPassword = lazy(() => import('./pages/dealer/ResetPassword').then(m => ({ default: m.ResetPassword })));
const DistributionActivity = lazy(() => import('./pages/dealer/DistributionActivity').then(m => ({ default: m.DistributionActivity })));
const DealerBeneficiaryDetails = lazy(() => import('./pages/dealer/BeneficiaryDetails').then(m => ({ default: m.DealerBeneficiaryDetails })));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.AdminUsers })));
const AdminDistributions = lazy(() => import('./pages/admin/Distributions').then(m => ({ default: m.AdminDistributions })));
const AdminProfile = lazy(() => import('./pages/admin/Profile').then(m => ({ default: m.AdminProfile })));
const AdminEditDealer = lazy(() => import('./pages/admin/EditDealer').then(m => ({ default: m.AdminEditDealer })));
const AdminAddBeneficiary = lazy(() => import('./pages/admin/AddBeneficiary').then(m => ({ default: m.AdminAddBeneficiary })));
const AdminAddClinic = lazy(() => import('./pages/admin/AddClinic').then(m => ({ default: m.AdminAddClinic })));
const AdminClinics = lazy(() => import('./pages/admin/Clinics').then(m => ({ default: m.AdminClinics })));
const AdminStockRequests = lazy(() => import('./pages/admin/StockRequests').then(m => ({ default: m.default })));
const AdminBeneficiaryDetails = lazy(() => import('./pages/admin/BeneficiaryDetails').then(m => ({ default: m.default })));
const AdminDealerDetails = lazy(() => import('./pages/admin/DealerDetails').then(m => ({ default: m.default })));
const AdminStockRequestDetails = lazy(() => import('./pages/admin/StockRequestDetails').then(m => ({ default: m.default })));
const AdminAddDealer = lazy(() => import('./pages/admin/AddDealer').then(m => ({ default: m.AdminAddDealer })));
const AdminAddLocation = lazy(() => import('./pages/admin/AddLocation').then(m => ({ default: m.AdminAddLocation })));
const AdminFeatures = lazy(() => import('./pages/admin/Features').then(m => ({ default: m.Features })));
const AdminAbout = lazy(() => import('./pages/admin/About').then(m => ({ default: m.About })));

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: LandingPage },
      { path: "role-selection", Component: RoleSelection },
      
      // Global Login Routes
      { path: "login/user", Component: UserLogin },
      { path: "user/login", loader: () => redirect("/login/user") },
      { path: "login/dealer", Component: DealerLogin },
      { path: "dealer/login", loader: () => redirect("/login/dealer") },
      { path: "login/admin", Component: AdminLogin },
      { path: "admin/login", loader: () => redirect("/login/admin") },

      // Public Information Routes
      { path: "features", Component: PublicFeatures },
      { path: "about", Component: PublicAbout },
      { path: "impact", Component: PublicImpact },

      // User routes
      {
        path: "user",
        children: [
          { path: "dashboard", Component: UserDashboard },
          { path: "register", Component: Register },
          { path: "daily-checkin", Component: DailyCheckIn },
          { path: "ai-report-detailed", Component: DetailedAIReport },
          { path: "family", Component: FamilyManagement },
          { path: "family/add", Component: AddFamilyMember },
          { path: "family/edit/:id", Component: EditFamilyMember },
          { path: "family/last-scan", Component: LastAIScanReport },
          { path: "family/member/:id/scans", Component: ScanHistory },
          { path: "family/member/:id/health-status", Component: MemberHealthStatus },
          { path: "beneficiaries", Component: BeneficiaryManagement },
          { path: "scan", Component: ScanVerification },
          { path: "select-location", Component: SelectLocation },
          { path: "verification-success", Component: VerificationSuccess },
          { path: "profile", Component: UserProfile },
          { path: "notifications", Component: Notifications },
          { path: "settings", Component: Settings },
          { path: "feedback", Component: Feedback },
          { path: "health-records", Component: HealthRecords },
          { path: "fitness-progress", loader: () => redirect("/user/daily-checkin") }, // Reference to check-in
          { path: "kit-hub", Component: KitHub },
          { path: "consult", Component: Consult },
          { path: "learn", Component: Learn },
          { path: "about", Component: About },
          { path: "features", Component: UserFeatures },
          { path: "support", Component: Support },
          { path: "brushing-check-in", Component: BrushingCheckIn },
          { path: "ai-scan", Component: InstantAnalysis },
          { path: "ai-analysis-loading", Component: AIAnalysisLoading },
          { path: "ai-analysis-result", Component: AIAnalysisResult },
          { path: "monthly-usage", Component: MonthlyUsage },
          { path: "confirm-kit-receipt", Component: ConfirmKitReceipt },
          { path: "scan-qr", Component: QRScanner },
          { path: "scan-dealer-qr", Component: ScanDealerQR },
          { path: "kit-received", Component: KitReceived },
          { path: "forgot-password", Component: UserForgotPassword },
          { path: "verify-otp", Component: UserVerifyOTP },
          { path: "reset-password", Component: UserResetPassword },
          { path: "link-identity", Component: LinkIdentity },
        ]
      },

      // Dealer routes
      {
        path: "dealer",
        children: [
          { path: "dashboard", Component: DealerDashboard },
          { path: "distribution-activity", Component: DistributionActivity },
          { path: "stock-request", Component: StockRequest },
          { path: "stock-confirmation", Component: StockConfirmation },
          { path: "distribution", Component: Distribution },
          { path: "stock-management", Component: StockManagement },
          { path: "change-password", Component: DealerChangePassword },
          { path: "stock-list", Component: DealerStockList },
          { path: "edit-profile", Component: DealerEditProfile },
          { path: "generate-qr", Component: DealerGenerateQR },
          { path: "profile", Component: DealerProfile },
          { path: "beneficiaries", Component: DealerBeneficiaries },
          { path: "beneficiaries/:id", Component: DealerBeneficiaryDetails },
          { path: "beneficiaries/register", Component: NewHouseholdRegistration },
          { path: "beneficiaries/registration-success", Component: RegistrationSuccess },
          { path: "request-new-stock", Component: RequestNewStock },
          { path: "stock-request-success", Component: StockRequestSuccess },
          { path: "reports", Component: DealerReports },
          { path: "household-eligibility", Component: HouseholdEligibility },
          { path: "final-distribution", Component: FinalDistribution },
          { path: "distribution-success", Component: DistributionSuccess },
          { path: "features", Component: DealerFeatures },
          { path: "about", Component: DealerAbout },
          { path: "forgot-password", Component: DealerForgotPassword },
          { path: "verify-otp", Component: DealerVerifyOTP },
          { path: "reset-password", Component: DealerResetPassword },
        ]
      },

      // Admin routes
      {
        path: "admin",
        children: [
          { path: "dashboard", Component: AdminDashboard },
          { path: "users", Component: AdminUsers },
          { path: "dealers", loader: () => redirect("/admin/users") },
          { path: "beneficiaries", loader: () => redirect("/admin/users") },
          { path: "distributions", Component: AdminDistributions },
          { path: "profile", Component: AdminProfile },
          { path: "stock-requests", Component: AdminStockRequests },
          { path: "stock-requests/:id", Component: AdminStockRequestDetails },
          { path: "dealers/:id", Component: AdminDealerDetails },
          { path: "dealers/:id/edit", Component: AdminEditDealer },
          { path: "beneficiaries/:id", Component: AdminBeneficiaryDetails },
          { path: "beneficiaries/add", Component: AdminAddBeneficiary },
          { path: "dealers/add", Component: AdminAddDealer },
          { path: "locations/add", Component: AdminAddLocation },
          { path: "clinics", Component: AdminClinics },
          { path: "clinics/add", Component: AdminAddClinic },
          { path: "features", Component: AdminFeatures },
          { path: "about", Component: AdminAbout },
        ]
      }
    ]
  }
]);