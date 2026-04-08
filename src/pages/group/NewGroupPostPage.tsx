import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newPostCategories } from '../../features/group/group-data';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import {
  CalendarIcon,
  CoverImageField,
  NewPostCategoryChip,
  NewPostField,
  NewPostInput,
  NewPostTextArea,
  PeopleIcon,
} from '../../features/group/group-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BottomTabs, ScreenFrame } from '../../features/session/ui';

function NewGroupPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<(typeof newPostCategories)[number]>('Study');
  const [recruitmentNumber, setRecruitmentNumber] = useState('');
  const [activityStartDate, setActivityStartDate] = useState('');
  const [activityEndDate, setActivityEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState<string | null>(null);
  const canSubmit =
    title.trim().length > 0 &&
    recruitmentNumber.trim().length > 0 &&
    activityStartDate.trim().length > 0 &&
    activityEndDate.trim().length > 0 &&
    description.trim().length > 0;

  useEffect(() => {
    if (!coverImageFile) {
      setCoverImagePreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(coverImageFile);
    setCoverImagePreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [coverImageFile]);

  useEffect(() => {
    if (!activityStartDate || !activityEndDate) {
      return;
    }

    if (activityEndDate < activityStartDate) {
      setActivityEndDate(activityStartDate);
    }
  }, [activityEndDate, activityStartDate]);

  const handlePost = () => {
    if (!canSubmit) {
      return;
    }

    const draftPayload = {
      title: title.trim(),
      category,
      recruitmentNumber: recruitmentNumber.trim(),
      activityStartDate,
      activityEndDate,
      description: description.trim(),
      coverImageFile,
    };

    console.info('Ready group post draft', draftPayload);
    navigate('/group');
  };

  return (
    <RequireAuth>
      <ScreenFrame className='pb-0 pt-3'>
        <div className='flex min-h-dvh flex-col'>
          <header className='flex items-center justify-between text-[18px] font-semibold tracking-[-0.03em] text-[#1f2b45]'>
            <button type='button' onClick={() => navigate('/group')} className='text-[#6f7b8f]'>
              Cancel
            </button>
            <h1 className='font-bold'>NewPost</h1>
            <button
              type='button'
              onClick={handlePost}
              disabled={!canSubmit}
              className='font-bold text-[#1967d2] disabled:text-[#9eb3cf]'
            >
              Post
            </button>
          </header>

          <main className='flex-1 overflow-y-auto pb-6 pt-8'>
            <div className='space-y-7'>
              <NewPostField label='GroupTitle'>
                <NewPostInput placeholder='Enter group name' value={title} onChange={setTitle} />
              </NewPostField>

              <NewPostField label='Category'>
                <div className='flex flex-wrap gap-3'>
                  {newPostCategories.map((item) => (
                    <NewPostCategoryChip
                      key={item}
                      label={item}
                      active={category === item}
                      onClick={() => setCategory(item)}
                    />
                  ))}
                </div>
              </NewPostField>

              <div className='grid grid-cols-2 gap-4'>
                <NewPostField label='Recruitment Number'>
                  <NewPostInput
                    placeholder='e.g. 4 people'
                    value={recruitmentNumber}
                    onChange={setRecruitmentNumber}
                    icon={<PeopleIcon />}
                  />
                </NewPostField>
                <NewPostField label='Activity Period'>
                  <div className='space-y-3'>
                    <NewPostInput
                      type='date'
                      value={activityStartDate}
                      onChange={setActivityStartDate}
                      icon={<CalendarIcon />}
                    />
                    <NewPostInput
                      type='date'
                      value={activityEndDate}
                      onChange={setActivityEndDate}
                      min={activityStartDate || undefined}
                      icon={<CalendarIcon />}
                    />
                    <p className='text-[12px] text-[#8c98ad]'>
                      Start date and end date are stored separately for API submission.
                    </p>
                  </div>
                </NewPostField>
              </div>

              <NewPostField label='Description'>
                <NewPostTextArea value={description} onChange={setDescription} />
              </NewPostField>

              <NewPostField label='CoverImage (Optional)'>
                <CoverImageField
                  previewUrl={coverImagePreviewUrl}
                  fileName={coverImageFile?.name ?? null}
                  onFileSelect={setCoverImageFile}
                  onClear={() => setCoverImageFile(null)}
                />
              </NewPostField>
            </div>
          </main>

          <footer className='relative pb-4 pt-3'>
            <BottomTabs
              active='group'
              tone='subtle'
              onNavigate={(tab) => navigateFromBottomTab(navigate, tab)}
            />
          </footer>
        </div>
      </ScreenFrame>
    </RequireAuth>
  );
}

export default NewGroupPostPage;
