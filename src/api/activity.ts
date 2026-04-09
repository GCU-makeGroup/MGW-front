import type { ApiEnvelope } from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');

const ENDPOINTS = {
  list: '/activities',
  detail: (activityId: string) => `/activities/${activityId}`,
  create: '/activities',
  join: (activityId: string) => `/activities/${activityId}/members`,
  like: (activityId: string) => `/activities/${activityId}/likes`,
} as const;

export type ActivitySummaryResponse = {
  activityId: string;
  title: string;
  subtitle?: string;
  description: string;
  maxMembers: number;
  currentMembers: number;
};

export type ActivityDetailResponse = ActivitySummaryResponse & {
  location: string;
  schedule: string;
  liked: boolean;
};

export type CreateActivityRequest = {
  title: string;
  subtitle?: string;
  description: string;
  maxMembers: number;
  category: string;
  schedule: string;
  kakaoOpenChatLink?: string;
};

export type CreateActivityResponse = {
  activityId: number;
};

function buildMockEnvelope<T>(status: number, message: string, data: T): ApiEnvelope<T> {
  return { status, message, data };
}

async function pause(ms: number) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function parseJsonResponse<T>(response: Response): Promise<ApiEnvelope<T>> {
  const text = await response.text();

  if (!text) {
    throw new Error('서버 응답이 비어 있습니다.');
  }

  return JSON.parse(text) as ApiEnvelope<T>;
}

async function request<TResponse>(
  input: string,
  init: Parameters<typeof fetch>[1],
  fallback: () => ApiEnvelope<TResponse>,
): Promise<ApiEnvelope<TResponse>> {
  if (!API_BASE_URL) {
    await pause(250);
    return fallback();
  }

  const response = await fetch(input, init);

  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`;

    try {
      const payload = await response.json();
      if (typeof payload?.message === 'string') {
        message = payload.message;
      }
    } catch {
      // Keep the default message.
    }

    throw new Error(message);
  }

  return parseJsonResponse<TResponse>(response);
}

export async function fetchActivities(accessToken?: string) {
  return request<ActivitySummaryResponse[]>(
    `${API_BASE_URL}${ENDPOINTS.list}`,
    {
      method: 'GET',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    () => buildMockEnvelope(200, '액티비티 목록 조회 성공', []),
  );
}

export async function fetchActivityDetail(activityId: string, accessToken?: string) {
  return request<ActivityDetailResponse>(
    `${API_BASE_URL}${ENDPOINTS.detail(activityId)}`,
    {
      method: 'GET',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    () =>
      buildMockEnvelope(200, '액티비티 상세 조회 성공', {
        activityId,
        title: 'Gachon Dev Studio Weekly Sprint',
        subtitle: 'AI & TECH',
        description: 'A collaborative session focusing on product delivery.',
        maxMembers: 24,
        currentMembers: 21,
        location: 'AI Hall, Room 302',
        schedule: 'Every Wednesday, 14:00',
        liked: false,
      }),
  );
}

export async function createActivity(requestBody: CreateActivityRequest, accessToken?: string) {
  return request<CreateActivityResponse>(
    `${API_BASE_URL}${ENDPOINTS.create}`,
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
      body: JSON.stringify(requestBody),
    },
    () =>
      buildMockEnvelope(201, '액티비티 생성 성공', {
        activityId: Date.now(),
      }),
  );
}

export async function joinActivity(activityId: string, accessToken?: string) {
  return request<null>(
    `${API_BASE_URL}${ENDPOINTS.join(activityId)}`,
    {
      method: 'POST',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    () => buildMockEnvelope(200, '액티비티 참여 성공', null),
  );
}

export async function likeActivity(activityId: string, accessToken?: string) {
  return request<null>(
    `${API_BASE_URL}${ENDPOINTS.like(activityId)}`,
    {
      method: 'POST',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    () => buildMockEnvelope(200, '액티비티 좋아요 성공', null),
  );
}

export async function unlikeActivity(activityId: string, accessToken?: string) {
  return request<null>(
    `${API_BASE_URL}${ENDPOINTS.like(activityId)}`,
    {
      method: 'DELETE',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    () => buildMockEnvelope(200, '액티비티 좋아요 취소 성공', null),
  );
}
