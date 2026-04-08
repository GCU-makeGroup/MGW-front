import type { NotificationCardData, PurposeCardData } from './types';

export const interests = [
  '#Back-end',
  '#Guitar',
  '#K-Pop',
  '#Gaming',
  '#AI & Tech',
  '#Architecture',
  '#Literature',
];

export const purposeCards: PurposeCardData[] = [
  {
    title: 'Academic Study',
    description: 'Connect with peer mentors and find focused study circles.',
    icon: 'book',
  },
  {
    title: 'Cultural Exchange',
    description: 'Explore global perspectives and shared traditions.',
    icon: 'globe',
  },
  {
    title: 'Making Friends',
    description: 'Find your community and social activities on campus.',
    icon: 'people',
  },
];

export const consentItems = [
  {
    title: 'Terms of Service',
    description:
      'I agree to the guidelines governing communication, intellectual property, and community standards on the Gachon Connect platform.',
    linkLabel: 'READ FULL POLICY',
  },
  {
    title: 'Privacy Policy',
    description:
      'I acknowledge how Gachon Connect collects, stores, and uses my academic and personal data to provide a personalized experience.',
    linkLabel: 'READ FULL POLICY',
  },
  {
    title: 'Marketing Consent',
    description:
      'Receive updates about campus events, AI research opportunities, and academic symposia.',
    detail: 'Optional',
  },
];

export const notificationItems: NotificationCardData[] = [
  {
    title: 'New Messages',
    description: 'Real-time alerts for private chats',
    icon: 'message',
    tone: 'neutral',
  },
  {
    title: 'Group Invites',
    description: 'When someone adds you to a study group',
    icon: 'group',
    tone: 'neutral',
  },
  {
    title: 'Etiquette Mode',
    description: 'No alerts after 11PM for better focus',
    icon: 'moon',
    tone: 'rose',
  },
];
