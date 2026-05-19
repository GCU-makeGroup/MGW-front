import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainDiscoverySection } from '../features/main/MainDiscoverySection';
import { NotificationModal } from '../features/notification/NotificationModal';
import { navigateFromBottomTab } from '../features/navigation/bottom-tab-navigation';
import { RequireAuth } from '../features/session/RequireAuth';
import { useSession } from '../features/session/session-context';
import { BellIcon, BottomTabs, ScreenFrame } from '../features/session/ui';

function MainPage() {
  const navigate = useNavigate();
  const { state } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <RequireAuth>
        <ScreenFrame className='pb-4 pt-4'>
          <div className='flex flex-1 flex-col'>
            <header className='flex items-center justify-between px-1'>
              <h1 className='text-[22px] font-extrabold tracking-[-0.05em] text-[#123f7a]'>
                GachonConnect
              </h1>
              <button
                type='button'
                onClick={() => setShowNotifications(true)}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#123f7a] shadow-[0_10px_20px_rgba(16,34,64,0.08)]'
                aria-label='Notifications'
              >
                <BellIcon />
              </button>
            </header>

            <main className='flex-1 pt-8 pb-20'>
              <MainDiscoverySection />
              <p className='mt-6 text-center text-[11px] font-medium text-slate-400'>
                Signed in as {state.signup.fullName || state.auth.email || 'Gachon Connect member'}
              </p>
            </main>
          </div>
        </ScreenFrame>
        <BottomTabs
          fixed
          active='main'
          onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
        />
      </RequireAuth>
      {showNotifications && <NotificationModal onClose={() => setShowNotifications(false)} />}
    </>
  );
}

export default MainPage;
