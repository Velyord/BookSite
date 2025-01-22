export interface Choice {
  text: string;
  nextPageId: number;
}

export interface Page {
  id: number;
  image: string;
  text: string;
  audio?: string;
  choices?: Choice[];
}

export interface StoryState {
  currentPage: number;
  textRevealIndex: number;
  bottomTextRevealIndex: number;
  showChoices: boolean;
  useVoice: boolean | null;
  isPlaying: boolean;
  isTransitioning: boolean;
}