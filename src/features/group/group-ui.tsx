import clsx from 'clsx';
import type { ChangeEvent, ReactNode } from 'react';
import { useId } from 'react';
import { shareLink } from '../ui';
import type { GroupComment, GroupItem } from './group-data';
import { isGroupFull } from './group-data';

function badgeClasses(label: string, tone: 'feed' | 'detail' = 'feed') {
  if (tone === 'detail') {
    return (
      {
        Design: 'bg-[#edf2ff] text-[#5f7df2]',
        Study: 'bg-[#f1e9ff] text-[#8d71e5]',
        Project: 'bg-[#edf2ff] text-[#5f7df2]',
        IT: 'bg-[#e7fbf1] text-[#45af80]',
        English: 'bg-[#fff1e0] text-[#e59a4f]',
      }[label] ?? 'bg-[#eef2f7] text-[#6b7689]'
    );
  }

  return (
    {
      Study: 'bg-[#f0eaff] text-[#8d71e5]',
      Design: 'bg-[#ffe4f3] text-[#d774a8]',
      Project: 'bg-[#edf2ff] text-[#5f7df2]',
      IT: 'bg-[#e7fbf1] text-[#45af80]',
      English: 'bg-[#fff1e0] text-[#e59a4f]',
    }[label] ?? 'bg-[#eef2f7] text-[#6b7689]'
  );
}

function WireframeVisual() {
  return (
    <div className='flex h-full items-center justify-center rounded-[20px] bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.96),rgba(245,247,250,0.92)_56%,rgba(236,240,245,0.92)_100%)] px-8'>
      <div className='flex w-full max-w-[240px] items-end justify-center gap-6'>
        <div className='h-[104px] w-[68px] rounded-[14px] border border-slate-200 bg-white shadow-[0_12px_22px_rgba(15,23,42,0.08)]' />
        <div className='h-[112px] w-[104px] rounded-[14px] border border-slate-200 bg-white shadow-[0_12px_22px_rgba(15,23,42,0.08)]' />
      </div>
    </div>
  );
}

function PortraitVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={clsx(
        'overflow-hidden bg-[linear-gradient(180deg,#17293b_0%,#0f1d2e_100%)] shadow-[0_10px_24px_rgba(15,23,42,0.16)]',
        compact ? 'h-[122px] w-[92px] rounded-[22px]' : 'rounded-[22px]',
      )}
    >
      <div className='flex h-full items-end justify-center bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.2),transparent_28%)]'>
        <span className={clsx(compact ? 'pb-1 text-[58px]' : 'pb-2 text-[92px]')}>👨🏻‍🏫</span>
      </div>
    </div>
  );
}

function GroupIllustration({
  variant,
  context,
}: {
  variant: 'wireframe' | 'portrait';
  context: 'list' | 'detail';
}) {
  if (variant === 'portrait') {
    return context === 'list' ? (
      <PortraitVisual compact />
    ) : (
      <div className='rounded-[24px] bg-[#f8fafc] p-4 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]'>
        <PortraitVisual />
      </div>
    );
  }

  return (
    <div className='rounded-[24px] bg-[#f8fafc] p-4 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]'>
      <div className='h-[208px] rounded-[20px]'>
        <WireframeVisual />
      </div>
    </div>
  );
}

function IconButton({
  label,
  className,
  children,
  onClick,
  showBadge = false,
}: {
  label: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  showBadge?: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'relative flex h-9 w-9 items-center justify-center rounded-full text-[#6d798e] transition hover:bg-slate-900/5',
        className,
      )}
      aria-label={label}
    >
      {children}
      {showBadge ? (
        <span className='absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#2e63f6]' />
      ) : null}
    </button>
  );
}

export function SearchIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <circle cx='11' cy='11' r='5.7' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <path
        d='m15.2 15.3 4 4'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='1.8'
      />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M5 7h14M5 12h14M5 17h14'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='2'
      />
    </svg>
  );
}

