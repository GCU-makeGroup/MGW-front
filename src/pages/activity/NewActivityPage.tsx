import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createActivity, uploadActivityImage } from '../../api/activity';
import { newActivityCategories } from '../../features/activity/activity-data';
import {
  ActivityCapacityStepper,
  ActivityCategoryChip,
  CreatedArtwork,
  FeedbackModal,
  ModalScrim,
} from '../../features/activity/activity-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { ScreenFrame } from '../../features/session/ui';
import {
  CalendarIcon,
  CoverImageField,
  NewPostField,
  NewPostInput,
  NewPostTextArea,
} from '../../features/group/group-ui';

const CATEGORY_ID_MAP: Record<string, number[]> = {
  Study: [1],
  Language: [2],
  Hobby: [3],
  Sports: [4],
};

function NewActivityPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<(typeof newActivityCategories)[number]>('Study');
  const [maxCapacity, setMaxCapacity] = useState(4);
  const [schedule, setSchedule] = useState('');
  const [description, setDescription] = useState('');
  const [kakaoLink, setKakaoLink] = useState('');
  const [location, setLocation] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const canCreate =
    title.trim().length > 0 && description.trim().length > 0 && schedule.trim().length > 0;

  useEffect(() => {
    if (!coverImageFile) {
      setCoverImagePreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(coverImageFile);
    setCoverImagePreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [coverImageFile]);

  const handleCreate = async () => {
    if (!canCreate) {
      return;
    }

    try {
      let thumbnailUrl = '';
      if (coverImageFile) {
        const uploadResult = await uploadActivityImage(coverImageFile);
        thumbnailUrl = uploadResult.thumbnailUrl;
      }

      await createActivity({
        title: title.trim(),
        description: description.trim(),
        maxMembers: maxCapacity,
        categoryIds: CATEGORY_ID_MAP[category] ?? [1],
        schedule: schedule ? `${schedule}+09:00` : schedule,
        openchatUrl: kakaoLink.trim(),
        thumbnailUrl,
        location: location.trim(),
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RequireAuth>
      <ScreenFrame className='pb-4 pt-4'>
        <div className='flex min-h-dvh flex-col'>
          <header className='grid grid-cols-[40px_1fr_40px] items-center text-[#203354]'>
            <button
              type='button'
              onClick={() => navigate('/activity')}
              className='text-[24px] leading-none text-[#63728b]'
              aria-label='Close create activity'
            >
              ×
            </button>
            <h1 className='text-center text-[20px] font-extrabold tracking-[-0.04em]'>
              Create New Activity
            </h1>
            <span />
          </header>

          <main className='flex-1 overflow-y-auto pt-5'>
            <div className='space-y-4 pb-6'>
              <CoverImageField
                previewUrl={coverImagePreviewUrl}
                fileName={coverImageFile?.name ?? null}
                onFileSelect={setCoverImageFile}
                onClear={() => setCoverImageFile(null)}
              />

              <section className='rounded-[28px] bg-white p-5 shadow-[0_18px_36px_rgba(16,34,64,0.07)]'>
                <div className='space-y-6'>
                  <NewPostField label='ACTIVITY TITLE'>
                    <NewPostInput
                      placeholder='Enter a catchy name for your group'
                      value={title}
                      onChange={setTitle}
                    />
                  </NewPostField>

                  <NewPostField label='CATEGORY'>
                    <div className='flex flex-wrap gap-3'>
                      {newActivityCategories.map((item) => (
                        <ActivityCategoryChip
                          key={item}
                          label={item}
                          active={category === item}
                          onClick={() => setCategory(item)}
                        />
                      ))}
                    </div>
                  </NewPostField>
                </div>
              </section>

              <section className='rounded-[28px] bg-white p-5 shadow-[0_18px_36px_rgba(16,34,64,0.07)]'>
                <div className='space-y-6'>
                  <NewPostField label='MAX CAPACITY'>
                    <ActivityCapacityStepper value={maxCapacity} onChange={setMaxCapacity} />
                  </NewPostField>

                  <NewPostField label='SCHEDULE'>
                    <div className='flex h-14 items-center gap-3 rounded-[18px] bg-[#f5f7fb] px-4'>
                      <input
                        type='datetime-local'
                        value={schedule}
                        onChange={(event) => setSchedule(event.target.value)}
                        className='min-w-0 flex-1 bg-transparent text-[15px] text-[#24324c] outline-none [color-scheme:light]'
                      />
                      <span className='text-[#7d899d]'>
                        <CalendarIcon />
                      </span>
                    </div>
                  </NewPostField>

                  <NewPostField label='LOCATION'>
                    <NewPostInput
                      placeholder='Enter activity location'
                      value={location}
                      onChange={setLocation}
                    />
                  </NewPostField>
                </div>
              </section>

              <section className='rounded-[28px] bg-white p-5 shadow-[0_18px_36px_rgba(16,34,64,0.07)]'>
                <div className='space-y-6'>
                  <NewPostField label='DESCRIPTION'>
                    <NewPostTextArea value={description} onChange={setDescription} />
                  </NewPostField>

                  <NewPostField label='KAKAO OPEN CHAT LINK'>
                    <NewPostInput
                      placeholder='Paste your group chat link here'
                      value={kakaoLink}
                      onChange={setKakaoLink}
                    />
                  </NewPostField>

                  <div className='rounded-[18px] bg-[#eef4ff] px-4 py-4 text-[14px] leading-[1.5] text-[#4e6c96]'>
                    <p className='font-semibold'>
                      ⓘ Setting a clear description helps students find groups that match their
                      interests perfectly.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <footer className='mt-2 flex items-center gap-4'>
            <button
              type='button'
              onClick={() => navigate('/activity')}
              className='inline-flex h-14 flex-1 items-center justify-center rounded-full bg-[#eef0f3] text-[17px] font-bold text-[#5f6f88]'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={() => {
                void handleCreate();
              }}
              disabled={!canCreate}
              className='inline-flex h-14 flex-[1.45] items-center justify-center rounded-full bg-[#0d3f7c] text-[17px] font-bold text-white shadow-[0_18px_30px_rgba(13,63,124,0.24)] disabled:opacity-60'
            >
              Create Activity
            </button>
          </footer>

          {showSuccessModal ? (
            <ModalScrim>
              <FeedbackModal
                tone='create'
                title='Activity Created Successfully!'
                description='Your new activity has been listed. You can now invite members and manage the group from your profile.'
                primaryLabel='Go to My Activities'
                secondaryLabel='Dismiss'
                onPrimary={() => navigate('/activity')}
                onSecondary={() => setShowSuccessModal(false)}
                artwork={<CreatedArtwork />}
              />
            </ModalScrim>
          ) : null}
        </div>
      </ScreenFrame>
    </RequireAuth>
  );
}

export default NewActivityPage;
