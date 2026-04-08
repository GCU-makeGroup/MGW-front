export type OnboardingInterest =
  | 'Back-end'
  | 'Guitar'
  | 'K-Pop'
  | 'Gaming'
  | 'AI & Tech'
  | 'Architecture'
  | 'Literature';

export type OnboardingPurpose = 'Academic Study' | 'Cultural Exchange' | 'Making Friends';

export type NotificationKey = 'newMessages' | 'groupInvites' | 'etiquetteMode';

export const onboardingInterests: OnboardingInterest[] = [
  'Back-end',
  'Guitar',
  'K-Pop',
  'Gaming',
  'AI & Tech',
  'Architecture',
  'Literature',
];

export const onboardingPurposes: OnboardingPurpose[] = [
  'Academic Study',
  'Cultural Exchange',
  'Making Friends',
];

export const notificationOptions: Array<{
  key: NotificationKey;
  title: string;
  description: string;
  iconLabel: string;
  accent: 'blue' | 'pink' | 'rose';
}> = [
  {
    key: 'newMessages',
    title: 'New Messages',
    description: 'Real-time alerts for private chats',
    iconLabel: '✉',
    accent: 'blue',
  },
  {
    key: 'groupInvites',
    title: 'Group Invites',
    description: 'When someone adds you to a study group',
    iconLabel: '👥',
    accent: 'blue',
  },
  {
    key: 'etiquetteMode',
    title: 'Etiquette Mode',
    description: 'No alerts after 11PM for better focus',
    iconLabel: '☾',
    accent: 'rose',
  },
];

export type SessionAuthDraft = {
  email: string;
  password: string;
};

export type SessionSignupDraft = {
  fullName: string;
  universityEmail: string;
  password: string;
  confirmPassword: string;
  major: string;
  studentId: string;
  emailToken: string;
};

export type SessionConsentState = {
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
};

export type SessionNotificationState = Record<NotificationKey, boolean>;

export type SessionPreferenceState = {
  interests: OnboardingInterest[];
  purpose: OnboardingPurpose | null;
};

export type SessionState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  auth: SessionAuthDraft;
  signup: SessionSignupDraft;
  consent: SessionConsentState;
  preferences: SessionPreferenceState;
  notifications: SessionNotificationState;
};
