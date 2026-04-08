import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { ActivityGroupOption, ActivityItem, JoinMode } from './activity-data';

function ActivityVisual({
  variant,
  heightClassName,
  showFooterLabel = true,
}: {
  variant: ActivityItem['imageVariant'];
  heightClassName: string;
  showFooterLabel?: boolean;
}) {
  const themeClassName = {
    founders:
      'bg-[linear-gradient(180deg,rgba(8,20,38,0.16),rgba(8,20,38,0.62)),linear-gradient(135deg,#c07d33_0%,#655341_35%,#3b5066_100%)]',
    summit:
      'bg-[linear-gradient(180deg,rgba(8,20,38,0.12),rgba(8,20,38,0.58)),linear-gradient(135deg,#071a3d_0%,#0f4f7b_58%,#1b7ca8_100%)]',
    studio:
      'bg-[linear-gradient(180deg,rgba(8,20,38,0.12),rgba(8,20,38,0.6)),linear-gradient(135deg,#70502a_0%,#8c6e45_30%,#5f7890_100%)]',
    lab: 'bg-[linear-gradient(180deg,rgba(8,20,38,0.1),rgba(8,20,38,0.58)),linear-gradient(135deg,#152642_0%,#1c4076_48%,#305e7a_100%)]',
  };

  const label = {
    founders: 'FOUNDERS',
    summit: 'SUMMIT',
    studio: 'STUDIO',
    lab: 'WELLNESS',
  }[variant];

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-[28px]',
        heightClassName,
        themeClassName[variant],
      )}
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_76%_16%,rgba(255,255,255,0.16),transparent_16%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(7,14,28,0.3)_55%,rgba(7,14,28,0.64)_100%)]' />
      {showFooterLabel ? (
        <div className='absolute bottom-4 left-4 rounded-full bg-white/16 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white backdrop-blur-sm'>
          {label}
        </div>
      ) : null}
    </div>
  );
}

function HeartBadgeButton({
  liked,
  onClick,
  solid = false,
}: {
  liked: boolean;
  onClick?: () => void;
  solid?: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'flex h-11 w-11 items-center justify-center rounded-full transition',
        solid
          ? 'bg-[#0f3d79] text-white shadow-[0_12px_24px_rgba(15,61,121,0.18)]'
          : 'bg-white/92 text-[#8b97aa] shadow-[0_8px_18px_rgba(15,23,42,0.18)]',
      )}
      aria-label={liked ? 'Unlike activity' : 'Like activity'}
    >
      <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
        <path
          d='M12 20s-7-4.6-7-10.2C5 6.7 6.7 5 8.7 5c1.4 0 2.6.8 3.3 2 .7-1.2 1.9-2 3.3-2 2 0 3.7 1.7 3.7 4.8C19 15.4 12 20 12 20Z'
          fill={liked ? 'currentColor' : 'none'}
          stroke='currentColor'
          strokeWidth='1.8'
        />
      </svg>
    </button>
  );
}

function ActivityHeroBadges({ left, right }: { left: string; right: string }) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='rounded-full bg-[#c61c1c] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em]'>
        {left}
      </span>
      <span className='rounded-full bg-white/18 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] backdrop-blur-sm'>
        {right}
      </span>
    </div>
  );
}

function ActivityMetaRow({
  schedule,
  location,
  className,
}: {
  schedule: string;
  location: string;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-wrap items-center gap-x-4 gap-y-1', className)}>
      <span className='inline-flex items-center gap-1'>🗓 {schedule}</span>
      <span className='inline-flex items-center gap-1'>📍 {location}</span>
    </div>
  );
}

function ActivityAvailability({
  maxMembers,
  seatsLeft,
}: {
  maxMembers: number;
  seatsLeft: number;
}) {
  return (
    <div className='space-y-1'>
      <p className='text-[16px] font-semibold text-[#203354]'>{maxMembers} members</p>
      <p className='text-[14px] font-medium text-[#6d7a90]'>{seatsLeft} seats left</p>
    </div>
  );
}

