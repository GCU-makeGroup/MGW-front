export function ListSkeleton({
  count = 3,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='animate-pulse rounded-[18px] border border-[#e8eef5] bg-white p-4'>
          <div className='h-4 w-3/5 rounded bg-[#e8eef5]' />
          <div className='mt-2.5 h-3 w-2/5 rounded bg-[#e8eef5]' />
          <div className='mt-3 flex gap-2'>
            <div className='h-5 w-12 rounded-full bg-[#e8eef5]' />
            <div className='h-5 w-14 rounded-full bg-[#e8eef5]' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className='h-[200px] rounded-[28px] bg-[#e8eef5]' />
      <div className='space-y-2 px-4'>
        <div className='h-5 w-4/5 rounded bg-[#e8eef5]' />
        <div className='h-4 w-3/5 rounded bg-[#e8eef5]' />
        <div className='h-4 w-2/5 rounded bg-[#e8eef5]' />
      </div>
      <div className='space-y-2 px-4'>
        <div className='h-3 w-full rounded bg-[#e8eef5]' />
        <div className='h-3 w-full rounded bg-[#e8eef5]' />
        <div className='h-3 w-3/4 rounded bg-[#e8eef5]' />
      </div>
    </div>
  );
}
