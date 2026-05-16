import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from './session-context';
import { sendEmailCode, verifyEmailCode } from '../../api/session';
import {
  BrandMark,
  ChoiceCard,
  ChoiceChip,
  ConsentCard,
  DecorativeOnboardingCard,
  EyeIcon,
  InputField,
  InlineErrorMessage,
  LinkButton,
  PrimaryButton,
  ProgressBars,
  ScreenFrame,
  StepHeader,
  ToggleCard,
  TopBar,
} from './ui';
import { consentOptions, onboardingPurposeOptions } from './session-content';
import { notificationOptions, onboardingInterests } from './session-types';
import type { FormEvent } from 'react';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '요청을 처리하지 못했습니다.';
}

export function LoginPage() {
  const navigate = useNavigate();
  const { state, actions } = useSession();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await actions.loginAccount();
      navigate('/main');
    } catch (error_) {
      setError(getErrorMessage(error_));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenFrame className='justify-between'>
      <div className='pt-4'>
        <BrandMark />

        <div className='mt-8 space-y-3'>
          <h1 className='max-w-[10ch] text-[34px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#11254b]'>
            Welcome back to <span className='text-[#1f76a7]'>Gachon Connect</span>
          </h1>
          <p className='text-[16px] leading-[1.5] text-slate-500'>
            Log in to access your campus life.
          </p>
        </div>

        <form className='mt-9 space-y-4' onSubmit={handleSubmit}>
          <InputField
            placeholder='University Email (@gachon.ac.kr)'
            value={state.auth.email}
            onChange={(value) => actions.updateAuthField('email', value)}
            autoComplete='email'
          />
          <InputField
            placeholder='Password'
            type={isPasswordVisible ? 'text' : 'password'}
            value={state.auth.password}
            onChange={(value) => actions.updateAuthField('password', value)}
            autoComplete='current-password'
            rightSlot={
              <button
                type='button'
                onClick={() => setIsPasswordVisible((value) => !value)}
                className='text-slate-500 transition hover:text-[#11254b]'
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              >
                <EyeIcon />
              </button>
            }
          />
          <div className='flex justify-end'>
            <LinkButton onClick={() => window.alert('비밀번호 찾기는 추후 연결됩니다.')}>
              Forgot password?
            </LinkButton>
          </div>

          {error ? <InlineErrorMessage message={error} /> : null}

          <PrimaryButton type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? 'Signing in...' : 'Continue'}
          </PrimaryButton>
        </form>
      </div>

      <div className='space-y-5 pt-10 text-center'>
        <p className='text-[15px] font-medium text-slate-500'>
          New to Gachon Connect?{' '}
          <button
            type='button'
            onClick={() => navigate('/onboard/signup')}
            className='font-semibold text-[#1f76a7] transition hover:text-[#15587a]'
          >
            Sign Up
          </button>
        </p>
        <div className='flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-300'>
          <span className='h-px w-10 bg-slate-300/80' />
          Academic Excellence
          <span className='h-px w-10 bg-slate-300/80' />
        </div>
      </div>
    </ScreenFrame>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { state, actions } = useSession();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const signupValidationError = getSignupValidationError({
    confirmPassword: state.signup.confirmPassword,
    fullName: state.signup.fullName,
    password: state.signup.password,
    universityEmail: state.signup.universityEmail,
  });

  const fullEmail = `${state.signup.universityEmail.trim()}@gachon.ac.kr`;

  const handleSendCode = async () => {
    if (!state.signup.universityEmail.trim()) {
      setError('학교 이메일 아이디를 입력해 주세요.');
      return;
    }
    setIsSendingCode(true);
    setError(null);
    try {
      await sendEmailCode({ email: fullEmail });
      setEmailSent(true);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('인증 코드를 입력해 주세요.');
      return;
    }
    setIsVerifying(true);
    setError(null);
    try {
      await verifyEmailCode({ email: fullEmail, code: verificationCode.trim() });
      actions.updateSignupField('emailVerified', 'true');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (signupValidationError) {
      setError(signupValidationError);
      return;
    }
    if (!state.signup.emailVerified) {
      setError('이메일 인증을 완료해 주세요.');
      return;
    }
    setError(null);
    navigate('/onboard/terms');
  };

  return (
    <ScreenFrame>
      <div className='pt-3'>
        <BrandMark compact />

        <div className='mt-8 space-y-3'>
          <h1 className='text-[36px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#11254b]'>
            Create Account
          </h1>
          <p className='max-w-[20ch] text-[16px] leading-[1.45] text-slate-500'>
            Join Gachon University's exclusive academic community.
          </p>
        </div>

        <form className='mt-10 space-y-4' onSubmit={handleSubmit}>
          <InputField
            label='Full Name'
            placeholder='Gachon Student'
            value={state.signup.fullName}
            onChange={(value) => actions.updateSignupField('fullName', value)}
            autoComplete='name'
          />
          <div>
            <InputField
              label='University Email'
              placeholder='username'
              value={state.signup.universityEmail}
              onChange={(value) => {
                actions.updateSignupField('universityEmail', value);
                if (state.signup.emailVerified) {
                  actions.updateSignupField('emailVerified', '');
                }
                setEmailSent(false);
              }}
              autoComplete='email'
              rightSlot={
                <span className='rounded-full bg-sky-200 px-3 py-1 text-[12px] font-bold text-[#1f76a7]'>
                  @gachon.ac.kr
                </span>
              }
            />
            <div className='mt-2 flex items-center gap-2'>
              <PrimaryButton
                type='button'
                onClick={handleSendCode}
                disabled={isSendingCode || !state.signup.universityEmail.trim()}
                className='flex-shrink-0 text-[13px]'
              >
                {isSendingCode ? '전송 중...' : emailSent ? '재전송' : '인증 코드 전송'}
              </PrimaryButton>
              {state.signup.emailVerified && (
                <span className='text-[13px] font-semibold text-emerald-600'>인증 완료</span>
              )}
            </div>
          </div>

          {emailSent && !state.signup.emailVerified && (
            <div className='flex items-end gap-2'>
              <InputField
                label='인증 코드'
                placeholder='6자리 숫자'
                value={verificationCode}
                onChange={setVerificationCode}
                autoComplete='one-time-code'
              />
              <PrimaryButton
                type='button'
                onClick={handleVerifyCode}
                disabled={isVerifying || verificationCode.trim().length === 0}
                className='flex-shrink-0 text-[13px]'
              >
                {isVerifying ? '확인 중...' : '확인'}
              </PrimaryButton>
            </div>
          )}

          <InputField
            label='Password'
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder='••••••••'
            value={state.signup.password}
            onChange={(value) => actions.updateSignupField('password', value)}
            autoComplete='new-password'
            rightSlot={
              <button
                type='button'
                onClick={() => setIsPasswordVisible((value) => !value)}
                className='text-slate-500 transition hover:text-[#11254b]'
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              >
                <EyeIcon />
              </button>
            }
          />
          <InputField
            label='Confirm Password'
            type={isConfirmVisible ? 'text' : 'password'}
            placeholder='••••••••'
            value={state.signup.confirmPassword}
            onChange={(value) => actions.updateSignupField('confirmPassword', value)}
            autoComplete='new-password'
            rightSlot={
              <button
                type='button'
                onClick={() => setIsConfirmVisible((value) => !value)}
                className='text-slate-500 transition hover:text-[#11254b]'
                aria-label={
                  isConfirmVisible ? 'Hide confirmation password' : 'Show confirmation password'
                }
              >
                <EyeIcon />
              </button>
            }
          />

          <div className='rounded-[18px] border border-[#f1d0be] bg-[#ffefe6] px-4 py-4 text-[13px] leading-[1.45] text-[#9f4c2e] shadow-[0_12px_24px_rgba(159,76,46,0.06)]'>
            By joining, you agree to our Terms of Service and acknowledge you are a verified Gachon
            student.
          </div>

          {error ? <InlineErrorMessage message={error} /> : null}

          <PrimaryButton type='submit' className='w-full'>
            Join Now
          </PrimaryButton>
        </form>
      </div>

      <div className='mt-5 pb-2 text-center'>
        <p className='text-[15px] text-slate-500'>
          Already have an account?{' '}
          <button
            type='button'
            onClick={() => navigate('/onboard/login')}
            className='font-semibold text-[#1f76a7]'
          >
            Login
          </button>
        </p>
      </div>
    </ScreenFrame>
  );
}

