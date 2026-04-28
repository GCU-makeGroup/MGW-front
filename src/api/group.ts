import type { ApiEnvelope } from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');

const ENDPOINTS = {
  join: (groupId: number | string) => `/groups/${groupId}/members`,
} as const;

export type JoinGroupResponse = {
  groupId: number;
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

export async function joinGroup(groupId: number, accessToken?: string) {
  return request<JoinGroupResponse>(
    `${API_BASE_URL}${ENDPOINTS.join(groupId)}`,
    {
      method: 'POST',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
    () =>
      buildMockEnvelope(200, '그룹 참여 성공', {
        groupId,
      }),
  );
}