export function ActivityHotCard({
  activity,
  onOpen,
  onToggleLike,
}: {
  activity: ActivityItem;
  onOpen: () => void;
  onToggleLike: () => void;
}) {
  return (
    <article className='rounded-[32px] bg-white p-4 shadow-[0_20px_40px_rgba(16,34,64,0.08)]'>
      <div className='relative'>
        <button type='button' onClick={onOpen} className='block w-full text-left'>
          <ActivityVisual
            variant={activity.imageVariant}
            heightClassName='h-[176px] w-full'
            showFooterLabel={false}
          />
          <div className='absolute inset-x-0 bottom-0 space-y-3 p-4 text-white'>
            <ActivityHeroBadges left={activity.badgeLabel} right={activity.membersLabel} />
            <h2 className='max-w-[10ch] text-[38px] font-extrabold leading-[0.92] tracking-[-0.06em]'>
              {activity.title}
            </h2>
            <ActivityMetaRow
              schedule={activity.schedule}
              location={activity.location}
              className='text-[12px] font-medium text-white/86'
            />
          </div>
        </button>
        <div className='absolute right-4 top-4'>
          <HeartBadgeButton liked={activity.liked} onClick={onToggleLike} />
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
        <ActivityAvailability maxMembers={activity.maxMembers} seatsLeft={activity.seatsLeft} />
        <button
          type='button'
          onClick={onOpen}
          className='inline-flex h-12 items-center justify-center rounded-full bg-[#0d3f7c] px-6 text-[15px] font-bold text-white shadow-[0_16px_28px_rgba(13,63,124,0.22)]'
        >
          View Details
        </button>
      </div>
    </article>
  );
}

export function ActivityFilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] transition',
        active ? 'bg-[#e8eefb] text-[#203354]' : 'bg-[#f2f4f7] text-[#717d90]',
      )}
    >
      {label}
    </button>
  );
}

export function ActivityFeedCard({
  activity,
  onOpen,
  onToggleLike,
}: {
  activity: ActivityItem;
  onOpen: () => void;
  onToggleLike: () => void;
}) {
  return (
    <article className='overflow-hidden rounded-[30px] bg-white shadow-[0_18px_36px_rgba(16,34,64,0.07)]'>
      <div className='relative p-4 pb-0'>
        <button type='button' onClick={onOpen} className='block w-full text-left'>
          <ActivityVisual
            variant={activity.imageVariant}
            heightClassName='h-[178px] w-full rounded-[26px]'
          />
          <div className='absolute bottom-4 left-8 rounded-full bg-[#0d3f7c] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_10px_20px_rgba(13,63,124,0.18)]'>
            {activity.membersLabel}
          </div>
        </button>
        <div className='absolute right-8 top-8'>
          <HeartBadgeButton liked={activity.liked} onClick={onToggleLike} />
        </div>
      </div>
      <button type='button' onClick={onOpen} className='block w-full text-left'>
        <div className='space-y-3 px-5 pb-5 pt-7'>
          <div>
            <p className='text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d26e56]'>
              {activity.categoryLabel}
            </p>
            <h3 className='mt-2 text-[28px] font-extrabold leading-[1] tracking-[-0.05em] text-[#203354]'>
              {activity.title}
            </h3>
          </div>
          <ActivityMetaRow
            schedule={activity.schedule}
            location={activity.location}
            className='text-[14px] text-[#6d7a90]'
          />
          <ActivityAvailability maxMembers={activity.maxMembers} seatsLeft={activity.seatsLeft} />
          <span className='inline-flex h-12 w-full items-center justify-center rounded-full border border-[#dae2ef] text-[15px] font-bold text-[#28406b]'>
            View Details
          </span>
        </div>
      </button>
    </article>
  );
}

