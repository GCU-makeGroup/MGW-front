import clsx from 'clsx';
import type { ReactNode } from 'react';
import type {
  AcademicCalendarDayViewModel,
  AcademicScheduleEventViewModel,
  AcademicScheduleViewModel,
  MyPageOverviewViewModel,
  MyPageSettingsViewModel,
  PreferredLanguage,
} from '../../api/mypage';
import { preferredLanguageOptions, type MyPageAccountItem, weekdayLabels } from './mypage-data';

function ChevronRightIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4.5 w-4.5'>
      <path
        d='m9 6 6 6-6 6'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  );
}

function ChevronButton({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next';
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex h-7 w-7 items-center justify-center rounded-full text-[#7d89a1] transition hover:bg-slate-900/5'
      aria-label={direction === 'prev' ? 'Previous month' : 'Next month'}
    >
      <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        className={clsx('h-4.5 w-4.5', direction === 'next' ? 'rotate-180' : '')}
      >
        <path
          d='m15 18-6-6 6-6'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
        />
      </svg>
    </button>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className='text-[20px] font-extrabold tracking-[-0.04em] text-[#203354]'>{children}</h2>
  );
}

function CardSurface({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'rounded-[28px] bg-white shadow-[0_18px_36px_rgba(16,34,64,0.07)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (_next: boolean) => void;
}) {
  return (
    <button
      type='button'
      onClick={() => onToggle(!enabled)}
      className={clsx(
        'relative h-6 w-11 rounded-full transition',
        enabled ? 'bg-[#123f7a]' : 'bg-[#dbe2ec]',
      )}
      aria-pressed={enabled}
    >
      <span
        className={clsx(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_6px_14px_rgba(16,34,64,0.18)] transition',
          enabled ? 'left-5' : 'left-0.5',
        )}
      />
    </button>
  );
}

