import clsx from 'clsx';
import type { ReactNode } from 'react';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchActivities, likeActivity, type ActivitySummaryResponse } from '../../api/activity';
import { type DiscoveryCard, type MainDiscoveryAction } from './discovery-data';

const themes: DiscoveryCard['theme'][] = ['teal', 'sunset', 'night'];

function mapActivityToCard(activity: ActivitySummaryResponse, index: number): DiscoveryCard {
  return {
    id: String(activity.id),
    badge: activity.isHotpick ? 'Hot Trending' : 'New Match',
    title: activity.title,
    memberCount: `${activity.currentParticipants}/${activity.capacity} Members`,
    description: activity.category,
    tags: [activity.category],
    theme: themes[index % themes.length],
  };
}

const actionMeta: Record<
  MainDiscoveryAction,
  {
    label: string;
    overlayClassName: string;
    cardClassName: string;
    buttonTone: 'danger' | 'save' | 'like';
  }
> = {
  dismiss: {
    label: 'Skip',
    overlayClassName: 'bg-white/90 text-[#ca3535] ring-1 ring-[#f7c2c4]',
    cardClassName:
      '-translate-x-[112%] translate-y-8 rotate-[-18deg] scale-[0.84] opacity-0 saturate-50',
    buttonTone: 'danger',
  },
  save: {
    label: 'Saved',
    overlayClassName: 'bg-[#123f7a] text-white ring-1 ring-white/30',
    cardClassName: 'translate-y-[-6%] rotate-[4deg] scale-[1.07] opacity-0 saturate-125 blur-[1px]',
    buttonTone: 'save',
  },
  like: {
    label: 'Liked',
    overlayClassName: 'bg-[#ff4f9b] text-white ring-1 ring-[#ffd0e4]',
    cardClassName:
      'translate-x-[112%] translate-y-3 rotate-[15deg] scale-[1.02] opacity-0 saturate-125',
    buttonTone: 'like',
  },
};

const cardThemeClassNames: Record<DiscoveryCard['theme'], string> = {
  teal: 'bg-[radial-gradient(circle_at_18%_18%,rgba(255,197,90,0.32),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(255,127,80,0.26),transparent_24%),linear-gradient(135deg,#0d4664_0%,#14677d_34%,#11182f_100%)]',
  sunset:
    'bg-[radial-gradient(circle_at_22%_20%,rgba(255,233,171,0.28),transparent_22%),radial-gradient(circle_at_82%_16%,rgba(255,154,158,0.26),transparent_24%),linear-gradient(135deg,#6a2f90_0%,#dd5e89_54%,#ffb86c_100%)]',
  night:
    'bg-[radial-gradient(circle_at_18%_20%,rgba(110,176,255,0.22),transparent_22%),radial-gradient(circle_at_76%_18%,rgba(216,181,255,0.20),transparent_24%),linear-gradient(135deg,#11182f_0%,#1a2750_48%,#122c64_100%)]',
};

function StarIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4 7.2 19l.9-5.4-3.9-3.8 5.4-.8L12 4Z'
        fill='currentColor'
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5'>
      <path
        d='M12 20s-7-4.6-7-10.2C5 6.7 6.7 5 8.7 5c1.4 0 2.6.8 3.3 2 .7-1.2 1.9-2 3.3-2 2 0 3.7 1.7 3.7 4.8C19 15.4 12 20 12 20Z'
        fill='currentColor'
      />
    </svg>
  );
}

function MainActionButton({
  icon,
  onClick,
  disabled = false,
  tone = 'danger',
  pressed = false,
}: {
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: 'danger' | 'save' | 'like';
  pressed?: boolean;
}) {
  const toneClassName = {
    danger: pressed
      ? 'border-transparent bg-[#ca3535] text-white shadow-[0_16px_30px_rgba(202,53,53,0.22)]'
      : 'border-slate-200 bg-white text-[#cb3940] shadow-[0_10px_24px_rgba(16,34,64,0.08)]',
    save: pressed
      ? 'border-transparent bg-[#123f7a] text-white shadow-[0_16px_30px_rgba(18,63,122,0.22)]'
      : 'border-slate-200 bg-white text-[#123f7a] shadow-[0_10px_24px_rgba(16,34,64,0.08)]',
    like: pressed
      ? 'border-transparent bg-[#ff4f9b] text-white shadow-[0_16px_30px_rgba(255,79,155,0.24)]'
      : 'border-slate-200 bg-white text-[#ff4f9b] shadow-[0_10px_24px_rgba(16,34,64,0.08)]',
  };

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex h-14 w-14 items-center justify-center rounded-full border transition',
        toneClassName[tone],
        disabled && 'cursor-not-allowed opacity-70',
      )}
    >
      {icon}
    </button>
  );
}

