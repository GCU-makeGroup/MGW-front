let container: HTMLDivElement | null = null;

function getContainer(): HTMLDivElement {
  if (!container) {
    container = document.createElement('div');
    container.className =
      'fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2';
    document.body.appendChild(container);
  }
  return container;
}

type Tone = 'success' | 'error';

export function showToast(message: string, tone: Tone = 'error', durationMs = 3000): void {
  const el = document.createElement('div');

  const bg = tone === 'success' ? 'bg-[#1f2b45]' : 'bg-[#c53030]';
  el.className = `${bg} rounded-[12px] px-4 py-2 text-[13px] font-medium text-white shadow-lg transition-all duration-300 opacity-0 translate-y-2`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.textContent = message;

  const root = getContainer();
  root.appendChild(el);

  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
    el.classList.add('opacity-100', 'translate-y-0');
  });

  setTimeout(() => {
    el.classList.remove('opacity-100', 'translate-y-0');
    el.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => el.remove(), 300);
  }, durationMs);
}
