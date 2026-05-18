import { useNavigate } from 'react-router-dom';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGroups, type GroupListItemResponse } from '../../api/group';
import {
  groupFilters,
  type GroupCategoryFilter,
  type GroupItem,
} from '../../features/group/group-data';
import { SearchModal } from '../../features/search/SearchModal';
import {
  CategoryPill,
  FloatingActionButton,
  GroupFeedCard,
  HeaderIconButton,
  SearchIcon,
} from '../../features/group/group-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BellIcon, BottomTabs, ScreenFrame } from '../../features/session/ui';

const filterToCategoryIds: Record<Exclude<GroupCategoryFilter, 'all'>, number[]> = {
  study: [1],
  project: [2],
  it: [3],
};

function formatTimeAgo(updatedAt: string): string {
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const themeEmojis = ['🧑🏻‍🎨', '👩🏻‍💻', '👨🏻', '🧑🏻‍🔬', '👩🏻‍🦱', '👨🏻‍🏫'];

function mapGroupItem(item: GroupListItemResponse, index: number): GroupItem {
  return {
    id: String(item.id),
    apiId: item.id,
    badges: item.categories.map((c) => c.name),
    category: (item.categories[0]?.name?.toLowerCase() ?? 'study') as GroupCategoryFilter,
    title: item.title,
    description: item.name,
    authorName: '',
    authorAvatar: themeEmojis[index % themeEmojis.length],
    currentParticipants: item.currentMemberCount,
    capacity: item.capacity,
    likes: 0,
    comments: item.commentCount,
    timeAgo: formatTimeAgo(item.updatedAt),
  };
}

function GroupPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<GroupCategoryFilter>('all');
  const [showSearch, setShowSearch] = useState(false);

  const { data: groupList } = useQuery({
    queryKey: ['groups', activeFilter],
    queryFn: () =>
      fetchGroups({
        ...(activeFilter !== 'all' ? { categoryIds: filterToCategoryIds[activeFilter] } : {}),
        page: 1,
        size: 10,
        sort: 'updatedAt,desc',
      }),
  });

  const groups = groupList?.groups.map((item, i) => mapGroupItem(item, i)) ?? [];

  return (
    <RequireAuth>
      <ScreenFrame className='pb-4 pt-4'>
        <div className='flex flex-1 flex-col'>
          <header className='flex items-center justify-between'>
            <h1 className='text-[22px] font-extrabold tracking-[-0.05em] text-[#2a63e9]'>
              GachonConnect
            </h1>
            <div className='flex items-center gap-3 text-[#8090aa]'>
              <HeaderIconButton label='Search' onClick={() => setShowSearch(true)}>
                <SearchIcon />
              </HeaderIconButton>
              <HeaderIconButton label='Notifications' showBadge>
                <BellIcon />
              </HeaderIconButton>
            </div>
          </header>

          <main className='relative flex-1 pt-8'>
            <div className='space-y-5'>
              <div className='space-y-2'>
                <h2 className='text-[26px] font-extrabold tracking-[-0.05em] text-[#1f2b45]'>
                  Group
                </h2>
                <p className='text-[16px] text-[#8b97aa]'>
                  Find your study and project partners at Gachon.
                </p>
              </div>

              <div className='hide-scrollbar flex gap-3 overflow-x-auto pb-1'>
                {groupFilters.map((filter) => (
                  <CategoryPill
                    key={filter.value}
                    label={filter.label}
                    active={activeFilter === filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                  />
                ))}
              </div>

              <div className='space-y-4 pb-24'>
                {groups.map((group) => (
                  <GroupFeedCard
                    key={group.id}
                    group={group}
                    onClick={() => navigate(`/group/${group.id}`)}
                  />
                ))}
                {groups.length === 0 ? (
                  <div className='rounded-[28px] bg-white px-5 py-7 text-center shadow-[0_18px_36px_rgba(16,34,64,0.07)]'>
                    <p className='text-[17px] font-bold tracking-[-0.03em] text-[#1f2b45]'>
                      No groups in this category yet
                    </p>
                    <p className='mt-2 text-[14px] leading-[1.5] text-[#7b879b]'>
                      Try another filter or create the first group post for this topic.
                    </p>
                  </div>
                ) : null}
              </div>

              <FloatingActionButton
                onClick={() => navigate('/group/new')}
                className='absolute bottom-[82px] right-1'
                ariaLabel='Create group post'
                variant='rounded-square'
              />
            </div>
          </main>

          <footer className='mt-4'>
            <BottomTabs active='group' onNavigate={(tab) => navigateFromBottomTab(navigate, tab)} />
          </footer>
        </div>
      </ScreenFrame>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </RequireAuth>
  );
}

export default GroupPage;
