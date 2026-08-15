// Type declaration for window.umami analytics script
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

/**
 * Track custom user events using Umami Privacy Telemetry
 * Fires events safely if script is active, or logs to console in development.
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(eventName, eventData);
    } else if ((import.meta as any).env?.DEV) {
      console.log(`[Umami Analytics Event] ${eventName}`, eventData ?? '');
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}
