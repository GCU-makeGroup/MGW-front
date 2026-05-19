import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  markNotificationAsRead,
  type NotificationItem,
} from '../../api/notification';
import { formatTimeAgo } from '../ui';

interface NotificationModalProps {
  onClose: () => void;
}

export function NotificationModal({ onClose }: NotificationModalProps) {
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const readMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      readMutation.mutate(notification.id);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-black/40' onClick={onClose}>
      <div
        className='w-full max-w-[430px] rounded-t-[24px] bg-white shadow-xl max-h-[70vh] flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-[#e8eef5] px-5 py-4'>
          <h2 className='text-[18px] font-bold text-[#1f2b45]'>Notifications</h2>
          <button
            type='button'
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full text-[#8090aa] transition hover:bg-[#f5f7fa]'
          >
            <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
              <path
                d='M18 6 6 18M6 6l12 12'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
              />
            </svg>
          </button>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-[#0879f2] border-t-transparent' />
            </div>
          ) : isError ? (
            <div className='px-5 py-12 text-center'>
              <p className='text-[14px] text-red-500'>Failed to load notifications.</p>
              <button
                type='button'
                onClick={() => refetch()}
                className='mt-2 text-[13px] font-semibold text-[#0879f2]'
              >
                Retry
              </button>
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className='px-5 py-12 text-center'>
              <p className='text-[15px] font-semibold text-[#1f2b45]'>No notifications yet</p>
              <p className='mt-1 text-[13px] text-[#8090aa]'>
                Notifications about your groups and activities will appear here.
              </p>
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type='button'
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full flex items-start gap-3 px-5 py-4 text-left transition hover:bg-[#f8fafd] ${
                      !notification.isRead ? 'bg-[#f0f6ff]' : ''
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        notification.isRead ? 'bg-[#c8d1de]' : 'bg-[#0879f2]'
                      }`}
                    />
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <p
                          className={`text-[15px] ${
                            notification.isRead
                              ? 'font-medium text-[#6d7a90]'
                              : 'font-semibold text-[#1f2b45]'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <span className='shrink-0 text-[11px] text-[#9aa7bb]'>
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className='mt-0.5 text-[13px] leading-[1.4] text-[#8090aa]'>
                        {notification.message}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
