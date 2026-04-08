import { useState } from 'react';
import {
  Chip,
  ChoiceCard,
  BookIcon,
  GlobeIcon,
  PeopleIcon,
  PrimaryButton,
  ScreenFrame,
  SectionProgress,
} from '../../features/onboarding';
import { interests, purposeCards } from '../../features/onboarding';

const icons = {
  book: BookIcon,
  globe: GlobeIcon,
  people: PeopleIcon,
} as const;

function PreferencesPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['#Guitar']);
  const [selectedPurpose, setSelectedPurpose] = useState(0);

  return (
    <ScreenFrame className='pb-6 pt-5'>
      <div className='space-y-7'>
        <div className='flex items-center justify-between text-slate-900'>
          <button
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-[0_10px_22px_rgba(15,23,42,0.05)]'
          >
            <BackIcon />
          </button>
          <p className='text-[0.96rem] font-semibold tracking-[-0.03em]'>Step 2 of 4</p>
          <button
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-full'
          >
            <DotsIcon />
          </button>
        </div>

        <div className='absolute right-1 top-20 h-44 w-44 rounded-full border border-[#d8e5f1]/70' />

        <SectionProgress step={2} total={4} />

        <div className='space-y-3'>
          <h1 className='max-w-[10ch] text-[2.15rem] leading-[0.96] font-extrabold tracking-[-0.06em] text-slate-900'>
            Tell us about you
          </h1>
          <p className='max-w-[26ch] text-[1rem] leading-6 text-slate-500'>
            Help us curate your campus experience by sharing what drives your curiosity.
          </p>
        </div>

        <section className='space-y-4'>
          <div className='flex items-end justify-between'>
            <h2 className='text-[1.05rem] font-bold tracking-[-0.03em] text-slate-900'>
              Interests
            </h2>
            <span className='text-[0.72rem] font-bold uppercase tracking-[0.2em] text-slate-400'>
              Select Multiple
            </span>
          </div>
          <div className='flex flex-wrap gap-2.5'>
            {interests.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                selected={selectedInterests.includes(interest)}
                onClick={() =>
                  setSelectedInterests((current) =>
                    current.includes(interest)
                      ? current.filter((value) => value !== interest)
                      : [...current, interest],
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className='space-y-3'>
          <div className='flex items-end justify-between'>
            <h2 className='text-[1.05rem] font-bold tracking-[-0.03em] text-slate-900'>
              Joining Purpose
            </h2>
            <span className='text-[0.72rem] font-bold uppercase tracking-[0.2em] text-slate-400'>
              Select One
            </span>
          </div>
          <div className='space-y-3'>
            {purposeCards.map((card, index) => {
              const Icon = icons[card.icon];
              return (
                <ChoiceCard
                  key={card.title}
                  title={card.title}
                  description={card.description}
                  icon={<Icon className='h-5 w-5' />}
                  selected={selectedPurpose === index}
                  onClick={() => setSelectedPurpose(index)}
                />
              );
            })}
          </div>
        </section>

        <div className='pt-1'>
          <PrimaryButton>
            Next <ArrowIcon />
          </PrimaryButton>
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

function DotsIcon() {
  return (
    <svg className='h-6 w-6 text-slate-500' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <circle cx='6' cy='12' r='1.6' fill='currentColor' />
      <circle cx='12' cy='12' r='1.6' fill='currentColor' />
      <circle cx='18' cy='12' r='1.6' fill='currentColor' />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className='h-4.5 w-4.5' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='m9 5 7 7-7 7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default PreferencesPage;
