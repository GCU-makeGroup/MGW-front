import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { likeActivity, unlikeActivity } from '../../api/activity';
import {
  activityFilters,
  activityItems,
  type ActivityCategory,
} from '../../features/activity/activity-data';
import {
  ActivityFeedCard,
  ActivityFilterChip,
  ActivityHotCard,
  MyActivityButton,
} from '../../features/activity/activity-ui';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { RequireAuth } from '../../features/session/RequireAuth';
import { useSession } from '../../features/session/session-context';
import { BottomTabs, ScreenFrame } from '../../features/session/ui';
import { FloatingActionButton, HeaderIconButton, SearchIcon } from '../../features/group/group-ui';
import { BellIcon } from '../../features/session/ui';

function ActivityPage() {
  const navigate = useNavigate();
  const { state } = useSession();
  const [activeFilter, setActiveFilter] = useState<ActivityCategory | 'all'>('all');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>(
    Object.fromEntries(activityItems.map((item) => [item.id, item.liked])),
  );

  const hotPickActivity = activityItems.find((activity) => activity.isHotPick) ?? activityItems[0];
  const visibleActivities =
    activeFilter === 'all'
      ? activityItems.filter((activity) => !activity.isHotPick)
      : activityItems.filter(
          (activity) => activity.category === activeFilter && !activity.isHotPick,
        );

  const toggleLike = async (activityId: string) => {
    const nextLiked = !likedIds[activityId];
    setLikedIds((prev) => ({ ...prev, [activityId]: nextLiked }));

    try {
      if (nextLiked) {
        await likeActivity(activityId, state.accessToken ?? undefined);
      } else {
        await unlikeActivity(activityId, state.accessToken ?? undefined);
      }
    } catch (error) {
      setLikedIds((prev) => ({ ...prev, [activityId]: !nextLiked }));
      console.error(error);
    }
  };

  return (
    <RequireAuth>
      <ScreenFrame className='pb-4 pt-4'>
        <div className='flex flex-1 flex-col'>
          <header className='grid grid-cols-[40px_1fr_40px] items-center text-[#203354]'>
            <HeaderIconButton label='Search'>
              <SearchIcon />
            </HeaderIconButton>
            <h1 className='text-center text-[18px] font-extrabold tracking-[-0.04em]'>
              GachonConnect
            </h1>
            <HeaderIconButton label='Notifications'>
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
                  <button type='button' className='text-[15px] font-bold text-[#6d7a90]'>
                    See all
                  </button>
                </div>
                <ActivityHotCard
                  activity={{ ...hotPickActivity, liked: likedIds[hotPickActivity.id] }}
                  onOpen={() => navigate(`/activity/${hotPickActivity.id}`)}
                  onToggleLike={() => toggleLike(hotPickActivity.id)}
                />
              </section>

              <section className='space-y-4'>
                <h2 className='text-[28px] font-extrabold tracking-[-0.05em] text-[#203354]'>
                  Available Activity
                </h2>
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
                  {visibleActivities.map((activity) => (
                    <ActivityFeedCard
                      key={activity.id}
                      activity={{ ...activity, liked: likedIds[activity.id] }}
                      onOpen={() => navigate(`/activity/${activity.id}`)}
                      onToggleLike={() => toggleLike(activity.id)}
                    />
                  ))}
                </div>
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
    </RequireAuth>
  );
}

export default ActivityPage;
