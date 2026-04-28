import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { joinGroup } from '../../api/group';
import { groupComments, groupItems, isGroupFull } from '../../features/group/group-data';
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
import { useSession } from '../../features/session/session-context';
import { BackButton, BellIcon, BottomTabs, ScreenFrame } from '../../features/session/ui';

function GroupDetailPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { state } = useSession();
  const [comment, setComment] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSucceeded, setJoinSucceeded] = useState(false);

  const group = groupItems.find((item) => item.id === groupId) ?? groupItems[0];
  const comments = groupComments[group.id] ?? [];
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
      await joinGroup(group.apiId, state.accessToken ?? undefined);
      setJoinSucceeded(true);
    } catch (error) {
      console.error(error);
      setJoinError('그룹 참여에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setJoining(false);
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
              <GroupComposer
                value={comment}
                onChange={setComment}
                onSubmit={() => {
                  if (!comment.trim()) {
                    return;
                  }

                  setComment('');
                }}
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
  );
}

export default GroupDetailPage;
