import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className='rounded-[14px] bg-[#f9fafb] px-5 py-6 text-center'>
      <p className='text-[15px] font-semibold text-[#1f2b45]'>{title}</p>
      {description ? <p className='mt-1 text-[13px] text-[#8090aa]'>{description}</p> : null}
      {action ? <div className='mt-3'>{action}</div> : null}
    </div>
  );
}
