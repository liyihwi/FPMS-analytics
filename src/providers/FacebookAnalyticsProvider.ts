import { GenericUserInfo, GenericEventProperties } from "../analytics.types";
import { EventName } from "../enum";
import { IAnalyticsProvider } from "./IAnalyticsProvider";
import {
  UserData,
  ServerEvent,
  CustomData,
  EventRequest,
  Content,
} from "facebook-nodejs-business-sdk";

interface FacebookConfig {
  accessToken: string;
  pixelId: string;
}

export class FacebookAnalyticsProvider implements IAnalyticsProvider {
  private accessToken: string;
  private pixelId: string;
  private userData: UserData | null = null;
  private me = "Facebook";

  constructor(config: FacebookConfig) {
    this.accessToken = config.accessToken;
    this.pixelId = config.pixelId;
    console.log("FacebookAnalyticsProvider Initialized.");
  }

  /**
   * Sets and stores the user's data for all subsequent track calls.
   * Call this after a user logs in or their session is identified.
   */
  private setUser(userInfo: GenericUserInfo): void {
    const userData = new UserData();
    if (userInfo.email) userData.setEmails([userInfo.email]);
    if (userInfo.phone) userData.setPhones([userInfo.phone]);
    if (userInfo.ipAddress) userData.setClientIpAddress(userInfo.ipAddress);
    if (userInfo.userAgent) userData.setClientUserAgent(userInfo.userAgent);
    if (userInfo.identifiers?.fbp) userData.setFbp(userInfo.identifiers.fbp);
    if (userInfo.identifiers?.fbc) userData.setFbc(userInfo.identifiers.fbc);

    this.userData = userData;
  }

  /**
   * Tracks a server-side event.
   */
  public async track(
    eventName: EventName | string,
    userInfo: GenericUserInfo,
    properties: GenericEventProperties = {}
  ) {
    if (!userInfo) {
      console.warn(
        "Warning: Tracking an event without setting user data first."
      );
    }

    this.setUser(userInfo);

    try {
      const currentTimestamp = Math.floor(new Date().getTime() / 1000);

      const customData = new CustomData();
      if (properties.value) customData.setValue(properties.value);
      if (properties.currency) customData.setCurrency(properties.currency);
      if (properties.items) {
        const sdkContents = properties.items.map((c) =>
          new Content().setId(c.id).setQuantity(c.quantity)
        );
        customData.setContents(sdkContents);
      }

      const serverEvent = new ServerEvent()
        .setEventName(eventName)
        .setEventTime(currentTimestamp)
        .setUserData(this.userData || new UserData())
        .setCustomData(customData)
        .setActionSource(userInfo.source || "");

      if (properties.url) {
        serverEvent.setEventSourceUrl(properties.url);
      }

      const eventRequest = new EventRequest(
        this.accessToken,
        this.pixelId
      ).setEvents([serverEvent]);

      const response = await eventRequest.execute();

      return {
        success: response._events_received > 0,
        provider: this.me,
        traceId: response._fbtrace_id,
      };
    } catch (err) {
      const error = err as Error;
      return {
        success: false,
        provider: this.me,
        message: error.message,
        error: error,
      };
    }
  }
}
