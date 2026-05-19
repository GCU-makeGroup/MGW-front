export type ActivityCategory =
  | 'ai-tech'
  | 'wellness'
  | 'design'
  | 'study'
  | 'language'
  | 'hobby'
  | 'sports';

export const CATEGORY_MAP: Record<string, ActivityCategory> = {
  Study: 'study',
  Language: 'language',
  Hobby: 'hobby',
  Sports: 'sports',
  'AI & Tech': 'ai-tech',
  Wellness: 'wellness',
  Design: 'design',
};

export function formatSchedule(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export type JoinMode = 'individual' | 'group';
export type MyActivityTab = 'joined' | 'created';
export type MyActivityStatus = 'active' | 'completed' | 'upcoming';

export type ActivityGroupOption = {
  id: string;
  name: string;
  subtitle: string;
  members: number;
  activeLabel: string;
  selected?: boolean;
};

export type ActivityMember = {
  userId: number;
  name: string;
  profileImg: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: ActivityCategory;
  categoryLabel: string;
  badgeLabel: string;
  membersLabel: string;
  location: string;
  schedule: string;
  seatsLeft: number;
  maxMembers: number;
  imageVariant: 'founders' | 'summit' | 'studio' | 'lab';
  isHotPick?: boolean;
  liked: boolean;
  joinState: 'available' | 'joined' | 'full' | 'creator';
  kakaoOpenChatLink?: string;
  groupOptions?: ActivityGroupOption[];
  members: ActivityMember[];
};

export type MyActivityItem = {
  id: string;
  tab: MyActivityTab;
  title: string;
  memberLabel: string;
  status: MyActivityStatus;
  icon: string;
  liked?: boolean;
};

export const activityFilters: Array<{ value: ActivityCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'ai-tech', label: 'AI& TECH' },
  { value: 'wellness', label: 'WELLNESS' },
  { value: 'design', label: 'DESIGN' },
];

export const newActivityCategories = ['Study', 'Language', 'Hobby', 'Sports'] as const;

export const activityItems: ActivityItem[] = [
  {
    id: 'gachon-founders-weekend',
    title: 'Gachon Founders Weekend 2024',
    subtitle: 'Hot pick activity',
    description:
      'Startup-minded students gather for a weekend sprint with rapid mentoring, prototyping, and final pitch sessions.',
    category: 'ai-tech',
    categoryLabel: 'AI & TECH',
    badgeLabel: 'HOT',
    membersLabel: '42 MEMBERS',
    location: 'Innovation Hub',
    schedule: 'Oct 24, 2024',
    seatsLeft: 5,
    maxMembers: 42,
    imageVariant: 'founders',
    isHotPick: true,
    liked: true,
    joinState: 'available',
    members: [],
    groupOptions: [
      {
        id: 'neural-networks-team',
        name: 'Neural Networks Team',
        subtitle: 'Last active 2h ago',
        members: 5,
        activeLabel: '5 members',
      },
      {
        id: 'digital-humanities-archive',
        name: 'Digital Humanities Archive',
        subtitle: 'Last active 1d ago',
        members: 12,
        activeLabel: '12 members',
      },
      {
        id: 'astrophysics-lab-b',
        name: 'Astrophysics Lab B',
        subtitle: 'Active now',
        members: 8,
        activeLabel: '8 members',
        selected: true,
      },
    ],
  },
  {
    id: 'global-ai-ethics-summit',
    title: 'Global AI Ethics Summit',
    description:
      'An expert-led event on policy, fairness, and responsible AI development across academia and industry.',
    category: 'ai-tech',
    categoryLabel: 'GLOBAL SUMMIT',
    badgeLabel: '128 MEMBERS',
    membersLabel: '128 MEMBERS',
    location: 'Grand Auditorium',
    schedule: 'Tue, Nov 15 • 10:00 AM',
    seatsLeft: 18,
    maxMembers: 128,
    imageVariant: 'summit',
    liked: true,
    joinState: 'available',
    members: [],
  },
  {
    id: 'gachon-dev-studio-weekly-sprint',
    title: 'Gachon Dev Studio Weekly Sprint',
    description:
      'A collaborative session focusing on product delivery, frontend polishing, and design critique in one room.',
    category: 'ai-tech',
    categoryLabel: 'AI & TECH',
    badgeLabel: 'HOT TRENDING',
    membersLabel: '24 MEMBERS',
    location: 'AI Hall, Room 302',
    schedule: 'Every Wednesday, 14:00',
    seatsLeft: 3,
    maxMembers: 24,
    imageVariant: 'studio',
    liked: false,
    joinState: 'available',
    kakaoOpenChatLink: 'https://open.kakao.com/o/gachon-dev-studio',
    members: [],
    groupOptions: [
      {
        id: 'neural-networks-team',
        name: 'Neural Networks Team',
        subtitle: 'Last active 2h ago',
        members: 5,
        activeLabel: '5 members',
      },
      {
        id: 'digital-humanities-archive',
        name: 'Digital Humanities Archive',
        subtitle: 'Last active 1d ago',
        members: 12,
        activeLabel: '12 members',
      },
      {
        id: 'astrophysics-lab-b',
        name: 'Astrophysics Lab B',
        subtitle: 'Active now',
        members: 8,
        activeLabel: '8 members',
        selected: true,
      },
    ],
  },
  {
    id: 'midnight-run-club',
    title: 'Midnight Run Club',
    description:
      'For students who want a low-pressure fitness group after classes. Light warm-up, 5km jog, cool-down chat.',
    category: 'wellness',
    categoryLabel: 'WELLNESS',
    badgeLabel: '18 MEMBERS',
    membersLabel: '18 MEMBERS',
    location: 'Main Track',
    schedule: 'Fri, 8:30 PM',
    seatsLeft: 0,
    maxMembers: 18,
    imageVariant: 'lab',
    liked: false,
    joinState: 'full',
    members: [],
  },
];

