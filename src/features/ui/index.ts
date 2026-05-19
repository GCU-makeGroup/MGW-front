export { ListSkeleton, DetailSkeleton } from './list-skeleton';
export { ErrorRetry } from './error-retry';
export { EmptyState } from './empty-state';
export { showToast } from './toast';

export function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function shareLink(title: string, url: string): void {
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {
      void navigator.clipboard.writeText(url);
    });
  } else {
    void navigator.clipboard.writeText(url);
  }
}
