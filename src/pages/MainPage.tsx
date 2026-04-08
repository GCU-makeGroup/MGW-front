import { Navigate } from 'react-router-dom';
import { useSession } from '../features/session/session-context';
import {
  BellIcon,
  BottomTabs,
  HeartIcon,
  MainActionButton,
  MainDiscoveryHero,
  ScreenFrame,
  StarIcon,
} from '../features/session/ui';

function MainPage() {
  const { state } = useSession();

  if (!state.isAuthenticated) {
    return <Navigate to='/onboard/login' replace />;
  }

  return (
    <ScreenFrame className='pb-4 pt-4'>
      <div className='flex flex-1 flex-col'>
        <header className='flex items-center justify-between px-1'>
          <h1 className='text-[22px] font-extrabold tracking-[-0.05em] text-[#123f7a]'>
            GachonConnect
          </h1>
          <button
            type='button'
            className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#123f7a] shadow-[0_10px_20px_rgba(16,34,64,0.08)]'
            aria-label='Notifications'
          >
            <BellIcon />
          </button>
        </header>

        <main className='flex-1 pt-8'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between px-1'>
              <h2 className='text-[28px] font-extrabold tracking-[-0.05em] text-[#11254b]'>
                Group Discovery
              </h2>
              <div className='flex items-center gap-1 text-[#ca3535]'>
                <span className='h-2 w-2 rounded-full bg-[#ca3535]' />
                <span className='h-1 w-1 rounded-full bg-slate-300' />
                <span className='h-1 w-1 rounded-full bg-slate-300' />
              </div>
            </div>

            <MainDiscoveryHero />

            <div className='flex justify-center gap-5 pt-1'>
              <MainActionButton icon={<span className='text-[21px] leading-none'>×</span>} />
              <MainActionButton icon={<StarIcon />} active />
              <MainActionButton icon={<HeartIcon />} />
            </div>
          </div>
        </main>

        <footer className='mt-6 space-y-3'>
          <BottomTabs active='main' />
          <p className='text-center text-[11px] font-medium text-slate-400'>
            Signed in as {state.signup.fullName || state.auth.email || 'Gachon Connect member'}
          </p>
        </footer>
      </div>
    </ScreenFrame>
  );
}

export default MainPage;
