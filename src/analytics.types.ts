export interface GenericUserInfo {
  email?: string;
  phone?: string;
  ipAddress?: string;
  userAgent?: string;
  identifiers?: {
    fbp?: string; // Facebook Browser ID
    fbc?: string; // Facebook Click ID
    ga?: string; // Google Analytics ID
  };
  source?: string;
}

export interface GenericItem {
  id: string;
  quantity: number;
  price?: number;
  category?: string;
}

export interface GenericEventProperties {
  value?: number;
  currency?: string;
  items?: GenericItem[];
  url?: string;
  eventId?: string;
}

export interface TrackResult {
  /** Indicates if the event was successfully sent. */
  success: boolean;

  /** The name of the provider that processed the event. */
  provider: string;

  /** A provider-specific trace or request ID, useful for debugging. */
  traceId?: string;

  /** A human-readable message, especially useful on failure. */
  message?: string;

  /** The original error object, if one was thrown. */
  error?: Error;
}
