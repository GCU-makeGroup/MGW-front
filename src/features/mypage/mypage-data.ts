import type {
  AcademicScheduleViewModel,
  AppLanguage,
  MyPageOverviewViewModel,
  MyPageSettingsViewModel,
  PreferredLanguage,
} from '../../api/mypage';
import type { SessionState } from '../session/session-types';

export type MyPageAccountItem = {
  key: string;
  label: string;
  icon: string;
  href?: string;
  disabled?: boolean;
};

export const weekdayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

export const accountItems: MyPageAccountItem[] = [
  {
    key: 'posts',
    label: 'My Posts',
    icon: '🧾',
    disabled: true,
  },
  {
    key: 'activity-history',
    label: 'Activity History',
    icon: '🕘',
    disabled: true,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: '⚙️',
    href: '/mypage/settings',
  },
  {
    key: 'privacy',
    label: 'Privacy',
    icon: '🔒',
    disabled: true,
  },
];

export const keywordSuggestions = ['AI', 'Design', 'Start-up', 'Front-end'] as const;

export const preferredLanguageOptions: Array<{
  label: string;
  value: PreferredLanguage;
}> = [
  {
    label: 'Korean',
    value: 'KOREAN',
  },
  {
    label: 'English',
    value: 'ENGLISH',
  },
  {
    label: 'None',
    value: 'NONE',
  },
];

export const appLanguageLabels: Record<AppLanguage, string> = {
  KOREAN: 'Korean',
  ENGLISH: 'English',
};

export type MyPageFallbackContext = {
  displayName: string;
  major: string;
  registeredEmail: string;
};

function buildIdentity(state: SessionState): MyPageFallbackContext {
  const fullName = state.signup.fullName.trim();
  const authEmail = state.auth.email.trim().toLowerCase();
  const emailPrefix = authEmail ? authEmail.split('@')[0] : '';

  return {
    displayName:
      fullName ||
      (emailPrefix
        ? emailPrefix
            .split(/[._-]/)
            .filter(Boolean)
            .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
            .join(' ')
        : 'Kim Min-jun'),
    major: state.signup.major.trim() || 'Software Engineering',
    registeredEmail:
      authEmail || `${state.signup.universityEmail.trim() || 'student'}@gachon.ac.kr`,
  };
}

function buildScheduleDays(selectedDateIso: string): AcademicScheduleViewModel['days'] {
  const [year, month] = selectedDateIso.split('-').map(Number);
  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const visibleCells = 42;

  return Array.from({ length: visibleCells }, (_, index) => {
    const cellOffset = index - firstDayIndex + 1;
    const inCurrentMonth = cellOffset >= 1 && cellOffset <= totalDaysInMonth;
    const dayNumber = inCurrentMonth
      ? cellOffset
      : cellOffset <= 0
        ? totalDaysInPrevMonth + cellOffset
        : cellOffset - totalDaysInMonth;
    const calendarMonth = inCurrentMonth ? month : cellOffset <= 0 ? month - 1 : month + 1;
    const safeMonth = calendarMonth === 0 ? 12 : calendarMonth === 13 ? 1 : calendarMonth;
    const safeYear = calendarMonth === 0 ? year - 1 : calendarMonth === 13 ? year + 1 : year;
    const key = `${safeYear}-${String(safeMonth).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

    return {
      key,
      label: String(dayNumber),
      inCurrentMonth,
      isSelected: key === selectedDateIso,
      hasEvents: key === selectedDateIso,
    };
  });
}

export function createMyPageFallbackContext(state: SessionState): MyPageFallbackContext {
  return buildIdentity(state);
}

export function createInitialOverview(state: SessionState): MyPageOverviewViewModel {
  const identity = buildIdentity(state);

  return {
    memberId: 1,
    name: identity.displayName,
    major: identity.major,
    verificationLabel: 'ACADEMIC VERIFIED',
    emailVerified: true,
    profileEmoji: '👨🏻‍💼',
    profileImageUrl: undefined,
    stats: {
      posts: 0,
      groups: 8,
      activities: 24,
      points: 1250,
    },
  };
}

export function createInitialSchedule(): AcademicScheduleViewModel {
  const selectedDateIso = '2024-11-15';

  return {
    monthLabel: 'November 2024',
    selectedDayLabel: 'November 15, Wednesday',
    selectedDateIso,
    days: buildScheduleDays(selectedDateIso),
    events: [
      {
        id: 'team-meeting',
        typeLabel: 'SEMINAR',
        title: 'Team Meeting: AI Lab',
        timeRange: '13:00 - 14:30',
        location: 'Room 302',
        joiningFriendsLabel: '3 of your friends are joining',
        completed: true,
      },
    ],
    trendingEvent: {
      badgeLabel: 'HOT TRENDING',
      title: 'Career Fair 2023',
      location: 'Main Plaza',
    },
  };
}

export function createInitialSettings(state: SessionState): MyPageSettingsViewModel {
  const identity = buildIdentity(state);

  return {
    profile: {
      name: identity.displayName === 'Kim Min-jun' ? 'Alex Kim' : identity.displayName,
      major: identity.major,
      grade: 'Senior',
      academicVerified: true,
      profileEmoji: '👨🏻‍💼',
    },
    matchingCommunication: {
      interestKeywords: ['Back-end', 'Guitar', 'K-Pop'],
      preferredLanguage: 'KOREAN',
    },
    notifications: {
      newMessages: true,
      groupInvites: true,
      postComments: false,
      etiquetteMode: true,
      etiquetteStartTime: '23:00',
      etiquetteEndTime: '07:00',
    },
    languageRegion: {
      appLanguage: 'ENGLISH',
    },
    accountSecurity: {
      studentId: '2021034920',
      department: 'Dept Of College of AI & Software',
      twoFactorEnabled: false,
    },
    system: {
      darkMode: false,
    },
  };
}
