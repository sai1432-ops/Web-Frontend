// src/app/network/RetrofitClient.ts

export interface AdminDashboardStats {
  totalDealers: number;
  totalBeneficiaries: number;
  totalDistributions: number;
  returnedKits: number;
  trends: Array<{ month: string, kits: number, dealers: number }>;
}

export interface AdminDistributionDto {
  id: string;
  beneficiary_name: string;
  pds_card_no: string;
  dealer_name: string;
  brush_received: number;
  paste_received: number;
  iec_received: number;
  confirmed_at: string;
  status: string;
}

export interface AdminNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
}

export interface DealerInfo {
  id: number | string;
  name: string;
  username: string;
  handle: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  contactPhone: string;
  activeStatus: string;
  isOnline: boolean;
  isEnabled: boolean;
  companyName: string;
  dealer_qr_value?: string;
}

export interface Deal {
  title: string;
  product: string;
  quantity: string;
  price: string;
  status: string;
  statusColor: string;
  date: string;
}

export interface AiDetection {
  detectedClass: string;
  confidence: number;
  bbox: number[];
}

export interface AiPredictionResponse {
  message: string;
  reportId: number;
  riskLevel: string;
  detections: AiDetection[];
  prediction?: string;
  confidence?: number;
}

export interface Beneficiary {
  id: string;
  name: string;
  pds_card_no: string;
  pds_verified: boolean;
  phone: string;
  email?: string;
  dealer_name?: string;
  location_name?: string;
  isActive: boolean;
  dealerId: number;
}

export interface DealerQRConfirmRequest {
  dealer_qr_value: string;
  beneficiaryId: number;
}

export interface DealerQRConfirmResponse {
  message: string;
  dealerId?: number;
}
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
  age?: string;
  gender?: string;
  education?: string;
  employment?: string;
  address?: string;
  profile_image?: File | Blob;
  otp?: string;
}

export interface RegisterResponse {
  message: string;
  userId?: number;
  access_token?: string;
}

export interface Location {
  id: number;
  location_name: string;
  dealer_name: string | null;
}

export interface SelectLocationRequest {
  userId: number;
  dealerId: number;
}

export interface ForgotPasswordRequest {
  identifier: string;
  userType?: 'dealer' | 'user';
}

export interface ForgotPasswordResponse {
  message: string;
  devCode?: string;
}

export interface CheckinRequest {
  userId: number;
  familyMemberId: number | null;
  session: string;
}

export interface MonthlyBrushSession {
  date: string;
  morning: boolean;
  evening: boolean;
}

export interface MonthlyProgressResponse {
  sessions: MonthlyBrushSession[];
  totalCompleted: number;
}

export type Distribution = AdminDistributionDto;

export interface MonthlyUsageData {
  name: string;
  days: string;
  score: number;
  progress: number;
  pasteConsumption: string;
  brushCondition: string;
}

export interface FamilyMemberResponse {
  id: number;
  memberName: string;
  relation: string;
  age: number;
  brushingTarget?: number;
  riskLevel?: string;
  score?: number;
}

export interface MemberAiReport {
  memberId: number;
  imagePath?: string;
  aiResult: AiPredictionResponse;
  createdAt: string;
  riskLevel: string;
}

export interface KitReceivedSummary {
  id: string; 
  kit_unique_id: string;
  brushReceived: number;
  pasteReceived: number;
  iecReceived: number;
  confirmed_at: string | null;
  status: string;
  show_red_alert: boolean;
}

export interface FamilyMemberRequest {
  userId: number;
  memberName: string;
  age: number;
  relation: string;
}

export interface Transaction {
  id: string;
  name: string;
  details: string;
  quantity: string;
  timestamp: string;
}

export interface DealerDashboardStats {
  todayDistributions: number;
  performancePercentage: number;
  totalKits: string;
  distributedKits: string;
  remainingKits: string;
  returnedKits: string;
  recentTransactions: Transaction[];
}

export type ClinicType = 'PHYSICAL' | 'ONLINE' | 'HYBRID';

export interface ClinicResponse {
  id: string;
  clinicName: string;
  clinicType: ClinicType;
  address: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  contactNumber?: string;
  website?: string;
  googleMapsUri?: string;
  distanceKm?: number;
}

export interface AppointmentResponse {
    id: string;
    clinicName: string;
    clinicId: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    memberName: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    consultationReport?: string;
    address: string;
}

export interface AddClinicRequest {
  clinic_name: string;
  clinic_type: ClinicType;
  address: string;
  district: string;
  contact_number: string;
  website?: string;
}

export interface ProfileUpdateRequest {
  dealer_id: number;
  name: string;
  phone: string;
  company_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact_person: string;
  contact_phone: string;
}

export interface StockItem {
  itemName: string;
  quantity: number;
  requestedQuantity?: number;
  status: string;
  requestedAt?: string; // Compatibility alias
  dealer_id?: number;
  dealerId?: number; // Compatibility alias
  dealer_name?: string;
  dealerName?: string; // Compatibility alias
  item_name?: string;
}

export interface AdminStockRequestDto {
  id: number;
  request_id: string;
  requestId?: string; // Compatibility alias
  dealer_id: number;
  dealerId?: number; // Compatibility alias
  dealer_name: string;
  dealerName?: string; // Compatibility alias
  item_name: string;
  kitType?: string; // Compatibility alias
  requested_quantity: number;
  quantity?: number | string; // Compatibility alias
  status: string;
  requested_at: string;
  requestDate?: string; // Compatibility alias
  location?: string;
  dispatchedAt?: string;
  adminNote?: string;
  courierName?: string;
  trackingId?: string;
  dealerAddress?: string;
  dealerUsername?: string;
  dispatchAddress?: string;
  dispatchUsername?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactPerson?: string;
  contactPhone?: string;
}

export interface DispatchStockRequestBody {
  courierName: string;
  trackingId: string;
  adminNote?: string;
}

export interface RejectStockRequestBody {
  reason: string | null;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface DealerLoginResponse {
  message: string;
  dealer_id: number;
  name: string;
  email: string;
  phone: string;
  access_token: string;
  dealer_qr_value?: string;
  error?: string;
}

export interface VerifyBeneficiaryRequest {
  dealerId: number;
  pdsCardNo: string;
}

export interface VerifyBeneficiaryResponse {
  valid: boolean;
  message: string;
  beneficiaryName?: string;
  isEligible?: boolean;
}

export interface DealerHouseholdResponse {
  userId: number;
  name: string;
  identityCardNo: string;
  members: FamilyMemberResponse[];
}

export interface DealerDistributionHistoryResponse {
  id: string;
  beneficiaryName: string;
  date: string;
  time: string;
  status: string;
  itemsSummary?: string;
  items: Array<{ name: string, quantity: number }>;
  oldKitReturned: boolean;
}

export interface DealerManualDistributionRequest {
  dealerId: number;
  beneficiaryId: number;
  brushReceived: number;
  pasteReceived: number;
  iecReceived: number;
  oldKitReturned: boolean;
}

export interface StockRequestBody {
  dealerId: number;
  brushQty: number;
  pasteQty: number;
  iecQty: number;
  totalKits: number;
  urgency: string;
}

export interface StockRequestResponse {
  message: string;
  requestGroupId?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface DealerProfileResponse extends DealerInfo {
  profileImage?: string;
}

export interface AdminStockRequest {
  id: string;
  requestId: string;
  dealerId: number;
  status: string;
  kitType: string;
  quantity: string;
  requestDate: string;
  dealer?: {
    name: string;
    username: string;
    address?: string;
  };
  location?: string;
}

export interface LinkIdentityRequest {
  userId: number;
  identityCardNo: string;
}

export interface LinkIdentityResponse {
  message: string;
  nextStep?: string;
}

export interface ProfileImageResponse {
  message: string;
  profileImage: string;
}

export interface Response<T> {
  isSuccessful: boolean;
  body?: T;
  code?: number;
  message?: string; // Added for easier error handling
  errorBody?: { string: () => string };
}

export interface AdminDashboardStats {
  totalDealers: number;
  totalBeneficiaries: number;
  totalDistributions: number;
  returnedKits: number;
  trends: Array<{ month: string, kits: number, dealers: number }>;
}

class ApiService {
  private USE_MOCK = false;
  // Backend server address
  private baseUrl = ""; // Use Vite proxy (relative paths) to avoid CORS in browser
  private static MOCK_CLINICS: ClinicResponse[] = [
    { 
      id: 'c1', clinicName: 'Happy Dental Clinic', clinicType: 'PHYSICAL',
      address: '123 Main St, Mumbai Central', district: 'Mumbai', latitude: 19.076, longitude: 72.877,
      contactNumber: '9123456701', website: 'https://happydental.com'
    },
    { 
      id: 'c2', clinicName: 'Sahyadri Specialty Care', clinicType: 'HYBRID',
      address: '45 Hill View, Pune', district: 'Pune', latitude: 18.520, longitude: 73.856,
      contactNumber: '9123456702', website: 'https://sahyadri-specialty.in'
    },
    { 
      id: 'c3', clinicName: 'City Dental Hub', clinicType: 'ONLINE',
      address: 'Virtual Hub', district: 'Mumbai', latitude: 19.076, longitude: 72.877,
      contactNumber: '9123456703', website: 'https://citydentalhub.in'
    }
  ];