function SettingsRowShell({
  icon,
  title,
  description,
  rightSlot,
  onClick,
  disabled = false,
}: {
  icon: string;
  title: string;
  description?: string;
  rightSlot: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const content = (
    <>
      <span className='flex min-w-0 items-center gap-3'>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2fa] text-[16px]'>
          {icon}
        </span>
        <span className='min-w-0'>
          <span className='block text-[15px] font-bold tracking-[-0.02em] text-[#203354]'>
            {title}
          </span>
          {description ? (
            <span className='mt-0.5 block text-[11px] leading-[1.35] text-[#8a96ab]'>
              {description}
            </span>
          ) : null}
        </span>
      </span>
      <span className='shrink-0'>{rightSlot}</span>
    </>
  );

  if (onClick && !disabled) {
    return (
      <button
        type='button'
        onClick={onClick}
        className='flex w-full items-center justify-between gap-3 rounded-[20px] px-4 py-3 text-left transition hover:bg-slate-900/[0.025]'
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={clsx(
        'flex w-full items-center justify-between gap-3 rounded-[20px] px-4 py-3 text-left',
        disabled ? 'opacity-90' : '',
      )}
    >
      {content}
    </div>
  );
}

export function MyPageProfileHero({
  overview,
  onImageSelect,
}: {
  overview: MyPageOverviewViewModel;
  onImageSelect?: (_file: File) => void;
}) {
  return (
    <div className='flex flex-col items-center gap-4 pt-4 text-center'>
      <div className='relative'>
        <div className='flex h-[106px] w-[106px] items-center justify-center rounded-full border-[4px] border-[#1a3764] bg-[radial-gradient(circle_at_30%_30%,#8ca6cf,#274164_72%)] text-[48px] shadow-[0_18px_34px_rgba(15,41,82,0.18)]'>
          {overview.profileImageUrl ? (
            <img
              src={overview.profileImageUrl}
              className='h-full w-full rounded-full object-cover'
              alt='Profile'
            />
          ) : (
            overview.profileEmoji
          )}
        </div>
        <label
          htmlFor='profile-image-input'
          className='absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1c4f97] text-white shadow-[0_10px_18px_rgba(28,79,151,0.28)]'
        >
          <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4 w-4'>
            <path
              d='M8.5 7.5 10 5h4l1.5 2.5H18A2.5 2.5 0 0 1 20.5 10v6A2.5 2.5 0 0 1 18 18.5H6A2.5 2.5 0 0 1 3.5 16v-6A2.5 2.5 0 0 1 6 7.5h2.5Z'
              fill='none'
              stroke='currentColor'
              strokeLinejoin='round'
              strokeWidth='1.7'
            />
            <circle cx='12' cy='13' r='2.8' fill='none' stroke='currentColor' strokeWidth='1.7' />
          </svg>
        </label>
        <input
          id='profile-image-input'
          type='file'
          accept='image/*'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageSelect?.(file);
          }}
        />
      </div>

      <div className='space-y-2'>
        <h1 className='text-[22px] font-extrabold tracking-[-0.05em] text-[#203354]'>
          {overview.name}
        </h1>
        <div className='flex items-center justify-center gap-3 text-[14px] font-medium text-[#66748b]'>
          <span className='max-w-[14ch] leading-[1.25]'>{overview.major}</span>
          <span className='rounded-full bg-[#e7efff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#6f84ad]'>
            {overview.verificationLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MyPageStats({
  stats,
  onNavigate,
}: {
  stats: MyPageOverviewViewModel['stats'];
  onNavigate?: (_path: string) => void;
}) {
  const items = [
    {
      label: 'Posts',
      value: stats.posts,
      path: undefined as string | undefined,
    },
    {
      label: 'Groups',
      value: stats.groups,
      path: undefined as string | undefined,
    },
    {
      label: 'Activities',
      value: stats.activities,
      path: '/activity/my',
    },
  ];

  return (
    <div className='grid grid-cols-3 gap-2'>
      {items.map((item) => {
        const cardContent = (
          <>
            <p className='text-[20px] font-extrabold tracking-[-0.05em]'>{item.value}</p>
            <p className='mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#909cb0]'>
              {item.label}
            </p>
          </>
        );

        if (item.path && onNavigate) {
          return (
            <CardSurface key={item.label} className='px-2 py-4 text-center cursor-pointer text-[#203354]'>
              <button
                type='button'
                onClick={() => onNavigate(item.path!)}
                className='w-full text-center'
              >
                {cardContent}
              </button>
            </CardSurface>
          );
        }

        return (
          <CardSurface key={item.label} className='px-2 py-4 text-center text-[#203354]'>
            {cardContent}
          </CardSurface>
        );
      })}
    </div>
  );
}

export function AcademicScheduleCard({
  monthLabel,
  days,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}: {
  monthLabel: string;
  days: AcademicCalendarDayViewModel[];
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onSelectDay: (_dayKey: string) => void;
}) {
  return (
    <CardSurface className='px-4 py-4'>
      <div className='flex items-center justify-between'>
        <SectionHeading>Academic Schedule</SectionHeading>
        <div className='flex items-center gap-1'>
          <span className='mr-2 text-[16px] font-bold tracking-[-0.03em] text-[#394860]'>
            {monthLabel}
          </span>
          <ChevronButton direction='prev' onClick={onPrevMonth} />
          <ChevronButton direction='next' onClick={onNextMonth} />
        </div>
      </div>

      <div className='mt-4 grid grid-cols-7 gap-y-3 text-center'>
        {weekdayLabels.map((label) => (
          <span
            key={label}
            className='text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#98a3b5]'
          >
            {label}
          </span>
        ))}

        {days.map((day) => (
          <button
            key={day.key}
            type='button'
            onClick={() => onSelectDay(day.key)}
            className='flex flex-col items-center gap-1 rounded-2xl py-1.5 text-center'
          >
            <span
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-semibold transition',
                day.isSelected
                  ? 'bg-[#123f7a] text-white shadow-[0_12px_20px_rgba(18,63,122,0.18)]'
                  : day.inCurrentMonth
                    ? 'text-[#55647d]'
                    : 'text-[#c4ccda]',
              )}
            >
              {day.label}
            </span>
            <span
              className={clsx(
                'h-1.5 w-1.5 rounded-full',
                day.hasEvents ? 'bg-[#db6a53]' : 'bg-transparent',
              )}
            />
          </button>
        ))}
      </div>
    </CardSurface>
  );
}

