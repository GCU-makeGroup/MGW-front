import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { OnboardingInterest } from './session-types';

type FrameProps = {
  children: ReactNode;
  className?: string;
};

type LabelFieldProps = {
  label?: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (_value: string) => void;
  rightSlot?: ReactNode;
  autoComplete?: string;
};

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
};

type ToggleCardProps = {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (_next: boolean) => void;
  accent?: 'blue' | 'pink' | 'rose';
  iconLabel?: string;
};

type ConsentCardProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (_checked: boolean) => void;
  linkLabel?: string;
};

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M15 18 9 12l6-6'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <circle cx='12' cy='12' r='2.8' fill='none' stroke='currentColor' strokeWidth='1.8' />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M15 17H4l1.4-1.8A3 3 0 0 0 6 13.4V11a6 6 0 1 1 12 0v2.4a3 3 0 0 0 .6 1.8L20 17h-5'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <path
        d='M10 18a2 2 0 0 0 4 0'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M4 11.5 12 5l8 6.5'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
      <path
        d='M6.5 10.5V19h11V10.5'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M8.5 10.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4ZM15.5 10.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4ZM4.5 19c0-2.8 2.2-5 5-5h1a5 5 0 0 1 5 5M14 19c0-1.7 1.4-3 3.1-3H18c1.7 0 3.1 1.3 3.1 3'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.7'
      />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <circle cx='12' cy='12' r='8.5' fill='none' stroke='currentColor' strokeWidth='1.7' />
      <path
        d='m10.5 13.5 1-3.5 3.5-1-1 3.5-3.5 1Z'
        fill='currentColor'
        stroke='currentColor'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5.5 19a6.5 6.5 0 0 1 13 0'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.7'
      />
    </svg>
  );
}

