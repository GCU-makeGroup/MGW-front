import { request } from './client';

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return request<NotificationItem[]>('/notifications');
}

export async function markNotificationAsRead(id: number): Promise<void> {
  return request<void>(`/notifications/${id}/read`, { method: 'PATCH' });
}
