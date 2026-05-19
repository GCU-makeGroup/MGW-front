import { request, uploadFile } from './client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActivitySummaryResponse = {
  id: number;
  title: string;
  category: string;
  capacity: number;
  currentParticipants: number;
  isLiked: boolean | null;
  likeCount: number;
  schedule: string;
  thumbnail: string;
  isHotpick: boolean;
  isCreator: boolean;
  isJoined: boolean;
};

export type ActivityDetailResponse = ActivitySummaryResponse & {
  description: string;
  members: { userId: number; name: string; profileImg: string }[];
  openChatUrl: string;
};

export type ActivityListResponse = {
  hotpick: ActivitySummaryResponse | null;
  activities: ActivitySummaryResponse[];
  nextCursor: string | null;
};

export type UpdateActivityRequest = {
  title: string;
  categoryIds: number[];
  maxMembers: number;
  schedule: string;
  description: string;
  openchatUrl: string;
  thumbnailUrl: string;
  location: string;
};

export type CreateActivityRequest = {
  title: string;
  categoryIds: number[];
  maxMembers: number;
  schedule: string;
  description: string;
  openchatUrl: string;
  thumbnailUrl: string;
  location: string;
};

// ---------------------------------------------------------------------------
// Mock fallbacks
// ---------------------------------------------------------------------------

const mockActivityList: ActivityListResponse = {
  hotpick: null,
  activities: [],
  nextCursor: null,
};

const mockActivityDetail: ActivityDetailResponse = {
  id: 0,
  title: 'Gachon Dev Studio Weekly Sprint',
  category: 'Study',
  capacity: 24,
  currentParticipants: 21,
  isLiked: false,
  likeCount: 0,
  schedule: new Date().toISOString(),
  thumbnail: '',
  isHotpick: false,
  description: 'A collaborative session focusing on product delivery.',
  members: [],
  openChatUrl: '',
  isCreator: false,
  isJoined: false,
};

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function fetchActivities(
  params?: {
    scope?: 'hotpick' | 'joined' | 'created';
    category?: string;
    cursor?: string;
    limit?: number;
  },
  _accessToken?: string,
): Promise<ActivityListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.scope) searchParams.set('scope', params.scope);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.cursor) searchParams.set('cursor', params.cursor);
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();
  const path = `/activities${qs ? `?${qs}` : ''}`;

  return request<ActivityListResponse>(path, { method: 'GET' }, () => mockActivityList);
}

export async function searchActivities(
  keyword: string,
  params?: { limit?: number; cursor?: string },
  _accessToken?: string,
): Promise<ActivityListResponse> {
  const searchParams = new URLSearchParams({ keyword });
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.cursor) searchParams.set('cursor', params.cursor);

  return request<ActivityListResponse>(
    `/activities/search?${searchParams.toString()}`,
    { method: 'GET' },
    () => mockActivityList,
  );
}

export async function fetchActivityDetail(
  activityId: number | string,
  _accessToken?: string,
): Promise<ActivityDetailResponse> {
  return request<ActivityDetailResponse>(
    `/activities/${activityId}/details`,
    { method: 'GET' },
    () => ({ ...mockActivityDetail, id: Number(activityId) }),
  );
}

export async function createActivity(
  body: CreateActivityRequest,
  _accessToken?: string,
): Promise<{ activityId: number }> {
  return request<{ activityId: number }>('/activities', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function joinActivity(
  activityId: number | string,
  body?: { participationType: 'INDIVIDUAL' | 'GROUP'; groupId?: number },
  _accessToken?: string,
): Promise<{ activityId: number }> {
  return request<{ activityId: number }>(`/activities/${activityId}/members`, {
    method: 'POST',
    body: JSON.stringify(body ?? { participationType: 'INDIVIDUAL' }),
  });
}

export async function leaveActivity(
  activityId: number | string,
  _accessToken?: string,
): Promise<{ activityId: number }> {
  return request<{ activityId: number }>(`/activities/${activityId}/members`, {
    method: 'DELETE',
  });
}

export async function likeActivity(
  activityId: number | string,
  _accessToken?: string,
): Promise<{ activityId: number }> {
  return request<{ activityId: number }>(`/activities/${activityId}/likes`, {
    method: 'POST',
  });
}

export async function unlikeActivity(
  activityId: number | string,
  _accessToken?: string,
): Promise<{ activityId: number }> {
  return request<{ activityId: number }>(`/activities/${activityId}/likes`, {
    method: 'DELETE',
  });
}

export async function uploadActivityImage(file: File): Promise<{ thumbnailUrl: string }> {
  return uploadFile<{ thumbnailUrl: string }>('/activities/images', file, () => ({
    thumbnailUrl: '',
  }));
}

export async function updateActivity(
  activityId: number | string,
  body: UpdateActivityRequest,
  _accessToken?: string,
): Promise<{ activityId: number }> {
  return request<{ activityId: number }>(`/activities/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteActivity(
  activityId: number | string,
  _accessToken?: string,
): Promise<{ activityId: number }> {
  return request<{ activityId: number }>(`/activities/${activityId}`, { method: 'DELETE' });
}
