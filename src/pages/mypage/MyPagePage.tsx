import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAcademicSchedule,
  fetchMyPageOverview,
  logoutFromMyPage,
  type AcademicScheduleViewModel,
  type MyPageOverviewViewModel,
} from '../../api/mypage';
import {
  accountItems,
  createMyPageFallbackContext,
  createInitialOverview,
  createInitialSchedule,
} from '../../features/mypage/mypage-data';
import {
  AcademicScheduleCard,
  AccountSettingsList,
  MyPageProfileHero,
  MyPageStats,
  QuietActionButton,
  ScheduleBottomSheet,
} from '../../features/mypage/mypage-ui';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { RequireAuth } from '../../features/session/RequireAuth';
import { useSession } from '../../features/session/session-context';
import { BellIcon, BottomTabs, ScreenFrame } from '../../features/session/ui';
import { HeaderIconButton, SearchIcon } from '../../features/group/group-ui';

function buildSelectedDayLabel(dayKey: string) {
  const [year, month, day] = dayKey.split('-').map((value) => Number(value));

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date(year, month - 1, day));
}

function selectScheduleDay(
  schedule: AcademicScheduleViewModel,
  sourceSchedule: AcademicScheduleViewModel,
  dayKey: string,
) {
  const hasEvents = dayKey === sourceSchedule.selectedDateIso;

  return {
    ...sourceSchedule,
    selectedDateIso: dayKey,
    selectedDayLabel: buildSelectedDayLabel(dayKey),
    days: schedule.days.map((day) => ({
      ...day,
      isSelected: day.key === dayKey,
    })),
    events: hasEvents ? sourceSchedule.events : [],
  };
}

function MyPagePage() {
  const navigate = useNavigate();
  const { state, actions } = useSession();
  const fallbackContext = createMyPageFallbackContext(state);
  const { displayName, major, registeredEmail } = fallbackContext;
  const seedOverview = createInitialOverview(state);
  const seedSchedule = createInitialSchedule();
  const [overview, setOverview] = useState<MyPageOverviewViewModel>(() => seedOverview);
  const [scheduleSource, setScheduleSource] = useState<AcademicScheduleViewModel>(
    () => seedSchedule,
  );
  const [schedule, setSchedule] = useState<AcademicScheduleViewModel>(() => seedSchedule);
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [nextOverview, nextSchedule] = await Promise.all([
          fetchMyPageOverview(state.accessToken ?? undefined, {
            displayName,
            major,
            email: registeredEmail,
          }),
          fetchAcademicSchedule(state.accessToken ?? undefined),
        ]);

        if (cancelled) {
          return;
        }

        setOverview(nextOverview);
        setScheduleSource(nextSchedule);
        setSchedule(nextSchedule);
      } catch (error) {
        console.error(error);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [displayName, major, registeredEmail, state.accessToken]);

  const handleSelectDay = (dayKey: string) => {
    const nextSchedule = selectScheduleDay(schedule, scheduleSource, dayKey);
    setSchedule(nextSchedule);
    setShowScheduleSheet(nextSchedule.events.length > 0);
  };

  const handleLogout = async () => {
    try {
      await logoutFromMyPage(state.accessToken ?? undefined, state.refreshToken);
    } catch (error) {
      console.error(error);
    } finally {
      actions.resetAll();
      navigate('/onboard/login', { replace: true });
    }
  };

  return (
    <RequireAuth>
      <ScreenFrame className='pb-4 pt-4'>
        <div className='flex flex-1 flex-col'>
          <header className='flex items-center justify-between text-[#203354]'>
            <h1 className='text-[18px] font-extrabold tracking-[-0.04em]'>Gachon Connect</h1>
            <div className='flex items-center gap-1'>
              <HeaderIconButton label='Search'>
                <SearchIcon />
              </HeaderIconButton>
              <HeaderIconButton label='Notifications' showBadge>
                <BellIcon />
              </HeaderIconButton>
            </div>
          </header>

          <main className='flex-1 space-y-7 pt-4 pb-6'>
            <MyPageProfileHero overview={overview} />
            <MyPageStats stats={overview.stats} />
            <AcademicScheduleCard
              monthLabel={schedule.monthLabel}
              days={schedule.days}
              onSelectDay={handleSelectDay}
            />

            <section className='space-y-3'>
              <h2 className='text-[20px] font-extrabold tracking-[-0.04em] text-[#203354]'>
                Account Settings
              </h2>
              <AccountSettingsList
                items={accountItems}
                onNavigate={(item) => {
                  if (!item.href || item.disabled) {
                    return;
                  }

                  navigate(item.href);
                }}
              />
            </section>

            <QuietActionButton onClick={handleLogout}>↪ Logout</QuietActionButton>
          </main>

          <footer className='mt-auto'>
            <BottomTabs
              active='mypage'
              onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
            />
          </footer>
        </div>

        {showScheduleSheet ? (
          <ScheduleBottomSheet
            selectedDayLabel={schedule.selectedDayLabel}
            events={schedule.events}
            trendingEvent={schedule.trendingEvent}
            onClose={() => setShowScheduleSheet(false)}
          />
        ) : null}
      </ScreenFrame>
    </RequireAuth>
  );
}

export default MyPagePage;
