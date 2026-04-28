export type GroupCategoryFilter = 'all' | 'study' | 'project' | 'it';

export type GroupItem = {
  id: string;
  apiId: number;
  badges: string[];
  detailBadges?: string[];
  category: GroupCategoryFilter;
  title: string;
  description: string;
  detailDescription?: string;
  authorName: string;
  authorAvatar: string;
  currentParticipants: number;
  capacity: number;
  likes: number;
  comments: number;
  timeAgo: string;
  listThumbnailVariant?: 'portrait';
  detailVisualVariant?: 'wireframe' | 'portrait';
};

export type GroupComment = {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  message: string;
};

export const groupFilters: Array<{ value: GroupCategoryFilter; label: string }> = [
  { value: 'all', label: 'All Groups' },
  { value: 'study', label: 'Study' },
  { value: 'project', label: 'Project' },
  { value: 'it', label: 'IT' },
];

export const groupItems: GroupItem[] = [
  {
    id: 'gachon-uiux-design-study',
    apiId: 101,
    badges: ['Study', 'Design'],
    detailBadges: ['Design'],
    category: 'study',
    title: 'Gachon UI/UX Design Study',
    description:
      'Seeking 2 more members to join our weekly portfolio review sessions. We focus on Figma and UX case studies.',
    detailDescription:
      'Looking for Gachon students interested in UI/UX design. We will study the Stitch tool and Figma together. No experience required, just passion! Meeting every Tuesday at the IT Center.',
    authorName: 'Minjun Kim',
    authorAvatar: '🧑🏻‍🎨',
    currentParticipants: 4,
    capacity: 8,
    likes: 24,
    comments: 12,
    timeAgo: '2 mins ago',
    detailVisualVariant: 'wireframe',
  },
  {
    id: 'react-native-side-project',
    apiId: 102,
    badges: ['Project', 'IT'],
    category: 'project',
    title: 'React Native Side Project 📱',
    description:
      'Frontend/Backend recruitment for a campus food delivery app. Looking for React and Node teammates.',
    detailDescription:
      'We are building a campus food delivery app and need teammates for frontend, backend, and product planning. Weekly evening sprints, clear role sharing, and demo days every other Friday.',
    authorName: 'Sarah Lee',
    authorAvatar: '👩🏻‍💻',
    currentParticipants: 3,
    capacity: 6,
    likes: 8,
    comments: 4,
    timeAgo: '15 mins ago',
    detailVisualVariant: 'wireframe',
  },
  {
    id: 'toeic-morning-study',
    apiId: 103,
    badges: ['English', 'Study'],
    category: 'study',
    title: 'Toeic 900+ Morning Study ☕',
    description:
      'Location: IT Center. Early birds only! We practice LC and RC together before class.',
    detailDescription:
      'We meet before morning classes to solve LC and RC sets together. Bring your own materials and be ready to share weekly progress. Consistency matters more than prior scores.',
    authorName: 'James Park',
    authorAvatar: '👨🏻',
    currentParticipants: 5,
    capacity: 10,
    likes: 2,
    comments: 1,
    timeAgo: '1 hour ago',
    listThumbnailVariant: 'portrait',
    detailVisualVariant: 'portrait',
  },
];

export function isGroupFull(group: GroupItem) {
  return group.currentParticipants >= group.capacity;
}

export const groupComments: Record<string, GroupComment[]> = {
  'gachon-uiux-design-study': [
    {
      id: 'comment-1',
      author: 'Sarah Lee',
      avatar: '👩🏻',
      timeAgo: '1 min ago',
      message: 'Can I join even if I’m a freshman? I really want to learn Figma!',
    },
    {
      id: 'comment-2',
      author: 'James Park',
      avatar: '👨🏻',
      timeAgo: 'Just now',
      message: 'I’m interested! I’ve used Figma a bit but want to get better. See you Tuesday!',
    },
  ],
  'react-native-side-project': [
    {
      id: 'comment-3',
      author: 'Jisoo Han',
      avatar: '👩🏻‍🦱',
      timeAgo: '4 mins ago',
      message: 'Is there still an opening for someone who can help with product design?',
    },
  ],
};

export const newPostCategories = ['Study', 'Project', 'Hobby', 'Sports', 'Language'] as const;