export function MessageBubbleIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4.5 w-4.5'>
      <path
        d='M5.5 7.5A2.5 2.5 0 0 1 8 5h8a2.5 2.5 0 0 1 2.5 2.5v5A2.5 2.5 0 0 1 16 15H10l-3.5 3v-3H8A2.5 2.5 0 0 1 5.5 12.5v-5Z'
        fill='none'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.7'
      />
    </svg>
  );
}

function HeartOutlineIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4.5 w-4.5'>
      <path
        d='M12 20s-7-4.6-7-10.2C5 6.7 6.7 5 8.7 5c1.4 0 2.6.8 3.3 2 .7-1.2 1.9-2 3.3-2 2 0 3.7 1.7 3.7 4.8C19 15.4 12 20 12 20Z'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
      />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4.5 w-4.5'>
      <path
        d='M15 8.5a2.5 2.5 0 1 0-2.35-3.35L8.6 7.26a2.5 2.5 0 1 0 0 4.48l4.05 2.11A2.5 2.5 0 1 0 15 15.5'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.7'
      />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-6 w-6'>
      <path d='M12 5v14M5 12h14' stroke='currentColor' strokeLinecap='round' strokeWidth='2.4' />
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M20 4 4.8 10.3l6.2 1.8L12.8 19 20 4Z'
        fill='none'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <path d='M11 12.1 20 4' stroke='currentColor' strokeLinecap='round' strokeWidth='1.8' />
    </svg>
  );
}

export function CameraPlusIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-8 w-8'>
      <path
        d='M8.5 7.5 10 5h4l1.5 2.5H18A2.5 2.5 0 0 1 20.5 10v7A2.5 2.5 0 0 1 18 19.5H6A2.5 2.5 0 0 1 3.5 17v-7A2.5 2.5 0 0 1 6 7.5h2.5Z'
        fill='none'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='1.7'
      />
      <circle cx='12' cy='13' r='3.2' fill='none' stroke='currentColor' strokeWidth='1.7' />
      <path
        d='M18.5 5.5v4M16.5 7.5h4'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='1.7'
      />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4.5 w-4.5'>
      <rect
        x='4.5'
        y='5.5'
        width='15'
        height='14'
        rx='2.5'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
      />
      <path
        d='M8 3.8v3.1M16 3.8v3.1M4.5 9.3h15'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='1.7'
      />
    </svg>
  );
}

export function PeopleIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4.5 w-4.5'>
      <circle cx='9' cy='9' r='2.5' fill='currentColor' opacity='0.85' />
      <circle cx='16' cy='10' r='2.2' fill='currentColor' opacity='0.65' />
      <path
        d='M5.5 18c.4-2 2.1-3.5 4.2-3.5h.6c2.1 0 3.8 1.5 4.2 3.5'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='1.6'
      />
    </svg>
  );
}

function PeoplePlusIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <circle cx='9' cy='9' r='2.7' fill='currentColor' opacity='0.92' />
      <circle cx='16' cy='10' r='2.2' fill='currentColor' opacity='0.68' />
      <path
        d='M5.2 18.2c.5-2.1 2.2-3.7 4.5-3.7h.8c2 0 3.7 1.2 4.4 3'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='1.7'
      />
      <path
        d='M18.5 15.5v4M16.5 17.5h4'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='1.9'
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-16 w-16'>
      <circle cx='12' cy='12' r='9' fill='none' stroke='currentColor' strokeWidth='2.2' />
      <path
        d='m7.8 12.4 2.8 2.8 5.9-6.4'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2.6'
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-7 w-7'>
      <path
        d='m9 5 7 7-7 7'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2.4'
      />
    </svg>
  );
}

function GroupMemberCount({ group, compact = false }: { group: GroupItem; compact?: boolean }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold',
        compact ? 'text-[14px] text-[#8a97ab]' : 'text-[15px] text-[#1967d2]',
      )}
    >
      <PeopleIcon />
      <span>
        {group.currentParticipants}/{group.capacity}
        {compact ? '' : ' members'}
      </span>
    </span>
  );
}

export function HeaderIconButton({
  label,
  children,
  onClick,
  showBadge = false,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  showBadge?: boolean;
}) {
  return (
    <IconButton label={label} onClick={onClick} showBadge={showBadge}>
      {children}
    </IconButton>
  );
}

