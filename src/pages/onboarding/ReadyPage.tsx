import {
  ArrowButton,
  Badge,
  BottomTabBar,
  HeroCard,
  HeroTile,
  ScreenFrame,
  SectionProgress,
} from '../../features/onboarding';

function ReadyPage() {
  return (
    <ScreenFrame className='pb-0 pt-5'>
      <div className='space-y-6 pb-6'>
        <div className='flex items-center justify-between text-slate-900'>
          <button
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-[0_10px_22px_rgba(15,23,42,0.05)]'
          >
            <BackIcon />
          </button>
          <p className='text-[0.96rem] font-semibold tracking-[-0.03em]'>Step 4 of 4</p>
          <div className='h-10 w-10' />
        </div>

        <Badge>Final Step</Badge>

        <div className='space-y-3'>
          <h1 className='max-w-[9ch] text-[2.15rem] leading-[0.96] font-extrabold tracking-[-0.06em] text-slate-900'>
            Ready to Start?
          </h1>
          <p className='max-w-[26ch] text-[1rem] leading-6 text-slate-500'>
            Explore your new academic sanctuary and connect with the heartbeat of campus life.
          </p>
        </div>

        <SectionProgress step={4} total={4} />

        <HeroCard
          tag='Collaborate'
          title='Find Study Groups'
          subtitle='Connect with peers in your courses for shared mastery.'
        />

        <div className='grid grid-cols-2 gap-3'>
          <HeroTile
            title='Activity Discovery'
            subtitle='Campus events tailored to your interests.'
            icon={<CompassIcon />}
          />
          <HeroTile
            title='Student Community'
            subtitle='Join now with peers already here.'
            icon={<GroupFacesIcon />}
            tone='dark'
          />
        </div>

        <div className='rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_34px_rgba(15,23,42,0.05)]'>
          <div className='flex items-start gap-3'>
            <span className='mt-0.5 text-[#0c376d]'>
              <SparkleIcon />
            </span>
            <div>
              <h2 className='text-[1.05rem] font-bold tracking-[-0.03em] text-slate-900'>
                Academic Curator
              </h2>
              <p className='mt-1 text-[0.9rem] leading-5 text-slate-500'>
                Our AI analyzes your syllabus to suggest the best times for rest and focused study.
              </p>
            </div>
          </div>
        </div>

        <ArrowButton label='Get Started' />
        <p className='text-center text-[0.72rem] text-slate-400'>
          By continuing, you agree to our Terms of Service
        </p>
      </div>

      <div className='mt-auto pb-4'>
        <BottomTabBar />
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

function CompassIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <circle cx='12' cy='12' r='7.5' stroke='currentColor' strokeWidth='1.6' />
      <path d='m9.5 14.5 1.2-4.2 4.2-1.2-1.2 4.2-4.2 1.2Z' fill='currentColor' />
    </svg>
  );
}

function GroupFacesIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <circle cx='8' cy='10' r='2.4' fill='currentColor' />
      <circle cx='15.5' cy='9' r='2.1' fill='currentColor' opacity='0.92' />
      <path
        d='M4.8 19a4.8 4.8 0 0 1 6.8-3.7A5.4 5.4 0 0 1 17.8 19'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M12 2.5 13.9 8.1 19.5 10 13.9 11.9 12 17.5 10.1 11.9 4.5 10 10.1 8.1 12 2.5Z'
        fill='currentColor'
      />
    </svg>
  );
}

export default ReadyPage;