function CardSurface({
  card,
  layer,
  action,
}: {
  card: DiscoveryCard;
  layer: 'front' | 'middle' | 'back';
  action: MainDiscoveryAction | null;
}) {
  const layerClassName =
    layer === 'front'
      ? 'z-30 scale-100 translate-y-0 opacity-100'
      : layer === 'middle'
        ? 'z-20 scale-[0.95] translate-y-5 opacity-80'
        : 'z-10 scale-[0.9] translate-y-10 opacity-55';

  const actionClassName = layer === 'front' && action ? actionMeta[action].cardClassName : '';

  return (
    <article
      className={clsx(
        'absolute inset-x-0 top-0 overflow-hidden rounded-[36px] bg-white shadow-[0_22px_60px_rgba(16,34,64,0.10)] transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        layerClassName,
        actionClassName,
      )}
    >
      <div
        className={clsx(
          'relative h-[380px] overflow-hidden rounded-[36px]',
          cardThemeClassNames[card.theme],
        )}
      >
        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,24,0)_0%,rgba(5,10,24,0.08)_38%,rgba(5,10,24,0.62)_100%)]' />
        <div className='absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_16%_52%,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_58%_40%,rgba(255,255,255,0.12),transparent_15%),radial-gradient(circle_at_76%_62%,rgba(255,255,255,0.11),transparent_15%)]' />
        {layer === 'front' && action === 'dismiss' ? (
          <div className='absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.16)_35%,transparent_42%,rgba(255,255,255,0.08)_58%,transparent_68%)] opacity-80' />
        ) : null}
        {layer === 'front' && action === 'like' ? (
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,120,175,0.34),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,87,155,0.18)_100%)]' />
        ) : null}
        {layer === 'front' && action === 'save' ? (
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_52%_20%,rgba(255,255,255,0.26),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(18,63,122,0.22)_100%)]' />
        ) : null}

        <div className='relative flex h-full flex-col justify-between p-5'>
          <span className='inline-flex w-fit items-center rounded-full bg-[#ca3535] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_12px_22px_rgba(202,53,53,0.24)]'>
            {card.badge}
          </span>
          <div className='space-y-2 text-white'>
            <h3 className='max-w-[9ch] text-[36px] font-extrabold leading-[0.95] tracking-[-0.05em]'>
              {card.title}
            </h3>
            <p className='text-[14px] font-semibold text-white/88'>{card.memberCount}</p>
          </div>
        </div>
      </div>

      <div className='space-y-4 px-5 py-5'>
        <p className='max-w-[26ch] text-[16px] leading-[1.55] text-slate-500'>{card.description}</p>
        <div className='flex gap-3'>
          {card.tags.map((tag) => (
            <span
              key={tag}
              className='rounded-full bg-[#edf3ff] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#2e56be]'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function MainDiscoverySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingAction, setPendingAction] = useState<MainDiscoveryAction | null>(null);
  const queryClient = useQueryClient();

  const { data: activityList } = useQuery({
    queryKey: ['activities', 'discovery'],
    queryFn: () => fetchActivities({ scope: 'hotpick', limit: 20 }),
  });

  const cards: DiscoveryCard[] = useMemo(
    () =>
      activityList
        ? [
            ...(activityList.hotpick ? [mapActivityToCard(activityList.hotpick, 0)] : []),
            ...activityList.activities.map((a, i) => mapActivityToCard(a, i + 1)),
          ]
        : [],
    [activityList],
  );

  const visibleCards = useMemo(
    () =>
      cards.length > 0
        ? [0, 1, 2].map((offset) => cards[(activeIndex + offset) % cards.length])
        : [],
    [activeIndex, cards],
  );

  useEffect(() => {
    if (!pendingAction || cards.length === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % cards.length);
      });
      setPendingAction(null);
    }, 460);

    return () => window.clearTimeout(timeoutId);
  }, [pendingAction, cards.length]);

  const triggerAction = useCallback(
    async (action: MainDiscoveryAction) => {
      if (pendingAction || cards.length === 0) {
        return;
      }

      const currentCard = cards[activeIndex % cards.length];
      if (currentCard && (action === 'save' || action === 'like')) {
        try {
          await likeActivity(Number(currentCard.id));
          queryClient.invalidateQueries({ queryKey: ['activities'] });
        } catch {
          // still animate even if like fails
        }
      }

      setPendingAction(action);
    },
    [pendingAction, cards, activeIndex, queryClient],
  );

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between px-1'>
        <h2 className='text-[28px] font-extrabold tracking-[-0.05em] text-[#11254b]'>
          Group Discovery
        </h2>
        <div className='flex items-center gap-1 text-[#ca3535]'>
          {cards.map((card, index) => (
            <span
              key={card.id}
              className={clsx(
                'rounded-full transition-all duration-300',
                index === activeIndex ? 'h-2 w-2 bg-[#ca3535]' : 'h-1 w-1 bg-slate-300',
              )}
            />
          ))}
        </div>
      </div>

      <div className='relative h-[520px]'>
        {visibleCards.length >= 3 ? (
          <>
            <CardSurface card={visibleCards[2]} layer='back' action={null} />
            <CardSurface card={visibleCards[1]} layer='middle' action={null} />
            <CardSurface card={visibleCards[0]} layer='front' action={pendingAction} />
          </>
        ) : (
          <div className='flex h-full items-center justify-center'>
            <p className='text-[16px] text-[#8b97aa]'>No activities available</p>
          </div>
        )}

        {pendingAction && visibleCards.length >= 3 ? (
          <div className='pointer-events-none absolute inset-x-0 top-5 z-40 flex justify-center'>
            <span
              className={clsx(
                'rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] shadow-[0_12px_24px_rgba(16,34,64,0.12)]',
                actionMeta[pendingAction].overlayClassName,
              )}
            >
              {actionMeta[pendingAction].label}
            </span>
          </div>
        ) : null}
      </div>

      <div className='relative z-40 flex justify-center gap-5 pt-1'>
        <MainActionButton
          icon={<span className='text-[21px] leading-none'>×</span>}
          onClick={() => triggerAction('dismiss')}
          disabled={Boolean(pendingAction)}
          tone='danger'
          pressed={pendingAction === 'dismiss'}
        />
        <MainActionButton
          icon={<StarIcon />}
          onClick={() => triggerAction('save')}
          disabled={Boolean(pendingAction)}
          tone='save'
          pressed={pendingAction === 'save'}
        />
        <MainActionButton
          icon={<HeartIcon />}
          onClick={() => triggerAction('like')}
          disabled={Boolean(pendingAction)}
          tone='like'
          pressed={pendingAction === 'like'}
        />
      </div>
    </section>
  );
}