export function CategoryPill({
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
        'rounded-full px-5 py-2.5 text-[15px] font-semibold tracking-[-0.02em] transition',
        active
          ? 'bg-[#2e63f6] text-white shadow-[0_12px_22px_rgba(46,99,246,0.22)]'
          : 'bg-[#eef2f8] text-[#5f6f88]',
      )}
    >
      {label}
    </button>
  );
}

export function GroupFeedCard({ group, onClick }: { group: GroupItem; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='block w-full rounded-[30px] bg-white px-5 py-5 text-left shadow-[0_18px_36px_rgba(16,34,64,0.07)]'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex flex-wrap gap-2'>
          {group.badges.map((badge) => (
            <span
              key={badge}
              className={clsx(
                'rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]',
                badgeClasses(badge),
              )}
            >
              {badge}
            </span>
          ))}
        </div>
        <span className='pt-0.5 text-[12px] font-medium text-[#a7b1c3]'>{group.timeAgo}</span>
      </div>

      <div className='mt-4 flex gap-4'>
        <div className='min-w-0 flex-1'>
          <h3 className='text-[19px] font-bold leading-[1.2] tracking-[-0.04em] text-[#1f2b45]'>
            {group.title}
          </h3>
          <p className='mt-3 line-clamp-3 text-[15px] leading-[1.5] text-[#7b879b]'>
            {group.description}
          </p>
        </div>

        {group.listThumbnailVariant ? (
          <GroupIllustration variant={group.listThumbnailVariant} context='list' />
        ) : null}
      </div>

      <div className='mt-5 flex items-center justify-between text-[#52617d]'>
        <div className='flex items-center gap-2'>
          <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2f7] text-[18px]'>
            {group.authorAvatar}
          </span>
          <span className='text-[15px] font-semibold'>{group.authorName}</span>
        </div>

        <div className='flex items-center gap-4 text-[14px] font-semibold'>
          <GroupMemberCount group={group} compact />
          <span className='inline-flex items-center gap-1.5'>
            <span className='text-[#567cf9]'>👍</span>
            {group.likes}
          </span>
          <span className='inline-flex items-center gap-1.5'>
            <span className='text-[#7b8aa4]'>💬</span>
            {group.comments}
          </span>
        </div>
      </div>
    </button>
  );
}

export function GroupDetailCard({ group }: { group: GroupItem }) {
  const detailBadges = group.detailBadges ?? group.badges;

  return (
    <article className='rounded-[30px] bg-white px-5 py-5 shadow-[0_18px_36px_rgba(16,34,64,0.07)]'>
      <div className='flex flex-wrap gap-2'>
        {detailBadges.map((badge) => (
          <span
            key={badge}
            className={clsx(
              'rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]',
              badgeClasses(badge, 'detail'),
            )}
          >
            {badge}
          </span>
        ))}
      </div>

      <h2 className='mt-4 text-[20px] font-bold leading-[1.2] tracking-[-0.04em] text-[#1f2b45]'>
        {group.title}
      </h2>

      <div className='mt-4 flex items-center gap-3'>
        <span className='flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f7] text-[18px]'>
          {group.authorAvatar}
        </span>
        <div className='text-[14px]'>
          <p className='font-semibold text-[#2a3854]'>{group.authorName}</p>
          <p className='text-[#9aa7bb]'>{group.timeAgo}</p>
          <div className='mt-1'>
            <GroupMemberCount group={group} />
          </div>
        </div>
      </div>

      <p className='mt-5 text-[16px] leading-[1.6] text-[#63728b]'>
        {group.detailDescription ?? group.description}
      </p>

      {group.detailVisualVariant ? (
        <div className='mt-5'>
          <GroupIllustration variant={group.detailVisualVariant} context='detail' />
        </div>
      ) : null}

      <div className='mt-5 flex items-center justify-between text-[15px] font-semibold text-[#7b879b]'>
        <div className='flex items-center gap-5'>
          <span className='inline-flex items-center gap-1.5'>
            <HeartOutlineIcon />
            {group.likes}
          </span>
          <span className='inline-flex items-center gap-1.5'>
            <MessageBubbleIcon />
            {group.comments}
          </span>
        </div>
        <button
          type='button'
          onClick={() => shareLink(group.title, window.location.href)}
          className='rounded-full p-1 text-[#9aa7bb] transition hover:bg-slate-100'
          aria-label='Share group'
        >
          <ShareIcon />
        </button>
      </div>
    </article>
  );
}

