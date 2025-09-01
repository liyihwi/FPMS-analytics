import {
  GenericUserInfo,
  GenericEventProperties,
  TrackResult,
} from "../analytics.types";
import { EventName } from "../enum";

export interface IAnalyticsProvider {
  track(
    eventName: EventName | string,
    userInfo: GenericUserInfo,
    properties: GenericEventProperties
  ): Promise<TrackResult>;
}
