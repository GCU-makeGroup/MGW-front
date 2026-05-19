import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchActivityDetail, joinActivity, type ActivityDetailResponse } from '../../api/activity';
import { fetchMyGroups } from '../../api/group';
import { ApiError } from '../../api/client';
import {
  CATEGORY_MAP,
  formatSchedule,
  type ActivityItem,
  type ActivityGroupOption,
  type JoinMode,
} from '../../features/activity/activity-data';
import {
  ActivityDetailCard,
  ChoiceModal,
  FeedbackModal,
  GroupSelectionSheet,
  ModalScrim,
} from '../../features/activity/activity-ui';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BottomTabs, ScreenFrame } from '../../features/session/ui';
import { DetailSkeleton } from '../../features/ui';

function mapDetailToActivityItem(
  detail: ActivityDetailResponse,
  groupOptions?: ActivityGroupOption[],
): ActivityItem {
  const seatsLeft = detail.capacity - detail.currentParticipants;
  return {
    id: String(detail.id),
    title: detail.title,
    description: detail.description,
    category: CATEGORY_MAP[detail.category] ?? 'study',
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
    joinState: detail.isCreator
      ? 'creator'
      : detail.isJoined
        ? 'joined'
        : seatsLeft <= 0
          ? 'full'
          : 'available',
    kakaoOpenChatLink: detail.openChatUrl,
    groupOptions: groupOptions ?? [],
    members: detail.members ?? [],
  };
}

type DetailOverlay =
  | 'join-choice'
  | 'group-select'
  | 'success'
  | 'full'
  | 'already-joined'
  | 'error'
  | null;
const POST_JOIN_RETURN_PATH = '/activity';

function ActivityDetailPage() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const numericId = Number(activityId);
  const queryClient = useQueryClient();

  const { data: detail } = useQuery({
    queryKey: ['activity', numericId],
    queryFn: () => fetchActivityDetail(numericId),
    enabled: !!activityId && !isNaN(numericId),
  });

  const { data: myGroupsData } = useQuery({
    queryKey: ['groups', 'my-short'],
    queryFn: () => fetchMyGroups({ page: 0, size: 50 }),
    enabled: !!activityId && !isNaN(numericId),
  });

  const groupOptions = myGroupsData?.groups.map((g) => ({
    id: String(g.id),
    name: g.name,
    subtitle: '',
    members: g.currentMemberCount,
    activeLabel: `${g.currentMemberCount}/${g.capacity}`,
  }));
  const activity = detail ? mapDetailToActivityItem(detail, groupOptions) : null;

  const [overlay, setOverlay] = useState<DetailOverlay>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const joinMutation = useMutation({
    mutationFn: (body: { participationType: 'INDIVIDUAL' | 'GROUP'; groupId?: number }) =>
      joinActivity(numericId, body),
    onSuccess: async () => {
      setOverlay('success');
      await queryClient.invalidateQueries({ queryKey: ['activity', numericId] });
      await queryClient.invalidateQueries({ queryKey: ['activities'] });
      await queryClient.invalidateQueries({ queryKey: ['activities', 'joined'] });
      await queryClient.invalidateQueries({ queryKey: ['activities', 'created'] });
      await queryClient.invalidateQueries({ queryKey: ['activities', 'discovery'] });
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        if (err.code === 'ACTIVITY-015') {
          setOverlay('full');
        } else if (err.code === 'ACTIVITY-016' || err.code === 'ACTIVITY-017') {
          setOverlay('already-joined');
        } else {
          setOverlay('error');
        }
      } else {
        setOverlay('error');
      }
    },
  });

  const handleJoinRequest = (_mode: JoinMode) => {
    if (!activity) return;

    if (activity.joinState === 'full') {
      setOverlay('full');
      return;
    }

    if (_mode === 'group' && selectedGroupId) {
      joinMutation.mutate({ participationType: 'GROUP', groupId: Number(selectedGroupId) });
    } else {
      joinMutation.mutate({ participationType: 'INDIVIDUAL' });
    }
  };

  if (!activity) {
    return (
      <RequireAuth>
        <ScreenFrame className='pb-4 pt-4'>
          <div className='flex flex-1 items-center justify-center'>
            <DetailSkeleton className='w-full' />
          </div>
        </ScreenFrame>
      </RequireAuth>
    );
  }

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

        {overlay === 'group-select' ? (
          <div className='fixed inset-0 z-50 bg-[rgba(214,223,235,0.64)] backdrop-blur-sm'>
            <div className='mx-auto flex min-h-dvh w-full max-w-[430px] items-end'>
              <GroupSelectionSheet
                groups={activity.groupOptions ?? []}
                selectedId={selectedGroupId}
                onSelect={setSelectedGroupId}
                onConfirm={() => {
                  handleJoinRequest('group');
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

        {overlay === 'already-joined' ? (
          <ModalScrim>
            <FeedbackModal
              tone='error'
              title='Already Joined'
              description='You are already participating in this activity.'
              primaryLabel='Close'
              onPrimary={() => setOverlay(null)}
            />
          </ModalScrim>
        ) : null}

        {overlay === 'error' ? (
          <ModalScrim>
            <FeedbackModal
              tone='error'
              title='Unable to Join'
              description='An error occurred while trying to join. Please try again later.'
              primaryLabel='Close'
              onPrimary={() => setOverlay(null)}
            />
          </ModalScrim>
        ) : null}
      </ScreenFrame>
    </RequireAuth>
  );
}

export default ActivityDetailPage;