export function GroupJoinButton({
  group,
  joining,
  onJoin,
}: {
  group: GroupItem;
  joining: boolean;
  onJoin: () => void;
}) {
  const full = isGroupFull(group);

  return (
    <button
      type='button'
      onClick={onJoin}
      disabled={joining || full}
      className={clsx(
        'inline-flex h-[60px] w-full items-center justify-center gap-3 rounded-[28px] text-[18px] font-bold tracking-[-0.02em] text-white shadow-[0_18px_30px_rgba(25,103,210,0.22)] transition',
        full
          ? 'bg-[#b7c1d0] shadow-none'
          : 'bg-[#0879f2] hover:-translate-y-0.5 disabled:bg-[#94bff0]',
      )}
    >
      <PeoplePlusIcon />
      {full ? 'Group is Full' : joining ? 'Joining...' : 'Join This Group'}
    </button>
  );
}

export function GroupLeaveButton({ leaving, onLeave }: { leaving: boolean; onLeave: () => void }) {
  return (
    <button
      type='button'
      onClick={onLeave}
      disabled={leaving}
      className='inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[24px] text-[15px] font-bold tracking-[-0.02em] text-[#8090aa] border border-[#d8e1f0] transition hover:bg-[#f5f7fa] disabled:opacity-50'
    >
      {leaving ? 'Leaving...' : 'Leave Group'}
    </button>
  );
}

export function GroupJoinSuccessView({
  group,
  onBackToGroup,
}: {
  group: GroupItem;
  onBackToGroup: () => void;
}) {
  return (
    <div className='flex min-h-dvh flex-col bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#f7fbff_34%,#edf5fb_62%,#e9f3f9_100%)] px-6 py-12 text-center'>
      <div className='flex flex-1 flex-col items-center justify-center'>
        <div className='rounded-[34px] bg-white p-8 text-[#0d7698] shadow-[0_28px_58px_rgba(13,118,152,0.15)]'>
          <div className='rounded-full bg-[#e5f1f4] p-5'>
            <CheckCircleIcon />
          </div>
        </div>

        <div className='mt-12 space-y-4'>
          <h1 className='text-[42px] font-extrabold leading-[1.02] tracking-[-0.06em] text-[#101827]'>
            Join Successful!
          </h1>
          <p className='mx-auto max-w-[340px] text-[19px] leading-[1.55] tracking-[-0.03em] text-[#6f7b8f]'>
            You have successfully joined the{' '}
            <strong className='font-extrabold text-[#111827]'>{group.title}</strong> group. Check
            your Activity tab for updates.
          </p>
        </div>

        <div className='mt-10 flex w-full items-center gap-4 rounded-[32px] bg-[#f1f4f7] px-6 py-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]'>
          <span className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-[28px] shadow-[0_10px_24px_rgba(16,34,64,0.08)]'>
            {group.authorAvatar}
          </span>
          <div className='min-w-0 flex-1'>
            <p className='line-clamp-2 text-[21px] font-extrabold leading-[1.2] tracking-[-0.05em] text-[#111827]'>
              {group.title}
            </p>
            <GroupMemberCount group={group} />
          </div>
          <span className='text-[#0d7698]'>
            <ChevronRightIcon />
          </span>
        </div>
      </div>

      <button
        type='button'
        onClick={onBackToGroup}
        className='mb-4 inline-flex h-16 w-full items-center justify-center rounded-full bg-[#0d7698] text-[20px] font-bold text-white shadow-[0_22px_36px_rgba(13,118,152,0.22)]'
      >
        Back to Group
      </button>
    </div>
  );
}