export function AccountSettingsList({
  items,
  onNavigate,
}: {
  items: MyPageAccountItem[];
  onNavigate: (_item: MyPageAccountItem) => void;
}) {
  return (
    <CardSurface className='px-3 py-3'>
      <div className='space-y-1'>
        {items.map((item) => (
          <SettingsRowShell
            key={item.key}
            icon={item.icon}
            title={item.label}
            disabled={item.disabled}
            onClick={() => onNavigate(item)}
            rightSlot={<ChevronRightIcon />}
          />
        ))}
      </div>
    </CardSurface>
  );
}

export function QuietActionButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='inline-flex h-14 w-full items-center justify-center rounded-[18px] bg-[#efe5e7] text-[15px] font-semibold text-[#5b6678]'
    >
      {children}
    </button>
  );
}

export function ScheduleBottomSheet({
  selectedDayLabel,
  events,
  trendingEvent,
  loading,
  onClose,
}: {
  selectedDayLabel: string;
  events: AcademicScheduleEventViewModel[];
  trendingEvent: AcademicScheduleViewModel['trendingEvent'];
  loading?: boolean;
  onClose: () => void;
}) {
  return (
    <div className='fixed inset-0 z-50 bg-[rgba(214,223,235,0.5)] backdrop-blur-sm'>
      <div className='mx-auto flex min-h-dvh w-full max-w-[430px] items-end'>
        <div className='w-full rounded-t-[32px] bg-white px-5 pb-8 pt-3 shadow-[0_-22px_52px_rgba(16,34,64,0.18)]'>
          <div className='mx-auto h-1.5 w-16 rounded-full bg-[#d9e1ec]' />
          <div className='mt-5 space-y-1'>
            <h2 className='text-[22px] font-extrabold tracking-[-0.05em] text-[#203354]'>
              {selectedDayLabel}
            </h2>
            <p className='text-[15px] text-[#7b879b]'>Today&apos;s Academic & Social Events</p>
          </div>

          <div className='mt-6 space-y-4'>
            {loading ? (
              <div className='py-8 text-center'>
                <p className='text-[14px] text-[#8090aa]'>Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className='py-8 text-center'>
                <p className='text-[15px] font-semibold text-[#1f2b45]'>No events scheduled</p>
                <p className='mt-1 text-[13px] text-[#8090aa]'>
                  No activities or events for this day.
                </p>
              </div>
            ) : (
              events.map((event) => (
                <CardSurface
                  key={event.id}
                  className='overflow-hidden border-l-[4px] border-[#123f7a] p-4'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <span className='rounded-full bg-[#edf2fa] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6f7b90]'>
                        {event.typeLabel}
                      </span>
                      <h3 className='mt-3 text-[17px] font-bold leading-[1.2] tracking-[-0.03em] text-[#203354]'>
                        {event.title}
                      </h3>
                    </div>
                    <button type='button' className='text-[#516077]' aria-label='More options'>
                      •••
                    </button>
                  </div>

                  <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-medium text-[#5f6d84]'>
                    <span className='inline-flex items-center gap-2'>🕐 {event.timeRange}</span>
                    <span className='inline-flex items-center gap-2'>📍 {event.location}</span>
                  </div>

                  <div className='mt-4 flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <div className='flex -space-x-2'>
                        {['🧑🏻', '👩🏻', '🧑🏽'].map((avatar) => (
                          <span
                            key={avatar}
                            className='flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#d9edf0] text-[13px]'
                          >
                            {avatar}
                          </span>
                        ))}
                      </div>
                      <span className='text-[14px] font-semibold text-[#203354]'>
                        {event.joiningFriendsLabel}
                      </span>
                    </div>
                    <span
                      className={clsx(
                        'flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold',
                        event.completed ? 'bg-[#123f7a] text-white' : 'bg-[#edf2fa] text-[#7f8ca2]',
                      )}
                    >
                      ✓
                    </span>
                  </div>
                </CardSurface>
              ))
            )}

            <div className='relative overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#2e9ca0_0%,#174566_100%)] p-5 text-white shadow-[0_18px_36px_rgba(16,34,64,0.12)]'>
              <div className='absolute bottom-0 right-10 text-[90px] opacity-40'>👩🏻</div>
              <span className='inline-flex rounded-full bg-[#b60000] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em]'>
                {trendingEvent.badgeLabel}
              </span>
              <h3 className='mt-4 max-w-[12ch] text-[30px] font-extrabold leading-[0.95] tracking-[-0.05em]'>
                {trendingEvent.title}
              </h3>
              <p className='mt-3 text-[15px] font-medium text-white/88'>
                📍 {trendingEvent.location}
              </p>
              <button
                type='button'
                className='absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/18 text-[28px] text-white backdrop-blur-sm'
              >
                +
              </button>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='mt-6 w-full text-center text-[15px] font-bold text-[#66748b]'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsProfileSummary({ settings }: { settings: MyPageSettingsViewModel }) {
  return (
    <CardSurface className='px-4 py-3'>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <div className='flex h-12 w-12 items-center justify-center rounded-[16px] bg-[radial-gradient(circle_at_30%_30%,#8ca6cf,#274164_72%)] text-[24px] text-white'>
            {settings.profile.profileEmoji}
          </div>
          <div className='absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1c4f97] text-[10px] text-white'>
            ✓
          </div>
        </div>
        <div className='min-w-0'>
          <p className='text-[15px] font-bold tracking-[-0.03em] text-[#203354]'>
            {settings.profile.name}
          </p>
          <p className='text-[11px] text-[#7a869b]'>
            {settings.profile.major} • {settings.profile.grade}
          </p>
          <span className='mt-1 inline-flex rounded-full bg-[#edf2fa] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#7586a4]'>
            Academic Verified
          </span>
        </div>
      </div>
    </CardSurface>
  );
}

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='space-y-3'>
      <SectionHeading>{title}</SectionHeading>
      <CardSurface className='px-3 py-3'>{children}</CardSurface>
    </section>
  );
}

export function KeywordSelection({
  keywords,
  onRemove,
  onAddSuggestion,
}: {
  keywords: string[];
  onRemove: (_keyword: string) => void;
  onAddSuggestion: () => void;
}) {
  return (
    <div className='space-y-4'>
      <div>
        <p className='text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8f99ad]'>
          Interest Keywords
        </p>
        <div className='mt-3 flex flex-wrap gap-2'>
          {keywords.map((keyword) => (
            <button
              key={keyword}
              type='button'
              onClick={() => onRemove(keyword)}
              className='rounded-full bg-[#edf2fa] px-3 py-2 text-[12px] font-bold text-[#24406f]'
            >
              #{keyword}
            </button>
          ))}
          <button
            type='button'
            onClick={onAddSuggestion}
            className='rounded-full bg-[#f4f6fa] px-3 py-2 text-[12px] font-semibold text-[#8a96ab]'
          >
            + Add New
          </button>
        </div>
      </div>
    </div>
  );
}

export function PreferredLanguageSelector({
  value,
  onSelect,
}: {
  value: PreferredLanguage;
  onSelect: (_value: PreferredLanguage) => void;
}) {
  return (
    <div>
      <p className='text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8f99ad]'>
        Preferred Language
      </p>
      <div className='mt-3 flex gap-2'>
        {preferredLanguageOptions.map((option) => (
          <button
            key={option.value}
            type='button'
            onClick={() => onSelect(option.value)}
            className={clsx(
              'rounded-[14px] px-4 py-2.5 text-[12px] font-bold transition',
              option.value === value ? 'bg-[#203f74] text-white' : 'bg-[#f4f6fa] text-[#5e6e86]',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsToggleRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: string;
  title: string;
  description?: string;
  enabled: boolean;
  onToggle: (_next: boolean) => void;
}) {
  return (
    <SettingsRowShell
      icon={icon}
      title={title}
      description={description}
      rightSlot={<ToggleSwitch enabled={enabled} onToggle={onToggle} />}
    />
  );
}

export function SettingsLinkRow({
  icon,
  title,
  value,
  onClick,
}: {
  icon: string;
  title: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <SettingsRowShell
      icon={icon}
      title={title}
      onClick={onClick}
      rightSlot={
        <span className='inline-flex items-center gap-2 text-[13px] font-semibold text-[#8a96ab]'>
          {value ? <span>{value}</span> : null}
          <ChevronRightIcon />
        </span>
      }
    />
  );
}

export function AcademicVerificationCard({
  studentId,
  department,
  onReverify,
}: {
  studentId: string;
  department: string;
  onReverify?: () => void;
}) {
  return (
    <div className='rounded-[20px] bg-[#fbfcfe] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(228,234,243,0.9)]'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='text-[15px] font-bold tracking-[-0.03em] text-[#203354]'>
            Academic Verification
          </p>
          <p className='mt-1 text-[11px] leading-[1.35] text-[#8a96ab]'>
            ID {studentId}
            <br />
            {department}
          </p>
        </div>
        <button
          type='button'
          onClick={onReverify}
          className='rounded-full bg-[#123f7a] px-4 py-2 text-[11px] font-bold text-white'
        >
          Re-verify
        </button>
      </div>
    </div>
  );
}

export function SignOutFooter() {
  return (
    <div className='space-y-5 pt-2 text-center'>
      <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-[#c0c7d4]'>
        Gachon Connect v1.0.0
      </p>
    </div>
  );
}

export function DangerConfirmationModal({
  email,
  value,
  onChange,
  onConfirm,
  onCancel,
}: {
  email: string;
  value: string;
  onChange: (_value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const matchesEmail = value.trim().toLowerCase() === email.trim().toLowerCase();

  return (
    <div className='fixed inset-0 z-50 bg-[rgba(183,197,214,0.56)] px-5 py-10 backdrop-blur-sm'>
      <div className='mx-auto flex min-h-full max-w-[430px] items-center justify-center'>
        <div className='w-full rounded-[32px] bg-white px-7 py-8 text-center shadow-[0_24px_56px_rgba(16,34,64,0.2)]'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1f1] text-[#c43333] shadow-[0_0_0_14px_rgba(255,241,241,0.7)]'>
            <svg aria-hidden='true' viewBox='0 0 24 24' className='h-9 w-9'>
              <path
                d='M12 4 4 19h16L12 4Zm0 5.5v4.5m0 3h.01'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.9'
              />
            </svg>
          </div>

          <div className='mt-8 space-y-4'>
            <h2 className='text-[24px] font-extrabold tracking-[-0.05em] text-[#203354]'>
              Confirm Deactivation
            </h2>
            <p className='mx-auto max-w-[18ch] text-[16px] leading-[1.5] text-[#66748b]'>
              Are you sure you want to delete your account? This action cannot be undone. To
              confirm, please enter your registered university email address.
            </p>
          </div>

          <label className='mt-8 block text-left'>
            <span className='mb-2 block text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#46546e]'>
              University Email
            </span>
            <input
              type='email'
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder='Enter your email'
              className='h-14 w-full rounded-[16px] bg-[#f3f6fb] px-5 text-[15px] font-medium text-[#203354] outline-none placeholder:text-[#b0bbcb] focus:ring-2 focus:ring-[#123f7a]/20'
            />
          </label>

          <button
            type='button'
            onClick={onConfirm}
            disabled={!matchesEmail}
            className='mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0d3f7c] text-[18px] font-bold text-white shadow-[0_18px_30px_rgba(13,63,124,0.22)] disabled:opacity-50'
          >
            Deactivate
          </button>

          <button
            type='button'
            onClick={onCancel}
            className='mt-5 text-[16px] font-bold text-[#5f6d84]'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
