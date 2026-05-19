import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchGroupDetail,
  joinGroup,
  leaveGroup,
  createComment,
  updateComment,
  deleteComment,
  type GroupDetailResponse,
  type CommentInfo,
} from '../../api/group';
import { ApiError } from '../../api/client';
import { type GroupComment, type GroupItem, isGroupFull } from '../../features/group/group-data';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { useSession } from '../../features/session/session-context';
import { SearchModal } from '../../features/search/SearchModal';
import {
  GroupCommentCard,
  GroupComposer,
  GroupDetailCard,
  GroupJoinButton,
  GroupJoinSuccessView,
  GroupLeaveButton,
  HeaderIconButton,
  SearchIcon,
} from '../../features/group/group-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BackButton, BellIcon, BottomTabs, ScreenFrame } from '../../features/session/ui';
import { DetailSkeleton, ErrorRetry, showToast } from '../../features/ui';

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
    authorId: comment.author.id,
    author: comment.author.name,
    avatar: comment.author.imageUrl ?? '👤',
    timeAgo: formatTimeAgo(comment.createdAt),
    message: comment.content,
    parentId: comment.parentId != null ? String(comment.parentId) : null,
  };
}

function GroupDetailPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const session = useSession();
  const currentMemberId = session.state.memberId;
  const numericGroupId = Number(groupId);
  const [comment, setComment] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSucceeded, setJoinSucceeded] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; author: string } | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useQuery({
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

  const topLevelComments = comments.filter((c) => c.parentId === null);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

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
      await queryClient.refetchQueries({ queryKey: ['groupDetail', numericGroupId] });
      await queryClient.refetchQueries({ queryKey: ['groups'], type: 'all' });
      setJoinSucceeded(true);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'GROUP-011') {
        setJoinSucceeded(true);
        return;
      }
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
      await createComment(numericGroupId, {
        content: comment.trim(),
        parentId: replyTo ? Number(replyTo.id) : undefined,
      });
      setComment('');
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ['groupDetail', numericGroupId] });
    } catch (error) {
      console.error(error);
      showToast('Failed to post comment.');
    }
  };

  const handleLeave = async () => {
    if (leaving) return;
    if (!window.confirm('Are you sure you want to leave this group?')) return;

    setLeaving(true);
    try {
      await leaveGroup(numericGroupId);
      await queryClient.refetchQueries({ queryKey: ['groupDetail', numericGroupId] });
      await queryClient.refetchQueries({ queryKey: ['groups'], type: 'all' });
    } catch (error) {
      console.error(error);
      showToast('Failed to leave group.');
    } finally {
      setLeaving(false);
    }
  };

  const handleEditComment = (c: GroupComment) => {
    setEditingCommentId(c.id);
    setEditValue(c.message);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditValue('');
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editValue.trim()) return;

    try {
      await updateComment(numericGroupId, Number(editingCommentId), {
        content: editValue.trim(),
      });
      setEditingCommentId(null);
      setEditValue('');
      queryClient.invalidateQueries({ queryKey: ['groupDetail', numericGroupId] });
    } catch (error) {
      console.error(error);
      showToast('Failed to save edit.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(numericGroupId, Number(commentId));
      queryClient.invalidateQueries({ queryKey: ['groupDetail', numericGroupId] });
    } catch (error) {
      console.error(error);
      showToast('Failed to delete comment.');
    }
  };

  return (
    <>
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
                  <HeaderIconButton label='Search' onClick={() => setShowSearch(true)}>
                    <SearchIcon />
                  </HeaderIconButton>
                  <HeaderIconButton
                    label='Notifications'
                    showBadge
                    onClick={() => showToast('Notifications coming soon.', 'success')}
                  >
                    <BellIcon />
                  </HeaderIconButton>
                </div>
              </header>

              <main className='flex-1 overflow-y-auto pb-4 pt-6'>
                <div className='space-y-5'>
                  {isLoading ? (
                    <DetailSkeleton />
                  ) : isError ? (
                    <ErrorRetry message='Failed to load group details.' onRetry={() => refetch()} />
                  ) : (
                    <>
                      <GroupDetailCard group={group} />
                      <div className='space-y-2'>
                        {!detail?.isMember ? (
                          <GroupJoinButton group={group} joining={joining} onJoin={handleJoin} />
                        ) : (
                          <GroupLeaveButton leaving={leaving} onLeave={handleLeave} />
                        )}
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
                        {topLevelComments.map((item) => (
                          <div key={item.id} className='space-y-2'>
                            <GroupCommentCard
                              comment={item}
                              isOwnComment={item.authorId === currentMemberId}
                              editing={editingCommentId === item.id}
                              editValue={editValue}
                              onEditValueChange={setEditValue}
                              onEdit={() => handleEditComment(item)}
                              onEditCancel={handleCancelEdit}
                              onEditSave={handleSaveEdit}
                              onDelete={() => handleDeleteComment(item.id)}
                              onReply={() => setReplyTo({ id: item.id, author: item.author })}
                            />
                            {getReplies(item.id).map((reply) => (
                              <div key={reply.id} className='ml-8'>
                                <GroupCommentCard
                                  comment={reply}
                                  isOwnComment={reply.authorId === currentMemberId}
                                  editing={editingCommentId === reply.id}
                                  editValue={editValue}
                                  onEditValueChange={setEditValue}
                                  onEdit={() => handleEditComment(reply)}
                                  onEditCancel={handleCancelEdit}
                                  onEditSave={handleSaveEdit}
                                  onDelete={() => handleDeleteComment(reply.id)}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </section>
                    </>
                  )}
                </div>
              </main>

              <div className='space-y-3'>
                <GroupComposer
                  value={comment}
                  onChange={setComment}
                  onSubmit={handleSubmitComment}
                  replyToAuthor={replyTo?.author}
                  onCancelReply={() => setReplyTo(null)}
                />
                <BottomTabs
                  active='group'
                  onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
                />
              </div>
            </div>
          </ScreenFrame>
        )}
      </RequireAuth>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </>
  );
}

export default GroupDetailPage;
