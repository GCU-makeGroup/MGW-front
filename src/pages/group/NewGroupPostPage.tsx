import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../api/group';
import { newPostCategories } from '../../features/group/group-data';
import { navigateFromBottomTab } from '../../features/navigation/bottom-tab-navigation';
import {
  CoverImageField,
  NewPostCategoryChip,
  NewPostField,
  NewPostInput,
  NewPostTextArea,
  PeopleIcon,
} from '../../features/group/group-ui';
import { RequireAuth } from '../../features/session/RequireAuth';
import { BottomTabs, ScreenFrame } from '../../features/session/ui';

const categoryToId: Record<(typeof newPostCategories)[number], number> = {
  Study: 1,
  Project: 2,
  Hobby: 3,
  Sports: 4,
  Language: 5,
};

function NewGroupPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<(typeof newPostCategories)[number]>('Study');
  const [recruitmentNumber, setRecruitmentNumber] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [description, setDescription] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const parsedCapacity = Number.parseInt(recruitmentNumber, 10);
  const canSubmit =
    title.trim().length > 0 &&
    Number.isFinite(parsedCapacity) &&
    parsedCapacity > 0 &&
    description.trim().length > 0 &&
    !submitting;

  useEffect(() => {
    if (!coverImageFile) {
      setCoverImagePreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(coverImageFile);
    setCoverImagePreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [coverImageFile]);

  const handlePost = async () => {
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);

    try {
      await createGroup({
        name: name.trim() || title.trim(),
        title: title.trim(),
        content: description.trim(),
        isPublic,
        capacity: parsedCapacity,
        categoryIds: [categoryToId[category]],
      });
      navigate('/group');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
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
                <NewPostInput placeholder='Enter group title' value={title} onChange={setTitle} />
              </NewPostField>

              <NewPostField label='Group Name'>
                <NewPostInput
                  placeholder='Short name (defaults to title)'
                  value={name}
                  onChange={setName}
                />
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

              <NewPostField label='Recruitment Number'>
                <NewPostInput
                  placeholder='e.g. 4 people'
                  value={recruitmentNumber}
                  onChange={setRecruitmentNumber}
                  icon={<PeopleIcon />}
                />
              </NewPostField>

              <NewPostField label='Visibility'>
                <div className='flex items-center gap-3'>
                  <button
                    type='button'
                    onClick={() => setIsPublic(true)}
                    className={`rounded-full px-4 py-2.5 text-[15px] font-semibold transition ${
                      isPublic
                        ? 'bg-[#0d7698] text-white shadow-[0_12px_22px_rgba(13,118,152,0.22)]'
                        : 'bg-[#eef2f7] text-[#5c697f]'
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsPublic(false)}
                    className={`rounded-full px-4 py-2.5 text-[15px] font-semibold transition ${
                      !isPublic
                        ? 'bg-[#0d7698] text-white shadow-[0_12px_22px_rgba(13,118,152,0.22)]'
                        : 'bg-[#eef2f7] text-[#5c697f]'
                    }`}
                  >
                    Private
                  </button>
                </div>
              </NewPostField>

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
