import { useReducer, type ReactNode } from 'react';
import {
  login as loginRequest,
  signup as signupRequest,
  savePreferences,
  type LoginRequest,
  type SignupRequest,
} from '../../api/session';
import { SessionContext, type SessionContextValue } from './session-context';
import {
  getAccessToken,
  getRefreshToken,
  getMemberInfo,
  setTokens as persistTokens,
  setMemberInfo as persistMemberInfo,
  clearTokens as clearPersistedTokens,
} from './token-store';
import type {
  NotificationKey,
  OnboardingInterest,
  OnboardingPurpose,
  SessionAuthDraft,
  SessionConsentState,
  SessionSignupDraft,
  SessionState,
} from './session-types';

function buildInitialState(): SessionState {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const memberInfo = getMemberInfo();

  return {
    isAuthenticated: !!(accessToken && refreshToken),
    accessToken,
    refreshToken,
    memberId: memberInfo?.memberId ?? null,
    memberEmail: memberInfo?.memberEmail ?? null,
    memberName: memberInfo?.memberName ?? null,
    auth: {
      email: '',
      password: '',
    },
    signup: {
      fullName: '',
      universityEmail: '',
      password: '',
      confirmPassword: '',
      emailVerified: false,
      major: '',
    },
    consent: {
      terms: false,
      privacy: false,
      marketing: false,
    },
    preferences: {
      interests: [],
      purpose: null,
    },
    notifications: {
      newMessages: true,
      groupInvites: true,
      etiquetteMode: false,
    },
  };
}

const initialState = buildInitialState();

type SessionAction =
  | { type: 'updateAuthField'; field: keyof SessionAuthDraft; value: string }
  | {
      type: 'updateSignupField';
      field: keyof SessionSignupDraft;
      value: SessionSignupDraft[keyof SessionSignupDraft];
    }
  | { type: 'setConsent'; field: keyof SessionConsentState; value: boolean }
  | { type: 'toggleInterest'; interest: OnboardingInterest }
  | { type: 'setPurpose'; purpose: OnboardingPurpose }
  | { type: 'setNotification'; key: NotificationKey; value: boolean }
  | { type: 'setTokens'; accessToken: string; refreshToken: string }
  | { type: 'setAuthenticated'; value: boolean }
  | { type: 'setMemberInfo'; memberId: number; memberEmail: string; memberName: string }
  | { type: 'resetAll' };

function reducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'updateAuthField':
      return {
        ...state,
        auth: {
          ...state.auth,
          [action.field]: action.value,
        },
      };
    case 'updateSignupField':
      return {
        ...state,
        signup: {
          ...state.signup,
          [action.field]: action.value,
        },
      };
    case 'setConsent':
      return {
        ...state,
        consent: {
          ...state.consent,
          [action.field]: action.value,
        },
      };
    case 'toggleInterest':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          interests: state.preferences.interests.includes(action.interest)
            ? state.preferences.interests.filter((value) => value !== action.interest)
            : [...state.preferences.interests, action.interest],
        },
      };
    case 'setPurpose':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          purpose: action.purpose,
        },
      };
    case 'setNotification':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.key]: action.value,
        },
      };
    case 'setTokens':
      persistTokens(action.accessToken, action.refreshToken);
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
    case 'setAuthenticated':
      return {
        ...state,
        isAuthenticated: action.value,
      };
    case 'setMemberInfo':
      persistMemberInfo(action.memberId, action.memberEmail, action.memberName);
      return {
        ...state,
        memberId: action.memberId,
        memberEmail: action.memberEmail,
        memberName: action.memberName,
      };
    case 'resetAll':
      clearPersistedTokens();
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        memberId: null,
        memberEmail: null,
        memberName: null,
      };
    default:
      return state;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions: SessionContextValue['actions'] = {
    updateAuthField(field, value) {
      dispatch({ type: 'updateAuthField', field, value });
    },
    updateSignupField(field, value) {
      dispatch({ type: 'updateSignupField', field, value });
    },
    setConsent(field, value) {
      dispatch({ type: 'setConsent', field, value });
    },
    toggleInterest(_interest) {
      dispatch({ type: 'toggleInterest', interest: _interest });
    },
    setPurpose(_purpose) {
      dispatch({ type: 'setPurpose', purpose: _purpose });
    },
    setNotification(key, value) {
      dispatch({ type: 'setNotification', key, value });
    },
    async loginAccount() {
      const requestBody: LoginRequest = {
        email: state.auth.email,
        password: state.auth.password,
      };
      const response = await loginRequest(requestBody);
      dispatch({
        type: 'setTokens',
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      dispatch({
        type: 'setMemberInfo',
        memberId: response.memberId,
        memberEmail: response.email,
        memberName: response.name,
      });
      return response;
    },
    async completeSignup() {
      const email = `${state.signup.universityEmail.trim()}@gachon.ac.kr`;
      const password = state.signup.password;

      const requestBody: SignupRequest = {
        email,
        password,
        name: state.signup.fullName,
      };

      await signupRequest(requestBody);

      // Auto-login with signup credentials
      const response = await loginRequest({ email, password });
      dispatch({
        type: 'setTokens',
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      dispatch({
        type: 'setMemberInfo',
        memberId: response.memberId,
        memberEmail: response.email,
        memberName: response.name,
      });

      // Save onboarding preferences (interests + purpose)
      if (state.preferences.interests.length > 0 || state.preferences.purpose) {
        try {
          await savePreferences({
            interestKeywords: state.preferences.interests,
            purpose: state.preferences.purpose ?? undefined,
          });
        } catch (error) {
          console.error('Failed to save preferences:', error);
        }
      }
    },
    resetAll() {
      dispatch({ type: 'resetAll' });
    },
  };

  return <SessionContext.Provider value={{ state, actions }}>{children}</SessionContext.Provider>;
}
