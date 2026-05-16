import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchGroupDetail,
  joinGroup,
  createComment,
  type GroupDetailResponse,
  type CommentInfo,
} from '../../api/group';
import { type GroupComment, type GroupItem, isGroupFull } from '../../features/group/group-data';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import {
  GroupCommentCard,
  GroupComposer,
  GroupDetailCard,
  GroupJoinButton,
  GroupJoinSuccessView,
  HeaderIconButton,
  SearchIcon,
} from '../../features/group/group-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BackButton, BellIcon, BottomTabs, ScreenFrame } from '../../features/session/ui';

function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function mapDetailToGroupItem(detail: GroupDetailResponse): GroupItem {
  return {
    id: String(detail.id),
    apiId: detail.id,
    badges: detail.categories.map((c) => c.name),
    detailBadges: detail.categories.map((c) => c.name),
    category: (detail.categories[0]?.name?.toLowerCase() ?? 'study') as
      | 'all'
      | 'study'
      | 'project'
      | 'it',
    title: detail.title,
    description: detail.name,
    detailDescription: detail.content,
    authorName: detail.author.name,
    authorAvatar: detail.author.imageUrl ?? '👤',
    currentParticipants: detail.currentMemberCount,
    capacity: detail.capacity,
    likes: 0,
    comments: detail.commentCount,
    timeAgo: formatTimeAgo(detail.updatedAt),
  };
}

function mapCommentInfo(comment: CommentInfo): GroupComment {
  return {
    id: String(comment.id),
    author: comment.author.name,
    avatar: comment.author.imageUrl ?? '👤',
    timeAgo: formatTimeAgo(comment.createdAt),
    message: comment.content,
  };
}

function GroupDetailPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const numericGroupId = Number(groupId);
  const [comment, setComment] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSucceeded, setJoinSucceeded] = useState(false);

  const { data: detail } = useQuery({
    queryKey: ['groupDetail', numericGroupId],
    queryFn: () => fetchGroupDetail(numericGroupId),
    enabled: Number.isFinite(numericGroupId),
  });

  const group: GroupItem = detail
    ? mapDetailToGroupItem(detail)
    : {
        id: String(numericGroupId),
        apiId: numericGroupId,
        badges: [],
        category: 'study',
        title: '',
        description: '',
        authorName: '',
        authorAvatar: '👤',
        currentParticipants: 0,
        capacity: 0,
        likes: 0,
        comments: 0,
        timeAgo: '',
      };

  const comments: GroupComment[] = detail?.comments.map(mapCommentInfo) ?? [];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/group');
  };

  const handleJoin = async () => {
    if (joining || isGroupFull(group)) {
      return;
    }

    setJoining(true);
    setJoinError(null);

    try {
      await joinGroup(numericGroupId);
      setJoinSucceeded(true);
    } catch (error) {
      console.error(error);
      setJoinError('그룹 참여에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setJoining(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      return;
    }

    try {
      await createComment(numericGroupId, { content: comment.trim() });
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['groupDetail', numericGroupId] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RequireAuth>
      {joinSucceeded ? (
        <ScreenFrame className='p-0'>
          <GroupJoinSuccessView group={group} onBackToGroup={() => navigate('/group')} />
        </ScreenFrame>
      ) : (
        <ScreenFrame className='pb-4 pt-4'>
          <div className='flex flex-1 flex-col'>
            <header className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <BackButton onClick={handleBack} />
                <h1 className='text-[20px] font-bold tracking-[-0.03em] text-[#1f2b45]'>
                  Group Detail
                </h1>
              </div>
              <div className='flex items-center gap-3 text-[#8090aa]'>
                <HeaderIconButton label='Search'>
                  <SearchIcon />
                </HeaderIconButton>
                <HeaderIconButton label='Notifications' showBadge>
                  <BellIcon />
                </HeaderIconButton>
              </div>
            </header>

            <main className='flex-1 overflow-y-auto pb-4 pt-6'>
              <div className='space-y-5'>
                <GroupDetailCard group={group} />
                <div className='space-y-2'>
                  <GroupJoinButton group={group} joining={joining} onJoin={handleJoin} />
                  {joinError ? (
                    <p className='text-center text-[13px] font-semibold text-[#d16060]'>
                      {joinError}
                    </p>
                  ) : null}
                </div>

                <section className='space-y-4'>
                  <h2 className='text-[24px] font-bold tracking-[-0.04em] text-[#1f2b45]'>
                    Comments
                  </h2>
                  {comments.map((item) => (
                    <GroupCommentCard key={item.id} comment={item} />
                  ))}
                </section>
              </div>
            </main>

            <div className='space-y-3'>
              <GroupComposer value={comment} onChange={setComment} onSubmit={handleSubmitComment} />
              <BottomTabs
                active='group'
                onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
              />
            </div>
          </div>
        </ScreenFrame>
      )}
    </RequireAuth>
  );
}

export default GroupDetailPage;
