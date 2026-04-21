import { useState, useCallback } from 'react';
import { 
  RetrofitClient, 
  type KitReceivedSummary, 
  type MemberAiReport, 
  type AiPredictionResponse 
} from '../network/RetrofitClient';

/**
 * Hook mirroring the Android FamilyHealthViewModel logic.
 * Manages family distribution history and AI health reports.
 */
export function useFamilyHealth() {
  const [distributionHistory, setDistributionHistory] = useState<KitReceivedSummary[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [memberReports, setMemberReports] = useState<Record<number, MemberAiReport>>({});
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  /**
   * Fetches family members for a specific user.
   */
  const fetchFamilyMembers = useCallback(async (userId: number) => {
    try {
      const response = await RetrofitClient.apiService.getFamilyMembers(userId);
      if (response.isSuccessful) {
        setFamilyMembers(response.body || []);
      }
    } catch (error) {
      console.error("Failed to fetch family members:", error);
    }
  }, []);

  /**
   * Fetches the distribution history for a specific user.
   */
  const fetchDistributionHistory = useCallback(async (userId: number) => {
    setIsLoadingHistory(true);
    try {
      const response = await RetrofitClient.apiService.getUserDistributionHistory(userId);
      if (response.isSuccessful) {
        setDistributionHistory(response.body || []);
      }
    } catch (error) {
      console.error("Failed to fetch distribution history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  /**
   * Saves or updates a dental health report for a family member.
   */
  const saveOrUpdateMemberReport = useCallback((
    memberId: number,
    imageUri: string | undefined,
    result: AiPredictionResponse
  ) => {
    const riskLevel = result.riskLevel || "LOW";
    const createdAt = new Date().toISOString().split('T')[0];

    const report: MemberAiReport = {
      memberId,
      imagePath: imageUri,
      aiResult: result,
      createdAt,
      riskLevel
    };

    setMemberReports(prev => ({
      ...prev,
      [memberId]: report
    }));
  }, []);

  /**
   * Retrieves a report for a specific family member.
   */
  const getMemberReport = useCallback((memberId: number): MemberAiReport | undefined => {
    return memberReports[memberId];
  }, [memberReports]);

  return {
    distributionHistory,
    familyMembers,
    memberReports,
    isLoadingHistory,
    fetchFamilyMembers,
    fetchDistributionHistory,
    saveOrUpdateMemberReport,
    getMemberReport
  };
}
