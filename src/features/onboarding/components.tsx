import type {
  ButtonHTMLAttributes,
  Dispatch,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
} from 'react';

type FrameProps = {
  children: ReactNode;
  className?: string;
};

type SectionProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  suffix?: ReactNode;
  wrapperClassName?: string;
};

type SplitEmailFieldProps = {
  name: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  label?: string;
};

type ProgressProps = {
  step: number;
  total: number;
  labels?: [string, string?];
};

type ConsentCardProps = {
  title: string;
  description: string;
  detail?: string;
  selected?: boolean;
  muted?: boolean;
  linkLabel?: string;
  onClick?: () => void;
};

type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

type ChoiceCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

type ToggleCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  tone?: 'neutral' | 'rose';
  active?: boolean;
  onToggle?: () => void;
};

type HeroCardProps = {
  title: string;
  subtitle: string;
  tag: string;
};

type ActionCircleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  label: string;
};

export function ScreenFrame({ children, className = '' }: FrameProps) {
  return (
    <div className='relative min-h-dvh overflow-hidden bg-[#f8fbff] text-slate-900'>
      <div className='absolute -left-24 top-6 h-72 w-72 rounded-full bg-[#b7dbf5]/25 blur-3xl' />
      <div className='absolute right-[-5rem] top-[-3rem] h-80 w-80 rounded-full bg-[#d7e9fb]/45 blur-3xl' />
      <div className='absolute bottom-[-8rem] left-[-6rem] h-96 w-96 rounded-full bg-[#dfefff]/50 blur-3xl' />
      <div
        className={`relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pb-10 pt-6 sm:px-6 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, eyebrow, className = '' }: SectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {eyebrow ? (
        <p className='text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400'>
          {eyebrow}
        </p>
      ) : null}
      <h1 className='max-w-[18ch] text-[2rem] leading-[0.98] font-extrabold tracking-[-0.05em] text-slate-900 sm:text-[2.15rem]'>
        {title}
      </h1>
      {subtitle ? (
        <p className='max-w-[31ch] text-[1rem] leading-6 text-slate-500'>{subtitle}</p>
      ) : null}
    </div>
  );
}

export function BrandMark() {
  return (
    <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0b6a94] shadow-[0_12px_30px_rgba(11,106,148,0.18)]'>
      <GraduationCapIcon className='h-6 w-6 text-white' />
    </div>
  );
}

export function TextField({
  label,
  suffix,
  wrapperClassName = '',
  className = '',
  ...props
}: TextFieldProps) {
  return (
    <label className={`block ${wrapperClassName}`}>
      {label ? (
        <span className='mb-2 block text-[0.74rem] font-bold uppercase tracking-[0.18em] text-slate-500'>
          {label}
        </span>
      ) : null}
      <div className='relative'>
        <input
          {...props}
          className={`h-14 w-full rounded-full border border-transparent bg-[#eef2f6] px-5 text-[0.98rem] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b7d6ef] focus:bg-white ${className}`}
        />
        {suffix ? (
          <div className='absolute inset-y-0 right-4 flex items-center text-slate-400'>
            {suffix}
          </div>
        ) : null}
      </div>
    </label>
  );
}

export function SplitEmailField({
  name,
  value,
  onChange,
  label = 'UNIVERSITY EMAIL',
}: SplitEmailFieldProps) {
  return (
    <div>
      <span className='mb-2 block text-[0.74rem] font-bold uppercase tracking-[0.18em] text-slate-500'>
        {label}
      </span>
      <div className='flex h-14 items-center gap-2 rounded-full bg-[#e9edf2] px-4'>
        <input
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder='username'
          className='h-full min-w-0 flex-1 bg-transparent text-[0.98rem] font-medium text-slate-900 outline-none placeholder:text-slate-400'
        />
        <span className='rounded-full bg-[#bfe0f6] px-3 py-1 text-[0.78rem] font-semibold text-[#0b6a94]'>
          @gachon.ac.kr
        </span>
      </div>
    </div>
  );
}

export function PasswordField({
  label,
  wrapperClassName = '',
  className = '',
  ...props
}: TextFieldProps) {
  const suffix = <EyeIcon className='h-5 w-5' />;

  return (
    <TextField
      {...props}
      type={props.type ?? 'password'}
      label={label}
      suffix={suffix}
      wrapperClassName={wrapperClassName}
      className={`pr-14 ${className}`}
    />
  );
}

export function PrimaryButton({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex h-14 w-full items-center justify-center rounded-full px-6 text-[1rem] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6a94]';
  const styles = {
    primary:
      'bg-[#0b6a94] text-white shadow-[0_18px_36px_rgba(11,106,148,0.24)] hover:bg-[#0d5f83]',
    secondary:
      'bg-[#0c376d] text-white shadow-[0_18px_30px_rgba(12,55,109,0.2)] hover:bg-[#0a2b57]',
    ghost: 'bg-white text-[#0b6a94] border border-[#d8e5f1] hover:bg-slate-50',
  };

  return <button {...props} className={`${base} ${styles[variant]} ${className}`} />;
}

export function SectionProgress({ step, total, labels }: ProgressProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-center gap-2'>
        {Array.from({ length: total }, (_, index) => {
          const active = index + 1 <= step;
          return (
            <span
              key={index}
              className={`h-1.5 w-12 rounded-full sm:w-14 ${active ? 'bg-[#0c376d]' : 'bg-[#d7e5f3]'}`}
            />
          );
        })}
      </div>
      {labels ? (
        <div className='flex justify-between text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-400'>
          <span>{labels[0]}</span>
          {labels[1] ? <span>{labels[1]}</span> : <span />}
        </div>
      ) : null}
    </div>
  );
}

export function StepHeader({
  step,
  total,
  title,
  subtitle,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between text-slate-900'>
        <BackArrowIcon className='h-5 w-5' />
        <p className='text-[0.92rem] font-semibold tracking-[-0.03em]'>
          Step {step} of {total}
        </p>
        <span className='h-5 w-5 rounded-full border border-transparent' />
      </div>
      <div className='space-y-3'>
        <div className='flex justify-center'>
          <BrandMark />
        </div>
        <div className='space-y-2 text-center'>
          <h1 className='text-[2rem] leading-[0.96] font-extrabold tracking-[-0.05em] text-slate-900 sm:text-[2.1rem]'>
            {title}
          </h1>
          {subtitle ? (
            <p className='mx-auto max-w-[28ch] text-[1rem] leading-6 text-slate-500'>{subtitle}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ConsentCard({
  title,
  description,
  detail,
  selected = false,
  muted = false,
  linkLabel,
  onClick,
}: ConsentCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
        muted
          ? 'border-slate-200/70 bg-[#f7f9fb] text-slate-400'
          : selected
            ? 'border-[#bfdcf1] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]'
            : 'border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]'
      }`}
    >
      <div className='flex items-start gap-3'>
        <span
          className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${
            selected ? 'border-[#0b6a94] bg-[#0b6a94]' : 'border-slate-300 bg-white'
          }`}
        >
          {selected ? <CheckIcon className='h-3.5 w-3.5 text-white' /> : null}
        </span>
        <div className='min-w-0 flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <h2 className='text-[1rem] font-bold tracking-[-0.03em] text-slate-900'>{title}</h2>
            {detail ? (
              <span className='rounded-full bg-[#fff1e9] px-2 py-0.5 text-[0.7rem] font-semibold text-[#bf5f2d]'>
                {detail}
              </span>
            ) : null}
          </div>
          <p className='text-[0.9rem] leading-5 text-slate-500'>{description}</p>
          {linkLabel ? (
            <span className='inline-flex items-center gap-1 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#0b6a94]'>
              {linkLabel} <ExternalLinkIcon className='h-3.5 w-3.5' />
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[0.9rem] font-semibold transition ${
        selected
          ? 'bg-[#0c376d] text-white shadow-[0_12px_24px_rgba(12,55,109,0.18)]'
          : 'bg-[#eef2f6] text-slate-600'
      }`}
    >
      {label}
    </button>
  );
}

export function ChoiceCard({
  title,
  description,
  icon,
  selected = false,
  onClick,
}: ChoiceCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[22px] border px-4 py-4 text-left transition ${
        selected
          ? 'border-[#b5d4ef] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.07)]'
          : 'border-[#e6edf5] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.05)]'
      }`}
    >
      <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef5fb] text-[#0b6a94]'>
        {icon}
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block text-[1rem] font-bold tracking-[-0.03em] text-slate-900'>
          {title}
        </span>
        <span className='mt-1 block text-[0.89rem] leading-5 text-slate-500'>{description}</span>
      </span>
    </button>
  );
}

export function ToggleCard({
  title,
  description,
  icon,
  tone = 'neutral',
  active = false,
  onToggle,
}: ToggleCardProps) {
  const toneStyles =
    tone === 'rose'
      ? 'border-l-4 border-l-[#5b2330] bg-[#fff7f4]'
      : 'border-l-4 border-l-transparent bg-white';

  return (
    <button
      type='button'
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-[20px] px-4 py-4 text-left shadow-[0_18px_34px_rgba(15,23,42,0.05)] transition ${toneStyles}`}
    >
      <span className='flex items-center gap-3'>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            tone === 'rose' ? 'bg-[#ffe4df] text-[#8d3445]' : 'bg-[#eaf1fb] text-[#0b6a94]'
          }`}
        >
          {icon}
        </span>
        <span className='space-y-1'>
          <span className='block text-[1rem] font-bold tracking-[-0.03em] text-slate-900'>
            {title}
          </span>
          <span className='block max-w-[18ch] text-[0.85rem] leading-5 text-slate-500'>
            {description}
          </span>
        </span>
      </span>
      <span
        className={`relative flex h-6 w-11 items-center rounded-full p-0.5 transition ${
          active ? 'bg-[#0c376d]' : 'bg-slate-300'
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${
            active ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}

export function HeroCard({ title, subtitle, tag }: HeroCardProps) {
  return (
    <div className='relative overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#183f73_0%,#0d7aa5_50%,#5a3b21_100%)] text-white shadow-[0_20px_48px_rgba(8,32,60,0.2)]'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(255,176,89,0.28),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.18),transparent_25%)]' />
      <div className='absolute -right-8 top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl' />
      <div className='absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(180deg,transparent_0%,rgba(8,16,36,0.55)_100%)]' />
      <div className='relative flex min-h-[15rem] flex-col justify-end p-5'>
        <span className='mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-white/90'>
          <SparkleIcon className='h-3.5 w-3.5' />
          {tag}
        </span>
        <div className='space-y-2'>
          <h2 className='max-w-[10ch] text-[1.95rem] leading-[0.95] font-extrabold tracking-[-0.05em]'>
            {title}
          </h2>
          <p className='max-w-[24ch] text-[0.92rem] leading-5 text-white/90'>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function ActionCircleButton({
  active = false,
  label,
  className = '',
  ...props
}: ActionCircleButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      className={`inline-flex h-14 w-14 items-center justify-center rounded-full border transition ${
        active
          ? 'border-transparent bg-[#0c376d] text-white shadow-[0_14px_28px_rgba(12,55,109,0.25)]'
          : 'border-slate-200 bg-white text-slate-500 shadow-[0_12px_24px_rgba(15,23,42,0.06)]'
      } ${className}`}
    />
  );
}

export function BottomTabBar() {
  const tabs = [
    { label: 'MAIN', icon: HomeIcon, active: true },
    { label: 'GROUP', icon: UsersIcon },
    { label: 'ACTIVITY', icon: CompassIcon },
    { label: 'MY PAGE', icon: ProfileIcon },
  ];

  return (
    <nav className='sticky bottom-0 z-10 -mx-5 border-t border-slate-200/80 bg-white/90 px-5 pb-4 pt-3 backdrop-blur'>
      <div className='mx-auto flex max-w-[430px] items-end justify-between gap-3'>
        {tabs.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type='button'
            className={`flex flex-1 flex-col items-center gap-1 text-[0.65rem] font-bold tracking-[0.2em] ${
              active ? 'text-[#0c4ea8]' : 'text-slate-400'
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? 'text-[#0c4ea8]' : 'text-slate-400'}`} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className='inline-flex items-center rounded-full bg-[#ffebe7] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#bf5f2d]'>
      {children}
    </span>
  );
}

export function HeroTile({
  title,
  subtitle,
  icon,
  tone = 'light',
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  tone?: 'light' | 'dark';
}) {
  return (
    <div
      className={`rounded-[22px] p-4 shadow-[0_18px_34px_rgba(15,23,42,0.08)] ${
        tone === 'dark' ? 'bg-[#08234a] text-white' : 'bg-white text-slate-900'
      }`}
    >
      <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#0b6a94]'>
        {icon}
      </div>
      <h3 className='text-[1.05rem] font-bold tracking-[-0.03em]'>{title}</h3>
      <p
        className={`mt-2 text-[0.86rem] leading-5 ${tone === 'dark' ? 'text-white/75' : 'text-slate-500'}`}
      >
        {subtitle}
      </p>
    </div>
  );
}

function GraduationCapIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path d='M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z' fill='currentColor' />
      <path
        d='M6 10v3.25c0 1.05 2.68 2.25 6 2.25s6-1.2 6-2.25V10'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

function EyeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M2.8 12c1.86-4.03 5.43-6.5 9.2-6.5s7.34 2.47 9.2 6.5c-1.86 4.03-5.43 6.5-9.2 6.5S4.66 16.03 2.8 12Z'
        stroke='currentColor'
        strokeWidth='1.6'
      />
      <circle cx='12' cy='12' r='2.5' stroke='currentColor' strokeWidth='1.6' />
    </svg>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='m5 12 4 4 10-10'
        stroke='currentColor'
        strokeWidth='2.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function ExternalLinkIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M14 5h5v5'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='m10 14 9-9'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function BackArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M15 5 8 12l7 7'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function SparkleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M12 2.5 13.9 8.1 19.5 10 13.9 11.9 12 17.5 10.1 11.9 4.5 10 10.1 8.1 12 2.5Z'
        fill='currentColor'
      />
    </svg>
  );
}

function HomeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M4 11.2 12 4l8 7.2'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6.5 10.8V20h11v-9.2'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function UsersIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M9.5 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm7.5 0a2.4 2.4 0 1 0-2.4-2.4A2.4 2.4 0 0 0 17 11Z'
        stroke='currentColor'
        strokeWidth='1.6'
      />
      <path
        d='M4.5 19a5 5 0 0 1 10 0m1-2.2a4.3 4.3 0 0 1 3.8 2.2'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

function CompassIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <circle cx='12' cy='12' r='7.5' stroke='currentColor' strokeWidth='1.6' />
      <path d='m9.5 14.5 1.2-4.2 4.2-1.2-1.2 4.2-4.2 1.2Z' fill='currentColor' />
    </svg>
  );
}

function ProfileIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <circle cx='12' cy='9' r='3.5' stroke='currentColor' strokeWidth='1.6' />
      <path
        d='M5.5 20a6.5 6.5 0 0 1 13 0'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

export function MessageIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M5 6.5h14v9H9l-4 3V6.5Z'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinejoin='round'
      />
      <path d='M8 10h8M8 12.8h5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
    </svg>
  );
}

export function GroupIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M8.3 11a2.8 2.8 0 1 0-2.8-2.8A2.8 2.8 0 0 0 8.3 11Zm7.4 0a2.4 2.4 0 1 0-2.4-2.4A2.4 2.4 0 0 0 15.7 11Z'
        fill='currentColor'
      />
      <path
        d='M4.8 19a4.8 4.8 0 0 1 7.5-3.9A5.8 5.8 0 0 1 18 19'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

export function BookIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M6 4.8h10a2 2 0 0 1 2 2V19H8a2 2 0 0 1-2-2V4.8Z'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinejoin='round'
      />
      <path
        d='M8.4 8h7.2M8.4 11h5.5'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

export function GlobeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <circle cx='12' cy='12' r='7.5' stroke='currentColor' strokeWidth='1.6' />
      <path
        d='M4.5 12h15M12 4.5c2 2 3.1 4.7 3.1 7.5s-1.1 5.5-3.1 7.5c-2-2-3.1-4.7-3.1-7.5S10 6.5 12 4.5Z'
        stroke='currentColor'
        strokeWidth='1.6'
      />
    </svg>
  );
}

export function PeopleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M7.8 10.6a2.6 2.6 0 1 0-2.6-2.6 2.6 2.6 0 0 0 2.6 2.6Zm8.4 0a2.2 2.2 0 1 0-2.2-2.2 2.2 2.2 0 0 0 2.2 2.2Z'
        fill='currentColor'
      />
      <path
        d='M4.8 19a4.8 4.8 0 0 1 6.8-3.7A5.4 5.4 0 0 1 17.8 19'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

export function BellIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M12 5.2a4 4 0 0 0-4 4V12c0 .8-.5 1.5-1.1 2.1L6 15.2h12l-.9-1.1c-.6-.6-1.1-1.3-1.1-2.1V9.2a4 4 0 0 0-4-4Z'
        fill='currentColor'
      />
      <path
        d='M10.3 17.8a1.7 1.7 0 0 0 3.4 0'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

export function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path d='M15.5 4.7A7.5 7.5 0 1 0 19.3 15 9 9 0 0 1 15.5 4.7Z' fill='currentColor' />
    </svg>
  );
}

export function ChevronRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='m9 5 7 7-7 7'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function ArrowButton({
  label = 'Next',
  ...props
}: { label?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className='inline-flex h-14 min-w-36 items-center justify-center gap-2 rounded-full bg-[#0c376d] px-6 text-[0.98rem] font-semibold text-white shadow-[0_18px_36px_rgba(12,55,109,0.24)] transition hover:bg-[#092b58]'
    >
      {label}
      <ChevronRightIcon className='h-4.5 w-4.5' />
    </button>
  );
}
