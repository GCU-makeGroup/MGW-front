import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { joinActivity } from '../../api/activity';
import { getActivityById, type JoinMode } from '../../features/activity/activity-data';
import {
  ActivityDetailCard,
  ChoiceModal,
  FeedbackModal,
  GroupSelectionSheet,
  ModalScrim,
} from '../../features/activity/activity-ui';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { RequireAuth } from '../../features/session/RequireAuth';
import { useSession } from '../../features/session/session-context';
import { BottomTabs, ScreenFrame } from '../../features/session/ui';

type DetailOverlay = 'join-choice' | 'group-select' | 'success' | 'full' | null;
const POST_JOIN_RETURN_PATH = '/activity';

function ActivityDetailPage() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const { state } = useSession();
  const activity = getActivityById(activityId ?? '');
  const [overlay, setOverlay] = useState<DetailOverlay>(null);
  const [selectedGroupId, setSelectedGroupId] = useState(
    activity.groupOptions?.find((group) => group.selected)?.id ??
      activity.groupOptions?.[0]?.id ??
      null,
  );

  const handleJoinRequest = async (_mode: JoinMode) => {
    if (activity.joinState === 'full') {
      setOverlay('full');
      return;
    }

    try {
      await joinActivity(activity.id, state.accessToken ?? undefined);
      setOverlay('success');
    } catch (error) {
      console.error(error);
      setOverlay('full');
    }
  };

  return (
    <RequireAuth>
      <ScreenFrame className='pb-4 pt-4'>
        <div className='flex flex-1 flex-col'>
          <main className='flex-1 pt-2'>
            <ActivityDetailCard
              activity={activity}
              onClose={() => navigate('/activity')}
              onJoin={() => setOverlay('join-choice')}
            />
          </main>

          <footer className='mt-6'>
            <BottomTabs
              active='activity'
              onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
            />
          </footer>
        </div>

        {overlay === 'join-choice' ? (
          <ModalScrim>
            <ChoiceModal
              onSelect={(mode) => {
                if (mode === 'group') {
                  setOverlay('group-select');
                  return;
                }

                void handleJoinRequest(mode);
              }}
              onDismiss={() => setOverlay(null)}
            />
          </ModalScrim>
        ) : null}

        {overlay === 'group-select' && activity.groupOptions ? (
          <div className='fixed inset-0 z-50 bg-[rgba(214,223,235,0.64)] backdrop-blur-sm'>
            <div className='mx-auto flex min-h-dvh w-full max-w-[430px] items-end'>
              <GroupSelectionSheet
                groups={activity.groupOptions}
                selectedId={selectedGroupId}
                onSelect={setSelectedGroupId}
                onConfirm={() => {
                  void handleJoinRequest('group');
                }}
                onClose={() => setOverlay(null)}
              />
            </div>
          </div>
        ) : null}

        {overlay === 'success' ? (
          <ModalScrim>
            <FeedbackModal
              tone='success'
              title='Successfully Joined!'
              description={
                <>
                  You are now a member of <strong>{activity.title}</strong>. You can keep exploring
                  more activities from this tab.
                </>
              }
              primaryLabel='Great!'
              onPrimary={() => navigate(POST_JOIN_RETURN_PATH)}
            />
          </ModalScrim>
        ) : null}

        {overlay === 'full' ? (
          <ModalScrim>
            <FeedbackModal
              tone='error'
              title='Group is Full'
              description='Sorry, this group has reached its maximum capacity. Please try joining another group or check back later.'
              primaryLabel='Close'
              secondaryLabel='EXPLORE SIMILAR GROUPS'
              onPrimary={() => setOverlay(null)}
              onSecondary={() => navigate(POST_JOIN_RETURN_PATH)}
            />
          </ModalScrim>
        ) : null}
      </ScreenFrame>
    </RequireAuth>
  );
}

export default ActivityDetailPage;