  private static MOCK_APPOINTMENTS: AppointmentResponse[] = [
    {
      id: 'APT-1001',
      clinicName: 'Happy Dental Clinic',
      clinicId: 'c1',
      doctorName: 'Dr. Sarah Johnson',
      appointmentDate: '2024-03-28',
      appointmentTime: '10:30 AM',
      memberName: 'Rahul Kumar',
      status: 'CONFIRMED',
      address: '123 Main St, Mumbai Central'
    },
    {
       id: 'APT-0982',
       clinicName: 'Sahyadri Specialty Care',
       clinicId: 'c2',
       doctorName: 'Dr. Michael Chen',
       appointmentDate: '2024-02-15',
       appointmentTime: '02:00 PM',
       memberName: 'Rahul Kumar',
       status: 'COMPLETED',
       consultationReport: "Standard cleaning completed. No anomalies detected in AI pre-scan phase.",
       address: '45 Hill View, Pune'
    }
  ];

  private static MOCK_STOCK_REQUESTS: AdminStockRequestDto[] = [
    { 
        id: 1, request_id: "REQ-99011", dealer_id: 1, dealer_name: "Shivaji Dealer",
        location: "Mumbai", item_name: "Standard Kit", requested_quantity: 500,
        status: "PENDING", requested_at: "2024-03-24T10:00:00Z"
    },
    {
        id: 2, request_id: "REQ-99012", dealer_id: 2, dealer_name: "Sahyadri Dealer",
        location: "Pune", item_name: "Premium Kit", requested_quantity: 200,
        status: "DISPATCHED", requested_at: "2024-03-22T14:30:00Z",
        courierName: "BlueDart", trackingId: "ABD-778899"
    }
  ];

  private static MOCK_DISTRIBUTIONS: AdminDistributionDto[] = [
    {
      id: '1',
      beneficiary_name: 'Rajesh Kumar',
      pds_card_no: 'PDS/MH/12345',
      dealer_name: 'Shivaji Dealer',
      brush_received: 4,
      paste_received: 2,
      iec_received: 1,
      confirmed_at: '2024-03-15T10:00:00Z',
      status: 'GIVEN'
    }
  ];

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Real-world network logic
  private async requestRaw<T>(endpoint: string, options: RequestInit = {}): Promise<Response<T>> {
    try {
      const token = this.getToken();
      const headers = new Headers(options.headers || {});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(this.baseUrl + endpoint, {
        ...options,
        headers
      });

      // Global Session Handling for Token Expiry
      const isLoginEndpoint = endpoint.includes('/login') || endpoint.includes('/verify-registration-otp');
      if (response.status === 401 && !isLoginEndpoint) {
          localStorage.clear();
          // Force a full page reload to the login/role selection screen
          window.location.href = '/role-selection';
          return {
              isSuccessful: false,
              code: 401,
              errorBody: { string: () => "Session Expired" }
          };
      }

      let body: any = {};
      const contentType = response.headers.get("content-type");
      
      try {
        if (contentType && contentType.includes("application/json")) {
          body = await response.json();
        } else {
          body = await response.text();
        }
      } catch (e) {
        body = {};
      }
      
      return {
        isSuccessful: response.ok,
        body: body as T,
        code: response.status,
        errorBody: !response.ok ? { 
          string: () => {
            if (typeof body === 'object' && body !== null) {
              const b = body as any;
              const msg = b.error || b.message || b.msg || b.detail;
              return msg || `Error ${response.status}: ${JSON.stringify(body)}`;
            }
            return body ? String(body) : `Error ${response.status}: Unknown server response`;
          } 
        } : undefined
      };
    } catch (error) {
      console.error(`NETWORK_ERROR: [${options.method || 'GET'}] ${endpoint}`, error);
      return {
        isSuccessful: false,
        code: 500,
        errorBody: { string: () => "Network error occurred." }
      };
    }
  }

  public getBaseUrl(): string {
    return this.baseUrl || window.location.origin;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await this.requestRaw<T>(endpoint, options);
    if (!res.isSuccessful) {
      throw new Error(res.errorBody?.string() || "API Request Failed");
    }
    return res.body as T;
  }

  // --- ADMIN METHODS ---

  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    if (this.USE_MOCK) {
       return {
         totalDealers: 45,
         totalBeneficiaries: 1240,
         totalDistributions: 8450,
         returnedKits: 102,
         trends: [
           { month: 'Jan', kits: 1200, dealers: 800 },
           { month: 'Feb', kits: 1890, dealers: 1200 },
           { month: 'Mar', kits: 2800, dealers: 2100 },
         ]
       };
    }
    try {
      const response = await this.requestRaw<any>('/admin/dashboard-stats', { method: 'GET' });
      const body = response.body;
      return {
        totalDealers: parseInt(body.totalDealers || '0'),
        totalBeneficiaries: parseInt(body.activeBeneficiaries || '0'),
        totalDistributions: parseInt(body.totalDistributions || '0'),
        returnedKits: parseInt(body.returnRate || '0'),
        trends: body.trends || []
      };
    } catch (e) {
      console.error("Stats fetch error:", e);
      return {
        totalDealers: 0,
        totalBeneficiaries: 0,
        totalDistributions: 0,
        returnedKits: 0,
        trends: []
      };
    }
  }

  async getDealers(): Promise<DealerInfo[]> {
    if (this.USE_MOCK) {
        return [
            { 
              id: 1, name: "Shivaji Dealer", username: "shivaji_well", companyName: "Shivaji Wellness", handle: "shivaji_well", 
              email: "contact@shivaji.co.in", phone: "9876543210", location: "Mumbai", address: "123 Victory Lane",
              city: "Mumbai", state: "Maharashtra", pincode: "400001", contactPerson: "Rajesh Patil", 
              contactPhone: "9876543210", activeStatus: "Active", isOnline: true, isEnabled: true
            },
            { 
              id: 2, name: "Sahyadri Dealer", username: "sahyadri_well", companyName: "Sahyadri Wellness", handle: "sahyadri_well",
              email: "contact@sahyadri.in", phone: "9123456780", location: "Pune", address: "45 Hill View",
              city: "Pune", state: "Maharashtra", pincode: "411001", contactPerson: "Anil Deshmukh",
              contactPhone: "9123456780", activeStatus: "Inactive", isOnline: false, isEnabled: false
            }
        ];
    }
    return this.request<any[]>('/admin/dealers').then(dealers => {
      console.log("DEBUG: /admin/dealers raw response:", dealers);
      return dealers.map((d: any) => {
        // Robust ID extraction
        const raw_id = d.id !== undefined ? d.id : (d._id !== undefined ? d._id : (d.dealer_id !== undefined ? d.dealer_id : (d.user_id !== undefined ? d.user_id : '?')));
        return {
          id: String(raw_id),
          name: d.name || d.dealerName || 'Unknown Dealer',
          companyName: d.companyName || d.agencyName || '',
          phone: d.phone || '',
          email: d.email || '',
          handle: d.handle || d.username || d.dealerHandle || '',
          location: d.location || '',
          address: d.address || '',
          city: d.city || '',
          state: d.state || '',
          pincode: d.pincode || '',
          contactPerson: d.contactPerson || '',
          contactPhone: d.contactPhone || '',
          activeStatus: d.active_status || d.activeStatus || (d.is_enabled || d.isOnline ? 'Active' : 'Offline') || 'N/A',
          isOnline: !!(d.is_active || d.isOnline || d.active_status === 'Active' || d.activeStatus === 'Active'),
          isEnabled: !!(d.is_enabled || d.isEnabled || d.active_status !== 'Disabled')
        } as DealerInfo;
      });
    });
  }

  async getDealer(id: string): Promise<DealerInfo> {
    if (this.USE_MOCK) {
        const dealers = await this.getDealers();
        const d = dealers.find(x => x.id.toString() === id.toString());
        if (d) return d;
        throw new Error("Dealer not found");
    }
    const d = await this.request<any>(`/admin/dealers/${id}`);
    const raw_id = d.id !== undefined ? d.id : (d.dealer_id || d.user_id || id);
    return {
      id: String(raw_id),
      name: d.name || d.dealerName || 'Unknown Dealer',
      companyName: d.companyName || d.agencyName || '',
      phone: d.phone || '',
      email: d.email || '',
      handle: d.handle || d.username || d.dealerHandle || '',
      location: d.location || '',
      address: d.address || '',
      city: d.city || '',
      state: d.state || '',
      pincode: d.pincode || '',
      contactPerson: d.contactPerson || '',
      contactPhone: d.contactPhone || '',
      activeStatus: d.active_status || d.activeStatus || 'N/A',
      isOnline: !!(d.is_active || d.isOnline || d.active_status === 'Active'),
      isEnabled: !!(d.is_enabled || d.isEnabled || d.active_status !== 'Disabled')
    } as DealerInfo;
  }

