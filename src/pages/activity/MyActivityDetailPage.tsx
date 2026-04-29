import { useNavigate, useParams } from 'react-router-dom';
import { getActivityById } from '../../features/activity/activity-data';
import { ManagedActivityDetailCard } from '../../features/activity/activity-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { ScreenFrame } from '../../features/session/ui';

function MyActivityDetailPage() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const activity = getActivityById(activityId ?? '');

  const handleOpenChat = () => {
    if (!activity.kakaoOpenChatLink) {
      console.info('KakaoTalk open chat link is not configured yet.');
      return;
    }

    window.open(activity.kakaoOpenChatLink, '_blank', 'noopener,noreferrer');
  };

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
