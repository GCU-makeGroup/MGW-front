import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchGroups, type GroupListItemResponse } from '../../api/group';
import { searchActivities, type ActivitySummaryResponse } from '../../api/activity';

type SearchTab = 'groups' | 'activities';

export function SearchModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [tab, setTab] = useState<SearchTab>('groups');
  const [groups, setGroups] = useState<GroupListItemResponse[]>([]);
  const [activities, setActivities] = useState<ActivitySummaryResponse[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const kw = keyword.trim();
    if (!kw) return;

    setLoading(true);
    setError(null);
    try {
      const [groupResult, activityResult] = await Promise.all([
        searchGroups({ keyword: kw }),
        searchActivities(kw),
      ]);
      setGroups(groupResult.groups);
      setActivities(activityResult.activities);
      setSearched(true);
    } catch {
      setError('검색에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleSearch();
    }
  };

  const emptyResult = (
    <div className='rounded-[14px] bg-[#f9fafb] px-5 py-6 text-center'>
      <p className='text-[15px] font-semibold text-[#1f2b45]'>검색 결과가 없습니다</p>
      <p className='mt-1 text-[13px] text-[#8090aa]'>다른 키워드로 시도해보세요</p>
    </div>
  );

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-16 px-4'>
      <div className='w-full max-w-lg rounded-[20px] bg-white shadow-xl overflow-hidden max-h-[70vh] flex flex-col'>
        <div className='flex items-center gap-3 border-b border-[#e8eef5] px-4 py-3'>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Search groups and activities...'
            autoFocus
            className='min-w-0 flex-1 text-[16px] text-[#1f2b45] outline-none placeholder:text-[#a8b2c2]'
          />
          <button
            type='button'
            onClick={onClose}
            className='text-[14px] font-semibold text-[#8090aa]'
          >
            Cancel
          </button>
        </div>

        <div className='flex border-b border-[#e8eef5]'>
          <button
            type='button'
            onClick={() => setTab('groups')}
            className={`flex-1 py-2.5 text-[14px] font-bold ${tab === 'groups' ? 'border-b-2 border-[#0879f2] text-[#0879f2]' : 'text-[#8090aa]'}`}
          >
            Groups
          </button>
          <button
            type='button'
            onClick={() => setTab('activities')}
            className={`flex-1 py-2.5 text-[14px] font-bold ${tab === 'activities' ? 'border-b-2 border-[#0879f2] text-[#0879f2]' : 'text-[#8090aa]'}`}
          >
            Activities
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-[#0879f2] border-t-transparent' />
            </div>
          ) : error ? (
            <div className='py-8 text-center'>
              <p className='text-[14px] text-red-500'>{error}</p>
              <button
                type='button'
                onClick={() => void handleSearch()}
                className='mt-2 text-[13px] font-semibold text-[#0879f2]'
              >
                다시 시도
              </button>
            </div>
          ) : !searched ? (
            <p className='text-center text-[14px] text-[#9aa7bb]'>
              키워드를 입력하고 Enter를 눌러 검색하세요
            </p>
          ) : tab === 'groups' ? (
            groups.length > 0 ? (
              <ul className='space-y-2'>
                {groups.map((g) => (
                  <li key={g.id}>
                    <button
                      type='button'
                      onClick={() => {
                        onClose();
                        navigate(`/group/${g.id}`);
                      }}
                      className='w-full rounded-[14px] border border-[#e8eef5] px-4 py-3 text-left transition hover:bg-[#f5f7fa]'
                    >
                      <p className='text-[15px] font-semibold text-[#1f2b45]'>{g.title}</p>
                      <p className='mt-0.5 text-[13px] text-[#6d7a90]'>
                        {g.currentMemberCount}/{g.capacity} members
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              emptyResult
            )
          ) : activities.length > 0 ? (
            <ul className='space-y-2'>
              {activities.map((a) => (
                <li key={a.id}>
                  <button
                    type='button'
                    onClick={() => {
                      onClose();
                      navigate(`/activity/${a.id}`);
                    }}
                    className='w-full rounded-[14px] border border-[#e8eef5] px-4 py-3 text-left transition hover:bg-[#f5f7fa]'
                  >
                    <p className='text-[15px] font-semibold text-[#1f2b45]'>{a.title}</p>
                    <p className='mt-0.5 text-[13px] text-[#6d7a90]'>
                      {a.currentParticipants}/{a.capacity} participants
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            emptyResult
          )}
        </div>
      </div>
    </div>
  );
}
