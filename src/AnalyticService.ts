import {
  FacebookAdsApi,
  UserData,
  ServerEvent,
  CustomData,
  EventRequest,
  Content,
} from "facebook-nodejs-business-sdk";

// Define the shape of the data we expect
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
  contents?: { id: string; quantity: number }[];
  eventSourceUrl?: string;
}

export class AnalyticsService {
  private accessToken: string;
  private pixelId: string;
  private api: FacebookAdsApi;
  private userData: UserData | null = null;

  constructor(config: AnalyticsConfig) {
    this.accessToken = config.accessToken;
    this.pixelId = config.pixelId;
    this.api = FacebookAdsApi.init(this.accessToken);
    console.log("AnalyticsService Initialized.");
  }

  /**
   * Sets and stores the user's data for all subsequent track calls.
   * Call this after a user logs in or their session is identified.
   */
  private setUser(userInfo: UserInfo) {
    const userData = new UserData();
    if (userInfo.emails) userData.setEmails(userInfo.emails);
    if (userInfo.phones) userData.setPhones(userInfo.phones);
    if (userInfo.clientIpAddress)
      userData.setClientIpAddress(userInfo.clientIpAddress);
    if (userInfo.clientUserAgent)
      userData.setClientUserAgent(userInfo.clientUserAgent);
    if (userInfo.fbp) userData.setFbp(userInfo.fbp);
    if (userInfo.fbc) userData.setFbc(userInfo.fbc);

    this.userData = userData;
  }

  /**
   * Clears the stored user data. Call this on logout.
   */
  public clearUser() {
    this.userData = null;
    console.log("User data has been cleared.");
  }

  /**
   * Tracks a server-side event.
   */
  public async track(
    eventName: string,
    userInfo: UserInfo,
    properties: EventProperties = {}
  ) {
    if (!userInfo) {
      console.warn(
        "Warning: Tracking an event without setting user data first."
      );
      // You might choose to throw an error here instead
    }

    this.setUser(userInfo);

    try {
      const currentTimestamp = Math.floor(new Date().getTime() / 1000);

      const customData = new CustomData();
      if (properties.value) customData.setValue(properties.value);
      if (properties.currency) customData.setCurrency(properties.currency);
      if (properties.contents) {
        const sdkContents = properties.contents.map((c) =>
          new Content().setId(c.id).setQuantity(c.quantity)
        );
        customData.setContents(sdkContents);
      }

      const serverEvent = new ServerEvent()
        .setEventName(eventName)
        .setEventTime(currentTimestamp)
        .setUserData(this.userData || new UserData()) // Pass empty UserData if none is set
        .setCustomData(customData)
        .setActionSource("website");

      if (properties.eventSourceUrl) {
        serverEvent.setEventSourceUrl(properties.eventSourceUrl);
      }

      console.log(serverEvent);

      const eventRequest = new EventRequest(
        this.accessToken,
        this.pixelId
      ).setEvents([serverEvent]);
      const response = await eventRequest.execute();
      console.log(`✅ Event '${eventName}' tracked successfully.`, response);
      return response;
    } catch (err) {
      console.error(`❌ Error tracking event '${eventName}':`, err);
    }
  }
}
