const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');

const ENDPOINTS = {
  overview: '/mypage',
  schedule: '/mypage/schedule',
  profile: '/mypage/profile',
  logout: '/auth/logout',
  settings: '/mypage/settings',
  matchingCommunication: '/mypage/settings/matching-communication',
  notifications: '/mypage/settings/notifications',
  appLanguage: '/mypage/settings/app-language',
  darkMode: '/mypage/settings/dark-mode',
} as const;

type MyPageApiEnvelope<TResult> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: TResult;
};

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

type AcademicScheduleDto = {
  year: number;
  month: number;
  selectedDay: number;
  events: Array<{
    id: string;
    typeLabel: string;
    title: string;
    timeRange: string;
    location: string;
    joiningFriendsLabel: string;
    completed: boolean;
  }>;
  trendingEvent: {
    badgeLabel: string;
    title: string;
    location: string;
  };
};

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

function pause(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

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

function parseResponse<TResult>(text: string): MyPageApiEnvelope<TResult> {
  if (!text) {
    throw new Error('서버 응답이 비어 있습니다.');
  }

  return JSON.parse(text) as MyPageApiEnvelope<TResult>;
}

async function request<TResult>(
  endpoint: string,
  init: globalThis.RequestInit,
  fallback: () => MyPageApiEnvelope<TResult>,
) {
  if (!API_BASE_URL) {
    await pause(220);
    return fallback();
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, init);

  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`;

    try {
      const payload = (await response.json()) as { message?: string };
      if (typeof payload.message === 'string') {
        message = payload.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return parseResponse<TResult>(await response.text());
}

function buildIdentity(context?: MyPageFallbackContext) {
  const displayName = context?.displayName?.trim() || 'Kim Min-jun';
  const email = context?.email?.trim() || 'student@gachon.ac.kr';
  const major = context?.major?.trim() || 'Software Engineering';

  return { displayName, email, major };
}

function mapOverview(
  dto: MyPageOverviewDto,
  context?: MyPageFallbackContext,
): MyPageOverviewViewModel {
  const identity = buildIdentity(context);

  return {
    memberId: dto.memberId,
    name: dto.name || identity.displayName,
    major: identity.major,
    verificationLabel: dto.verifiedBadgeLabel,
    emailVerified: dto.emailVerified,
    profileEmoji: '👨🏻‍💼',
    stats: {
      posts: dto.stats.postCount,
      groups: dto.stats.groupCount,
      points: dto.stats.point,
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

function mapSchedule(dto: AcademicScheduleDto): AcademicScheduleViewModel {
  const eventDays = [dto.selectedDay];
  const selectedDateIso = `${dto.year}-${String(dto.month).padStart(2, '0')}-${String(dto.selectedDay).padStart(2, '0')}`;

  return {
    monthLabel: monthLabel(dto.year, dto.month),
    selectedDayLabel: selectedDayLabel(dto.year, dto.month, dto.selectedDay),
    selectedDateIso,
    days: buildCalendarDays(dto.year, dto.month, dto.selectedDay, eventDays),
    events: dto.events,
    trendingEvent: dto.trendingEvent,
  };
}

function fallbackOverview(context?: MyPageFallbackContext): MyPageApiEnvelope<MyPageOverviewDto> {
  const identity = buildIdentity(context);

  return {
    isSuccess: true,
    code: 'COMMON200',
    message: '성공입니다.',
    result: {
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
    },
  };
}

function fallbackSchedule(): MyPageApiEnvelope<AcademicScheduleDto> {
  return {
    isSuccess: true,
    code: 'COMMON200',
    message: '일정 조회 성공',
    result: {
      year: 2024,
      month: 11,
      selectedDay: 15,
      events: [
        {
          id: 'team-meeting',
          typeLabel: 'Seminar',
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
    },
  };
}

function fallbackSettings(context?: MyPageFallbackContext): MyPageApiEnvelope<MyPageSettingsDto> {
  const identity = buildIdentity(context);

  return {
    isSuccess: true,
    code: 'SETTING2001',
    message: '설정 조회에 성공했습니다.',
    result: {
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
    },
  };
}

export async function fetchMyPageOverview(accessToken?: string, context?: MyPageFallbackContext) {
  const response = await request<MyPageOverviewDto>(
    ENDPOINTS.overview,
    {
      method: 'GET',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    () => fallbackOverview(context),
  );

  return mapOverview(response.result, context);
}

export async function fetchAcademicSchedule(accessToken?: string) {
  const response = await request<AcademicScheduleDto>(
    `${ENDPOINTS.schedule}?month=2024-11`,
    {
      method: 'GET',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    fallbackSchedule,
  );

  return mapSchedule(response.result);
}

export async function updateMyPageProfile(requestBody: UpdateProfileRequest, accessToken?: string) {
  const response = await request<MyPageOverviewDto>(
    ENDPOINTS.profile,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: JSON.stringify(requestBody),
    },
    () => ({
      isSuccess: true,
      code: 'MEMBER2001',
      message: '프로필 수정이 완료되었습니다.',
      result: {
        ...fallbackOverview().result,
        name: requestBody.name ?? fallbackOverview().result.name,
        profileImageUrl: requestBody.profileImageUrl ?? null,
      },
    }),
  );

  return mapOverview(response.result);
}

export async function logoutFromMyPage(accessToken?: string, refreshToken?: string | null) {
  await request<Record<string, never>>(
    ENDPOINTS.logout,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: JSON.stringify(
        refreshToken
          ? {
              refreshToken,
            }
          : {},
      ),
    },
    () => ({
      isSuccess: true,
      code: 'AUTH2003',
      message: '로그아웃되었습니다.',
      result: {},
    }),
  );
}

export async function fetchMyPageSettings(accessToken?: string, context?: MyPageFallbackContext) {
  const response = await request<MyPageSettingsDto>(
    ENDPOINTS.settings,
    {
      method: 'GET',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    () => fallbackSettings(context),
  );

  return mapSettings(response.result);
}

export async function updateMatchingCommunicationSettings(
  requestBody: UpdateMatchingCommunicationRequest,
  accessToken?: string,
) {
  const response = await request<MatchingCommunicationDto>(
    ENDPOINTS.matchingCommunication,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: JSON.stringify(requestBody),
    },
    () => ({
      isSuccess: true,
      code: 'SETTING2002',
      message: '관심 키워드 및 선호 언어가 수정되었습니다.',
      result: {
        interestKeywords: requestBody.interestKeywords ?? ['Back-end', 'Guitar', 'K-Pop'],
        preferredLanguage: requestBody.preferredLanguage ?? 'KOREAN',
      },
    }),
  );

  return response.result;
}

export async function updateNotificationSettings(
  requestBody: UpdateNotificationSettingsRequest,
  accessToken?: string,
) {
  const response = await request<NotificationSettingsDto>(
    ENDPOINTS.notifications,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: JSON.stringify(requestBody),
    },
    () => ({
      isSuccess: true,
      code: 'SETTING2003',
      message: '알림 설정이 수정되었습니다.',
      result: {
        newMessages: requestBody.newMessages ?? true,
        groupInvites: requestBody.groupInvites ?? true,
        postComments: requestBody.postComments ?? false,
        etiquetteMode: requestBody.etiquetteMode ?? true,
        etiquetteStartTime: requestBody.etiquetteStartTime ?? '23:00',
        etiquetteEndTime: requestBody.etiquetteEndTime ?? '07:00',
      },
    }),
  );

  return response.result;
}

export async function updateAppLanguagePreference(
  requestBody: UpdateAppLanguageRequest,
  accessToken?: string,
) {
  const response = await request<LanguageRegionDto>(
    ENDPOINTS.appLanguage,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: JSON.stringify(requestBody),
    },
    () => ({
      isSuccess: true,
      code: 'SETTING2004',
      message: '앱 언어가 변경되었습니다.',
      result: requestBody,
    }),
  );

  return response.result;
}

export async function updateDarkModePreference(
  requestBody: UpdateDarkModeRequest,
  accessToken?: string,
) {
  const response = await request<SystemSettingsDto>(
    ENDPOINTS.darkMode,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: JSON.stringify(requestBody),
    },
    () => ({
      isSuccess: true,
      code: 'SETTING2005',
      message: '다크모드 설정이 변경되었습니다.',
      result: requestBody,
    }),
  );

  return response.result;
}
