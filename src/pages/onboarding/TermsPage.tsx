import { useState } from 'react';
import { BrandMark, ConsentCard, ScreenFrame, SectionProgress } from '../../features/onboarding';
import { consentItems } from '../../features/onboarding';

function TermsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
          <p className='text-[0.96rem] font-semibold tracking-[-0.03em]'>Step 1 of 4</p>
          <div className='h-10 w-10' />
        </div>

        <div className='space-y-4'>
          <div className='flex justify-center'>
            <BrandMark />
          </div>
          <div className='space-y-2 text-center'>
            <h1 className='text-[2.15rem] leading-[0.96] font-extrabold tracking-[-0.06em] text-slate-900'>
              Welcome to Gachon Connect
            </h1>
            <p className='mx-auto max-w-[28ch] text-[1rem] leading-6 text-slate-500'>
              Join the curated academic ecosystem for Gachon University scholars.
            </p>
          </div>
        </div>

        <div className='space-y-3'>
          {consentItems.map((item, index) => (
            <ConsentCard
              key={item.title}
              selected={selectedIndex === index}
              muted={index === 2}
              {...item}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        <div className='space-y-4 pt-1'>
          <SectionProgress
            step={1}
            total={2}
            labels={['Curator Agreement', 'Finalizing Identity']}
          />
          <div className='flex items-center justify-between'>
            <button
              type='button'
              className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.05)]'
            >
              <BackIcon />
            </button>
            <button
              type='button'
              className='inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#0c376d] text-white shadow-[0_18px_34px_rgba(12,55,109,0.24)]'
            >
              <NextIcon />
            </button>
          </div>
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

function NextIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
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

export default TermsPage;
