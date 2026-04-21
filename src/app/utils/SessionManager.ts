// src/app/utils/SessionManager.ts

import type { MonthlyProgressResponse } from '../network/RetrofitClient';

export interface MonthlyBrushRecord {
    date: string;
    morning: boolean;
    evening: boolean;
}

class SessionManagerImpl {
    private readonly KEY_USER_ID = "user_id";
    private readonly KEY_USER_NAME = "user_name";
    private readonly KEY_USER_EMAIL = "user_email";
    private readonly KEY_USER_PHONE = "user_phone";
    private readonly KEY_USER_AGE = "user_age";
    private readonly KEY_USER_GENDER = "user_gender";
    private readonly KEY_USER_EDUCATION = "user_education";
    private readonly KEY_USER_EMPLOYMENT = "user_employment";
    private readonly KEY_USER_PDS_CARD = "user_pds_card";
    private readonly KEY_USER_ADDRESS = "user_address";
    private readonly KEY_USER_PROFILE_IMAGE = "user_profile_image";
    private readonly KEY_IS_LOGGED_IN = "is_logged_in";
    private readonly KEY_IDENTITY_VERIFIED = "identity_verified";
    private readonly KEY_USER_ROLE = "user_role";
    private readonly KEY_ACCESS_TOKEN = "access_token";
    private readonly KEY_ASSIGNED_DEALER_ID = "assigned_dealer_id";
    private readonly KEY_ASSIGNED_DEALER_NAME = "assigned_dealer_name";
    private readonly KEY_ASSIGNED_DEALER_LOCATION = "assigned_dealer_location";

    private readonly KEY_WEEKLY_SESSIONS_PREFIX = "weekly_sessions";
    private readonly KEY_WEEKLY_COUNT_PREFIX = "weekly_count";
    private readonly KEY_WEEK_STAMP_PREFIX = "weekly_stamp";

    private readonly KEY_MONTHLY_LOG_PREFIX = "monthly_log";
    private readonly KEY_MONTHLY_TOTAL_PREFIX = "monthly_total";

    private getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    private setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    private removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    saveSession(
        userId: number,
        name: string,
        email: string,
        phone: string,
        role: string,
        pdsVerified: boolean = false,
        token: string | null = null
    ): void {
        const idStr = (userId !== null && userId !== undefined) ? userId.toString() : "-1";
        const verifiedStr = (pdsVerified !== null && pdsVerified !== undefined) ? pdsVerified.toString() : "false";

        this.setItem(this.KEY_USER_ID, idStr);
        this.setItem(this.KEY_USER_NAME, name || "User");
        this.setItem(this.KEY_USER_EMAIL, email || "");
        this.setItem(this.KEY_USER_PHONE, phone || "");
        this.setItem(this.KEY_USER_ROLE, role);
        this.setItem(this.KEY_IS_LOGGED_IN, "true");
        this.setItem(this.KEY_IDENTITY_VERIFIED, verifiedStr);
        if (token) this.setItem(this.KEY_ACCESS_TOKEN, token);
    }

    setIdentityVerified(verified: boolean): void {
        this.setItem(this.KEY_IDENTITY_VERIFIED, verified.toString());
    }

    setUserName(name: string): void {
        this.setItem(this.KEY_USER_NAME, name);
    }

    setUserEmail(email: string): void {
        this.setItem(this.KEY_USER_EMAIL, email);
    }

    setUserPhone(phone: string): void {
        this.setItem(this.KEY_USER_PHONE, phone);
    }

    setUserAge(age: string): void {
        this.setItem(this.KEY_USER_AGE, age);
    }

    setUserGender(gender: string): void {
        this.setItem(this.KEY_USER_GENDER, gender);
    }

    setUserEducation(education: string): void {
        this.setItem(this.KEY_USER_EDUCATION, education);
    }

    setUserEmployment(employment: string): void {
        this.setItem(this.KEY_USER_EMPLOYMENT, employment);
    }

    setUserPdsCard(pdsCard: string): void {
        this.setItem(this.KEY_USER_PDS_CARD, pdsCard);
    }

    setUserAddress(address: string): void {
        this.setItem(this.KEY_USER_ADDRESS, address);
    }

