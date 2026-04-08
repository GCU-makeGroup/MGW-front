import type { OnboardingPurpose, SessionConsentState } from './session-types';

export const consentOptions: Array<{
  field: keyof SessionConsentState;
  title: string;
  description: string;
  linkLabel?: string;
}> = [
  {
    field: 'terms',
    title: 'Terms of Service',
    description:
      'I agree to the guidelines governing communication, intellectual property, and community standards on the Gachon Connect platform.',
    linkLabel: 'Read full policy',
  },
  {
    field: 'privacy',
    title: 'Privacy Policy',
    description:
      'I acknowledge how Gachon Connect collects, stores, and uses my academic and personal data to provide a personalized experience.',
    linkLabel: 'Read full policy',
  },
  {
    field: 'marketing',
    title: 'Marketing Consent (Optional)',
    description:
      'Receive updates about campus events, AI research opportunities, and academic symposia.',
  },
];

export const onboardingPurposeOptions: Array<{
  value: OnboardingPurpose;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'Academic Study',
    title: 'Academic Study',
    description: 'Connect with peer mentors and find focused study circles.',
    icon: '📘',
  },
  {
    value: 'Cultural Exchange',
    title: 'Cultural Exchange',
    description: 'Explore global perspectives and shared traditions.',
    icon: '🌐',
  },
  {
    value: 'Making Friends',
    title: 'Making Friends',
    description: 'Find your community and social activities on campus.',
    icon: '👥',
  },
];
