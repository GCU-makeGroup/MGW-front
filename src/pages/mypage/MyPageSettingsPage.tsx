import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchMyPageSettings,
  updateAppLanguagePreference,
  updateDarkModePreference,
  updateMatchingCommunicationSettings,
  updateNotificationSettings,
  type MyPageSettingsViewModel,
  type PreferredLanguage,
} from '../../api/mypage';
import { changePassword, withdrawAccount } from '../../api/session';
import {
  appLanguageLabels,
  createMyPageFallbackContext,
  createInitialSettings,
  keywordSuggestions,
} from '../../features/mypage/mypage-data';
import {
  AcademicVerificationCard,
  DangerConfirmationModal,
  KeywordSelection,
  PreferredLanguageSelector,
  SettingsLinkRow,
  SettingsProfileSummary,
  SettingsSection,
  SettingsToggleRow,
  SignOutFooter,
} from '../../features/mypage/mypage-ui';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import { RequireAuth } from '../../features/session/RequireAuth';
import { useSession } from '../../features/session/session-context';
import { BellIcon, BottomTabs, ScreenFrame, TopBar } from '../../features/session/ui';
import { HeaderIconButton, SearchIcon } from '../../features/group/group-ui';

function MyPageSettingsPage() {
  const navigate = useNavigate();
  const { state, actions } = useSession();
  const fallbackContext = createMyPageFallbackContext(state);
  const { displayName, major, registeredEmail } = fallbackContext;
  const seedSettings = createInitialSettings(state);
  const [settings, setSettings] = useState<MyPageSettingsViewModel>(() => seedSettings);
  const [deactivationEmail, setDeactivationEmail] = useState('');
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const nextSettings = await fetchMyPageSettings({
          displayName,
          email: registeredEmail,
          major,
        });

        if (cancelled) {
          return;
        }

        setSettings(nextSettings);
      } catch (error) {
        console.error(error);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [displayName, major, registeredEmail]);

  const handlePreferredLanguage = async (nextLanguage: PreferredLanguage) => {
    const previous = settings.matchingCommunication.preferredLanguage;
    const nextSettings = {
      ...settings,
      matchingCommunication: {
        ...settings.matchingCommunication,
        preferredLanguage: nextLanguage,
      },
    };

    setSettings(nextSettings);

    try {
      await updateMatchingCommunicationSettings({
        interestKeywords: nextSettings.matchingCommunication.interestKeywords,
        preferredLanguage: nextLanguage,
      });
    } catch (error) {
      console.error(error);
      setSettings((current) => ({
        ...current,
        matchingCommunication: {
          ...current.matchingCommunication,
          preferredLanguage: previous,
        },
      }));
    }
  };

  const handleKeywordChange = async (nextKeywords: string[]) => {
    const previous = settings.matchingCommunication.interestKeywords;
    setSettings((current) => ({
      ...current,
      matchingCommunication: {
        ...current.matchingCommunication,
        interestKeywords: nextKeywords,
      },
    }));

    try {
      await updateMatchingCommunicationSettings({
        interestKeywords: nextKeywords,
        preferredLanguage: settings.matchingCommunication.preferredLanguage,
      });
    } catch (error) {
      console.error(error);
      setSettings((current) => ({
        ...current,
        matchingCommunication: {
          ...current.matchingCommunication,
          interestKeywords: previous,
        },
      }));
    }
  };

  const handleNotificationToggle = async (
    key: keyof MyPageSettingsViewModel['notifications'],
    value: boolean,
  ) => {
    const previous = settings.notifications;
    const nextNotifications = {
      ...settings.notifications,
      [key]: value,
    };

    setSettings((current) => ({
      ...current,
      notifications: nextNotifications,
    }));

    try {
      await updateNotificationSettings(nextNotifications);
    } catch (error) {
      console.error(error);
      setSettings((current) => ({
        ...current,
        notifications: previous,
      }));
    }
  };

  const handleToggleAppLanguage = async () => {
    const nextLanguage = settings.languageRegion.appLanguage === 'ENGLISH' ? 'KOREAN' : 'ENGLISH';
    const previous = settings.languageRegion.appLanguage;

    setSettings((current) => ({
      ...current,
      languageRegion: {
        appLanguage: nextLanguage,
      },
    }));

    try {
      await updateAppLanguagePreference({
        appLanguage: nextLanguage,
      });
    } catch (error) {
      console.error(error);
      setSettings((current) => ({
        ...current,
        languageRegion: {
          appLanguage: previous,
        },
      }));
    }
  };

  const handleToggleDarkMode = async (nextValue: boolean) => {
    const previous = settings.system.darkMode;

    setSettings((current) => ({
      ...current,
      system: {
        darkMode: nextValue,
      },
    }));

    try {
      await updateDarkModePreference({
        darkMode: nextValue,
      });
    } catch (error) {
      console.error(error);
      setSettings((current) => ({
        ...current,
        system: {
          darkMode: previous,
        },
      }));
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setInfoMessage('Password changed successfully.');
    } catch (error) {
      console.error(error);
      setPasswordError('Failed to change password. Check your current password.');
    }
  };

  const handleWithdraw = async () => {
    if (deactivationEmail !== registeredEmail) return;
    try {
      await withdrawAccount();
    } catch (error) {
      console.error(error);
    } finally {
      actions.resetAll();
      navigate('/onboard/login', { replace: true });
    }
  };

  return (
    <RequireAuth>
      <ScreenFrame className='pb-4 pt-4'>
        <div className='flex flex-1 flex-col'>
          <TopBar
            title='Settings'
            onBack={() => navigate(-1)}
            rightContent={
              <>
                <HeaderIconButton label='Search'>
                  <SearchIcon />
                </HeaderIconButton>
                <HeaderIconButton label='Notifications' showBadge>
                  <BellIcon />
                </HeaderIconButton>
              </>
            }
          />

          <main className='flex-1 space-y-6 pb-6'>
            {infoMessage ? (
              <p className='rounded-2xl bg-[#eef4ff] px-4 py-3 text-[13px] font-medium text-[#375b97]'>
                {infoMessage}
              </p>
            ) : null}
            <SettingsProfileSummary settings={settings} />

            <SettingsSection title='Matching & Communication'>
              <div className='space-y-5'>
                <KeywordSelection
                  keywords={settings.matchingCommunication.interestKeywords}
                  onRemove={(keyword) =>
                    handleKeywordChange(
                      settings.matchingCommunication.interestKeywords.filter(
                        (currentKeyword) => currentKeyword !== keyword,
                      ),
                    )
                  }
                  onAddSuggestion={() => {
                    const nextKeyword = keywordSuggestions.find(
                      (keyword) =>
                        !settings.matchingCommunication.interestKeywords.includes(keyword),
                    );

                    if (!nextKeyword) {
                      return;
                    }

                    void handleKeywordChange([
                      ...settings.matchingCommunication.interestKeywords,
                      nextKeyword,
                    ]);
                  }}
                />
                <PreferredLanguageSelector
                  value={settings.matchingCommunication.preferredLanguage}
                  onSelect={(value) => {
                    void handlePreferredLanguage(value);
                  }}
                />
              </div>
            </SettingsSection>

            <SettingsSection title='Notifications'>
              <div className='space-y-1'>
                <SettingsToggleRow
                  icon='💬'
                  title='New Messages'
                  description='Real-time alerts for private chats'
                  enabled={settings.notifications.newMessages}
                  onToggle={(value) => {
                    void handleNotificationToggle('newMessages', value);
                  }}
                />
                <SettingsToggleRow
                  icon='👥'
                  title='Group Invites'
                  description='Notification when joined to a crew'
                  enabled={settings.notifications.groupInvites}
                  onToggle={(value) => {
                    void handleNotificationToggle('groupInvites', value);
                  }}
                />
                <SettingsToggleRow
                  icon='📝'
                  title='Post Comments'
                  description='When someone replies to your board posts'
                  enabled={settings.notifications.postComments}
                  onToggle={(value) => {
                    void handleNotificationToggle('postComments', value);
                  }}
                />
                <SettingsToggleRow
                  icon='🌙'
                  title='Etiquette Mode'
                  description={`Do Not Disturb ${settings.notifications.etiquetteStartTime} - ${settings.notifications.etiquetteEndTime}`}
                  enabled={settings.notifications.etiquetteMode}
                  onToggle={(value) => {
                    void handleNotificationToggle('etiquetteMode', value);
                  }}
                />
              </div>
            </SettingsSection>

            <SettingsSection title='Language & Region'>
              <SettingsLinkRow
                icon='🌐'
                title='App Language'
                value={appLanguageLabels[settings.languageRegion.appLanguage]}
                onClick={() => {
                  void handleToggleAppLanguage();
                }}
              />
            </SettingsSection>

            <SettingsSection title='Account & Security'>
              <div className='space-y-2'>
                <AcademicVerificationCard
                  studentId={settings.accountSecurity.studentId}
                  department={settings.accountSecurity.department}
                  onReverify={() => {
                    setInfoMessage(
                      '학적 재인증 API는 문서 확정 후 연결할 수 있도록 자리만 준비했다.',
                    );
                  }}
                />
                <SettingsLinkRow
                  icon='🔐'
                  title='Change Password'
                  onClick={() => {
                    setPasswordError(null);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setShowPasswordModal(true);
                  }}
                />
                <SettingsToggleRow
                  icon='🛡️'
                  title='Two-Factor Authentication'
                  description='Extra security via student email'
                  enabled={settings.accountSecurity.twoFactorEnabled}
                  onToggle={(value) => {
                    setSettings((current) => ({
                      ...current,
                      accountSecurity: {
                        ...current.accountSecurity,
                        twoFactorEnabled: value,
                      },
                    }));
                    setInfoMessage(
                      '2차 인증 API는 문서 확정 전이라 현재는 프론트 상태만 반영한다.',
                    );
                  }}
                />
              </div>
            </SettingsSection>

            <SettingsSection title='System'>
              <SettingsToggleRow
                icon='🌘'
                title='Dark Mode'
                enabled={settings.system.darkMode}
                onToggle={(value) => {
                  void handleToggleDarkMode(value);
                }}
              />
            </SettingsSection>

            <div className='pt-2 text-center'>
              <button
                type='button'
                onClick={() => {
                  setInfoMessage('');
                  setShowDangerModal(true);
                }}
                className='text-[16px] font-semibold text-[#203354]'
              >
                Sign Out
              </button>
            </div>
            <SignOutFooter />
          </main>

          <footer>
            <BottomTabs
              active='mypage'
              onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
            />
          </footer>
        </div>

        {showDangerModal ? (
          <DangerConfirmationModal
            email={registeredEmail}
            value={deactivationEmail}
            onChange={setDeactivationEmail}
            onCancel={() => {
              setDeactivationEmail('');
              setShowDangerModal(false);
            }}
            onConfirm={() => {
              void handleWithdraw();
            }}
          />
        ) : null}

        {showPasswordModal ? (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6'>
            <div className='w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl'>
              <h2 className='text-[18px] font-bold text-[#1f2b45]'>Change Password</h2>
              <div className='mt-4 space-y-3'>
                <input
                  type='password'
                  placeholder='Current password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className='w-full rounded-xl border border-[#d8e1f0] px-4 py-3 text-[14px] outline-none focus:border-[#0879f2]'
                />
                <input
                  type='password'
                  placeholder='New password (8+ characters)'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='w-full rounded-xl border border-[#d8e1f0] px-4 py-3 text-[14px] outline-none focus:border-[#0879f2]'
                />
                <input
                  type='password'
                  placeholder='Confirm new password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='w-full rounded-xl border border-[#d8e1f0] px-4 py-3 text-[14px] outline-none focus:border-[#0879f2]'
                />
                {passwordError ? (
                  <p className='text-[13px] font-semibold text-[#d16060]'>{passwordError}</p>
                ) : null}
              </div>
              <div className='mt-5 flex gap-3'>
                <button
                  type='button'
                  onClick={() => setShowPasswordModal(false)}
                  className='flex-1 rounded-xl border border-[#d8e1f0] py-3 text-[14px] font-bold text-[#8090aa]'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={() => void handleChangePassword()}
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                  className='flex-1 rounded-xl bg-[#0879f2] py-3 text-[14px] font-bold text-white disabled:bg-[#bfd0e8]'
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </ScreenFrame>
    </RequireAuth>
  );
}

export default MyPageSettingsPage;
