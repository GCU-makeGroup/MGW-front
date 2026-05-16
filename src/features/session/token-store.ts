const ACCESS_TOKEN_KEY = 'mgw_access_token';
const REFRESH_TOKEN_KEY = 'mgw_refresh_token';
const MEMBER_ID_KEY = 'mgw_member_id';
const MEMBER_EMAIL_KEY = 'mgw_member_email';
const MEMBER_NAME_KEY = 'mgw_member_name';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getMemberInfo(): {
  memberId: number;
  memberEmail: string;
  memberName: string;
} | null {
  const id = localStorage.getItem(MEMBER_ID_KEY);
  const email = localStorage.getItem(MEMBER_EMAIL_KEY);
  const name = localStorage.getItem(MEMBER_NAME_KEY);
  if (!id || !email || !name) return null;
  return { memberId: Number(id), memberEmail: email, memberName: name };
}

export function setMemberInfo(memberId: number, memberEmail: string, memberName: string): void {
  localStorage.setItem(MEMBER_ID_KEY, String(memberId));
  localStorage.setItem(MEMBER_EMAIL_KEY, memberEmail);
  localStorage.setItem(MEMBER_NAME_KEY, memberName);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(MEMBER_ID_KEY);
  localStorage.removeItem(MEMBER_EMAIL_KEY);
  localStorage.removeItem(MEMBER_NAME_KEY);
}
