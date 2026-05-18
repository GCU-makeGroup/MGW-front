import { request } from './client';

// ---------------------------------------------------------------------------
// Backend DTO types (responses from actual endpoints)
// ---------------------------------------------------------------------------

/** Shape returned by GET /mypage?year=X&month=Y */
type MyPageMainResponse = {
  profile: {
    name: string;
    imageUrl: string | null;
    introduction: string;
  };
  summary: {
    activityCount: number;
    groupCount: number;
    point: number;
  };
  calendar: {
    year: number;
    month: number;
    selectedDate: string | null;
    schedules: Array<{ date: string; hasSchedule: boolean }>;
  };
};

/** Shape returned by GET /schedules?year=X&month=Y */
type ScheduleResponse = Array<{ date: string; hasSchedule: boolean }>;

// ---------------------------------------------------------------------------
// Internal DTO types used by mock fallbacks (endpoints that don't exist yet)
// ---------------------------------------------------------------------------

type MyPageFallbackContext = {
  displayName?: string;
  email?: string;
  major?: string;
};

type OverviewStatsDto = {
  postCount: number;
  groupCount: number;
  point: number;
};

type MyPageOverviewDto = {
  memberId: number;
  name: string;
  profileImageUrl: string | null;
  emailVerified: boolean;
  verifiedBadgeLabel: string;
  stats: OverviewStatsDto;
};

type SettingsProfileDto = {
  name: string;
  major: string;
  grade: string;
  academicVerified: boolean;
  profileImageUrl: string | null;
};

type MatchingCommunicationDto = {
  interestKeywords: string[];
  preferredLanguage: PreferredLanguage;
};

type NotificationSettingsDto = {
  newMessages: boolean;
  groupInvites: boolean;
  postComments: boolean;
  etiquetteMode: boolean;
  etiquetteStartTime: string;
  etiquetteEndTime: string;
};

type LanguageRegionDto = {
  appLanguage: AppLanguage;
};

type AccountSecurityDto = {
  studentId: string;
  department: string;
  twoFactorEnabled: boolean;
};

type SystemSettingsDto = {
  darkMode: boolean;
};

type MyPageSettingsDto = {
  profile: SettingsProfileDto;
  matchingCommunication: MatchingCommunicationDto;
  notifications: NotificationSettingsDto;
  languageRegion: LanguageRegionDto;
  accountSecurity: AccountSecurityDto;
  system: SystemSettingsDto;
};

// ---------------------------------------------------------------------------
// Exported view-model types (unchanged public API)
// ---------------------------------------------------------------------------

export type PreferredLanguage = 'KOREAN' | 'ENGLISH' | 'NONE';
export type AppLanguage = 'KOREAN' | 'ENGLISH';

export type MyPageOverviewViewModel = {
  memberId: number;
  name: string;
  major: string;
  verificationLabel: string;
  emailVerified: boolean;
  profileEmoji: string;
  stats: {
    posts: number;
    groups: number;
    points: number;
  };
};

export type AcademicCalendarDayViewModel = {
  key: string;
  label: string;
  inCurrentMonth: boolean;
  isSelected: boolean;
  hasEvents: boolean;
};

export type AcademicScheduleEventViewModel = {
  id: string;
  typeLabel: string;
  title: string;
  timeRange: string;
  location: string;
  joiningFriendsLabel: string;
  completed: boolean;
};

export type AcademicScheduleViewModel = {
  monthLabel: string;
  selectedDayLabel: string;
  selectedDateIso: string;
  days: AcademicCalendarDayViewModel[];
  events: AcademicScheduleEventViewModel[];
  trendingEvent: {
    badgeLabel: string;
    title: string;
    location: string;
  };
};

export type MyPageSettingsViewModel = {
  profile: {
    name: string;
    major: string;
    grade: string;
    academicVerified: boolean;
    profileEmoji: string;
  };
  matchingCommunication: {
    interestKeywords: string[];
    preferredLanguage: PreferredLanguage;
  };
  notifications: NotificationSettingsDto;
  languageRegion: LanguageRegionDto;
  accountSecurity: AccountSecurityDto;
  system: SystemSettingsDto;
};

export type UpdateProfileRequest = {
  name?: string;
  profileImageUrl?: string | null;
};

export type UpdateMatchingCommunicationRequest = {
  interestKeywords?: string[];
  preferredLanguage?: PreferredLanguage;
};

export type UpdateNotificationSettingsRequest = Partial<NotificationSettingsDto>;

export type UpdateAppLanguageRequest = {
  appLanguage: AppLanguage;
};

export type UpdateDarkModeRequest = {
  darkMode: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
}

function selectedDayLabel(year: number, month: number, day: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date(year, month - 1, day));
}

function buildCalendarDays(year: number, month: number, selectedDay: number, eventDays: number[]) {
  const days: AcademicCalendarDayViewModel[] = [];
  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const visibleCells = 35;

  for (let index = 0; index < visibleCells; index += 1) {
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

    days.push({
      key: `${safeYear}-${String(safeMonth).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`,
      label: String(dayNumber),
      inCurrentMonth,
      isSelected: inCurrentMonth && dayNumber === selectedDay,
      hasEvents: inCurrentMonth && eventDays.includes(dayNumber),
    });
  }

  return days;
}