export function GroupCommentCard({
  comment,
  isOwnComment = false,
  editing = false,
  editValue = '',
  onEditValueChange,
  onEdit,
  onEditCancel,
  onEditSave,
  onDelete,
  onReply,
}: {
  comment: GroupComment;
  isOwnComment?: boolean;
  editing?: boolean;
  editValue?: string;
  onEditValueChange?: (_value: string) => void;
  onEdit?: () => void;
  onEditCancel?: () => void;
  onEditSave?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
}) {
  return (
    <article className='rounded-[24px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(16,34,64,0.06)]'>
      <div className='flex items-start gap-3'>
        <span className='flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f7] text-[18px]'>
          {comment.avatar}
        </span>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <span className='text-[14px] font-semibold text-[#263550]'>{comment.author}</span>
            <span className='text-[12px] text-[#9aa7bb]'>{comment.timeAgo}</span>
            {isOwnComment && !editing && (
              <div className='ml-auto flex items-center gap-2'>
                <button
                  type='button'
                  onClick={onEdit}
                  className='text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9ca7bb] hover:text-[#61708a]'
                >
                  Edit
                </button>
                <button
                  type='button'
                  onClick={onDelete}
                  className='text-[11px] font-semibold uppercase tracking-[0.1em] text-[#d16060] hover:text-[#b04040]'
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {editing ? (
            <div className='mt-2 flex items-center gap-2'>
              <input
                value={editValue}
                onChange={(e) => onEditValueChange?.(e.target.value)}
                className='min-w-0 flex-1 rounded-lg border border-[#d8e1f0] px-3 py-1.5 text-[14px] text-[#24324c] outline-none focus:border-[#0879f2]'
              />
              <button
                type='button'
                onClick={onEditSave}
                className='text-[12px] font-bold text-[#0879f2]'
              >
                Save
              </button>
              <button
                type='button'
                onClick={onEditCancel}
                className='text-[12px] font-bold text-[#9aa7bb]'
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className='mt-2 text-[14px] leading-[1.55] text-[#61708a]'>{comment.message}</p>
          )}
          {!editing && onReply && (
            <button
              type='button'
              onClick={onReply}
              className='mt-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9ca7bb] hover:text-[#61708a]'
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function GroupComposer({
  value,
  onChange,
  onSubmit,
  replyToAuthor,
  onCancelReply,
}: {
  value: string;
  onChange: (_value: string) => void;
  onSubmit: () => void;
  replyToAuthor?: string | null;
  onCancelReply?: () => void;
}) {
  const hasValue = value.trim().length > 0;

  return (
    <div className='flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_14px_28px_rgba(16,34,64,0.08)]'>
      {replyToAuthor && onCancelReply ? (
        <button
          type='button'
          onClick={onCancelReply}
          className='shrink-0 rounded-full bg-[#eef2f7] px-2 py-0.5 text-[11px] font-bold text-[#8090aa]'
        >
          @{replyToAuthor} ✕
        </button>
      ) : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={replyToAuthor ? `Reply to ${replyToAuthor}...` : 'Write a comment...'}
        className='min-w-0 flex-1 bg-transparent text-[14px] text-[#24324c] outline-none placeholder:text-[#a8b2c2]'
      />
      <button
        type='button'
        onClick={onSubmit}
        disabled={!hasValue}
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[0_12px_22px_rgba(20,63,132,0.22)] transition',
          hasValue ? 'bg-[#143f84]' : 'bg-[#bfd0e8] shadow-none',
        )}
        aria-label='Send comment'
      >
        <SendIcon />
      </button>
    </div>
  );
}

export function FloatingActionButton({
  ariaLabel,
  onClick,
  className,
  variant = 'circle',
}: {
  ariaLabel: string;
  onClick: () => void;
  className?: string;
  variant?: 'circle' | 'rounded-square';
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(
        'flex items-center justify-center shadow-[0_18px_30px_rgba(46,99,246,0.28)] transition hover:-translate-y-0.5',
        variant === 'rounded-square'
          ? 'h-16 w-16 rounded-[18px] bg-[#2e63f6] text-white'
          : 'h-16 w-16 rounded-full bg-[#dff1f7] text-[#0d7698] shadow-[0_12px_24px_rgba(13,118,152,0.16)]',
        className,
      )}
    >
      <PlusIcon />
    </button>
  );
}

export function NewPostCategoryChip({
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
        'rounded-full px-4 py-2.5 text-[15px] font-semibold tracking-[-0.02em] transition',
        active
          ? 'bg-[#0d7698] text-white shadow-[0_12px_22px_rgba(13,118,152,0.22)]'
          : 'bg-[#eef2f7] text-[#5c697f]',
      )}
    >
      {label}
    </button>
  );
}

export function NewPostField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className='block'>
      <span className='mb-2 block text-[14px] font-semibold tracking-[-0.02em] text-[#5b667d]'>
        {label}
      </span>
      {children}
    </label>
  );
}

