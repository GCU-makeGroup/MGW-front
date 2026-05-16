import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityDetail, type ActivityDetailResponse } from '../../api/activity';
import { type ActivityItem } from '../../features/activity/activity-data';
import { ManagedActivityDetailCard } from '../../features/activity/activity-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { ScreenFrame } from '../../features/session/ui';

function formatSchedule(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function mapDetailToActivityItem(detail: ActivityDetailResponse): ActivityItem {
  const seatsLeft = detail.capacity - detail.currentParticipants;
  return {
    id: String(detail.id),
    title: detail.title,
    description: detail.description,
    category: 'study',
    categoryLabel: detail.category.toUpperCase(),
    badgeLabel: detail.isHotpick ? 'HOT' : `${detail.currentParticipants} MEMBERS`,
    membersLabel: `${detail.currentParticipants} MEMBERS`,
    location: '',
    schedule: formatSchedule(detail.schedule),
    seatsLeft,
    maxMembers: detail.capacity,
    imageVariant: 'studio',
    isHotPick: detail.isHotpick,
    liked: detail.isLiked ?? false,
    joinState: seatsLeft <= 0 ? 'full' : 'available',
    kakaoOpenChatLink: detail.openChatUrl,
  };
}

function MyActivityDetailPage() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const numericId = Number(activityId);

  const { data: detail } = useQuery({
    queryKey: ['activity', numericId],
    queryFn: () => fetchActivityDetail(numericId),
    enabled: !!activityId && !isNaN(numericId),
  });

  const activity = detail ? mapDetailToActivityItem(detail) : null;

  const handleOpenChat = () => {
    if (!activity?.kakaoOpenChatLink) {
      return;
    }

    window.open(activity.kakaoOpenChatLink, '_blank', 'noopener,noreferrer');
  };

  if (!activity) {
    return (
      <RequireAuth>
        <ScreenFrame className='bg-[#9aa8b8] px-5 pb-8 pt-10'>
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-[#6d7a90]'>Loading...</p>
          </div>
        </ScreenFrame>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <ScreenFrame className='bg-[#9aa8b8] px-5 pb-8 pt-10'>
        <main className='flex flex-1 items-center'>
          <ManagedActivityDetailCard
            activity={activity}
            onClose={() => navigate('/activity/my')}
            onShare={() => {
              void navigator.clipboard?.writeText(window.location.href);
            }}
            onOpenChat={handleOpenChat}
          />
        </main>
      </ScreenFrame>
    </RequireAuth>
  );
}

export default MyActivityDetailPage;
