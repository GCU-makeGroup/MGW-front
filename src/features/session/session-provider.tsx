import { useReducer, type ReactNode } from 'react';
import {
  login as loginRequest,
  signup as signupRequest,
  type LoginRequest,
  type SignupRequest,
} from '../../api/session';
import { SessionContext, type SessionContextValue } from './session-context';
import type {
  NotificationKey,
  OnboardingInterest,
  OnboardingPurpose,
  SessionAuthDraft,
  SessionConsentState,
  SessionSignupDraft,
  SessionState,
} from './session-types';

const initialState: SessionState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  auth: {
    email: '',
    password: '',
  },
  signup: {
    fullName: '',
    universityEmail: '',
    password: '',
    confirmPassword: '',
    major: '',
    studentId: '',
    emailToken: '',
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

type SessionAction =
  | { type: 'updateAuthField'; field: keyof SessionAuthDraft; value: string }
  | { type: 'updateSignupField'; field: keyof SessionSignupDraft; value: string }
  | { type: 'setConsent'; field: keyof SessionConsentState; value: boolean }
  | { type: 'toggleInterest'; interest: OnboardingInterest }
  | { type: 'setPurpose'; purpose: OnboardingPurpose }
  | { type: 'setNotification'; key: NotificationKey; value: boolean }
  | { type: 'setTokens'; accessToken: string; refreshToken: string }
  | { type: 'setAuthenticated'; value: boolean }
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
    case 'resetAll':
      return initialState;
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
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      return response.data;
    },
    async completeSignup() {
      const requestBody: SignupRequest = {
        email: `${state.signup.universityEmail.trim()}@gachon.ac.kr`,
        password: state.signup.password,
        name: state.signup.fullName,
        major: state.signup.major.trim() || undefined,
        studentId: state.signup.studentId.trim() ? Number(state.signup.studentId) : undefined,
        emailToken: state.signup.emailToken || undefined,
      };

      await signupRequest(requestBody);

      dispatch({ type: 'setAuthenticated', value: true });
    },
    resetAll() {
      dispatch({ type: 'resetAll' });
    },
  };

  return <SessionContext.Provider value={{ state, actions }}>{children}</SessionContext.Provider>;
}
