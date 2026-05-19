const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');
const API_PREFIX = '/api/v1';

type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  result: T;
};

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  const { getRefreshToken, setTokens, clearTokens } =
    await import('@/features/session/token-store');
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    window.location.href = '/onboard/login';
    return;
  }

  const res = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/token/reissue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    window.location.href = '/onboard/login';
    return;
  }

  const data: ApiResponse<{ accessToken: string; refreshToken: string }> = await res.json();
  setTokens(data.result.accessToken, data.result.refreshToken);
}

async function runWithRefresh<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      return fn();
    }
    throw error;
  }
}

export async function request<T>(
  path: string,
  init?: globalThis.RequestInit,
  fallback?: () => T,
): Promise<T> {
  if (!API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 200));
    return fallback!();
  }

  const doFetch = async (): Promise<T> => {
    const { getAccessToken } = await import('@/features/session/token-store');
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
      ...init,
      headers,
    });

    if (res.status === 204) {
      return undefined as T;
    }

    const text = await res.text();
    if (!text) {
      if (!res.ok) throw new ApiError(res.status, '', `요청 실패 (${res.status})`);
      return undefined as T;
    }

    const body: ApiResponse<unknown> = JSON.parse(text);

    if (!res.ok) {
      throw new ApiError(res.status, body.code ?? '', body.message ?? `요청 실패 (${res.status})`);
    }

    return body.result as T;
  };

  if (fallback) {
    return runWithRefresh(doFetch).catch((error) => {
      if (error instanceof ApiError && error.status === 401) {
        return fallback!();
      }
      throw error;
    });
  }
  return runWithRefresh(doFetch);
}

export async function uploadFile<T>(path: string, file: File, fallback?: () => T): Promise<T> {
  if (!API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 200));
    return fallback!();
  }

  const doFetch = async (): Promise<T> => {
    const { getAccessToken } = await import('@/features/session/token-store');
    const token = getAccessToken();
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const text = await res.text();
    if (!text) {
      if (!res.ok) throw new ApiError(res.status, '', `요청 실패 (${res.status})`);
      return undefined as T;
    }

    const body: ApiResponse<unknown> = JSON.parse(text);
    if (!res.ok) {
      throw new ApiError(res.status, body.code ?? '', body.message ?? `요청 실패 (${res.status})`);
    }
    return body.result as T;
  };

  if (fallback) {
    return runWithRefresh(doFetch).catch((error) => {
      if (error instanceof ApiError && error.status === 401) {
        return fallback!();
      }
      throw error;
    });
  }
  return runWithRefresh(doFetch);
}
