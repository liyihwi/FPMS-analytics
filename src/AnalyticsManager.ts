import { IAnalyticsProvider } from "./providers/IAnalyticsProvider";
import {
  GenericUserInfo,
  GenericEventProperties,
  TrackResult,
} from "./analytics.types";
import { FacebookAnalyticsProvider } from "./providers/FacebookAnalyticsProvider";
import { EventName } from "./enum";

// A single config object for all potential providers
export interface AppAnalyticsConfig {
  facebook?: {
    accessToken: string;
    pixelId: string;
  };
}

export class AnalyticsManager {
  private providers: IAnalyticsProvider[] = [];

  constructor(config: AppAnalyticsConfig) {
    if (config.facebook) {
      this.providers.push(new FacebookAnalyticsProvider(config.facebook));
    }
  }

  /**
   * Tracks an event across all registered providers.
   */
  public async track(
    eventName: EventName | string,
    userInfo: GenericUserInfo,
    properties: GenericEventProperties = {}
  ): Promise<TrackResult[]> {
    const results = await Promise.all(
      this.providers.map((provider) =>
        provider.track(eventName, userInfo, properties)
      )
    );
    return results;
  }
}