export function ScreenFrame({ children, className }: FrameProps) {
  return (
    <div className='relative min-h-dvh overflow-hidden bg-[#f7fbff] text-slate-900'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute left-[-12%] top-[-10%] h-72 w-72 rounded-full bg-sky-100/70 blur-3xl' />
        <div className='absolute bottom-[-12%] right-[-14%] h-80 w-80 rounded-full bg-blue-100/70 blur-3xl' />
      </div>
      <div
        className={clsx(
          'relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-6 pt-6 pb-8',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function TopBar({
  title,
  onBack,
  rightContent,
}: {
  title?: string;
  onBack?: () => void;
  rightContent?: ReactNode;
}) {
  return (
    <div className='mb-6 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        {onBack ? (
          <button
            type='button'
            onClick={onBack}
            className='inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-900/5'
          >
            <ArrowLeftIcon />
          </button>
        ) : (
          <span className='h-9 w-9' />
        )}
        {title ? (
          <span className='text-[18px] font-semibold tracking-[-0.02em] text-[#11254b]'>
            {title}
          </span>
        ) : null}
      </div>
      {rightContent ? (
        <div className='flex items-center gap-2'>{rightContent}</div>
      ) : (
        <span className='h-9 w-9' />
      )}
    </div>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full bg-[#1f76a7] text-white shadow-[0_10px_30px_rgba(31,118,167,0.24)]',
        compact ? 'h-10 w-10' : 'h-14 w-14',
      )}
    >
      <svg aria-hidden='true' viewBox='0 0 24 24' className={compact ? 'h-5 w-5' : 'h-7 w-7'}>
        <path d='M12 4 3.8 8.2 12 12.4l8.2-4.2L12 4Z' fill='currentColor' />
        <path d='M7.2 10.1V14l4.8 2.5 4.8-2.5v-3.9l-4.8 2.5-4.8-2.5Z' fill='currentColor' />
      </svg>
    </div>
  );
}

export function InputField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  rightSlot,
  autoComplete,
}: LabelFieldProps) {
  return (
    <label className='block'>
      {label ? (
        <span className='mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500'>
          {label}
        </span>
      ) : null}
      <div className='relative'>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={clsx(
            'h-[54px] w-full rounded-[28px] border border-transparent bg-slate-200/70 px-5 text-[15px] font-medium text-slate-800 outline-none',
            'placeholder:text-slate-400 focus:border-[#1f76a7] focus:bg-white',
            rightSlot ? 'pr-14' : '',
          )}
        />
        {rightSlot ? (
          <div className='absolute inset-y-0 right-0 flex items-center pr-4'>{rightSlot}</div>
        ) : null}
      </div>
    </label>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex h-14 items-center justify-center rounded-full bg-[#1f76a7] px-6 text-[15px] font-bold tracking-[-0.01em] text-white shadow-[0_18px_40px_rgba(31,118,167,0.28)] transition',
        'hover:-translate-y-0.5 hover:bg-[#19668f] disabled:translate-y-0 disabled:opacity-60',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function LinkButton({ children, onClick, className }: ButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'text-[14px] font-semibold text-[#1f76a7] transition hover:text-[#15587a]',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function InlineErrorMessage({ message }: { message: string }) {
  return (
    <p className='rounded-2xl bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700'>
      {message}
    </p>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-900/5'
    >
      <ArrowLeftIcon />
    </button>
  );
}

export function ConsentCard({
  title,
  description,
  checked,
  onChange,
  linkLabel,
}: ConsentCardProps) {
  return (
    <label className='block'>
      <div className='rounded-[24px] bg-white p-4 shadow-[0_14px_30px_rgba(16,34,64,0.06)]'>
        <div className='flex gap-4'>
          <input
            type='checkbox'
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            className='mt-1 h-5 w-5 rounded border-slate-300 text-[#123f7a] focus:ring-[#123f7a]'
          />
          <div className='space-y-2'>
            <h2 className='text-[17px] font-bold text-[#11254b]'>{title}</h2>
            <p className='text-[14px] leading-[1.45] text-slate-500'>{description}</p>
            {linkLabel ? (
              <span className='inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1f76a7]'>
                {linkLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </label>
  );
}

export function StepHeader({
  stepLabel,
  title,
  description,
  eyebrow,
}: {
  stepLabel?: string;
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        {stepLabel ? (
          <span className='text-[15px] font-semibold text-[#11254b]'>{stepLabel}</span>
        ) : (
          <span />
        )}
        {eyebrow ? (
          <span className='rounded-full bg-[#ffe5df] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#cb6d5f]'>
            {eyebrow}
          </span>
        ) : null}
      </div>
      <div className='space-y-2'>
        <h1 className='text-[28px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#11254b]'>
          {title}
        </h1>
        <p className='max-w-[32ch] text-[16px] leading-[1.45] text-slate-500'>{description}</p>
      </div>
    </div>
  );
}

export function ProgressBars({ activeIndex, total }: { activeIndex: number; total: number }) {
  return (
    <div className='flex items-center justify-center gap-2'>
      {Array.from({ length: total }).map((_, index) => {
        const active = index === activeIndex;
        return (
          <span
            key={index}
            className={clsx(
              'h-1.5 rounded-full transition',
              active ? 'w-14 bg-[#123f7a]' : 'w-14 bg-[#d8e4fb]',
            )}
          />
        );
      })}
    </div>
  );
}

export function ChoiceChip({
  label,
  selected,
  onClick,
}: {
  label: OnboardingInterest;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'rounded-full px-4 py-2.5 text-[14px] font-semibold tracking-[-0.01em] transition',
        selected
          ? 'bg-[#133f79] text-white shadow-[0_12px_24px_rgba(19,63,121,0.22)]'
          : 'bg-white text-[#3e4c63] shadow-[0_8px_18px_rgba(18,37,75,0.08)]',
      )}
    >
      #{label}
    </button>
  );
}

export function ChoiceCard({
  title,
  description,
  selected,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'flex w-full items-start gap-4 rounded-[22px] border bg-white p-4 text-left transition',
        selected
          ? 'border-[#123f7a] shadow-[0_16px_30px_rgba(18,63,122,0.12)]'
          : 'border-slate-200 shadow-[0_12px_24px_rgba(16,34,64,0.06)]',
      )}
    >
      <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-[20px] text-[#123f7a]'>
        {icon}
      </span>
      <span className='space-y-1'>
        <span className='block text-[16px] font-bold text-[#11254b]'>{title}</span>
        <span className='block max-w-[22ch] text-[14px] leading-[1.4] text-slate-500'>
          {description}
        </span>
      </span>
    </button>
  );
}

export function ToggleCard({
  title,
  description,
  enabled,
  onToggle,
  accent = 'blue',
  iconLabel,
}: ToggleCardProps) {
  const accentClasses = {
    blue: 'border-[#dcecff] bg-[#f8fbff]',
    pink: 'border-[#f6d8d2] bg-[#fff7f5]',
    rose: 'border-[#ead7d8] bg-[#fff9fa]',
  };

  return (
    <button
      type='button'
      onClick={() => onToggle(!enabled)}
      className={clsx(
        'flex w-full items-center justify-between rounded-[22px] border p-4 text-left shadow-[0_12px_24px_rgba(16,34,64,0.06)] transition',
        accentClasses[accent],
      )}
    >
      <span className='flex items-center gap-3'>
        <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[18px] text-[#123f7a] shadow-[0_10px_20px_rgba(16,34,64,0.08)]'>
          {iconLabel}
        </span>
        <span className='space-y-1'>
          <span className='block text-[15px] font-bold text-[#11254b]'>{title}</span>
          <span className='block max-w-[20ch] text-[13px] leading-[1.35] text-slate-500'>
            {description}
          </span>
        </span>
      </span>
      <span
        className={clsx(
          'relative h-6 w-11 rounded-full transition',
          enabled ? 'bg-[#133f79]' : 'bg-slate-300',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_4px_10px_rgba(16,34,64,0.18)] transition',
            enabled ? 'left-5' : 'left-0.5',
          )}
        />
      </span>
    </button>
  );
}

export type BottomTabKey = 'main' | 'group' | 'activity' | 'mypage';

export function BottomTabs({
  active = 'main',
  onNavigate,
  tone = 'default',
}: {
  active?: BottomTabKey;
  onNavigate?: (_tab: BottomTabKey) => void;
  tone?: 'default' | 'subtle';
}) {
  const tabClass = (key: typeof active) =>
    clsx(
      'flex flex-1 flex-col items-center gap-1 rounded-[18px] py-2 text-[10px] font-extrabold uppercase tracking-[0.15em] transition',
      active === key ? 'text-[#123f7a]' : tone === 'subtle' ? 'text-slate-300' : 'text-slate-400',
    );

  return (
    <nav
      className={clsx(
        'rounded-[26px] px-3 py-2 backdrop-blur',
        tone === 'subtle'
          ? 'border border-white/70 bg-white/75 shadow-[0_10px_24px_rgba(16,34,64,0.05)]'
          : 'border border-white/70 bg-white/95 shadow-[0_14px_36px_rgba(16,34,64,0.08)]',
      )}
    >
      <div className='flex items-center gap-1'>
        <button type='button' className={tabClass('main')} onClick={() => onNavigate?.('main')}>
          <HomeIcon />
          <span>Main</span>
        </button>
        <button type='button' className={tabClass('group')} onClick={() => onNavigate?.('group')}>
          <GroupIcon />
          <span>Group</span>
        </button>
        <button
          type='button'
          className={tabClass('activity')}
          onClick={() => onNavigate?.('activity')}
        >
          <CompassIcon />
          <span>Activity</span>
        </button>
        <button type='button' className={tabClass('mypage')} onClick={() => onNavigate?.('mypage')}>
          <UserIcon />
          <span>My Page</span>
        </button>
      </div>
    </nav>
  );
}

export function DecorativeOnboardingCard({
  title,
  description,
  className,
  icon,
}: {
  title: string;
  description: string;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-[32px] bg-white p-5 shadow-[0_16px_40px_rgba(16,34,64,0.08)]',
        className,
      )}
    >
      {icon ? <div className='absolute right-4 top-4'>{icon}</div> : null}
      <div className='space-y-2'>
        <h3 className='text-[18px] font-extrabold tracking-[-0.03em] text-[#11254b]'>{title}</h3>
        <p className='max-w-[21ch] text-[14px] leading-[1.5] text-slate-500'>{description}</p>
      </div>
    </div>
  );
}

export { BellIcon, EyeIcon, Icon, ArrowLeftIcon };