export function ActivityDetailCard({
  activity,
  onClose,
  onJoin,
}: {
  activity: ActivityItem;
  onClose: () => void;
  onJoin: () => void;
}) {
  return (
    <article className='overflow-hidden rounded-[34px] bg-white shadow-[0_24px_48px_rgba(16,34,64,0.12)]'>
      <div className='relative'>
        <ActivityVisual
          variant={activity.imageVariant}
          heightClassName='h-[280px] w-full rounded-b-none rounded-t-[34px]'
          showFooterLabel={false}
        />
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm'
          aria-label='Close detail'
        >
          <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
            <path
              d='M7 7l10 10M17 7 7 17'
              stroke='currentColor'
              strokeLinecap='round'
              strokeWidth='2'
            />
          </svg>
        </button>
        <div className='absolute inset-x-0 bottom-0 space-y-4 p-5 text-white'>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-[#af1717] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]'>
              {activity.badgeLabel}
            </span>
            <span className='rounded-full bg-white/18 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] backdrop-blur-sm'>
              {activity.categoryLabel}
            </span>
          </div>
        </div>
      </div>

      <div className='space-y-5 px-5 py-5'>
        <div className='space-y-3'>
          <h2 className='text-[40px] font-extrabold leading-[0.95] tracking-[-0.06em] text-[#183154]'>
            {activity.title}
          </h2>
          <div className='flex items-center gap-3 text-[16px] font-semibold text-[#5c6880]'>
            <div className='flex -space-x-2'>
              {['👩🏻', '👨🏻', '🧑🏻‍💻'].map((avatar) => (
                <span
                  key={avatar}
                  className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#e8eef9] text-[18px]'
                >
                  {avatar}
                </span>
              ))}
              <span className='flex h-10 min-w-10 items-center justify-center rounded-full border-2 border-white bg-[#143f84] px-2 text-[13px] font-bold text-white'>
                +21
              </span>
            </div>
            <span>{activity.maxMembers} Members Active</span>
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center gap-4 rounded-[26px] bg-[#f2f5fa] px-5 py-4'>
            <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[#e7eefc] text-[#123f7a]'>
              📅
            </span>
            <div>
              <p className='text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#8a96ab]'>
                Schedule
              </p>
              <p className='mt-1 text-[22px] font-extrabold leading-[1.05] tracking-[-0.05em] text-[#1d3355]'>
                {activity.schedule}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4 rounded-[26px] bg-[#f2f5fa] px-5 py-4'>
            <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[#e7eefc] text-[#123f7a]'>
              📍
            </span>
            <div>
              <p className='text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#8a96ab]'>
                Location
              </p>
              <p className='mt-1 text-[22px] font-extrabold leading-[1.05] tracking-[-0.05em] text-[#1d3355]'>
                {activity.location}
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <h3 className='text-[20px] font-extrabold tracking-[-0.04em] text-[#203354]'>
            About this Session
          </h3>
          <p className='text-[16px] leading-[1.55] text-[#607089]'>{activity.description}</p>
        </div>

        <div className='flex items-center gap-4'>
          <button
            type='button'
            className='flex h-14 w-14 items-center justify-center rounded-full border border-[#d8e1f0] text-[#708096]'
            aria-label='Share activity'
          >
            <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
              <path
                d='M15 8.5a2.5 2.5 0 1 0-2.35-3.35L8.6 7.26a2.5 2.5 0 1 0 0 4.48l4.05 2.11A2.5 2.5 0 1 0 15 15.5'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.8'
              />
            </svg>
          </button>
          <button
            type='button'
            onClick={onJoin}
            className='inline-flex h-14 flex-1 items-center justify-center rounded-full bg-[#0d3f7c] px-6 text-[18px] font-bold text-white shadow-[0_18px_30px_rgba(13,63,124,0.24)]'
          >
            Join This Group
          </button>
        </div>
      </div>
    </article>
  );
}

export function ModalScrim({ children }: { children: ReactNode }) {
  return (
    <div className='fixed inset-0 z-50 bg-[rgba(214,223,235,0.82)] px-5 py-10 backdrop-blur-sm'>
      <div className='mx-auto flex min-h-full max-w-[430px] items-center justify-center'>
        {children}
      </div>
    </div>
  );
}

export function ChoiceModal({
  onSelect,
  onDismiss,
}: {
  onSelect: (_mode: JoinMode) => void;
  onDismiss: () => void;
}) {
  return (
    <div className='w-full rounded-[28px] bg-white p-6 shadow-[0_22px_48px_rgba(16,34,64,0.18)]'>
      <div className='space-y-2 text-center'>
        <h2 className='text-[22px] font-extrabold tracking-[-0.04em] text-[#203354]'>
          Join Collaboration
        </h2>
        <p className='mx-auto max-w-[22ch] text-[16px] leading-[1.45] text-[#6b7790]'>
          Choose how you would like to participate in this research initiative.
        </p>
      </div>

      <div className='mt-6 space-y-4'>
        <button
          type='button'
          onClick={() => onSelect('individual')}
          className='flex w-full items-center justify-between rounded-[24px] bg-[#f4f6fa] px-5 py-5 text-left'
        >
          <span className='flex items-center gap-4'>
            <span className='text-[22px] text-[#173b78]'>👤</span>
            <span>
              <span className='block text-[20px] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#203354]'>
                Join as Individual
              </span>
              <span className='mt-1 block text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#7d899d]'>
                Personal Contribution
              </span>
            </span>
          </span>
          <span className='text-[#b0bac8]'>›</span>
        </button>
        <button
          type='button'
          onClick={() => onSelect('group')}
          className='flex w-full items-center justify-between rounded-[24px] bg-[#f4f6fa] px-5 py-5 text-left'
        >
          <span className='flex items-center gap-4'>
            <span className='text-[22px] text-[#173b78]'>👥</span>
            <span>
              <span className='block text-[20px] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#203354]'>
                Join as Group
              </span>
              <span className='mt-1 block text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#7d899d]'>
                Represent Your Team
              </span>
            </span>
          </span>
          <span className='text-[#b0bac8]'>›</span>
        </button>
      </div>

      <button
        type='button'
        onClick={onDismiss}
        className='mt-6 w-full text-center text-[16px] font-bold text-[#5d6a80]'
      >
        Dismiss
      </button>
    </div>
  );
}

export function GroupSelectionSheet({
  groups,
  selectedId,
  onSelect,
  onConfirm,
  onClose,
}: {
  groups: ActivityGroupOption[];
  selectedId: string | null;
  onSelect: (_groupId: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className='fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] rounded-t-[28px] bg-white px-5 pb-6 pt-4 shadow-[0_-18px_42px_rgba(16,34,64,0.18)]'>
      <div className='mx-auto h-1.5 w-14 rounded-full bg-[#d7ddea]' />
      <div className='mt-4 flex items-start justify-between gap-4'>
        <div>
          <h2 className='text-[22px] font-extrabold tracking-[-0.04em] text-[#203354]'>
            Confirm Group Selection
          </h2>
          <p className='mt-1 text-[15px] leading-[1.45] text-[#6b7790]'>
            Choose a group to proceed with the activity
          </p>
        </div>
        <button type='button' onClick={onClose} className='text-[26px] leading-none text-[#49566f]'>
          ×
        </button>
      </div>

      <div className='mt-5 space-y-4'>
        {groups.map((group) => {
          const selected = selectedId === group.id;
          return (
            <button
              key={group.id}
              type='button'
              onClick={() => onSelect(group.id)}
              className={clsx(
                'flex w-full items-center justify-between rounded-[22px] border px-4 py-4 text-left transition',
                selected
                  ? 'border-[#173b78] shadow-[0_12px_24px_rgba(23,59,120,0.08)]'
                  : 'border-transparent bg-[#f7f9fc]',
              )}
            >
              <span className='flex items-center gap-4'>
                <span className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef2fb] text-[20px] text-[#173b78]'>
                  {group.id === 'neural-networks-team'
                    ? '★'
                    : group.id === 'digital-humanities-archive'
                      ? '📘'
                      : '🚀'}
                </span>
                <span>
                  <span className='block text-[20px] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#203354]'>
                    {group.name}
                  </span>
                  <span className='mt-1 block text-[14px] text-[#768197]'>
                    {group.subtitle} • {group.activeLabel}
                  </span>
                </span>
              </span>
              <span
                className={clsx(
                  'flex h-7 w-7 items-center justify-center rounded-full border',
                  selected
                    ? 'border-[#173b78] text-[#173b78]'
                    : 'border-[#cbd4e2] text-transparent',
                )}
              >
                ●
              </span>
            </button>
          );
        })}
      </div>

      <button
        type='button'
        onClick={onConfirm}
        className='mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0d2f61] text-[18px] font-bold text-white'
      >
        Confirm Selection
      </button>
    </div>
  );
}

export function FeedbackModal({
  tone,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  artwork,
}: {
  tone: 'success' | 'error' | 'create';
  title: string;
  description: ReactNode;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  artwork?: ReactNode;
}) {
  const iconClassName = {
    success: 'bg-[#1bbc8d] text-white shadow-[0_0_0_18px_rgba(27,188,141,0.12)]',
    error: 'bg-[#5f0000] text-white shadow-[0_0_0_18px_rgba(255,164,164,0.32)]',
    create: 'bg-[#0d3f7c] text-white shadow-[0_12px_24px_rgba(13,63,124,0.18)]',
  };

  const iconSymbol = {
    success: '✓',
    error: '!',
    create: '✓',
  };

  return (
    <div className='w-full rounded-[44px] bg-white px-8 py-8 text-center shadow-[0_22px_48px_rgba(16,34,64,0.18)]'>
      <div
        className={clsx(
          'mx-auto flex h-20 w-20 items-center justify-center rounded-full text-[34px] font-bold',
          iconClassName[tone],
        )}
      >
        {iconSymbol[tone]}
      </div>
      <div className='mt-8 space-y-4'>
        <h2 className='text-[28px] font-extrabold leading-[1.05] tracking-[-0.05em] text-[#0f2750]'>
          {title}
        </h2>
        <div className='text-[16px] leading-[1.55] text-[#63728b]'>{description}</div>
      </div>
      {artwork ? <div className='mt-8 overflow-hidden rounded-[28px]'>{artwork}</div> : null}
      <button
        type='button'
        onClick={onPrimary}
        className='mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0d3f7c] text-[18px] font-bold text-white shadow-[0_18px_30px_rgba(13,63,124,0.24)]'
      >
        {primaryLabel}
      </button>
      {secondaryLabel ? (
        <button
          type='button'
          onClick={onSecondary}
          className='mt-5 text-[15px] font-bold text-[#5d6a80]'
        >
          {secondaryLabel}
        </button>
      ) : null}
    </div>
  );
}

export function ActivityCategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'rounded-full px-4 py-2.5 text-[15px] font-semibold transition',
        active ? 'bg-[#0d3f7c] text-white' : 'bg-[#eef2f7] text-[#5c697f]',
      )}
    >
      {label}
    </button>
  );
}

export function ActivityCapacityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (_next: number) => void;
}) {
  return (
    <div className='flex h-14 items-center justify-between rounded-[18px] bg-[#f5f7fb] px-4'>
      <button
        type='button'
        onClick={() => onChange(Math.max(2, value - 1))}
        className='text-[24px] font-medium text-[#5f6f88]'
        aria-label='Decrease max capacity'
      >
        −
      </button>
      <span className='text-[24px] font-extrabold tracking-[-0.05em] text-[#203354]'>{value}</span>
      <button
        type='button'
        onClick={() => onChange(Math.min(50, value + 1))}
        className='text-[22px] font-medium text-[#5f6f88]'
        aria-label='Increase max capacity'
      >
        +
      </button>
    </div>
  );
}

export function DetailPosterArtwork() {
  return (
    <div className='h-[180px] rounded-[24px] bg-[linear-gradient(135deg,#dde5ef_0%,#f6f8fb_50%,#e4eaf3_100%)] p-6'>
      <div className='flex h-full items-center justify-center gap-8'>
        <div className='h-[92px] w-[58px] rounded-[12px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]' />
        <div className='h-[98px] w-[92px] rounded-[12px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]' />
      </div>
    </div>
  );
}

export function CreatedArtwork() {
  return (
    <div className='h-[170px] rounded-[30px] bg-[linear-gradient(135deg,#87c9d8_0%,#d7ecf2_26%,#eff5f7_55%,#587aa4_100%)] p-6'>
      <div className='grid h-full grid-cols-4 gap-3'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={clsx('rounded-full bg-white/78', index > 3 && 'translate-y-4')}
          />
        ))}
      </div>
    </div>
  );
}