function getSignupValidationError({
  confirmPassword,
  fullName,
  password,
  universityEmail,
}: {
  confirmPassword: string;
  fullName: string;
  password: string;
  universityEmail: string;
}) {
  if (!fullName.trim()) {
    return '이름을 입력해 주세요.';
  }

  if (!universityEmail.trim()) {
    return '학교 이메일 아이디를 입력해 주세요.';
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(universityEmail.trim())) {
    return '이메일 아이디에는 영문, 숫자, ._- 만 사용할 수 있습니다.';
  }

  if (password.length < 8) {
    return '비밀번호는 8자 이상이어야 합니다.';
  }

  if (confirmPassword !== password) {
    return '비밀번호 확인이 일치하지 않습니다.';
  }

  return null;
}

export function TermsPage() {
  const navigate = useNavigate();
  const { state, actions } = useSession();

  return (
    <ScreenFrame>
      <TopBar onBack={() => navigate('/onboard/signup')} title='Step 1 of 5' />

      <div className='mt-4'>
        <StepHeader
          stepLabel=' '
          title='Welcome to Gachon Connect'
          description='Join the curated academic ecosystem for Gachon University scholars.'
        />
      </div>

      <div className='mt-8 space-y-4'>
        {consentOptions.map((option) => (
          <ConsentCard
            key={option.field}
            title={option.title}
            description={option.description}
            checked={state.consent[option.field]}
            onChange={(value) => actions.setConsent(option.field, value)}
            linkLabel={option.linkLabel}
          />
        ))}
      </div>

      <div className='mt-auto pt-8'>
        <PrimaryButton
          onClick={() => navigate('/onboard/preferences')}
          className='w-full'
          disabled={!state.consent.terms || !state.consent.privacy}
        >
          Continue
        </PrimaryButton>
      </div>
    </ScreenFrame>
  );
}

