export type MainDiscoveryAction = 'dismiss' | 'save' | 'like';

export type DiscoveryCard = {
  id: string;
  badge: string;
  title: string;
  memberCount: string;
  description: string;
  tags: string[];
  theme: 'teal' | 'sunset' | 'night';
};

export const discoveryCards: DiscoveryCard[] = [
  {
    id: 'gachon-dev-studio',
    badge: 'Hot Trending',
    title: 'Gachon Dev Studio',
    memberCount: '24 Members Active',
    description:
      'Creating the next generation of campus solutions. Join us for weekly sprints, tech talks, and pizza.',
    tags: ['Software', 'Design'],
    theme: 'teal',
  },
  {
    id: 'ai-makers-lab',
    badge: 'New Match',
    title: 'AI Makers Lab',
    memberCount: '18 Members Active',
    description:
      'Prototype AI tools, demo fast, and build polished campus experiences with product-minded teammates.',
    tags: ['AI', 'Prototype'],
    theme: 'sunset',
  },
  {
    id: 'night-owl-builders',
    badge: 'Late Night',
    title: 'Night Owl Builders',
    memberCount: '12 Members Active',
    description:
      'For students who ship best after sunset. Expect rapid experiments, design critiques, and weekend builds.',
    tags: ['Hackathon', 'Frontend'],
    theme: 'night',
  },
];
