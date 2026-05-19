export { ListSkeleton, DetailSkeleton } from './list-skeleton';
export { ErrorRetry } from './error-retry';
export { EmptyState } from './empty-state';
export { showToast } from './toast';

export function shareLink(title: string, url: string): void {
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {
      void navigator.clipboard.writeText(url);
    });
  } else {
    void navigator.clipboard.writeText(url);
  }
}