export function PreferencesPage() {
  const navigate = useNavigate();
  const { state, actions } = useSession();

  return (
    <ScreenFrame>
      <TopBar onBack={() => navigate('/onboard/terms')} title='Step 2 of 4' />

      <div className='mt-4 space-y-4'>
        <StepHeader
          stepLabel=' '
          title='Tell us about you'
          description='Help us curate your campus experience by sharing what drives your curiosity.'
        />
        <div className='absolute right-0 top-24 h-40 w-40 rounded-full bg-slate-200/40 blur-3xl' />
      </div>

      <section className='mt-8 space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-[17px] font-bold text-[#11254b]'>Interests</h2>
          <span className='text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400'>
            Select Multiple
          </span>
        </div>
        <div className='flex flex-wrap gap-3'>
          {onboardingInterests.map((interest) => (
            <ChoiceChip
              key={interest}
              label={interest}
              selected={state.preferences.interests.includes(interest)}
              onClick={() => actions.toggleInterest(interest)}
            />
          ))}
        </div>
      </section>

      <section className='mt-8 space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-[17px] font-bold text-[#11254b]'>Joining Purpose</h2>
          <span className='text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400'>
            Select One
          </span>
        </div>

        <div className='space-y-3'>
          {onboardingPurposeOptions.map((purpose) => (
            <ChoiceCard
              key={purpose.value}
              title={purpose.title}
              description={purpose.description}
              selected={state.preferences.purpose === purpose.value}
              onClick={() => actions.setPurpose(purpose.value)}
              icon={purpose.icon}
            />
          ))}
        </div>
      </section>

      <div className='mt-auto pt-8'>
        <PrimaryButton
          onClick={() => navigate('/onboard/notifications')}
          className='w-full'
          disabled={!state.preferences.purpose}
        >
          Next
        </PrimaryButton>
      </div>
    </ScreenFrame>
  );
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const { state, actions } = useSession();

  return (
    <ScreenFrame>
      <TopBar onBack={() => navigate('/onboard/preferences')} title='Step 3 of 4' />

      <div className='mt-2'>
        <ProgressBars activeIndex={2} total={4} />
      </div>

      <div className='mt-8 flex flex-col items-center space-y-6 text-center'>
        <div className='relative flex h-64 w-full items-center justify-center rounded-[34px] bg-white shadow-[0_14px_34px_rgba(16,34,64,0.08)]'>
          <div className='absolute left-6 bottom-7 h-12 w-12 rounded-2xl bg-slate-100 shadow-[0_8px_20px_rgba(16,34,64,0.06)]' />
          <div className='absolute right-8 top-8 h-12 w-12 rounded-2xl bg-[#ffe3de] shadow-[0_8px_20px_rgba(16,34,64,0.06)]' />
          <div className='flex h-28 w-28 items-center justify-center rounded-full bg-[#123f7a] text-[42px] text-white shadow-[0_18px_30px_rgba(18,63,122,0.24)]'>
            🔔
          </div>
        </div>

        <div className='space-y-3'>
          <h1 className='text-[30px] font-extrabold tracking-[-0.05em] text-[#11254b]'>
            Stay Updated!
          </h1>
          <p className='max-w-[24ch] text-[16px] leading-[1.45] text-slate-500'>
            Choose how you want to be notified about campus life, new connections, and group
            activities.
          </p>
        </div>
      </div>

      <div className='mt-8 space-y-4'>
        {notificationOptions.map((option) => (
          <ToggleCard
            key={option.key}
            title={option.title}
            description={option.description}
            enabled={state.notifications[option.key]}
            onToggle={(value) => actions.setNotification(option.key, value)}
            accent={option.accent}
            iconLabel={option.iconLabel}
          />
        ))}
      </div>

      <div className='mt-auto pt-8'>
        <PrimaryButton onClick={() => navigate('/onboard/ready')} className='w-full'>
          Allow Notifications
        </PrimaryButton>
        <div className='mt-4 text-center'>
          <LinkButton onClick={() => navigate('/onboard/ready')}>Skip For Now</LinkButton>
        </div>
      </div>
    </ScreenFrame>
  );
}

