import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchActivities,
  likeActivity,
  unlikeActivity,
  type ActivitySummaryResponse,
} from '../../api/activity';
import {
  activityFilters,
  type ActivityCategory,
  type ActivityItem,
} from '../../features/activity/activity-data';
import { SearchModal } from '../../features/search/SearchModal';
import {
  ActivityFeedCard,
  ActivityFilterChip,
  ActivityHotCard,
  MyActivityButton,
} from '../../features/activity/activity-ui';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BottomTabs, ScreenFrame } from '../../features/session/ui';
import { FloatingActionButton, HeaderIconButton, SearchIcon } from '../../features/group/group-ui';
import { BellIcon } from '../../features/session/ui';
import { ListSkeleton, ErrorRetry, EmptyState, showToast } from '../../features/ui';

const CATEGORY_MAP: Record<string, ActivityCategory> = {
  Study: 'study',
  Language: 'language',
  Hobby: 'hobby',
  Sports: 'sports',
  'AI & Tech': 'ai-tech',
  Wellness: 'wellness',
  Design: 'design',
};

function formatSchedule(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function mapToActivityItem(a: ActivitySummaryResponse): ActivityItem {
  const seatsLeft = a.capacity - a.currentParticipants;
  const category = CATEGORY_MAP[a.category] ?? 'study';
  return {
    id: String(a.id),
    title: a.title,
    description: '',
    category,
    categoryLabel: a.category.toUpperCase(),
    badgeLabel: a.isHotpick ? 'HOT' : `${a.currentParticipants} MEMBERS`,
    membersLabel: `${a.currentParticipants} MEMBERS`,
    location: '',
    schedule: formatSchedule(a.schedule),
    seatsLeft,
    maxMembers: a.capacity,
    imageVariant: 'studio',
    isHotPick: a.isHotpick,
    liked: a.isLiked ?? false,
    joinState: seatsLeft <= 0 ? 'full' : 'available',
    members: [],
  };
}

function ActivityPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<ActivityCategory | 'all'>('all');
  const [showSearch, setShowSearch] = useState(false);

  const {
    data: activityList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['activities'],
    queryFn: () => fetchActivities(),
  });

  const allActivities = (activityList?.activities ?? []).map(mapToActivityItem);

  const likeMutation = useMutation({
    mutationFn: (activityId: number) => likeActivity(activityId),
    onSuccess: () => {
      setLikedOverrides({});
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities', 'discovery'] });
    },
    onError: (_err, activityId) => {
      setLikedOverrides((prev) => {
        const next = { ...prev };
        delete next[String(activityId)];
        return next;
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (activityId: number) => unlikeActivity(activityId),
    onSuccess: () => {
      setLikedOverrides({});
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities', 'discovery'] });
    },
    onError: (_err, activityId) => {
      setLikedOverrides((prev) => {
        const next = { ...prev };
        delete next[String(activityId)];
        return next;
      });
    },
  });

  const [likedOverrides, setLikedOverrides] = useState<Record<string, boolean>>({});

  const hotPickActivity =
    allActivities.find((activity) => activity.isHotPick) ?? allActivities[0] ?? null;
  const visibleActivities =
    activeFilter === 'all'
      ? allActivities.filter((activity) => !activity.isHotPick)
      : allActivities.filter(
          (activity) => activity.category === activeFilter && !activity.isHotPick,
        );

  const toggleLike = (activityId: string) => {
    const currentLiked =
      likedOverrides[activityId] ?? allActivities.find((a) => a.id === activityId)?.liked ?? false;
    const nextLiked = !currentLiked;
    setLikedOverrides((prev) => ({ ...prev, [activityId]: nextLiked }));

    const numericId = Number(activityId);
    if (nextLiked) {
      likeMutation.mutate(numericId);
    } else {
      unlikeMutation.mutate(numericId);
    }
  };

  return (
    <RequireAuth>
      <ScreenFrame className='pb-4 pt-4'>
        <div className='flex flex-1 flex-col'>
          <header className='grid grid-cols-[40px_1fr_40px] items-center text-[#203354]'>
            <HeaderIconButton label='Search' onClick={() => setShowSearch(true)}>
              <SearchIcon />
            </HeaderIconButton>
            <h1 className='text-center text-[18px] font-extrabold tracking-[-0.04em]'>
              GachonConnect
            </h1>
            <HeaderIconButton
              label='Notifications'
              onClick={() => showToast('Notifications coming soon.', 'success')}
            >
              <BellIcon />
            </HeaderIconButton>
          </header>

          <main className='relative flex-1 pt-8'>
            <div className='space-y-8 pb-28'>
              <div className='flex justify-end'>
                <MyActivityButton onClick={() => navigate('/activity/my')} />
              </div>

              <section className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-[28px] font-extrabold tracking-[-0.05em] text-[#203354]'>
                    Hot pick Activity
                  </h2>
                  <button
                    type='button'
                    onClick={() => setActiveFilter('all')}
                    className='text-[15px] font-bold text-[#6d7a90]'
                  >
                    See all
                  </button>
                </div>
                {hotPickActivity ? (
                  <ActivityHotCard
                    activity={{
                      ...hotPickActivity,
                      liked: likedOverrides[hotPickActivity.id] ?? hotPickActivity.liked,
                    }}
                    onOpen={() => navigate(`/activity/${hotPickActivity.id}`)}
                    onToggleLike={() => toggleLike(hotPickActivity.id)}
                  />
                ) : (
                  <p className='py-8 text-center text-[14px] text-slate-400'>No activities yet</p>
                )}
              </section>

              <section className='space-y-4'>
                <h2 className='text-[28px] font-extrabold tracking-[-0.05em] text-[#203354]'>
                  Available Activity
                </h2>
                {isLoading ? (
                  <ListSkeleton count={4} />
                ) : isError ? (
                  <ErrorRetry message='Failed to load activities.' onRetry={() => refetch()} />
                ) : (
                  <>
                    <div className='hide-scrollbar flex gap-2 overflow-x-auto pb-1'>
                      {activityFilters.map((filter) => (
                        <ActivityFilterChip
                          key={filter.value}
                          label={filter.label}
                          active={activeFilter === filter.value}
                          onClick={() => setActiveFilter(filter.value)}
                        />
                      ))}
                    </div>
                    <div className='space-y-5'>
                      {visibleActivities.length > 0 ? (
                        visibleActivities.map((activity) => (
                          <ActivityFeedCard
                            key={activity.id}
                            activity={{
                              ...activity,
                              liked: likedOverrides[activity.id] ?? activity.liked,
                            }}
                            onOpen={() => navigate(`/activity/${activity.id}`)}
                            onToggleLike={() => toggleLike(activity.id)}
                          />
                        ))
                      ) : (
                        <EmptyState
                          title='No activities found'
                          description='Try a different filter or check back later.'
                        />
                      )}
                    </div>
                  </>
                )}
              </section>
            </div>

            <FloatingActionButton
              ariaLabel='Create activity'
              onClick={() => navigate('/activity/new')}
              className='absolute bottom-[82px] right-1 bg-[#0d3f7c] text-white shadow-[0_18px_30px_rgba(13,63,124,0.28)]'
            />
          </main>

          <footer className='mt-4'>
            <BottomTabs
              active='activity'
              onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
            />
          </footer>
        </div>
      </ScreenFrame>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </RequireAuth>
  );
}

export default ActivityPage;