  async getBeneficiaries(): Promise<any[]> {
    if (this.USE_MOCK) {
        return [
            { 
              id: '1', name: 'Arjun Sharma', pds_card_no: 'PDS/MH/1123', pds_verified: true, 
              phone: '9876543210', email: 'arjun@example.com', dealer_name: 'Shivaji Dealer', 
              location_name: 'Mumbai', pds_linked_at: '15/03/2026' 
            },
            { 
              id: '2', name: 'Sunita Devi', pds_card_no: 'PDS/DL/9982', pds_verified: true, 
              phone: '9123456789', email: 'sunita@example.com', dealer_name: 'Sahyadri Dealer', 
              location_name: 'Pune', pds_linked_at: '10/03/2026' 
            },
            { 
              id: '3', name: 'Karan Singh', pds_card_no: 'PDS/KA/4451', pds_verified: false, 
              phone: '8877665544', email: 'karan@example.com', dealer_name: 'None', 
              location_name: 'Bangalore', pds_linked_at: null 
            }
        ];
    }
    const list = await this.request<any[]>('/admin/beneficiaries');
    return list.map((b: any) => ({
      ...b,
      id: String(b.id || b._id || b.beneficiary_id || '?'),
      name: b.name || b.fullName || 'N/A',
      pds_card_no: b.pds_card_no || b.rationId || b.pdsCardNo || null,
      pds_verified: !!(b.pds_verified || b.isActive || b.isVerified),
      phone: b.phone || b.phoneNumber || null,
      email: b.email || null,
      dealer_name: b.dealer_name || b.dealerName || null,
      location_name: b.location_name || b.location || null,
      pds_linked_at: b.pds_linked_at || b.createdAt || b.date || null
    }));
  }

  async getBeneficiary(id: string): Promise<any> {
    if (this.USE_MOCK) {
        // Look for the beneficiary in mock data
        const mockBeneficiaries = [
            {
                id: '1',
                name: 'Rajesh Kumar',
                username: '@rajesh_k',
                pdsCardNo: 'PDS/MH/12345',
                age: 45,
                gender: 'Male',
                phone: '+91 98765 43210',
                email: 'rajesh.kumar@email.com',
                location: 'Mumbai, Maharashtra',
                address: '123, Navyug Nagar, Forjett Hill Road, Tardeo, Mumbai 400036',
                education: 'Secondary School',
                employment: 'Self-employed',
                createdAt: '15/03/2026',
                status: 'GIVEN',
                createdByName: 'Shivaji',
                createdByRole: 'Dealer',
                pdsCardFront: '/temp/pds_front.jpg',
                pdsCardBack: '/temp/pds_back.jpg',
                adminNote: 'Verified resident of Mumbai cluster.',
                familyMembers: [
                  { id: 'f1', name: 'Saritha Kumar', age: 40, relation: 'Spouse' },
                  { id: 'f2', name: 'Rahul Kumar', age: 12, relation: 'Son' }
                ],
                history: [
                  {
                    id: 'h1',
                    name: 'Hygiene Kit V2',
                    type: 'Standard',
                    quantity: '2 Units',
                    date: '15/03/2026',
                    status: 'GIVEN',
                    givenBy: 'Shivaji',
                    notes: 'Regular monthly distribution.'
                  }
                ]
            },
            {
                id: '2',
                name: 'Priya Sharma',
                username: '@priya_sh',
                pdsCardNo: 'PDS/DL/98765',
                age: 32,
                gender: 'Female',
                phone: '+91 99887 76655',
                email: 'priya.s@email.com',
                location: 'Delhi, NCR',
                address: 'B-45, Lajpat Nagar II, New Delhi 110024',
                education: 'Graduate',
                employment: 'Private Employee',
                createdAt: '10/03/2026',
                status: 'PENDING',
                createdByName: 'Admin',
                createdByRole: 'Admin',
                familyMembers: [],
                history: []
            }
        ];
        const b = mockBeneficiaries.find(x => x.id.toString() === id.toString());
        if (b) return b;
        throw new Error("Beneficiary not found");
    }
    const data = await this.request<any>(`/admin/beneficiaries/${id}`);
    return {
      ...data,
      id: String(data.id ?? id),
      name: data.name || data.fullName || 'N/A',
      username: data.username || '',
      pdsCardNo: data.pds_card_no || data.pdsCardNo || data.rationId || 'N/A',
      phone: data.phone || data.contactPhone || 'N/A',
      email: data.email || 'N/A',
      location: data.location || data.locationName || 'N/A',
      address: data.address || 'N/A',
      age: data.age || 0,
      gender: data.gender || 'N/A',
      education: data.education || 'N/A',
      employment: data.employment || 'N/A',
      status: data.status || 'PENDING',
      createdAt: data.created_at || data.createdAt || 'N/A',
      createdByName: data.created_by_name || data.createdByName || 'System',
      createdByRole: data.created_by_role || data.createdByRole || 'Admin',
      pdsCardFront: data.pds_card_front || data.pdsCardFront,
      pdsCardBack: data.pds_card_back || data.pdsCardBack,
      familyMembers: (data.familyMembers || data.family_members || []).map((m: any) => ({
        ...m,
        id: String(m.id || ''),
        name: m.name || m.member_name || m.memberName || 'N/A',
        memberName: m.memberName || m.member_name || m.name || 'N/A',
        age: m.age || 0,
        relation: m.relation || 'N/A',
        score: m.score ?? 0,
        riskLevel: m.riskLevel || (m.age > 40 ? "Medium" : "Low")
      })),
      history: (data.history || []).map((h: any) => ({
        id: String(h.id || ''),
        name: h.name || h.kitName || 'Kit',
        type: h.type || h.kitType || 'Standard',
        quantity: h.quantity || 'N/A',
        date: h.date || h.distributedAt || 'N/A',
        status: h.status || 'GIVEN',
        givenBy: h.givenBy || h.distributedBy || 'N/A',
        notes: h.notes || h.adminNote
      }))
    };
  }

  async updateBeneficiaryStatus(id: string, request: { status: string, note?: string }): Promise<any> {
    if (this.USE_MOCK) return { success: true, message: "Status updated (mock)" };
    return this.request<any>(`/admin/beneficiaries/${id}/status`, {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async getAdminNotifications(): Promise<AdminNotification[]> {
    if (this.USE_MOCK) {
      return [
        { id: '1', message: 'New beneficiary registered', type: 'success', timestamp: '5 min ago' },
      ];
    }
    const res = await this.requestRaw<AdminNotification[]>('/admin/notifications');
    return res.body || [];
  }

  async getAdminDistributions(): Promise<AdminDistributionDto[]> {
    if (this.USE_MOCK) {
        return ApiService.MOCK_DISTRIBUTIONS as any;
    }
    const body = await this.request<any[]>('/admin/distributions');
    // Map backend keys to Distribution interface items
    return body.map((d: any) => ({
        id: d.id,
        beneficiary_name: d.beneficiary_name || d.beneficiaryName,
        pds_card_no: d.pds_card_no || d.pdsCardNo || '',
        dealer_name: d.dealer_name || d.dealerName,
        brush_received: d.brush_received || 0,
        paste_received: d.paste_received || 0,
        iec_received: d.iec_received || 0,
        confirmed_at: d.confirmed_at || d.date,
        status: d.status || 'GIVEN'
    }));
  }

  async getAdminStockRequests(): Promise<Response<AdminStockRequestDto[]>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: ApiService.MOCK_STOCK_REQUESTS };
    }
    const res = await this.requestRaw<AdminStockRequestDto[]>('/admin/stock-requests');
    if (res.isSuccessful && res.body) {
        res.body = res.body.map((req: any) => ({
            ...req,
            requestId: req.request_id || req.requestId,
            dealerId: req.dealer_id || req.dealerId,
            dealerName: req.dealer_name || req.dealerName,
            kitType: req.item_name || req.kitType || "Health Kit",
            quantity: req.requested_quantity || req.quantity,
            requestDate: req.requested_at || req.requestDate
        }));
    }
    return res;
  }

  async getStockRequestDetailsSync(id: number): Promise<Response<AdminStockRequestDto>> {
    const idx = ApiService.MOCK_STOCK_REQUESTS.findIndex(r => r.id === id);

    if (this.USE_MOCK) {
      if (idx !== -1) {
        const req = ApiService.MOCK_STOCK_REQUESTS[idx];
        return { isSuccessful: true, body: { ...req } as any };
      }
      return { isSuccessful: false, code: 404, errorBody: { string: () => "Not found" } };
    }

    const res = await this.requestRaw<any>(`/admin/stock-requests/${id}`);

    if (res.isSuccessful && res.body) {
      const r = res.body as any;

      return {
        ...res,
        body: {
          ...r,
          requestId: r.request_id || r.requestId,
          dealerId: r.dealer_id || r.dealerId,
          dealerName: r.dealer_name || r.dealerName,
          dealerAddress: r.dealer_address || r.dealerAddress,
          dealerUsername: r.dealer_username || r.dealerUsername,
          contactPhone: r.contact_phone || r.contactPhone,
          kitType: r.kit_type || r.kitType || r.item_name,
          quantity: r.quantity || r.requested_quantity,
          requestDate: r.request_date || r.requestDate || r.requested_at,
          requestedAt: r.requested_at || r.requestedAt,
          approvedAt: r.approved_at || r.approvedAt,
          rejectedAt: r.rejected_at || r.rejectedAt,
          dispatchedAt: r.dispatched_at || r.dispatchedAt,
          deliveredAt: r.delivered_at || r.deliveredAt,
          adminNote: r.admin_note,
          courierName: r.courier_name || r.courierName,
          trackingId: r.tracking_id || r.trackingId,
          dispatchAddress: r.dispatch_address || r.dispatchAddress,
          dispatchCity: r.dispatch_city || r.dispatchCity,
          dispatchState: r.dispatch_state || r.dispatchState,
        } as any
      };
    }

    return res as Response<AdminStockRequestDto>;
  }