    setUserProfileImage(url: string): void {
        this.setItem(this.KEY_USER_PROFILE_IMAGE, url);
    }

    getUserId(): number {
        return parseInt(this.getItem(this.KEY_USER_ID) || "-1");
    }

    getUserName(): string {
        return this.getItem(this.KEY_USER_NAME) || "User";
    }

    getUserEmail(): string {
        return this.getItem(this.KEY_USER_EMAIL) || "";
    }

    getUserPhone(): string {
        return this.getItem(this.KEY_USER_PHONE) || "";
    }

    getUserAge(): string {
        return this.getItem(this.KEY_USER_AGE) || "";
    }

    getUserGender(): string {
        return this.getItem(this.KEY_USER_GENDER) || "Male";
    }

    getUserEducation(): string {
        return this.getItem(this.KEY_USER_EDUCATION) || "";
    }

    getUserEmployment(): string {
        return this.getItem(this.KEY_USER_EMPLOYMENT) || "";
    }

    getUserPdsCard(): string {
        return this.getItem(this.KEY_USER_PDS_CARD) || "";
    }

    getUserAddress(): string {
        return this.getItem(this.KEY_USER_ADDRESS) || "";
    }

    getUserProfileImage(): string {
        return this.getItem(this.KEY_USER_PROFILE_IMAGE) || "";
    }

    getUserRole(): string {
        return this.getItem(this.KEY_USER_ROLE) || "user";
    }

    isLoggedIn(): boolean {
        return this.getItem(this.KEY_IS_LOGGED_IN) === "true";
    }

    isIdentityVerified(): boolean {
        return this.getItem(this.KEY_IDENTITY_VERIFIED) === "true";
    }

    getAccessToken(): string | null {
        return this.getItem(this.KEY_ACCESS_TOKEN);
    }

    setAssignedDealerId(id: number): void {
        this.setItem(this.KEY_ASSIGNED_DEALER_ID, id.toString());
    }

    getAssignedDealerId(): number | null {
        const id = this.getItem(this.KEY_ASSIGNED_DEALER_ID);
        return id ? parseInt(id) : null;
    }

    setAssignedDealerName(name: string): void {
        this.setItem(this.KEY_ASSIGNED_DEALER_NAME, name);
    }

    getAssignedDealerName(): string | null {
        return this.getItem(this.KEY_ASSIGNED_DEALER_NAME);
    }

    setAssignedDealerLocation(location: string): void {
        this.setItem(this.KEY_ASSIGNED_DEALER_LOCATION, location);
    }

    getAssignedDealerLocation(): string | null {
        return this.getItem(this.KEY_ASSIGNED_DEALER_LOCATION);
    }

    private currentWeekStamp(): string {
        const d = new Date();
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return `${date.getUTCFullYear()}-${weekNo}`;
    }

    private currentMonthStamp(): string {
        const d = new Date();
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    }

    private todayStamp(): string {
        return new Date().toISOString().split('T')[0];
    }

    saveWeeklyCheckinStatus(userId: number, completedSessions: Array<{ morning: boolean, evening: boolean }>): void {
        if (userId <= 0) return;
        const serialized = JSON.stringify(completedSessions);
        const count = completedSessions.reduce((acc, s) => acc + (s.morning ? 1 : 0) + (s.evening ? 1 : 0), 0);

        this.setItem(`${this.KEY_WEEKLY_SESSIONS_PREFIX}_${userId}`, serialized);
        this.setItem(`${this.KEY_WEEKLY_COUNT_PREFIX}_${userId}`, count.toString());
        this.setItem(`${this.KEY_WEEK_STAMP_PREFIX}_${userId}`, this.currentWeekStamp());
    }

    getWeeklyCheckinStatus(userId: number): Array<{ morning: boolean, evening: boolean }> {
        if (userId <= 0) return Array(7).fill({ morning: false, evening: false });

        const savedWeekStamp = this.getItem(`${this.KEY_WEEK_STAMP_PREFIX}_${userId}`);
        if (savedWeekStamp !== this.currentWeekStamp()) {
            return Array(7).fill({ morning: false, evening: false });
        }

        const raw = this.getItem(`${this.KEY_WEEKLY_SESSIONS_PREFIX}_${userId}`);
        if (!raw) return Array(7).fill({ morning: false, evening: false });

        try {
            return JSON.parse(raw);
        } catch {
            return Array(7).fill({ morning: false, evening: false });
        }
    }

