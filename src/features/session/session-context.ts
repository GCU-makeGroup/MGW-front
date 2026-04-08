import { createContext, useContext } from 'react';
import type { LoginResponseData } from '../../api/session';
import type {
  NotificationKey,
  OnboardingInterest,
  OnboardingPurpose,
  SessionAuthDraft,
  SessionConsentState,
  SessionSignupDraft,
  SessionState,
} from './session-types';

export type SessionContextValue = {
  state: SessionState;
  actions: {
    updateAuthField: <K extends keyof SessionAuthDraft>(
      _field: K,
      _value: SessionAuthDraft[K],
    ) => void;
    updateSignupField: <K extends keyof SessionSignupDraft>(
      _field: K,
      _value: SessionSignupDraft[K],
    ) => void;
    setConsent: <K extends keyof SessionConsentState>(_field: K, _value: boolean) => void;
    toggleInterest: (_interest: OnboardingInterest) => void;
    setPurpose: (_purpose: OnboardingPurpose) => void;
    setNotification: (_key: NotificationKey, _value: boolean) => void;
    loginAccount: () => Promise<LoginResponseData>;
    completeSignup: () => Promise<void>;
    resetAll: () => void;
  };
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider.');
  }

  return context;
}
