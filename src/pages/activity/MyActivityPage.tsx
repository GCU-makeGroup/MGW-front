import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities, type ActivitySummaryResponse } from '../../api/activity';
import { type MyActivityTab, type MyActivityItem } from '../../features/activity/activity-data';
import { MyActivityListCard, MyActivitySegmentedTabs } from '../../features/activity/activity-ui';
import { FloatingActionButton, HeaderIconButton, SearchIcon } from '../../features/group/group-ui';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BackButton, BellIcon, BottomTabs, ScreenFrame } from '../../features/session/ui';
import { SearchModal } from '../../features/search/SearchModal';
import { NotificationModal } from '../../features/notification/NotificationModal';
import { ListSkeleton, ErrorRetry, EmptyState } from '../../features/ui';

function mapToMyActivityItem(a: ActivitySummaryResponse, tab: MyActivityTab): MyActivityItem {
  return {
    id: String(a.id),
    tab,
    title: a.title,
    memberLabel: `${a.currentParticipants}/${a.capacity} MEMBERS`,
    status: 'active' as const,
    icon: '▱',
    liked: a.isLiked ?? false,
  };
}

function MyActivityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MyActivityTab>('joined');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const {
    data: joinedList,
    isLoading: joinedLoading,
    isError: joinedError,
    refetch: refetchJoined,
  } = useQuery({
    queryKey: ['activities', 'joined'],
    queryFn: () => fetchActivities({ scope: 'joined' }),
  });

  const {
    data: createdList,
    isLoading: createdLoading,
    isError: createdError,
    refetch: refetchCreated,
  } = useQuery({
    queryKey: ['activities', 'created'],
    queryFn: () => fetchActivities({ scope: 'created' }),
  });

  const joinedItems = (joinedList?.activities ?? []).map((a) => mapToMyActivityItem(a, 'joined'));
  const createdItems = (createdList?.activities ?? []).map((a) =>
    mapToMyActivityItem(a, 'created'),
  );
  const visibleItems = activeTab === 'joined' ? joinedItems : createdItems;

  const [likedState, setLikedState] = useState<Record<string, boolean>>({});

  const createButtonToneClassName = activeTab === 'created' ? 'bg-[#7d0904]' : 'bg-[#071d43]';

  return (
    <>
      <RequireAuth>
        <ScreenFrame className='pb-4 pt-4'>
          <div className='flex flex-1 flex-col'>
            <header className='grid grid-cols-[44px_1fr_auto] items-center gap-3 text-[#071d43]'>
              <BackButton onClick={() => navigate('/activity')} />
              <h1 className='text-center text-[22px] font-extrabold tracking-[-0.05em]'>
                GachonConnect
              </h1>
              <div className='flex items-center gap-2'>
                <HeaderIconButton label='Search' onClick={() => setShowSearch(true)}>
                  <SearchIcon />
                </HeaderIconButton>
                <HeaderIconButton label='Notifications' onClick={() => setShowNotifications(true)}>
                  <BellIcon />
                </HeaderIconButton>
                <span className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[22px] shadow-[0_8px_20px_rgba(16,34,64,0.08)]'>
                  👨🏻
                </span>
              </div>
            </header>

            <main className='relative flex-1 overflow-y-auto pb-28 pt-14'>
              <div className='space-y-10'>
                <section className='space-y-5'>
                  <h2 className='text-[56px] font-extrabold leading-[0.98] tracking-[-0.07em] text-[#071d43]'>
                    Discovery
                  </h2>
                  <p className='max-w-[320px] text-[28px] leading-[1.45] tracking-[-0.05em] text-[#2f3b4e]'>
                    Review and manage your academic & social gatherings
                  </p>
                </section>

                <section className='space-y-5'>
                  <h2 className='text-[34px] font-extrabold tracking-[-0.06em] text-[#111827]'>
                    My Activities
                  </h2>
                  <MyActivitySegmentedTabs active={activeTab} onChange={setActiveTab} />
                </section>

                <section className='space-y-4'>
                  {(activeTab === 'joined' ? joinedLoading : createdLoading) ? (
                    <ListSkeleton count={3} />
                  ) : (activeTab === 'joined' ? joinedError : createdError) ? (
                    <ErrorRetry
                      message='Failed to load activities.'
                      onRetry={() => (activeTab === 'joined' ? refetchJoined() : refetchCreated())}
                    />
                  ) : visibleItems.length > 0 ? (
                    visibleItems.map((item) => (
                      <MyActivityListCard
                        key={`${item.tab}-${item.id}`}
                        item={{ ...item, liked: likedState[item.id] ?? item.liked }}
                        mode={activeTab}
                        onOpen={() => navigate(`/activity/my/${item.id}`)}
                        onAction={() => {
                          if (activeTab === 'joined') {
                            setLikedState((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }));
                            return;
                          }

                          navigate('/activity/new');
                        }}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title={
                        activeTab === 'joined' ? 'No joined activities' : 'No created activities'
                      }
                      description='Activities you join or create will appear here.'
                    />
                  )}
                </section>
              </div>

              <FloatingActionButton
                ariaLabel='Create activity'
                onClick={() => navigate('/activity/new')}
                className={`fixed bottom-[116px] right-[calc(50%_-_190px)] z-20 ${createButtonToneClassName}`}
                variant='circle'
              />
            </main>
          </div>
        </ScreenFrame>
        <BottomTabs
          fixed
          active='activity'
          onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
        />
      </RequireAuth>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showNotifications && <NotificationModal onClose={() => setShowNotifications(false)} />}
    </>
  );
}

export default MyActivityPage;
