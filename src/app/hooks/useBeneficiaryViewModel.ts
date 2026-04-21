import { useState } from 'react';
import { RetrofitClient, type Beneficiary } from '../network/RetrofitClient';

export function useBeneficiaryViewModel() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchBeneficiaries = async (dealerId: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await RetrofitClient.apiService.getDealerBeneficiaries(dealerId);
      // Apply client-side filtering as a secondary safeguard mirroring the Android implementation
      const filtered = response.filter(b => b.dealerId === dealerId);
      setBeneficiaries(filtered);
    } catch (e: any) {
      setErrorMessage(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmKitByDealerQR = async (
    dealerQrValue: string,
    beneficiaryId: number,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const response = await RetrofitClient.apiService.confirmKitByDealerQR({
        dealer_qr_value: dealerQrValue,
        beneficiaryId
      });
      
      setActionMessage(response.message || "Kit created successfully");
      
      if (response.dealerId) {
        await fetchBeneficiaries(response.dealerId);
      }
      
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setErrorMessage(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    beneficiaries,
    isLoading,
    errorMessage,
    actionMessage,
    fetchBeneficiaries,
    confirmKitByDealerQR
  };
}
