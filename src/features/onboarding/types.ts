export type PurposeCardData = {
  title: string;
  description: string;
  icon: 'book' | 'globe' | 'people';
};

export type NotificationCardData = {
  title: string;
  description: string;
  icon: 'message' | 'group' | 'moon';
  tone: 'neutral' | 'rose';
};
