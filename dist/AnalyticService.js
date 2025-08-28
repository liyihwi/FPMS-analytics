"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const facebook_nodejs_business_sdk_1 = require("facebook-nodejs-business-sdk");
class AnalyticsService {
    constructor(config) {
        this.userData = null;
        this.accessToken = config.accessToken;
        this.pixelId = config.pixelId;
        this.api = facebook_nodejs_business_sdk_1.FacebookAdsApi.init(this.accessToken);
        console.log("AnalyticsService Initialized.");
    }
    /**
     * Sets and stores the user's data for all subsequent track calls.
     * Call this after a user logs in or their session is identified.
     */
    setUser(userInfo) {
        const userData = new facebook_nodejs_business_sdk_1.UserData();
        if (userInfo.emails)
            userData.setEmails(userInfo.emails);
        if (userInfo.phones)
            userData.setPhones(userInfo.phones);
        if (userInfo.clientIpAddress)
            userData.setClientIpAddress(userInfo.clientIpAddress);
        if (userInfo.clientUserAgent)
            userData.setClientUserAgent(userInfo.clientUserAgent);
        if (userInfo.fbp)
            userData.setFbp(userInfo.fbp);
        if (userInfo.fbc)
            userData.setFbc(userInfo.fbc);
        this.userData = userData;
    }
    /**
     * Clears the stored user data. Call this on logout.
     */
    clearUser() {
        this.userData = null;
        console.log("User data has been cleared.");
    }
    /**
     * Tracks a server-side event.
     */
    async track(eventName, userInfo, properties = {}) {
        if (!userInfo) {
            console.warn("Warning: Tracking an event without setting user data first.");
            // You might choose to throw an error here instead
        }
        this.setUser(userInfo);
        try {
            const currentTimestamp = Math.floor(new Date().getTime() / 1000);
            const customData = new facebook_nodejs_business_sdk_1.CustomData();
            if (properties.value)
                customData.setValue(properties.value);
            if (properties.currency)
                customData.setCurrency(properties.currency);
            if (properties.contents) {
                const sdkContents = properties.contents.map((c) => new facebook_nodejs_business_sdk_1.Content().setId(c.id).setQuantity(c.quantity));
                customData.setContents(sdkContents);
            }
            const serverEvent = new facebook_nodejs_business_sdk_1.ServerEvent()
                .setEventName(eventName)
                .setEventTime(currentTimestamp)
                .setUserData(this.userData || new facebook_nodejs_business_sdk_1.UserData()) // Pass empty UserData if none is set
                .setCustomData(customData)
                .setActionSource("website");
            if (properties.eventSourceUrl) {
                serverEvent.setEventSourceUrl(properties.eventSourceUrl);
            }
            console.log(serverEvent);
            const eventRequest = new facebook_nodejs_business_sdk_1.EventRequest(this.accessToken, this.pixelId).setEvents([serverEvent]);
            const response = await eventRequest.execute();
            console.log(`✅ Event '${eventName}' tracked successfully.`, response);
            return response;
        }
        catch (err) {
            console.error(`❌ Error tracking event '${eventName}':`, err);
        }
    }
}
exports.AnalyticsService = AnalyticsService;
