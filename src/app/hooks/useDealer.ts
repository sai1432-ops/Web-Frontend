import { useState, useCallback } from 'react';
import type { StockItem, DealerDashboardStats, VerifyBeneficiaryResponse, DealerHouseholdResponse, DealerDistributionHistoryResponse, DealerProfileResponse, ProfileUpdateRequest, DealerManualDistributionRequest, FamilyMemberInput, StockRequestBody, ChangePasswordRequest } from '../network/RetrofitClient';
import { RetrofitClient } from '../network/RetrofitClient';

export function useDealer() {
  const [dashboardStats, setDashboardStats] = useState<DealerDashboardStats | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [verifiedBeneficiary, setVerifiedBeneficiary] = useState<VerifyBeneficiaryResponse | null>(null);
  const [dealerHousehold, setDealerHousehold] = useState<DealerHouseholdResponse | null>(null);
  const [distributionHistory, setDistributionHistory] = useState<DealerDistributionHistoryResponse[]>([]);
  const [dealerProfile, setDealerProfile] = useState<DealerProfileResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [stockRequestLoading, setStockRequestLoading] = useState(false);
  const [stockRequestMessage, setStockRequestMessage] = useState<string | null>(null);
  const [stockRequestSuccess, setStockRequestSuccess] = useState(false);
  const [latestStockRequestId, setLatestStockRequestId] = useState<string | null>(null);

  const parseErrorMessage = (errorBody: any, code: number) => {
    try {
      const errorData = typeof errorBody.string === 'function' ? JSON.parse(errorBody.string()) : errorBody;
      return errorData.message || errorData.error || `Error: ${code}`;
    } catch (e) {
      return `Error: ${code}`;
    }
  };

  const fetchDealerProfile = useCallback(async (dealerId: number, token: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await RetrofitClient.apiService.getDealerProfile(`Bearer ${token}`, dealerId);
      if (response.isSuccessful) {
        setDealerProfile(response.body!);
      } else {
        setErrorMessage(parseErrorMessage(response.errorBody, response.code!));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDealerProfile = useCallback(async (dealerId: number, token: string, request: ProfileUpdateRequest, onSuccess?: () => void) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await RetrofitClient.apiService.updateDealerProfile(dealerId, request);
      // Backend updateDealerProfile currently returns { message: string }
      if ((response as any).message || (response as any).isSuccessful) {
        setActionMessage("Profile updated successfully");
        await fetchDealerProfile(dealerId, token);
        onSuccess?.();
      } else {
        setErrorMessage("Failed to update profile");
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDealerProfile]);

  const fetchDashboardStats = useCallback(async (dealerId: number) => {
    if (dealerId <= 0) {
      setErrorMessage("Invalid Dealer ID");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await RetrofitClient.apiService.getDealerDashboardStats(dealerId);
      setDashboardStats(data);
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStockList = useCallback(async (dealerId: number) => {
    if (dealerId <= 0) return;
    setIsStockLoading(true);
    setErrorMessage(null);
    try {
      const response = await RetrofitClient.apiService.getDealerStockDetailed(dealerId);
      if (response.isSuccessful) {
        setStockItems(response.body || []);
      } else {
        setErrorMessage(parseErrorMessage(response.errorBody, response.code!));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsStockLoading(false);
    }
  }, []);

  const verifyBeneficiary = useCallback(async (dealerId: number, pdsCardNo: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await RetrofitClient.apiService.verifyBeneficiary({ dealerId, pdsCardNo });
      if (response.isSuccessful) {
        if (response.body?.valid) {
          setVerifiedBeneficiary(response.body);
          onSuccess?.();
        } else {
          setErrorMessage(response.body?.message || "Invalid PDS Card");
        }
      } else {
        setErrorMessage(parseErrorMessage(response.errorBody, response.code!));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDealerHousehold = useCallback(async (userId: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await RetrofitClient.apiService.getDealerHousehold(userId);
      if (response.isSuccessful) {
        setDealerHousehold(response.body!);
      } else {
        setErrorMessage(parseErrorMessage(response.errorBody, response.code!));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDistributionHistory = useCallback(async (dealerId: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await RetrofitClient.apiService.getDealerDistributionHistory(dealerId);
      if (response.isSuccessful) {
        setDistributionHistory(response.body || []);
      } else {
        setErrorMessage(parseErrorMessage(response.errorBody, response.code!));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeDistribution = useCallback(async (
    dealerId: number,
    beneficiaryId: number,
    brushReceived: number,
    pasteReceived: number,
    iecReceived: number,
    oldKitReturned: boolean,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const request: DealerManualDistributionRequest = {
        dealerId, beneficiaryId, brushReceived, pasteReceived, iecReceived, oldKitReturned
      };
      const response = await RetrofitClient.apiService.dealerConfirmDistribution(request);
      if (response.isSuccessful) {
        setActionMessage(response.body?.message || "Distribution successful");
        await fetchDashboardStats(dealerId);
        onSuccess?.();
      } else {
        setErrorMessage(parseErrorMessage(response.errorBody, response.code!));
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardStats]);

  const registerHousehold = useCallback(async (
    dealerId: number,
    name: string,
    email: string | null,
    phone: string,
    pdsCardNo: string,
    members: FamilyMemberInput[],
    pdsFront: File | null,
    pdsBack: File | null,
    onSuccess?: (userId: number) => void
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const membersJson = JSON.stringify(members);
      const response = await RetrofitClient.apiService.registerDealerHousehold(
        dealerId.toString(), name, email, phone, pdsCardNo, membersJson, pdsFront, pdsBack
      );

      if (response.isSuccessful) {
        setActionMessage(response.body?.message || "Household registered successfully");
        onSuccess?.(response.body?.userId || 0);
      } else {
        setErrorMessage(parseErrorMessage(response.errorBody, response.code!));
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitStockRequest = useCallback(async (
    dealerId: number,
    brushQty: number,
    pasteQty: number,
    iecQty: number,
    urgency: string
  ) => {
    if (dealerId <= 0) {
      setStockRequestMessage("Invalid dealer session");
      setStockRequestSuccess(false);
      return;
    }

    setStockRequestLoading(true);
    setStockRequestMessage(null);
    setStockRequestSuccess(false);

    try {
      const request: StockRequestBody = { dealerId, brushQty, pasteQty, iecQty, urgency };
      const response = await RetrofitClient.apiService.requestStock(request);

      if (response.isSuccessful) {
        setStockRequestSuccess(true);
        setStockRequestMessage(response.body?.message || "Stock request submitted successfully");
        setLatestStockRequestId(response.body?.requestGroupId || "");
      } else {
        setStockRequestSuccess(false);
        setStockRequestMessage(parseErrorMessage(response.errorBody, response.code!));
      }
    } catch (e: any) {
      setStockRequestSuccess(false);
      setStockRequestMessage(e.message || "Something went wrong");
    } finally {
      setStockRequestLoading(false);
    }
  }, []);

  const uploadDealerProfileImage = useCallback(async (dealerId: number, token: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await RetrofitClient.apiService.updateDealerProfileImage(`Bearer ${token}`, dealerId, formData);
      if (response.isSuccessful) {
        const newImage = response.body?.profileImage;
        if (newImage && dealerProfile) {
          setDealerProfile({ ...dealerProfile, profileImage: newImage });
        }
        setActionMessage("Profile picture updated on server");
      } else {
        setErrorMessage(`Failed to upload image: ${response.code}`);
      }
    } catch (e: any) {
      setErrorMessage(`Error uploading image: ${e.message}`);
    }
  }, [dealerProfile]);

  const changePassword = useCallback(async (token: string, request: ChangePasswordRequest, onComplete: (success: boolean, message: string) => void) => {
    try {
      const response = await RetrofitClient.apiService.changeDealerPassword(`Bearer ${token}`, request);
      if (response.isSuccessful) {
        onComplete(true, response.body?.message || "Password changed successfully");
      } else {
        const errorData = typeof response.errorBody?.string === 'function' ? JSON.parse(response.errorBody.string()) : {};
        onComplete(false, errorData.error || "Failed to change password");
      }
    } catch (e: any) {
      onComplete(false, `Error: ${e.message}`);
    }
  }, []);

  const resetStockRequestState = () => {
    setStockRequestLoading(false);
    setStockRequestMessage(null);
    setStockRequestSuccess(false);
    setLatestStockRequestId(null);
  };

  const clearStockRequestMessage = () => setStockRequestMessage(null);
  const clearVerifiedBeneficiary = () => setVerifiedBeneficiary(null);

  const resetState = () => {
    setDashboardStats(null);
    setStockItems([]);
    setVerifiedBeneficiary(null);
    setDealerHousehold(null);
    setDistributionHistory([]);
    setIsLoading(false);
    setIsStockLoading(false);
    setErrorMessage(null);
    setActionMessage(null);
    setStockRequestLoading(false);
    setStockRequestMessage(null);
    setStockRequestSuccess(false);
    setLatestStockRequestId(null);
    setDealerProfile(null);
  };

  return {
    dashboardStats,
    stockItems,
    verifiedBeneficiary,
    dealerHousehold,
    distributionHistory,
    dealerProfile,
    isLoading,
    isStockLoading,
    errorMessage,
    actionMessage,
    stockRequestLoading,
    stockRequestMessage,
    stockRequestSuccess,
    latestStockRequestId,
    fetchDealerProfile,
    updateDealerProfile,
    uploadDealerProfileImage,
    fetchDashboardStats,
    fetchStockList,
    verifyBeneficiary,
    fetchDealerHousehold,
    fetchDistributionHistory,
    completeDistribution,
    registerHousehold,
    submitStockRequest,
    changePassword,
    resetStockRequestState,
    clearStockRequestMessage,
    clearVerifiedBeneficiary,
    resetState,
    setErrorMessage,
    setActionMessage
  };
}
