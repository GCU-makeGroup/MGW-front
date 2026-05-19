export function ErrorRetry({
  message = 'Something went wrong.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className='rounded-[14px] bg-[#fff5f5] px-5 py-6 text-center'>
      <p className='text-[15px] font-semibold text-[#c53030]'>{message}</p>
      {onRetry ? (
        <button
          type='button'
          onClick={onRetry}
          className='mt-2 text-[13px] font-semibold text-[#0879f2]'
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
