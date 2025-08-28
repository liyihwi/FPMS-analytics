interface AnalyticsConfig {
    accessToken: string;
    pixelId: string;
}
interface UserInfo {
    emails?: string[];
    phones?: string[];
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
}
interface EventProperties {
    value?: number;
    event_id?: string;
    event_source_url?: string;
    currency?: string;
    contents?: {
        id: string;
        quantity: number;
    }[];
    eventSourceUrl?: string;
}
export declare class AnalyticsService {
    private accessToken;
    private pixelId;
    private api;
    private userData;
    constructor(config: AnalyticsConfig);
    /**
     * Sets and stores the user's data for all subsequent track calls.
     * Call this after a user logs in or their session is identified.
     */
    private setUser;
    /**
     * Clears the stored user data. Call this on logout.
     */
    clearUser(): void;
    /**
     * Tracks a server-side event.
     */
    track(eventName: string, userInfo: UserInfo, properties?: EventProperties): Promise<import("facebook-nodejs-business-sdk").EventResponse | undefined>;
}
export {};