export function ReadyPage() {
  const navigate = useNavigate();
  const { actions } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await actions.completeSignup();
      navigate('/main');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenFrame>
      <TopBar onBack={() => navigate('/onboard/notifications')} title='Step 4 of 4' />

      <div className='mt-4 flex items-center gap-3'>
        <span className='rounded-full bg-[#ffe5df] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#cb6d5f]'>
          Final Step
        </span>
      </div>

      <div className='mt-5 space-y-3'>
        <h1 className='text-[32px] font-extrabold tracking-[-0.05em] text-[#11254b]'>
          Ready to Start?
        </h1>
        <p className='max-w-[24ch] text-[16px] leading-[1.45] text-slate-500'>
          Explore your new academic sanctuary and connect with the heartbeat of campus life.
        </p>
      </div>

      <div className='mt-7'>
        <ProgressBars activeIndex={3} total={4} />
      </div>

      <div className='mt-7 space-y-4'>
        <div className='overflow-hidden rounded-[30px] bg-white shadow-[0_16px_40px_rgba(16,34,64,0.08)]'>
          <div className='relative h-56 bg-[linear-gradient(135deg,#120f21_0%,#4d3326_38%,#c18449_100%)]'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_20%),radial-gradient(circle_at_70%_30%,rgba(255,224,190,0.28),transparent_16%)]' />
            <div className='absolute inset-x-4 bottom-4 rounded-[24px] bg-[linear-gradient(180deg,rgba(5,10,24,0)_0%,rgba(5,10,24,0.7)_100%)] p-4 text-white'>
              <span className='text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80'>
                Collaborate
              </span>
              <h2 className='mt-1 text-[24px] font-extrabold tracking-[-0.04em]'>
                Find Study Groups
              </h2>
              <p className='mt-2 max-w-[22ch] text-[13px] leading-[1.45] text-white/82'>
                Connect with peers in your courses for shared mastery.
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <DecorativeOnboardingCard
            title='Activity Discovery'
            description='Campus events tailored to your interests.'
            icon={<span className='text-[18px]'>🧭</span>}
          />
          <div className='overflow-hidden rounded-[32px] bg-[#0d2d63] p-5 text-white shadow-[0_16px_40px_rgba(13,45,99,0.22)]'>
            <div className='flex items-center gap-1'>
              <div className='flex -space-x-2'>
                <span className='h-8 w-8 rounded-full border-2 border-[#0d2d63] bg-[#f2c4c0]' />
                <span className='h-8 w-8 rounded-full border-2 border-[#0d2d63] bg-[#b4c5f2]' />
                <span className='h-8 w-8 rounded-full border-2 border-[#0d2d63] bg-[#f2d89e]' />
              </div>
              <span className='ml-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70'>
                +4k
              </span>
            </div>
            <div className='mt-5 space-y-2'>
              <h3 className='text-[20px] font-extrabold tracking-[-0.04em]'>Student Community</h3>
              <span className='text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/65'>
                Join Now →
              </span>
            </div>
          </div>
        </div>

        <DecorativeOnboardingCard
          title='Academic Curator'
          description='Our AI analyzes your syllabus to suggest the best times for rest and focused study.'
          icon={<span className='text-[18px]'>✨</span>}
        />

        <PrimaryButton onClick={handleFinish} disabled={isSubmitting} className='w-full'>
          {isSubmitting ? 'Getting ready...' : 'Get Started'}
        </PrimaryButton>
        <p className='text-center text-[13px] text-slate-500'>
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </ScreenFrame>
  );
}
