import { request } from './client';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  accessToken: string;
  refreshToken: string;
  memberId: number;
  email: string;
  name: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  name: string;
};

export type SignupResponseData = {
  memberId: number;
  email: string;
  name: string;
};

export type EmailCodeRequest = {
  email: string;
};

export type EmailCodeVerifyRequest = {
  email: string;
  code: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponseData = {
  accessToken: string;
};

const ENDPOINTS = {
  login: '/auth/login',
  signup: '/auth/signup',
  sendEmailCode: '/auth/email-verification/send',
  resendEmailCode: '/auth/email-verification/resend',
  verifyEmailCode: '/auth/email-verification/verify',
  refreshToken: '/auth/token/reissue',
  logout: '/auth/logout',
} as const;

function buildMockToken(prefix: string, seed: string) {
  const normalizedSeed = seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  return `${prefix}.${normalizedSeed || 'demo'}.${Math.random().toString(36).slice(2, 10)}`;
}

export async function login(requestBody: LoginRequest): Promise<LoginResponseData> {
  return request<LoginResponseData>(
    ENDPOINTS.login,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    },
    () => ({
      accessToken: buildMockToken('access', requestBody.email),
      refreshToken: buildMockToken('refresh', requestBody.email),
      memberId: 1,
      email: requestBody.email,
      name: 'Mock User',
    }),
  );
}

export async function signup(requestBody: SignupRequest): Promise<SignupResponseData> {
  return request<SignupResponseData>(
    ENDPOINTS.signup,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    },
    () => ({
      memberId: 1,
      email: requestBody.email,
      name: requestBody.name,
    }),
  );
}

export async function sendEmailCode(requestBody: EmailCodeRequest): Promise<void> {
  return request<void>(
    ENDPOINTS.sendEmailCode,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    },
    () => undefined,
  );
}

export async function resendEmailCode(requestBody: EmailCodeRequest): Promise<void> {
  return request<void>(
    ENDPOINTS.resendEmailCode,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    },
    () => undefined,
  );
}

export async function verifyEmailCode(requestBody: EmailCodeVerifyRequest): Promise<void> {
  return request<void>(
    ENDPOINTS.verifyEmailCode,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    },
    () => undefined,
  );
}

export async function refreshAccessToken(
  requestBody: RefreshTokenRequest,
): Promise<RefreshTokenResponseData> {
  return request<RefreshTokenResponseData>(
    ENDPOINTS.refreshToken,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    },
    () => ({
      accessToken: buildMockToken('access', requestBody.refreshToken),
    }),
  );
}

export async function logout(): Promise<void> {
  return request<void>(
    ENDPOINTS.logout,
    {
      method: 'POST',
    },
    () => undefined,
  );
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return request<void>('/auth/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function withdrawAccount(): Promise<void> {
  return request<void>('/auth/withdraw', { method: 'DELETE' });
}
