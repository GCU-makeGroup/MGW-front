import { useState } from 'react';
import {
  BrandMark,
  PrimaryButton,
  ScreenFrame,
  SplitEmailField,
  TextField,
} from '../../features/onboarding';

function SignupPage() {
  const [email, setEmail] = useState('student');
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <ScreenFrame className='pb-12'>
      <div className='pt-8'>
        <BrandMark />

        <div className='mt-7 space-y-3'>
          <h1 className='text-[2.15rem] leading-[0.96] font-extrabold tracking-[-0.06em] text-slate-900'>
            Create Account
          </h1>
          <p className='max-w-[28ch] text-[1rem] leading-6 text-slate-500'>
            Join Gachon University's exclusive academic community.
          </p>
        </div>

        <div className='mt-10 space-y-4'>
          <TextField label='FULL NAME' placeholder='Gachon Student' />
          <SplitEmailField name='email' value={email} onChange={setEmail} />
          <TextField
            label='PASSWORD'
            type={passwordVisible ? 'text' : 'password'}
            placeholder='••••••••'
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
          <TextField label='CONFIRM PASSWORD' type='password' placeholder='••••••••' />

          <div className='rounded-[20px] border border-[#f4c6b4] bg-[#fff1e8] px-4 py-4 text-[0.84rem] leading-5 text-[#94411d] shadow-[0_16px_32px_rgba(255,170,140,0.1)]'>
            <div className='flex items-start gap-3'>
              <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#bf5f2d] text-white'>
                <ShieldIcon className='h-3.5 w-3.5' />
              </span>
              <p>
                By joining, you agree to our <span className='font-semibold'>Terms of Service</span>{' '}
                and acknowledge you are a verified Gachon student.
              </p>
            </div>
          </div>

          <PrimaryButton>Join Now</PrimaryButton>
        </div>

        <p className='mt-7 text-center text-[0.96rem] text-slate-500'>
          Already have an account? <button className='font-semibold text-[#0b6a94]'>Login</button>
        </p>
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

function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <path
        d='M12 3.8 18 6v5.2c0 4.2-2.5 6.9-6 8.9-3.5-2-6-4.7-6-8.9V6l6-2.2Z'
        fill='currentColor'
      />
    </svg>
  );
}

export default SignupPage;
