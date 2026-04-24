export type AppId = 'bsa' | 'fsa' | 'institutional';

export type AccessTier =
  | 'free'
  | 'starter'
  | 'pro'
  | 'advisor'
  | 'school'
  | 'enterprise';

export interface Entitlement {
  key: string;
  app: AppId;
  tier?: AccessTier;
}

export interface UserAccessContext {
  app: AppId;
  activeTiers: AccessTier[];
  entitlementKeys: string[];
}
