import { useNavigate } from 'react-router-dom';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { useState } from 'react';
import {
  groupFilters,
  groupItems,
  type GroupCategoryFilter,
} from '../../features/group/group-data';
import {
  CategoryPill,
  FloatingActionButton,
  GroupFeedCard,
  HeaderIconButton,
  SearchIcon,
} from '../../features/group/group-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BellIcon, BottomTabs, ScreenFrame } from '../../features/session/ui';

function GroupPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<GroupCategoryFilter>('all');

  const filteredGroups =
    activeFilter === 'all'
      ? groupItems
      : groupItems.filter(
          (group) =>
            group.category === activeFilter ||
            group.badges.some((badge) => badge.toLowerCase() === activeFilter),
        );

  return (
    <RequireAuth>
      <ScreenFrame className='pb-4 pt-4'>
        <div className='flex flex-1 flex-col'>
          <header className='flex items-center justify-between'>
            <h1 className='text-[22px] font-extrabold tracking-[-0.05em] text-[#2a63e9]'>
              GachonConnect
            </h1>
            <div className='flex items-center gap-3 text-[#8090aa]'>
              <HeaderIconButton label='Search'>
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
                {filteredGroups.map((group) => (
                  <GroupFeedCard
                    key={group.id}
                    group={group}
                    onClick={() => navigate(`/group/${group.id}`)}
                  />
                ))}
                {filteredGroups.length === 0 ? (
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
    </RequireAuth>
  );
}

export default GroupPage;