export function getActivityById(activityId: string) {
  return activityItems.find((activity) => activity.id === activityId) ?? activityItems[0];
}

export const myActivityItems: MyActivityItem[] = [
  {
    id: 'gachon-dev-studio-weekly-sprint',
    tab: 'joined',
    title: 'Advanced Algorithms Study Group',
    memberLabel: '6/8 MEMBERS',
    status: 'active',
    icon: '▱',
    liked: true,
  },
  {
    id: 'midnight-run-club',
    tab: 'joined',
    title: 'Weekly Futsal Match',
    memberLabel: '14 MEMBERS',
    status: 'completed',
    icon: '◉',
    liked: false,
  },
  {
    id: 'global-ai-ethics-summit',
    tab: 'joined',
    title: 'UI/UX Design Masterclass',
    memberLabel: '22 MEMBERS',
    status: 'upcoming',
    icon: '●',
    liked: false,
  },
  {
    id: 'gachon-dev-studio-weekly-sprint',
    tab: 'created',
    title: 'Web Development Study Jam',
    memberLabel: '8 MEMBERS',
    status: 'active',
    icon: '□',
  },
  {
    id: 'global-ai-ethics-summit',
    tab: 'created',
    title: 'Career Growth Workshop',
    memberLabel: '24 MEMBERS',
    status: 'active',
    icon: '✦',
  },
  {
    id: 'midnight-run-club',
    tab: 'created',
    title: 'Autumn Campus Walk',
    memberLabel: '6 MEMBERS',
    status: 'completed',
    icon: '⚑',
  },
  {
    id: 'gachon-founders-weekend',
    tab: 'created',
    title: 'Public Speaking Club',
    memberLabel: '16 MEMBERS',
    status: 'upcoming',
    icon: '▮',
  },
  {
    id: 'gachon-dev-studio-weekly-sprint',
    tab: 'created',
    title: 'Book Club : Think & Share',
    memberLabel: '12 MEMBERS',
    status: 'active',
    icon: '▣',
  },
  {
    id: 'global-ai-ethics-summit',
    tab: 'created',
    title: 'Coffee Chat Networking',
    memberLabel: '10 MEMBERS',
    status: 'upcoming',
    icon: '☕',
  },
];

export function getMyActivityById(activityId: string) {
  return myActivityItems.find((activity) => activity.id === activityId) ?? myActivityItems[0];
}