export function NewPostInput({
  placeholder,
  value,
  onChange,
  icon,
  className,
  type = 'text',
  min,
}: {
  placeholder?: string;
  value: string;
  onChange: (_value: string) => void;
  icon?: ReactNode;
  className?: string;
  type?: 'text' | 'date';
  min?: string;
}) {
  return (
    <div
      className={clsx('flex h-14 items-center gap-3 rounded-[20px] bg-[#eef2f7] px-4', className)}
    >
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        className={clsx(
          'min-w-0 flex-1 bg-transparent text-[15px] text-[#24324c] outline-none placeholder:text-[#a8b2c2]',
          type === 'date' && 'uppercase text-[#5f6f88] [color-scheme:light]',
        )}
      />
      {icon ? <span className='text-[#808ca1]'>{icon}</span> : null}
    </div>
  );
}

export function NewPostTextArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (_value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Tell us about the group, goals, and who you're looking for..."
      className='h-[160px] w-full resize-none rounded-[24px] bg-[#eef2f7] px-4 py-4 text-[15px] leading-[1.5] text-[#24324c] outline-none placeholder:text-[#a8b2c2]'
    />
  );
}

export function CoverImageField({
  previewUrl,
  fileName,
  onFileSelect,
  onClear,
}: {
  previewUrl: string | null;
  fileName: string | null;
  onFileSelect: (_file: File | null) => void;
  onClear: () => void;
}) {
  const inputId = useId();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  return (
    <div className='space-y-3'>
      <input
        id={inputId}
        type='file'
        accept='image/*'
        className='sr-only'
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className='overflow-hidden rounded-[24px] border border-[#d8e1f0] bg-white shadow-[0_12px_24px_rgba(16,34,64,0.05)]'>
          <div className='h-[170px] overflow-hidden bg-[#f3f7fc]'>
            <img
              src={previewUrl}
              alt='Selected cover preview'
              className='h-full w-full object-cover'
            />
          </div>
          <div className='flex items-center justify-between gap-4 px-4 py-3'>
            <div className='min-w-0'>
              <p className='truncate text-[14px] font-semibold text-[#33415c]'>{fileName}</p>
              <p className='text-[12px] text-[#7d89a0]'>Ready to send as multipart image data</p>
            </div>
            <div className='flex items-center gap-2'>
              <label
                htmlFor={inputId}
                className='cursor-pointer rounded-full bg-[#eef3f8] px-3 py-2 text-[12px] font-semibold text-[#5b667d]'
              >
                Change
              </label>
              <button
                type='button'
                onClick={onClear}
                className='rounded-full px-3 py-2 text-[12px] font-semibold text-[#d16060]'
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className='flex h-[170px] cursor-pointer items-center justify-center rounded-[24px] border-2 border-dashed border-[#cad6ea] bg-[#fbfcfe] px-6 text-center text-[#7d89a0]'
        >
          <div className='space-y-3'>
            <span className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3f8] text-[#8390a6]'>
              <CameraPlusIcon />
            </span>
            <div className='space-y-1'>
              <p className='text-[15px] font-medium'>Add a photo to attract more members</p>
              <p className='text-[12px] text-[#9aa7bb]'>JPG, PNG, WEBP</p>
            </div>
          </div>
        </label>
      )}
    </div>
  );
}