    getWeeklyCompletedCount(userId: number): number {
        if (userId <= 0) return 0;
        const savedWeekStamp = this.getItem(`${this.KEY_WEEK_STAMP_PREFIX}_${userId}`);
        if (savedWeekStamp !== this.currentWeekStamp()) return 0;
        return parseInt(this.getItem(`${this.KEY_WEEKLY_COUNT_PREFIX}_${userId}`) || "0");
    }

    saveMonthlyUsage(userId: number, data: MonthlyProgressResponse): void {
        if (userId <= 0) return;
        const monthKey = `${this.KEY_MONTHLY_LOG_PREFIX}_${userId}_${this.currentMonthStamp()}`;
        this.setItem(monthKey, JSON.stringify(data.sessions));
        this.setItem(`${this.KEY_MONTHLY_TOTAL_PREFIX}_${userId}_${this.currentMonthStamp()}`, data.totalCompleted.toString());
    }

    saveMonthlyCheckin(userId: number, session: 'MORNING' | 'EVENING'): void {
        if (userId <= 0) return;
        const monthKey = `${this.KEY_MONTHLY_LOG_PREFIX}_${userId}_${this.currentMonthStamp()}`;
        const logs = this.getCurrentMonthLogs(userId);
        const today = this.todayStamp();

        let found = false;
        const updatedLogs = logs.map(log => {
            if (log.date === today) {
                found = true;
                return {
                    ...log,
                    morning: session === 'MORNING' ? true : log.morning,
                    evening: session === 'EVENING' ? true : log.evening
                };
            }
            return log;
        });

        if (!found) {
            updatedLogs.push({
                date: today,
                morning: session === 'MORNING',
                evening: session === 'EVENING'
            });
        }

        this.setItem(monthKey, JSON.stringify(updatedLogs));
    }

    getCurrentMonthLogs(userId: number): MonthlyBrushRecord[] {
        if (userId <= 0) return [];
        const monthKey = `${this.KEY_MONTHLY_LOG_PREFIX}_${userId}_${this.currentMonthStamp()}`;
        const raw = this.getItem(monthKey);
        if (!raw) return [];
        try {
            const parsed: MonthlyBrushRecord[] = JSON.parse(raw);
            return parsed.sort((a, b) => b.date.localeCompare(a.date));
        } catch {
            return [];
        }
    }

    getCurrentMonthCompletedCount(userId: number): number {
        const totalKey = `${this.KEY_MONTHLY_TOTAL_PREFIX}_${userId}_${this.currentMonthStamp()}`;
        const count = parseInt(this.getItem(totalKey) || "-1");
        if (count !== -1) return count;

        return this.getCurrentMonthLogs(userId).reduce((acc, log) => acc + (log.morning ? 1 : 0) + (log.evening ? 1 : 0), 0);
    }

    clearSession(): void {
        this.removeItem(this.KEY_USER_ID);
        this.removeItem(this.KEY_USER_NAME);
        this.removeItem(this.KEY_USER_EMAIL);
        this.removeItem(this.KEY_USER_PHONE);
        this.removeItem(this.KEY_USER_AGE);
        this.removeItem(this.KEY_USER_GENDER);
        this.removeItem(this.KEY_USER_EDUCATION);
        this.removeItem(this.KEY_USER_EMPLOYMENT);
        this.removeItem(this.KEY_USER_PDS_CARD);
        this.removeItem(this.KEY_USER_ADDRESS);
        this.removeItem(this.KEY_USER_PROFILE_IMAGE);
        this.removeItem(this.KEY_USER_ROLE);
        this.removeItem(this.KEY_IS_LOGGED_IN);
        this.removeItem(this.KEY_IDENTITY_VERIFIED);
        this.removeItem(this.KEY_ACCESS_TOKEN);
        this.removeItem(this.KEY_ASSIGNED_DEALER_ID);
        this.removeItem(this.KEY_ASSIGNED_DEALER_NAME);
        this.removeItem(this.KEY_ASSIGNED_DEALER_LOCATION);
    }
}

export const SessionManager = new SessionManagerImpl();
