import { useState } from 'react';
import { BrandMark, PrimaryButton, ScreenFrame, TextField } from '../../features/onboarding';

function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <ScreenFrame className='pb-12'>
      <div className='flex min-h-dvh flex-col justify-between'>
        <div className='pt-9'>
          <BrandMark />

          <div className='mt-8 space-y-3'>
            <h1 className='max-w-[12ch] text-[2.2rem] leading-[0.98] font-extrabold tracking-[-0.06em] text-slate-900'>
              Welcome back to <span className='text-[#0b6a94]'>Gachon Connect</span>
            </h1>
            <p className='max-w-[23ch] text-[1rem] leading-6 text-slate-500'>
              Log in to access your campus life.
            </p>
          </div>

          <div className='mt-10 space-y-4'>
            <TextField placeholder='University Email (@gachon.ac.kr)' />
            <TextField
              type={passwordVisible ? 'text' : 'password'}
              placeholder='Password'
              suffix={
                <button
                  type='button'
                  onClick={() => setPasswordVisible((value) => !value)}
                  className='text-slate-400 transition hover:text-slate-600'
                >
                  <EyeToggleIcon />
                </button>
              }
              className='pr-14'
            />
            <div className='flex justify-end'>
              <button
                type='button'
                className='text-[0.86rem] font-semibold text-slate-500 transition hover:text-[#0b6a94]'
              >
                Forgot password?
              </button>
            </div>
            <PrimaryButton>Continue</PrimaryButton>
          </div>
        </div>

        <div className='space-y-7 pb-2 pt-14'>
          <p className='text-center text-[0.96rem] text-slate-500'>
            New to Gachon Connect? <button className='font-semibold text-[#0b6a94]'>Sign Up</button>
          </p>
          <div className='flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-slate-300'>
            <span className='h-px flex-1 bg-slate-200' />
            Academic Excellence
            <span className='h-px flex-1 bg-slate-200' />
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function EyeToggleIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M2.8 12c1.86-4.03 5.43-6.5 9.2-6.5s7.34 2.47 9.2 6.5c-1.86 4.03-5.43 6.5-9.2 6.5S4.66 16.03 2.8 12Z'
        stroke='currentColor'
        strokeWidth='1.6'
      />
      <circle cx='12' cy='12' r='2.5' stroke='currentColor' strokeWidth='1.6' />
    </svg>
  );
}

export default LoginPage;