function buildIdentity(context?: MyPageFallbackContext) {
  const displayName = context?.displayName?.trim() || 'Kim Min-jun';
  const email = context?.email?.trim() || 'student@gachon.ac.kr';
  const major = context?.major?.trim() || 'Software Engineering';

  return { displayName, email, major };
}

// ---------------------------------------------------------------------------
// View-model mappers
// ---------------------------------------------------------------------------

function mapOverviewFromBackend(
  data: MyPageMainResponse,
  context?: MyPageFallbackContext,
): MyPageOverviewViewModel {
  const identity = buildIdentity(context);
  const { profile, summary } = data;

  return {
    memberId: 0,
    name: profile.name || identity.displayName,
    major: identity.major,
    verificationLabel: 'Academic Verified',
    emailVerified: true,
    profileEmoji: '👨🏻‍💼',
    stats: {
      posts: summary.activityCount,
      groups: summary.groupCount,
      points: summary.point,
    },
  };
}

function mapSettings(dto: MyPageSettingsDto): MyPageSettingsViewModel {
  return {
    profile: {
      name: dto.profile.name,
      major: dto.profile.major,
      grade: dto.profile.grade,
      academicVerified: dto.profile.academicVerified,
      profileEmoji: '👨🏻‍💼',
    },
    matchingCommunication: dto.matchingCommunication,
    notifications: dto.notifications,
    languageRegion: dto.languageRegion,
    accountSecurity: dto.accountSecurity,
    system: dto.system,
  };
}

// ---------------------------------------------------------------------------
// Fallback data (mock)
// ---------------------------------------------------------------------------

function fallbackOverviewDto(context?: MyPageFallbackContext): MyPageOverviewDto {
  const identity = buildIdentity(context);

  return {
    memberId: 1,
    name: identity.displayName,
    profileImageUrl: null,
    emailVerified: true,
    verifiedBadgeLabel: 'Academic Verified',
    stats: {
      postCount: 24,
      groupCount: 8,
      point: 1250,
    },
  };
}

function fallbackSettingsDto(context?: MyPageFallbackContext): MyPageSettingsDto {
  const identity = buildIdentity(context);

  return {
    profile: {
      name: identity.displayName === 'Kim Min-jun' ? 'Alex Kim' : identity.displayName,
      major: identity.major,
      grade: 'Senior',
      academicVerified: true,
      profileImageUrl: null,
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

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function fetchMyPageOverview(
  context?: MyPageFallbackContext,
  yearMonth?: { year: number; month: number },
) {
  const now = new Date();
  const year = yearMonth?.year ?? now.getFullYear();
  const month = yearMonth?.month ?? now.getMonth() + 1;

  const data = await request<MyPageMainResponse>(
    `/mypage?year=${year}&month=${month}`,
    { method: 'GET' },
    () => {
      const dto = fallbackOverviewDto(context);
      return {
        profile: { name: dto.name, imageUrl: dto.profileImageUrl, introduction: '' },
        summary: {
          activityCount: dto.stats.postCount,
          groupCount: dto.stats.groupCount,
          point: dto.stats.point,
        },
        calendar: { year, month, selectedDate: 15, schedules: [] },
      } satisfies MyPageMainResponse;
    },
  );

  return mapOverviewFromBackend(data, context);
}

export async function fetchAcademicSchedule(yearMonth?: { year: number; month: number }) {
  const now = new Date();
  const year = yearMonth?.year ?? now.getFullYear();
  const month = yearMonth?.month ?? now.getMonth() + 1;

  const schedules = await request<ScheduleResponse>(
    `/schedules?year=${year}&month=${month}`,
    { method: 'GET' },
    () => [] as ScheduleResponse,
  );

  const eventDays = schedules.filter((s) => s.hasSchedule).map((s) => new Date(s.date).getDate());

  const selectedDay = now.getDate();
  const selectedDateIso = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  return {
    monthLabel: monthLabel(year, month),
    selectedDayLabel: selectedDayLabel(year, month, selectedDay),
    selectedDateIso,
    days: buildCalendarDays(year, month, selectedDay, eventDays),
    events: [],
    trendingEvent: {
      badgeLabel: 'HOT TRENDING',
      title: 'Career Fair 2023',
      location: 'Main Plaza',
    },
  } satisfies AcademicScheduleViewModel;
}

export async function logoutFromMyPage() {
  await request<void>('/auth/logout', { method: 'POST' }, () => undefined);
}

export async function updateMyPageProfile(requestBody: UpdateProfileRequest) {
  await request<void>('/mypage/profile', {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
  });
}

export async function fetchMyPageSettings(context?: MyPageFallbackContext) {
  const data = await request<MyPageSettingsDto>('/mypage/settings', { method: 'GET' }, () =>
    fallbackSettingsDto(context),
  );
  return mapSettings(data);
}

export async function updateMatchingCommunicationSettings(
  requestBody: UpdateMatchingCommunicationRequest,
) {
  await request<void>('/mypage/settings/matching-communication', {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
  });
}

export async function updateNotificationSettings(requestBody: UpdateNotificationSettingsRequest) {
  await request<void>('/mypage/settings/notifications', {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
  });
}

export async function updateAppLanguagePreference(requestBody: UpdateAppLanguageRequest) {
  await request<void>('/mypage/settings/app-language', {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
  });
}

export async function updateDarkModePreference(requestBody: UpdateDarkModeRequest) {
  await request<void>('/mypage/settings/dark-mode', {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
  });
}
