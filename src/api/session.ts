export type ApiEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  grantType: 'Bearer';
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
};

export type SignupRequest = {
  email: string;
  password: string;
  name: string;
  major?: string;
  studentId?: number;
  emailToken?: string;
};

export type SignupResponseData = null;

export type EmailCodeRequest = {
  email: string;
};

export type EmailCodeVerifyRequest = {
  email: string;
  code: string;
};

export type EmailCodeVerifyResponseData = {
  emailToken: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponseData = {
  accessToken: string;
  accessTokenExpiresIn: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');

const ENDPOINTS = {
  login: '/auth/login',
  signup: '/auth/signup',
  sendEmailCode: '/auth/email/send-code',
  resendEmailCode: '/auth/email/resend-code',
  verifyEmailCode: '/auth/email/verify-code',
  refreshToken: '/auth/token/refresh',
} as const;

function buildMockToken(prefix: string, seed: string) {
  const normalizedSeed = seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  return `${prefix}.${normalizedSeed || 'demo'}.${Math.random().toString(36).slice(2, 10)}`;
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

async function request<TResponse, TRequest>(
  endpoint: string,
  body: TRequest,
  fallback: () => ApiEnvelope<TResponse>,
): Promise<ApiEnvelope<TResponse>> {
  if (!API_BASE_URL) {
    await pause(250);
    return fallback();
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`;

    try {
      const payload = await response.json();
      if (typeof payload?.message === 'string') {
        message = payload.message;
      }
    } catch {
      // Keep the default error message when the server does not return JSON.
    }

    throw new Error(message);
  }

  return parseJsonResponse<TResponse>(response);
}

export async function login(requestBody: LoginRequest) {
  return request<LoginResponseData, LoginRequest>(ENDPOINTS.login, requestBody, () => ({
    status: 200,
    message: '로그인에 성공했습니다.',
    data: {
      grantType: 'Bearer',
      accessToken: buildMockToken('access', requestBody.email),
      refreshToken: buildMockToken('refresh', requestBody.email),
      accessTokenExpiresIn: 1_800_000,
    },
  }));
}

export async function signup(requestBody: SignupRequest) {
  return request<SignupResponseData, SignupRequest>(ENDPOINTS.signup, requestBody, () => ({
    status: 201,
    message: '회원가입이 완료되었습니다.',
    data: null,
  }));
}

export async function sendEmailCode(requestBody: EmailCodeRequest) {
  return request<void, EmailCodeRequest>(ENDPOINTS.sendEmailCode, requestBody, () => ({
    status: 200,
    message: '이메일로 인증 코드가 발송되었습니다. (유효시간 5분)',
    data: undefined,
  }));
}

export async function resendEmailCode(requestBody: EmailCodeRequest) {
  return request<void, EmailCodeRequest>(ENDPOINTS.resendEmailCode, requestBody, () => ({
    status: 200,
    message: '이메일로 인증 코드가 재발송되었습니다. (유효시간 5분)',
    data: undefined,
  }));
}

export async function verifyEmailCode(requestBody: EmailCodeVerifyRequest) {
  return request<EmailCodeVerifyResponseData, EmailCodeVerifyRequest>(
    ENDPOINTS.verifyEmailCode,
    requestBody,
    () => ({
      status: 200,
      message: '이메일 인증이 완료되었습니다.',
      data: {
        emailToken: buildMockToken('email', requestBody.email),
      },
    }),
  );
}

export async function refreshAccessToken(requestBody: RefreshTokenRequest) {
  return request<RefreshTokenResponseData, RefreshTokenRequest>(
    ENDPOINTS.refreshToken,
    requestBody,
    () => ({
      status: 200,
      message: 'AccessToken이 재발급되었습니다.',
      data: {
        accessToken: buildMockToken('access', requestBody.refreshToken),
        accessTokenExpiresIn: 1_800_000,
      },
    }),
  );
}
