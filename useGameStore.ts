import { create } from 'zustand';

export interface Reel {
  id: string;
  color: 'blue' | 'pink';
  name: string;
  caughtAt: number;
  isNamed: boolean;
  videoIndex: number;
}

export interface Friend {
  id: string;
  username: string;
  reels: Reel[];
}

export const REEL_VIDEOS = [
  require('@/assets/reels/Video-719.mp4'),
  require('@/assets/reels/Video-700.mp4'),
  require('@/assets/reels/Video-853.mp4'),
  require('@/assets/reels/Video-148.mp4'),
  require('@/assets/reels/RX-side-effects-Elle-Cordova-1080p.mp4'),
  require('@/assets/reels/Alysa-Liu-edit-alysaliu-figureskating-edit-Inaraeditz-720p.mp4'),
  require('@/assets/reels/I-feel-like-90-of-moves-are-invented-by-accident-gymnastics-sports-fails-fail-gymnast-ncaa-Ian-Gunther-1080p.mp4'),
  require('@/assets/reels/One-of-my-faves-and-still-so-true-to-this-day-funnyshorts-laugh-comedy-dancing-millenials-Meaghan-Ranee-720p.mp4'),
];

interface GameState {
  reels: Reel[];
  friends: Friend[];
  checkpointPending: boolean;
  addReel: (reel: Reel) => void;
  removeReel: (id: string) => void;
  nameReel: (id: string, name: string) => void;
  addFriend: (friend: Friend) => void;
  setCheckpoint: (val: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  reels: [],
  friends: [
    {
      id: 'f1',
      username: 'OceanAngler99',
      reels: [
        { id: 'r-demo-1', color: 'blue', name: 'Splashy', caughtAt: Date.now() - 86400000, isNamed: true, videoIndex: 0 },
        { id: 'r-demo-2', color: 'pink', name: 'Bubblegum', caughtAt: Date.now() - 43200000, isNamed: true, videoIndex: 1 },
      ],
    },
    {
      id: 'f2',
      username: 'DeepSeaDiver',
      reels: [
        { id: 'r-demo-3', color: 'blue', name: 'Cobalt', caughtAt: Date.now() - 172800000, isNamed: true, videoIndex: 2 },
      ],
    },
  ],
  checkpointPending: false,

  addReel: (reel) =>
    set((state) => ({ reels: [...state.reels, reel] })),

  removeReel: (id) =>
    set((state) => ({ reels: state.reels.filter((r) => r.id !== id) })),

  nameReel: (id, name) =>
    set((state) => ({
      reels: state.reels.map((r) =>
        r.id === id ? { ...r, name, isNamed: true } : r
      ),
    })),

  addFriend: (friend) =>
    set((state) => ({ friends: [...state.friends, friend] })),

  setCheckpoint: (val) => set({ checkpointPending: val }),
}));
