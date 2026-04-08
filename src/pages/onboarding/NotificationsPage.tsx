import { useState } from 'react';
import {
  BellIcon,
  GroupIcon,
  MessageIcon,
  MoonIcon,
  ScreenFrame,
  SectionProgress,
  ToggleCard,
} from '../../features/onboarding';
import { notificationItems } from '../../features/onboarding';

function NotificationsPage() {
  const [states, setStates] = useState([true, true, false]);

  return (
    <ScreenFrame className='pb-6 pt-5'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between text-slate-900'>
          <button
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-[0_10px_22px_rgba(15,23,42,0.05)]'
          >
            <BackIcon />
          </button>
          <p className='text-[0.96rem] font-semibold tracking-[-0.03em]'>Step 3 of 4</p>
          <div className='h-10 w-10' />
        </div>

        <SectionProgress step={3} total={4} />

        <div className='grid place-items-center'>
          <div className='relative flex h-56 w-full items-center justify-center rounded-[26px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]'>
            <div className='absolute -left-2 bottom-10 rounded-2xl bg-slate-100 p-3 shadow-[0_12px_24px_rgba(15,23,42,0.08)]'>
              <GroupIcon className='h-5 w-5 text-slate-500' />
            </div>
            <div className='absolute right-6 top-5 rounded-2xl bg-[#fde4da] p-3 shadow-[0_12px_24px_rgba(255,173,141,0.18)]'>
              <MessageIcon className='h-5 w-5 text-[#7e3142]' />
            </div>
            <div className='flex h-32 w-32 items-center justify-center rounded-full bg-[#0c376d] text-white shadow-[0_18px_34px_rgba(12,55,109,0.2)]'>
              <BellIcon className='h-12 w-12' />
            </div>
          </div>
        </div>

        <div className='space-y-3 text-center'>
          <h1 className='text-[2rem] leading-[0.96] font-extrabold tracking-[-0.05em] text-slate-900'>
            Stay Updated!
          </h1>
          <p className='mx-auto max-w-[25ch] text-[1rem] leading-6 text-slate-500'>
            Choose how you want to be notified about campus life, new connections, and group
            activities.
          </p>
        </div>

        <div className='space-y-3'>
          {notificationItems.map((card, index) => {
            const iconMap = {
              message: MessageIcon,
              group: GroupIcon,
              moon: MoonIcon,
            } as const;
            const Icon = iconMap[card.icon];

            return (
              <ToggleCard
                key={card.title}
                {...card}
                icon={<Icon className='h-5 w-5' />}
                active={states[index]}
                onToggle={() =>
                  setStates((current) =>
                    current.map((value, currentIndex) => (currentIndex === index ? !value : value)),
                  )
                }
              />
            );
          })}
        </div>

        <div className='space-y-3 pt-1'>
          <button
            type='button'
            className='inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0c376d] text-[1rem] font-semibold text-white shadow-[0_18px_36px_rgba(12,55,109,0.24)]'
          >
            Allow Notifications
          </button>
          <button
            type='button'
            className='w-full text-center text-[0.72rem] font-bold uppercase tracking-[0.24em] text-slate-400'
          >
            Skip for now
          </button>
        </div>
      </div>
    </ScreenFrame>
  );
}

function BackIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
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

export default NotificationsPage;