  async approveStockRequest(id: number): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
      const idx = ApiService.MOCK_STOCK_REQUESTS.findIndex(r => r.id === id);
      if (idx !== -1) ApiService.MOCK_STOCK_REQUESTS[idx].status = 'APPROVED';
      return { isSuccessful: true, body: { message: "Approved (Mock)" } };
    }
    return this.requestRaw<{ message: string }>(`/admin/approve-stock/${id}`, { 
      method: 'PUT',
      body: JSON.stringify({ admin_note: "Approved via Admin Web" })
    });
  }

  async dispatchStockRequest(id: number, body: DispatchStockRequestBody): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        const req = ApiService.MOCK_STOCK_REQUESTS.find(r => r.id === id);
        if (req) {
            req.status = "DISPATCHED";
            req.courierName = body.courierName;
            req.trackingId = body.trackingId;
            req.adminNote = body.adminNote;
        }
        return { isSuccessful: true, body: { message: "Stock dispatched successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/admin/dispatch-stock/${id}`, { 
      method: 'PUT',
      body: JSON.stringify({
        courier_name: body.courierName,
        tracking_id: body.trackingId,
        admin_note: body.adminNote
      })
    });
  }

  async rejectStockRequest(id: number, body: RejectStockRequestBody): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        const req = ApiService.MOCK_STOCK_REQUESTS.find(r => r.id === id);
        if (req) {
            req.status = "REJECTED";
            req.adminNote = body.reason || undefined;
        }
        return { isSuccessful: true, body: { message: "Stock request rejected" } };
    }
    return this.requestRaw<{ message: string }>(`/admin/reject-stock/${id}`, { 
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  // --- AUTH METHODS ---

  async adminLogin(request: any): Promise<Response<any>> {
    if (this.USE_MOCK) {
        return { 
            isSuccessful: true, 
            body: { 
                message: "Login successful", 
                admin_id: 1,
                access_token: "mock_admin_token", 
                name: "Admin User",
                email: request.email 
            } 
        };
    }
    return this.requestRaw<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async dealerLogin(request: any): Promise<Response<any>> {
    if (this.USE_MOCK) {
        return { 
            isSuccessful: true, 
            body: { 
                message: "Login successful", 
                dealer_id: 1, 
                name: "Shivaji Dealer", 
                email: request.email, 
                phone: "9876543210", 
                access_token: "mock_dealer_token",
                dealer_qr_value: "DLR-1-ABC12345"
            } 
        };
    }
    return this.requestRaw<any>('/dealer/login', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async userLogin(request: any): Promise<Response<any>> {
    if (this.USE_MOCK) {
        return { 
            isSuccessful: true, 
            body: { 
                message: "Login successful", 
                user_id: 1, 
                name: "Rahul Kumar", 
                email: request.email, 
                phone: "9123456789", 
                pds_verified: true,
                assigned_dealer_id: 1,
                access_token: "mock_user_token" 
            } 
        };
    }
    return this.requestRaw<any>('/user/login', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  // --- DEALER METHODS ---

  async getDealerDashboardStats(dealerId: number): Promise<Response<DealerDashboardStats>> {
    const response = await this.requestRaw<any>(`/dealer/dashboard-stats/${dealerId}`);
    
    if (response.isSuccessful && response.body) {
        const b = response.body;
        // Backend returns camelCase keys; also handle snake_case for robustness
        const body: DealerDashboardStats = {
            todayDistributions: b.todayDistributions ?? b.today_distributions ?? 0,
            performancePercentage: b.performancePercentage ?? b.performance_percentage ?? 0,
            totalKits: String(b.totalKits ?? b.total_kits ?? 0),
            distributedKits: String(b.distributedKits ?? b.distributed_kits ?? 0),
            remainingKits: String(b.remainingKits ?? b.remaining_kits ?? 0),
            returnedKits: String(b.returnedKits ?? b.returned_kits ?? 0),
            recentTransactions: (b.recentTransactions || b.recent_transactions || []).map((tx: any) => ({
                id: String(tx.id),
                name: tx.beneficiary_name || tx.beneficiaryName || tx.name || "Unknown",
                details: tx.items_summary || tx.itemsSummary || tx.details || "",
                quantity: String(tx.quantity || 1),
                timestamp: tx.time || tx.timestamp || ""
            }))
        };
        return { isSuccessful: true, body };
    }
    return { isSuccessful: false, errorBody: response.errorBody };
  }

  async getDealerStockRequests(dealerId: number): Promise<Response<AdminStockRequestDto[]>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: ApiService.MOCK_STOCK_REQUESTS.filter(r => r.dealer_id === dealerId) };
    }
    // Reverting to the working admin endpoint since dealer-specific ones are 404
    const res = await this.requestRaw<AdminStockRequestDto[]>('/admin/stock-requests');
    if (res.isSuccessful && res.body) {
        // Filter by dealerId on the frontend and standardize mapping
        res.body = res.body
            .filter((req: any) => Number(req.dealer_id) === Number(dealerId))
            .map((req: any) => ({
                ...req,
                requestId: req.request_id || req.requestId,
                dealerId: req.dealer_id || req.dealerId,
                dealerName: req.dealer_name || req.dealerName,
                kitType: req.item_name || req.kitType || req.kit_type || "Health Kit",
                // quantity is often "10 Units" in live data; total_kits is also present
                quantity: req.quantity || (req.total_kits ? `${req.total_kits} Units` : '0 Units'),
                // requestDate mapping from request_date (live db) or requested_at
                requestDate: req.request_date || req.requested_at || req.requestDate || 'N/A'
            }));
    }
    return res;
  }

  async getDealerStockDetailed(dealerId: number): Promise<StockItem[]> {
    const res = await this.getDealerStockRequests(dealerId);
    if (res.isSuccessful && res.body) {
        const aggregated: StockItem[] = res.body.map(req => ({
            itemName: req.kitType || 'Item',
            quantity: 0, // Current inventory quantity is not directly available, defaulting to 0 for display
            requestedQuantity: parseInt(String(req.quantity || '0')) || 0,
            status: req.status || 'PENDING',
            requestedAt: req.requestDate || 'N/A'
        }));
        return aggregated;
    }
    return [];
  }

  async getDealerProfile(_token: string, dealerId: number): Promise<Response<DealerProfileResponse>> {
    if (this.USE_MOCK) {
        return {
            isSuccessful: true,
            body: {
                id: dealerId,
                name: "Shivaji Dealer",
                username: "@shivaji",
                handle: "shivaji_dist",
                phone: "9876543210",
                email: "shivaji@example.com",
                location: "Mumbai",
                address: "123, Navyug Nagar, Tardeo",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400036",
                contactPerson: "Shivaji Raonane",
                contactPhone: "9876543211",
                activeStatus: "ACTIVE",
                isOnline: true,
                isEnabled: true,
                companyName: "Shivaji Distributions",
                profileImage: "",
                dealer_qr_value: "DLR-1-ABC12345"
            }
        };
    }
    return this.requestRaw<DealerProfileResponse>(`/dealer/profile/${dealerId}`);
  }


  async updateDealerProfileImage(_token: string, dealerId: number, formData: FormData): Promise<Response<{ message: string, profileImage: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Image uploaded", profileImage: "/temp/profile.jpg" } };
    }
    return this.requestRaw<{ message: string, profileImage: string }>(`/dealer/profile-image/${dealerId}`, {
        method: 'POST',
        body: formData
    });
  }

  async verifyBeneficiary(rationId: string, dealerId: number): Promise<Response<{ valid: boolean, message: string, beneficiary?: any }>> {
    const response = await this.requestRaw<any>(`/dealer/validate-beneficiary?rationId=${rationId}&dealerId=${dealerId}`);

    // Fallback: If the backend endpoint doesn't exist (404), emulate the validation logic securely on the client
    if (!response.isSuccessful && response.code === 404) {
        try {
            // Strictly check against the dealer's specific beneficiary list
            const dealerBeneficiaries = await this.getDealerBeneficiaries(dealerId);
            const b = dealerBeneficiaries.find((x: any) => 
                 x.pds_card_no === rationId || 
                 x.rationId === rationId || 
                 x.id === rationId 
            );

            if (b) {
                return {
                    isSuccessful: true,
                    body: {
                        valid: true,
                        message: "Valid Identity",
                        beneficiary: {
                            id: b.id,
                            name: b.name,
                            familyMembers: [] // Optional fallback for family members
                        }
                    }
                };
            }

            // If not found in the dealer's list, check if it exists globally to provide correct error message
            const allBeneficiaries = await this.getBeneficiaries();
            const exists = allBeneficiaries.find(x => 
                 x.pds_card_no === rationId || 
                 x.rationId === rationId || 
                 x.id === rationId 
            );

            if (exists) {
                return { isSuccessful: true, body: { valid: false, message: "INVALID ACCESS: Beneficiary is not registered under your dealership." } };
            } else {
                return { isSuccessful: true, body: { valid: false, message: "INVALID IDENTIFICATION: PDS card is not registered." } };
            }
        } catch (e) {
            return { isSuccessful: false, errorBody: { string: () => "Failed to fetch beneficiaries for validation" } };
        }
    }

    if (response.isSuccessful && response.body) {
        // Support both nested beneficiary object and flat properties from Python backend
        const b = response.body.beneficiary || response.body;
        
        // Only enforce if the backend explicitly attached a mismatched dealer field
        if (b.dealer_id !== undefined && b.dealer_id !== null) {
             const assignedDealer = String(b.dealer_id);
             if (assignedDealer !== String(dealerId)) {
                 return { isSuccessful: true, body: { valid: false, message: "INVALID ACCESS: Beneficiary is not registered under your dealership." } };
             }
        }

        response.body.beneficiary = {
            id: b.id || b.beneficiary_id || rationId,
            name: b.name || b.beneficiary_name || b.beneficiaryName || "Unknown Beneficiary",
            familyMembers: (b.family_members || b.familyMembers || []).map((m: any) => ({
                id: m.id,
                memberName: m.member_name || m.memberName || m.name || "Member",
                relation: m.relation || "Dependent",
                age: m.age || 0,
                kitType: m.kit_type || m.kitType || ((m.age && m.age > 12) ? "Adult Kit" : "Child Kit")
            }))
        };
    }
    return response;
  }

  async getDealerHousehold(userId: number): Promise<Response<DealerHouseholdResponse>> {
    return this.requestRaw<DealerHouseholdResponse>(`/dealer/household-details/${userId}`);
  }

  async requestStock(request: StockRequestBody): Promise<Response<StockRequestResponse & { requestId: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Request sent", requestGroupId: "GRP-MOCK", requestId: "REQ-MOCK" } };
    }
    return this.requestRaw<StockRequestResponse & { requestId: string }>('/dealer/request-stock', {
        method: 'POST',
        body: JSON.stringify({
          dealer_id: request.dealerId,
          total_kits: request.totalKits,
          urgency: request.urgency
        })
    });
  }

  async changeDealerPassword(_token: string, request: ChangePasswordRequest): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Password changed" } };
    }
    return this.requestRaw<{ message: string }>('/dealer/change_password', {
        method: 'POST',
        body: JSON.stringify(request)
    });
  }

  async getDealerBeneficiaries(dealerId: number): Promise<Beneficiary[]> {
    const list = await this.request<any[]>(`/dealer/${dealerId}/beneficiaries`);
    return list.map(b => ({
      id: String(b.id || '?'),
      name: b.name || 'Unknown',
      pds_card_no: b.ration_id || b.pds_card_no || '',
      pds_verified: b.is_active || false,
      phone: b.phone || '',
      dealer_name: b.dealer_name || '',
      location_name: b.location_name || '',
      isActive: b.is_active || false,
      dealerId: b.dealer_id || dealerId
    }));
  }

  async getDealerBeneficiary(id: string): Promise<any> {
    const data = await this.request<any>(`/dealer/beneficiary/${id}`);
    return {
      ...data,
      id: String(data.id ?? id),
      name: data.name || data.fullName || 'N/A',
      username: data.username || '',
      pdsCardNo: data.pds_card_no || data.pdsCardNo || data.rationId || 'N/A',
      phone: data.phone || data.contactPhone || 'N/A',
      email: data.email || 'N/A',
      location: data.location || data.locationName || 'N/A',
      address: data.address || 'N/A',
      age: data.age || 0,
      gender: data.gender || 'N/A',
      education: data.education || 'N/A',
      employment: data.employment || 'N/A',
      status: data.status || 'PENDING',
      createdAt: data.created_at || data.createdAt || 'N/A',
      createdByName: data.created_by_name || data.createdByName || 'System',
      createdByRole: data.created_by_role || data.createdByRole || 'Admin',
      pdsCardFront: data.pds_card_front || data.pdsCardFront,
      pdsCardBack: data.pds_card_back || data.pdsCardBack,
      familyMembers: data.family_members?.map((m: any) => ({
        id: String(m.id || Math.random()),
        name: m.name || m.member_name || 'N/A',
        age: m.age || 0,
        relation: m.relation || 'Dependent'
      })) || [],
      history: data.history?.map((h: any) => ({
        ...h,
        id: String(h.id || Math.random()),
        date: h.date || h.created_at || 'N/A',
        status: h.status || 'PENDING'
      })) || []
    };
  }



  async getUserProfile(userId: number): Promise<any> {
    if (this.USE_MOCK) return { id: userId, name: "Mock User" };
    try {
        const ben = await this.getBeneficiary(String(userId));
        // Normalize profile image URL
        if (ben && ben.profile_image && !ben.profile_image.startsWith('http')) {
            ben.profile_image = `${this.baseUrl}/${ben.profile_image}`;
        }
        return ben;
    } catch (e) {
        return { id: userId, name: "User" };
    }
  }

  async updateUserProfile(userId: number, data: any): Promise<any> {
    return this.request<any>(`/user/update-profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
  }

  async updateUserProfileImage(userId: number, formData: FormData): Promise<Response<{ message: string, profileImage: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Image uploaded successfully", profileImage: "/temp/mock-user.jpg" } };
    }
    return this.requestRaw<{ message: string, profileImage: string }>(`/api/user/upload-profile-picture/${userId}`, {
        method: 'POST',
        body: formData
    });
  }

  async deleteUserAccount(userId: number): Promise<Response<{ message: string }>> {
    return this.requestRaw<{ message: string }>(`/api/user/delete-account/${userId}`, {
      method: 'DELETE'
    });
  }

  async confirmKitByDealerQR(
    beneficiaryId: number,
    dealerQRValue: string,
    brushReceived?: number,
    pasteReceived?: number,
    iecReceived?: number,
    oldKitReturned?: boolean
  ): Promise<Response<any>> {
    if (this.USE_MOCK) {
      return {
        isSuccessful: true,
        body: {
          message: "Kit confirmed successfully",
          data: {
            kit_unique_id: "mock-kit-id",
            brush_received: brushReceived ?? 1,
            paste_received: pasteReceived ?? 1,
            iec_received: iecReceived ?? 1,
            old_kit_returned: oldKitReturned ?? false
          }
        }
      };
    }

    const payload: Record<string, any> = {
      beneficiary_id: beneficiaryId,
      dealer_qr_value: dealerQRValue,
    };
    if (brushReceived !== undefined) payload.brush_received = brushReceived;
    if (pasteReceived !== undefined) payload.paste_received = pasteReceived;
    if (iecReceived !== undefined) payload.iec_received = iecReceived;
    if (oldKitReturned !== undefined) payload.old_kit_returned = oldKitReturned;

    return this.requestRaw<any>(`/user/confirm-kit-by-dealer-qr`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getKitDetails(kitUniqueId: string): Promise<any> {
    return this.request<any>(`/dealer/kit-received/${kitUniqueId}`);
  }

  async verifyDealerQR(qrValue: string): Promise<any> {
    return this.request<any>(`/dealer/verify-qr`, {
        method: 'POST',
        body: JSON.stringify({ dealer_qr_value: qrValue })
    });
  }


  async getDealerDistributionHistory(dealerId: number): Promise<Response<DealerDistributionHistoryResponse[]>> {
    const response = await this.requestRaw<any[]>(`/dealer/distribution-history/${dealerId}`);
    
    if (response.isSuccessful && response.body) {
        const mapped: DealerDistributionHistoryResponse[] = response.body.map(item => ({
            id: item.kit_unique_id || String(item.id),
            beneficiaryName: item.beneficiary_name || "Unknown",
            date: item.date || "",
            time: item.time || "",
            status: item.status || "VERIFIED",
            itemsSummary: item.items_summary || "",
            items: [], // Legacy field
            oldKitReturned: !!item.old_kit_returned
        }));
        return { isSuccessful: true, body: mapped };
    }
    return { isSuccessful: false, errorBody: response.errorBody };
  }

  async dealerConfirmDistribution(request: DealerManualDistributionRequest): Promise<Response<{ message: string }>> {
    return this.requestRaw<{ message: string }>('/dealer/confirm-distribution', {
      method: 'POST',
      body: JSON.stringify({
        dealer_id: request.dealerId,
        beneficiary_id: request.beneficiaryId,
        brush_received: request.brushReceived,
        paste_received: request.pasteReceived,
        iec_received: request.iecReceived,
        old_kit_returned: request.oldKitReturned
      })
    });
  }

  async registerHousehold(request: {
    beneficiary: any,
    members: any[],
    cardFront: File | Blob | string | null,
    cardBack: File | Blob | string | null
  }): Promise<Response<{ message: string, userId: number }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Household registered successfully", userId: 999 } };
    }
    const formData = new FormData();
    const data = request.beneficiary;
    formData.append('dealer_id', data.dealerId);
    formData.append('name', data.fullName);
    if (data.email) formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('pds_card_no', data.pdsCard);
    formData.append('age', data.age);
    formData.append('gender', data.gender);
    formData.append('education', data.education);
    formData.append('employment', data.employment);
    formData.append('address', data.streetAddress);
    
    formData.append('members', JSON.stringify(request.members));
    if (request.cardFront instanceof File || request.cardFront instanceof Blob) {
        formData.append('pds_front', request.cardFront);
    }
    if (request.cardBack instanceof File || request.cardBack instanceof Blob) {
        formData.append('pds_back', request.cardBack);
    }

    return this.requestRaw<{ message: string, userId: number }>('/dealer/register-household', {
      method: 'POST',
      body: formData
    });
  }

  async registerDealerHousehold(
    dealerId: string, name: string, email: string | null, phone: string, 
    identityCardNo: string, members: string, front: File | Blob | null, back: File | Blob | null
  ): Promise<Response<{ message: string, userId: number }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Household registered successfully", userId: 999 } };
    }
    const formData = new FormData();
    formData.append('dealerId', dealerId);
    formData.append('name', name);
    if (email) formData.append('email', email);
    formData.append('phone', phone);
    formData.append('identityCardNo', identityCardNo);
    formData.append('members', members);
    if (front) formData.append('front', front);
    if (back) formData.append('back', back);

    return this.requestRaw<{ message: string, userId: number }>('/dealer/register-household', {
      method: 'POST',
      body: formData
    });
  }

  // --- USER METHODS ---

  async userRegister(request: RegisterRequest): Promise<Response<RegisterResponse>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Registration successful", userId: 123, access_token: "mock_token" } };
    }
    
    // Always use FormData to support profile picture
    const formData = new FormData();
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'profile_image' && (value instanceof File || value instanceof Blob)) {
           formData.append('profile_image', value);
        } else {
           formData.append(key, value.toString());
        }
      }
    });

    return this.requestRaw<RegisterResponse>('/api/user/register', {
      method: 'POST',
      // No manual Content-Type for FormData
      body: formData
    });
  }

  async linkIdentityCard(request: LinkIdentityRequest): Promise<Response<LinkIdentityResponse>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Identity card linked successfully", nextStep: "VERIFIED" } };
    }
    return this.requestRaw<LinkIdentityResponse>('/user/link-identity', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async selectLocation(request: SelectLocationRequest): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Location selected successfully" } };
    }
    return this.requestRaw<{ message: string }>('/api/user/select-dealer', {
      method: 'POST',
      body: JSON.stringify({
        user_id: request.userId,
        dealer_id: request.dealerId
      })
    });
  }

  async confirmKitReceipt(
    userId: number,
    dealerQrValue: string,
    kitId: string,
    brushReceived: number,
    pasteReceived: number,
    iecReceived: number,
    oldKitReturned: boolean
  ): Promise<Response<any>> {
    if (this.USE_MOCK) {
      return { isSuccessful: true, body: { message: "Kit receipt confirmed successfully" } };
    }
    return this.requestRaw<any>('/user/confirm-kit', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        dealer_qr_value: dealerQrValue,
        kit_unique_id: kitId,
        brush_received: brushReceived,
        paste_received: pasteReceived,
        iec_received: iecReceived,
        old_kit_returned: oldKitReturned
      })
    });
  }

  async getLocations(): Promise<Response<Location[]>> {
    // 1. Fetch live dealers from the 'dealers' table (as created by admin)
    if (!this.USE_MOCK) {
        try {
            const res = await this.requestRaw<any[]>('/admin/dealers');
            
            if (res.isSuccessful && res.body && res.body.length > 0) {
                return {
                    isSuccessful: true,
                    body: res.body.map((d: any) => ({
                        // Robust ID extraction mapping to the expected backend schema
                        id: d.id || d.dealer_id || d.user_id,
                        location_name: d.location || d.city || d.location_name || "PDS Distribution Center",
                        dealer_name: d.name || d.dealerName || d.dealer_name || "Assigned Dealer"
                    }))
                };
            }
        } catch (e) {
            console.error("Live dealer fetch failed, attempting legacy locations", e);
        }

        // 2. Fallback to legacy locations endpoint if dealers table is empty or fails
        try {
            const res = await this.requestRaw<any[]>('/user/locations');
            if (res.isSuccessful && res.body && res.body.length > 0) {
                return {
                    isSuccessful: true,
                    body: res.body.map((loc: any) => ({
                        id: loc.id,
                        location_name: loc.location_name || loc.name || loc.location || "PDS Center",
                        dealer_name: loc.dealer_name || loc.dealer || loc.dealerName || "Assigned Dealer"
                    }))
                };
            }
        } catch (e) {}
    }

    // 3. Last resort: Mock Data
    return { 
        isSuccessful: true, 
        body: [
            { id: 1, location_name: "Mumbai Central", dealer_name: "Shivaji Distributions" },
            { id: 2, location_name: "Pune South", dealer_name: "Sahyadri Kits" },
            { id: 3, location_name: "Bangalore East", dealer_name: "Karnataka Wellness" },
            { id: 4, location_name: "Ahmedabad West", dealer_name: "Gujarat Health Hub" }
        ] 
    };
  }

  private mapFamilyMember(m: any): FamilyMemberResponse {
    return {
      id: m.id,
      memberName: m.memberName || m.member_name || m.name || "Member",
      relation: m.relation || "Relative",
      age: m.age || 0,
      brushingTarget: m.brushing_target || m.brushingTarget || 0,
      score: m.score ?? 0,
      riskLevel: m.riskLevel || (m.age > 40 ? "Medium" : "Low")
    };
  }

  private mapDistribution(d: any): KitReceivedSummary {
    return {
      id: String(d.id || d.kit_unique_id || ''),
      kit_unique_id: d.kit_unique_id || d.kitName || `KIT-${d.id}`,
      brushReceived:  d.brush_received  ?? d.brushReceived  ?? 0,
      pasteReceived:  d.paste_received  ?? d.pasteReceived  ?? 0,
      iecReceived:    d.iec_received    ?? d.iecReceived    ?? 0,
      confirmed_at:   d.confirmed_at    ?? d.date           ?? null,
      status:  d.status === 'GIVEN' || d.status === 'CONFIRMED'
        ? 'CONFIRMED'
        : (d.status || 'PENDING'),
      show_red_alert: !!(d.show_red_alert ?? false)
    };
  }

  async getFamilyMembers(userId: number): Promise<Response<FamilyMemberResponse[]>> {
    if (this.USE_MOCK) {
        return { 
            isSuccessful: true, 
            body: [
                { id: 101, memberName: "Rahul Kumar", relation: "Self", age: 32, score: 92, riskLevel: "Low" }
            ] 
        };
    }
    try {
        const ben = await this.getBeneficiary(String(userId));
        const members = (ben.familyMembers || []).map((m: any) => this.mapFamilyMember(m));
        return { isSuccessful: true, body: members };
    } catch (e) {
        return { isSuccessful: false, body: [] };
    }
  }

  async getUserDistributionHistory(userId: number): Promise<Response<KitReceivedSummary[]>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: [] };
    }
    try {
        // Try dedicated user distribution history endpoint first
        const directRes = await this.requestRaw<any>(`/user/distribution-history/${userId}`);
        if (directRes.isSuccessful && directRes.body) {
          const list = Array.isArray(directRes.body) ? directRes.body : (directRes.body.data || []);
          return { isSuccessful: true, body: list.map((h: any) => this.mapDistribution(h)) };
        }

        // Fallback: pull history from beneficiary detail endpoint
        const ben = await this.getBeneficiary(String(userId));
        const history = (ben.history || []).map((h: any) => this.mapDistribution(h));
        return { isSuccessful: true, body: history };
    } catch (e) {
        return { isSuccessful: false, body: [] };
    }
  }

  async addFamilyMember(request: { userId: number, name: string, age: number, relation: string }): Promise<Response<{ message: string, memberId: number }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Member added successfully", memberId: Math.floor(Math.random() * 1000) } };
    }
    return this.requestRaw<{ message: string, memberId: number }>('/api/family-members', {
      method: 'POST',
      body: JSON.stringify({
        user_id: request.userId,
        member_name: request.name,
        age: request.age,
        relation: request.relation
      })
    });
  }

  async updateFamilyMember(request: { memberId: number, name?: string, age?: number, relation?: string }): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Member updated successfully" } };
    }
    return this.requestRaw<{ message: string }>('/user/update-family-member', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async deleteFamilyMember(memberId: number, userId: number): Promise<Response<{ message: string }>> {
    const isMock = this.USE_MOCK;
    if (isMock) {
        return { isSuccessful: true, body: { message: "Member deleted successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/api/family-members/${memberId}?user_id=${userId}`, {
      method: 'DELETE'
    });
  }

  async submitBrushingCheckin(request: { userId: number, memberId: number | null, sessionMode: string }): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Check-in submitted successfully" } };
    }
    return this.requestRaw<any>('/user/checkin', {
      method: 'POST',
      body: JSON.stringify({
        user_id: request.userId,
        member_id: request.memberId,
        session: request.sessionMode.toUpperCase()
      })
    });
  }

  async getBrushingProgress(userId: number): Promise<Array<{ day: string, morning: boolean, evening: boolean, date: string }>> {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (this.USE_MOCK) {
        const today = new Date();
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            return {
                day: days[d.getDay()],
                morning: true,
                evening: i < 5,
                date: d.toISOString().split('T')[0]
            };
        });
    }
    
    try {
        const response = await this.requestRaw<any>(`/api/user/weekly-progress/${userId}`, { method: 'GET' });
        if (response.isSuccessful && response.body && response.body.sessions) {
            return response.body.sessions.map((session: any) => {
                const dateObj = new Date(session.date);
                return {
                    day: days[dateObj.getDay()],
                    morning: session.morning,
                    evening: session.evening,
                    date: session.date
                };
            });
        }
        
        // Fallback to empty week if response unsuccessful
        const today = new Date();
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            return {
                day: days[d.getDay()],
                morning: false,
                evening: false,
                date: d.toISOString().split('T')[0]
            };
        });
    } catch (e) {
        console.error("Failed to fetch real-time brushing progress:", e);
        return [];
    }
  }


  async getMemberAiReports(memberId: number): Promise<Response<MemberAiReport[]>> {
    if (this.USE_MOCK) {
      return {
        isSuccessful: true,
        body: []
      };
    }

    try {
      const userId = Number(localStorage.getItem("user_id"));
      if (!userId) {
        return {
          isSuccessful: false,
          code: 401,
          errorBody: { string: () => "User session not found" },
          body: []
        };
      }

      const response = await this.requestRaw<any>(
        `/api/member/${memberId}/latest-report?user_id=${userId}`
      );

      if (response.isSuccessful && response.body) {
        const r: any = response.body;

        let parsedAiResult: any = {
          message: "Analysis successful",
          reportId: 0,
          riskLevel: r.risk_level || "LOW",
          detections: []
        };

        try {
          parsedAiResult =
            typeof r.ai_result === "string" ? JSON.parse(r.ai_result) : r.ai_result;
        } catch {
          parsedAiResult = {
            message: "Analysis successful",
            reportId: 0,
            riskLevel: r.risk_level || "LOW",
            detections: []
          };
        }

        const rawDetections = (parsedAiResult.detections || []).map((d: any) => ({
          detectedClass: d.detectedClass || d.class || "Unknown",
          confidence: Number(d.confidence || 0),
          bbox: d.bbox || []
        }));

        // Deduplicate: Keep only the highest confidence detection for each class
        const uniqueDetectionsMap = new Map<string, any>();
        rawDetections.forEach((d: any) => {
          const existing = uniqueDetectionsMap.get(d.detectedClass);
          if (!existing || d.confidence > existing.confidence) {
            uniqueDetectionsMap.set(d.detectedClass, d);
          }
        });
        const finalDetections = Array.from(uniqueDetectionsMap.values());

        const mapped: MemberAiReport = {
          memberId: r.member_id ?? memberId,
          imagePath: r.image_path ? `${this.baseUrl}/${r.image_path}` : undefined,
          createdAt: r.created_at,
          riskLevel: r.risk_level || parsedAiResult.riskLevel || "LOW",
          aiResult: {
            message: parsedAiResult.message || "Analysis successful",
            reportId: parsedAiResult.reportId || 0,
            riskLevel: parsedAiResult.riskLevel || r.risk_level || "LOW",
            detections: finalDetections
          }
        };

        return {
          isSuccessful: true,
          body: [mapped]
        };
      }

      if (response.code === 404) {
        return {
          isSuccessful: true,
          body: []
        };
      }

      return {
        isSuccessful: false,
        code: response.code,
        errorBody: response.errorBody,
        body: []
      };
    } catch (e) {
      console.error("Failed to fetch member AI reports:", e);
      return {
        isSuccessful: false,
        code: 500,
        errorBody: { string: () => "Failed to fetch member AI reports" },
        body: []
      };
    }
  }

  async getMonthlyUsage(userId: number, _monthYear: string, memberId: number | null = null): Promise<Response<MonthlyUsageData[]>> {
    if (this.USE_MOCK) {
        return {
            isSuccessful: true,
            body: [
                { name: "Rahul Kumar", days: "28/31 Days", score: 92, progress: 90, pasteConsumption: "Normal", brushCondition: "Good" },
                { name: "Priya Kumar", days: "25/31 Days", score: 85, progress: 80, pasteConsumption: "Low", brushCondition: "Fair" }
            ]
        };
    }
    
    try {
        const url = memberId 
            ? `/api/user/monthly-usage/${userId}?member_id=${memberId}` 
            : `/api/user/monthly-usage/${userId}`;
            
        const res = await this.requestRaw<any>(url, { method: 'GET' });
        
        if (res.isSuccessful && res.body) {
            const body = res.body; // { total_completed, total_possible, sessions }
            const score = body.total_possible > 0 
                ? Math.round((body.total_completed / body.total_possible) * 100) 
                : 0;
            
            const mapping: MonthlyUsageData = {
                name: "Member", // To be filled by the page logic
                days: `${body.total_completed}/${Math.round(body.total_possible)} Sessions`,
                score: score,
                progress: score,
                pasteConsumption: score > 80 ? "Nominal" : score > 50 ? "Low" : "Abnormal",
                brushCondition: score > 70 ? "Good" : "Worn"
            };
            
            return { isSuccessful: true, body: [mapping] };
        }
        return { isSuccessful: false, body: [] };
    } catch (e) {
        console.error("Monthly Usage Sync Error:", e);
        return { isSuccessful: false, body: [] };
    }
  }

  // --- COMMON METHODS ---

  async viewClinics(): Promise<ClinicResponse[]> {
    if (this.USE_MOCK) {
      return ApiService.MOCK_CLINICS;
    }
    const body = await this.request<any[]>('/user/view-clinics');
    return body.map((c: any) => ({
      ...c,
      id: String(c.id || c.clinic_id || ''),
      clinicName: c.clinic_name || c.clinicName || 'Unnamed Clinic',
      clinicType: (c.clinic_type || c.clinicType || 'PHYSICAL') as ClinicType,
      address: c.address || 'N/A',
      district: c.district || 'N/A',
      contactNumber: c.contact_number || c.contactPhone || c.contactNumber || '',
      website: c.website_url || c.website || '',
      latitude: c.latitude || null,
      longitude: c.longitude || null
    }));
  }

  async addClinic(request: AddClinicRequest): Promise<Response<{ message: string, clinicId?: string }>> {
    if (this.USE_MOCK) {
        const newClinic: ClinicResponse = {
            id: "C-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
            clinicName: request.clinic_name,
            clinicType: request.clinic_type,
            address: request.address || 'N/A',
            district: request.district || 'N/A',
            contactNumber: request.contact_number,
            website: request.website,
            latitude: null,
            longitude: null
        };
        ApiService.MOCK_CLINICS.push(newClinic);
        return { isSuccessful: true, body: { message: "Clinic added successfully", clinicId: newClinic.id } };
    }
    return this.requestRaw<{ message: string, clinicId?: string }>('/admin/add-clinic', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async deleteClinic(clinicId: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        ApiService.MOCK_CLINICS = ApiService.MOCK_CLINICS.filter(c => c.id !== clinicId);
        return { isSuccessful: true, body: { message: "Clinic deleted successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/admin/delete-clinic/${clinicId}`, {
      method: 'DELETE'
    });
  }

  async deleteDealer(id: string | number): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Dealer deleted successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/admin/delete-dealer/${id}`, {
        method: 'DELETE'
    });
  }

  async deleteBeneficiary(id: string | number): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Beneficiary deleted successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/admin/delete-beneficiary/${id}`, {
        method: 'DELETE'
    });
  }

  async deleteAccount(userId: number): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Account deleted successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/user/delete/${userId}`, {
        method: 'DELETE'
    });
  }

  async updateBeneficiary(id: string | number, data: any): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Beneficiary updated successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/admin/update-beneficiary/${id}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
  }

  async registerBeneficiary(
    data: any, 
    members: string, 
    front: File | Blob | null, 
    back: File | Blob | null
  ): Promise<Response<{ message: string, userId: number }>> {
    const formData = new FormData();
    // Map data fields to backend expected names (snake_case)
    formData.append('dealer_id', data.dealerId);
    formData.append('name', data.fullName);
    if (data.email) formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('pds_card_no', data.pdsCard);
    formData.append('age', data.age);
    formData.append('gender', data.gender);
    formData.append('education', data.education);
    formData.append('employment', data.employment);
    formData.append('address', data.streetAddress);
    
    formData.append('members', members);
    if (front) formData.append('front', front);
    if (back) formData.append('back', back);

    return this.requestRaw<{ message: string, userId: number }>('/dealer/register-household', {
      method: 'POST',
      body: formData
    });
  }

  async getNearbyClinics(lat: number, lng: number): Promise<ClinicResponse[]> {
    if (this.USE_MOCK) {
      return ApiService.MOCK_CLINICS;
    }
    const body = await this.request<any[]>(`/user/nearby-clinics?lat=${lat}&lng=${lng}`);
    return body.map((c: any) => ({
      ...c,
      id: String(c.id || c.clinic_id || ''),
      clinicName: c.clinic_name || c.clinicName || 'Unnamed Clinic',
      clinicType: (c.clinic_type || c.clinicType || 'PHYSICAL') as ClinicType,
      address: c.address || 'N/A',
      district: c.district || 'N/A',
      contactNumber: c.contact_number || c.contactPhone || c.contactNumber || '',
      website: c.website_url || c.website || '',
      latitude: c.latitude || null,
      longitude: c.longitude || null
    }));
  }

  async updateDealerProfile(dealerId: number, request: ProfileUpdateRequest): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Profile updated successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/dealer/update-profile/${dealerId}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    });
  }

  async submitStockRequest(request: StockRequestBody): Promise<Response<StockRequestResponse & { requestId: string }>> {
    if (this.USE_MOCK) {
        const requestId = "REQ-" + Math.floor(10000 + Math.random() * 90000);
        // Find dealer name for mock
        const dealerName = request.dealerId === 1 ? "Shivaji Dealer" : "New Dealer";
        
        // Add to mock registry
        const newReq: AdminStockRequestDto = {
            id: ApiService.MOCK_STOCK_REQUESTS.length + 1,
            request_id: requestId,
            requestId: requestId,
            dealer_id: request.dealerId,
            dealerId: request.dealerId,
            dealer_name: dealerName,
            dealerName: dealerName,
            location: "Regional Hub",
            item_name: "Standard Mix",
            kitType: "Standard Mix",
            requested_quantity: request.brushQty + request.pasteQty,
            quantity: `${request.brushQty} Brushes, ${request.pasteQty} Paste`,
            status: "PENDING",
            requested_at: new Date().toISOString(),
            requestDate: new Date().toISOString()
        };
        ApiService.MOCK_STOCK_REQUESTS.push(newReq);

        return { 
            isSuccessful: true, 
            body: { 
                message: "Stock request submitted successfully", 
                requestId: requestId
            } 
        };
    }

    // REMapping to backend snake_case requirements
    // Keeping backend integrity for mobile/web shared systems.
    return this.requestRaw<StockRequestResponse & { requestId: string }>('/dealer/request-stock', {
      method: 'POST',
      body: JSON.stringify({
        dealer_id: request.dealerId,
        total_kits: request.totalKits,
        urgency: request.urgency
      })
    });
  }

  async confirmStockReceipt(dealerId: number, requestId: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        // Find all items with this requestId and mark as RECEIVED
        ApiService.MOCK_STOCK_REQUESTS.forEach(req => {
            if (req.requestId === requestId || req.request_id === requestId) {
                req.status = "RECEIVED";
            }
        });
        return { isSuccessful: true, body: { message: "Stock received successfully" } };
    }
    return this.requestRaw<{ message: string }>(`/dealer/confirm-delivery/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ dealer_id: dealerId })
    });
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<Response<ForgotPasswordResponse>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "OTP sent to registered phone", devCode: "123456" } };
    }
    const path = `/${request.userType || 'auth'}/forgot-password/send-otp`;
    return await this.requestRaw<ForgotPasswordResponse>(path, {
      method: 'POST',
      body: JSON.stringify({
        email: request.identifier.includes('@') ? request.identifier : undefined,
        phone: !request.identifier.includes('@') ? request.identifier : undefined,
        type: request.userType
      })
    });
  }

  async resetPassword(request: { identifier: string, otp: string, newPassword: string, userType: 'dealer' | 'user' }): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Password reset successfully" } };
    }
    const path = `/${request.userType}/forgot-password/reset`;
    return await this.requestRaw<{ message: string }>(path, {
      method: 'POST',
      body: JSON.stringify({
        email: request.identifier.includes('@') ? request.identifier : undefined,
        phone: !request.identifier.includes('@') ? request.identifier : undefined,
        otp: request.otp,
        new_password: request.newPassword,
        confirm_password: request.newPassword,
        type: request.userType
      })
    });
  }

  async changePassword(request: ChangePasswordRequest): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Password changed successfully" } };
    }
    return this.requestRaw<{ message: string }>('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        current_password: request.oldPassword || (request as any).currentPassword,
        new_password: request.newPassword
      })
    });
  }

  async analyzeTeeth(image: File | Blob, userId: string, memberId: string): Promise<AiPredictionResponse> {
    if (this.USE_MOCK) {
        return {
            message: "Mock analysis complete",
            reportId: 999,
            riskLevel: "Low",
            detections: [
                { detectedClass: "Healthy", confidence: 0.95, bbox: [0,0,0,0] }
            ]
        };
    }
    const formData = new FormData();
    formData.append("image", image, "teeth.jpg");
    formData.append("user_id", userId);
    formData.append("member_id", memberId);

    const res = await this.requestRaw<AiPredictionResponse>('/user/teeth-ai', {
      method: 'POST',
      body: formData
    });

    if (!res.isSuccessful) {
      console.error("AI_ANALYSIS_API_ERROR:", res.errorBody?.string());
      throw new Error(res.errorBody?.string() || "AI Analysis Engine is currently unavailable");
    }

    return res.body as AiPredictionResponse;
  }

  // --- VERIFICATION METHODS ---

  async sendEmailVerificationCode(email: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Verification code sent to " + email } };
    }
    return this.requestRaw<{ message: string }>('/user/send-registration-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async sendDealerEmailCode(email: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Verification code sent to " + email } };
    }
    return this.requestRaw<{ message: string }>('/dealer/send-registration-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async verifyEmailCode(email: string, code: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Email verified successfully" } };
    }
    return this.requestRaw<{ message: string }>('/user/verify-email-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp: code })
    });
  }

  async sendRegistrationOtp(email: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Registration OTP sent to " + email } };
    }
    return this.requestRaw<{ message: string }>('/user/send-registration-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async verifyRegistrationOtp(email: string, otp: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Registration OTP verified successfully" } };
    }
    return this.requestRaw<{ message: string }>('/user/verify-registration-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  }

  async verifyDealerEmailCode(email: string, code: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Email verified successfully" } };
    }
    return this.requestRaw<{ message: string }>('/dealer/verify-registration-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp: code })
    });
  }

  async registerDealer(data: any): Promise<Response<any>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: { message: "Dealer registered successfully", dealer_id: 123 } };
    }
    return this.requestRaw<any>('/dealer/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // --- BENEFICIARY DISTRIBUTION METHODS ---

  async getUserAppointments(userId: number): Promise<Response<AppointmentResponse[]>> {
    if (this.USE_MOCK) {
        return { isSuccessful: true, body: [...ApiService.MOCK_APPOINTMENTS] };
    }
    return this.requestRaw<AppointmentResponse[]>(`/user/appointments?userId=${userId}`);
  }

  async submitAppointment(request: any): Promise<Response<{ message: string, appointmentId: string }>> {
    if (this.USE_MOCK) {
        const id = "APT-" + Math.floor(1000 + Math.random() * 9000);
        const newApt: AppointmentResponse = {
            id,
            clinicName: request.clinicName || "Selected Clinic",
            clinicId: request.clinicId || "c1",
            doctorName: "Dr. Assigned",
            appointmentDate: request.date || new Date().toISOString().split('T')[0],
            appointmentTime: request.time || "10:00 AM",
            memberName: request.memberName || "User",
            status: 'PENDING',
            address: request.address || "Clinic Address"
        };
        ApiService.MOCK_APPOINTMENTS.unshift(newApt);
        return { isSuccessful: true, body: { message: "Appointment submitted", appointmentId: id } };
    }
    return this.requestRaw<{ message: string, appointmentId: string }>('/user/submit-appointment', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async cancelAppointment(appointmentId: string): Promise<Response<{ message: string }>> {
    if (this.USE_MOCK) {
        const apt = ApiService.MOCK_APPOINTMENTS.find(a => a.id === appointmentId);
        if (apt) apt.status = 'CANCELLED';
        return { isSuccessful: true, body: { message: "Appointment cancelled" } };
    }
    return this.requestRaw<{ message: string }>(`/user/cancel-appointment/${appointmentId}`, {
      method: 'POST'
    });
  }
}

export const RetrofitClient = {
  apiService: new ApiService()
};
