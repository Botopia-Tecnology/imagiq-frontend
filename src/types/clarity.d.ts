/**
 * Type definitions for Microsoft Clarity
 *
 * Define types for the global Clarity API to get better
 * TypeScript support in the application.
 */

declare global {
  interface Window {
    /**
     * Microsoft Clarity global function
     *
     * @see https://docs.microsoft.com/en-us/clarity/setup-and-installation/clarity-api
     */
    clarity?: {
      /**
       * Send custom event to Clarity
       * @param action - Always 'event' for custom events
       * @param eventName - Name of the custom event
       */
      (action: 'event', eventName: string): void;

      /**
       * Identify a user in Clarity (simple version)
       * IMPORTANT: Only use hashed or anonymous IDs, never PII
       * @param action - Always 'identify' for user identification
       * @param userId - Hashed or anonymous user ID
       */
      (action: 'identify', userId: string): void;

      /**
       * Identify a user in Clarity with full parameters
       * IMPORTANT: Clarity automatically hashes the userId on the client
       * @param action - Always 'identify' for user identification
       * @param userId - User ID (will be hashed by Clarity)
       * @param sessionId - Custom session ID for cross-session tracking
       * @param pageId - Custom page ID (optional)
       * @param friendlyName - Display name for Clarity dashboard
       */
      (action: 'identify', userId: string, sessionId: string, pageId: string | undefined, friendlyName: string): void;

      /**
       * Set a custom tag/property
       * @param action - Always 'set' for custom properties
       * @param key - Property key
       * @param value - Property value (will be converted to string)
       */
      (action: 'set', key: string, value: string | number | boolean): void;

      /**
       * Update user consent
       * @param action - Always 'consent' for consent updates
       * @param granted - true to grant, false to deny
       */
      (action: 'consent', granted: boolean): void;

      /**
       * Upgrade anonymous session to identified session
       * @param action - Always 'upgrade' for session upgrades
       * @param userId - Hashed or anonymous user ID
       */
      (action: 'upgrade', userId: string): void;

      /**
       * Set project configuration
       * Internal use only - set via backend
       */
      (action: 'set', key: 'project', projectId: string): void;

      /**
       * Queue for commands before Clarity loads
       */
  q?: [action: string, ...params: unknown[]][];
    };
  }
}

export {};
