import { request } from './client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CategoryInfo = { id: number; name: string };

export type PageInfo = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type GroupListItemResponse = {
  id: number;
  updatedAt: string;
  name: string;
  title: string;
  categories: CategoryInfo[];
  capacity: number;
  currentMemberCount: number;
  commentCount: number;
};

export type GroupListResponse = {
  pageInfo: PageInfo;
  groups: GroupListItemResponse[];
};

export type AuthorInfo = {
  id: number;
  name: string;
  imageUrl: string | null;
};

export type CommentInfo = {
  id: number;
  parentId: number | null;
  author: AuthorInfo;
  authorGroupMember: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type GroupDetailResponse = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isPublic: boolean;
  author: AuthorInfo;
  categories: CategoryInfo[];
  capacity: number;
  currentMemberCount: number;
  commentCount: number;
  comments: CommentInfo[];
  isMember: boolean;
};

export type CreateGroupRequest = {
  name: string;
  title: string;
  content: string;
  imageUrl?: string;
  isPublic: boolean;
  capacity: number;
  categoryIds: number[];
};

// ---------------------------------------------------------------------------
// Mock fallbacks
// ---------------------------------------------------------------------------

const mockGroupList: GroupListResponse = {
  pageInfo: { page: 1, size: 10, totalElements: 0, totalPages: 0, hasNext: false },
  groups: [],
};

const mockGroupDetail: GroupDetailResponse = {
  id: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  name: '',
  title: '',
  content: '',
  imageUrl: null,
  isPublic: true,
  author: { id: 0, name: '', imageUrl: null },
  categories: [],
  capacity: 0,
  currentMemberCount: 0,
  commentCount: 0,
  comments: [],
  isMember: false,
};

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function fetchGroups(
  params?: {
    categoryIds?: number[];
    page?: number;
    size?: number;
    sort?: string;
  },
  _accessToken?: string,
): Promise<GroupListResponse> {
  const searchParams = new URLSearchParams();
  params?.categoryIds?.forEach((id) => searchParams.append('categoryIds', String(id)));
  if (params?.page !== undefined) searchParams.set('page', String(params.page));
  if (params?.size) searchParams.set('size', String(params.size));
  if (params?.sort) searchParams.set('sort', params.sort);

  const qs = searchParams.toString();
  const path = `/groups${qs ? `?${qs}` : ''}`;

  return request<GroupListResponse>(path, { method: 'GET' }, () => mockGroupList);
}

export async function fetchMyGroups(
  params?: { page?: number; size?: number },
  _accessToken?: string,
): Promise<GroupListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set('page', String(params.page));
  if (params?.size) searchParams.set('size', String(params.size));

  const qs = searchParams.toString();
  const path = `/groups/me${qs ? `?${qs}` : ''}`;

  return request<GroupListResponse>(path, { method: 'GET' }, () => mockGroupList);
}

export async function searchGroups(
  params?: { memberId?: number; keyword?: string; page?: number; size?: number },
  _accessToken?: string,
): Promise<GroupListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.memberId) searchParams.set('memberId', String(params.memberId));
  if (params?.keyword) searchParams.set('keyword', params.keyword);
  if (params?.page !== undefined) searchParams.set('page', String(params.page));
  if (params?.size) searchParams.set('size', String(params.size));

  const qs = searchParams.toString();
  const path = `/groups/search${qs ? `?${qs}` : ''}`;

  return request<GroupListResponse>(path, { method: 'GET' }, () => mockGroupList);
}

export async function fetchGroupDetail(
  groupId: number | string,
  _accessToken?: string,
): Promise<GroupDetailResponse> {
  return request<GroupDetailResponse>(`/groups/${groupId}`, { method: 'GET' }, () => ({
    ...mockGroupDetail,
    id: Number(groupId),
  }));
}

export async function createGroup(
  body: CreateGroupRequest,
  _accessToken?: string,
): Promise<{ groupId: number }> {
  return request<{ groupId: number }>('/groups', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function joinGroup(groupId: number | string, _accessToken?: string): Promise<void> {
  return request<void>(`/groups/${groupId}/members/me`, { method: 'POST' });
}

export async function leaveGroup(groupId: number | string, _accessToken?: string): Promise<void> {
  return request<void>(`/groups/${groupId}/members/me`, { method: 'DELETE' });
}

export async function createComment(
  groupId: number | string,
  body: { content: string; parentId?: number },
  _accessToken?: string,
): Promise<{ commentId: number; authorGroupMember: boolean }> {
  return request<{ commentId: number; authorGroupMember: boolean }>(`/groups/${groupId}/comments`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateComment(
  groupId: number | string,
  commentId: number,
  body: { content: string },
  _accessToken?: string,
): Promise<void> {
  return request<void>(`/groups/${groupId}/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteComment(
  groupId: number | string,
  commentId: number,
  _accessToken?: string,
): Promise<void> {
  return request<void>(`/groups/${groupId}/comments/${commentId}`, { method: 'DELETE' });
}

export async function updateGroup(
  groupId: number | string,
  body: CreateGroupRequest,
  _accessToken?: string,
): Promise<{ groupId: number }> {
  return request<{ groupId: number }>(`/groups/${groupId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteGroup(groupId: number | string, _accessToken?: string): Promise<void> {
  return request<void>(`/groups/${groupId}`, { method: 'DELETE' });
}
