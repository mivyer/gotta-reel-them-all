import { create } from 'zustand';

export type BugReel = {
  id: string;
  name: string;
  thumbnail: any;
  videoUrl: any;
  caughtAt: number;
};

// Alias so existing imports of `Reel` still compile
export type Reel = BugReel;

export interface Friend {
  id: string;
  username: string;
  reels: BugReel[];
}

export const REEL_VIDEOS = [
  require('../assets/reels/Video-719.mp4'),
  require('../assets/reels/Video-700.mp4'),
  require('../assets/reels/Video-853.mp4'),
  require('../assets/reels/Video-148.mp4'),
  require('../assets/reels/RX-side-effects-Elle-Cordova-1080p.mp4'),
  require('../assets/reels/Alysa-Liu-edit-alysaliu-figureskating-edit-Inaraeditz-720p.mp4'),
  require('../assets/reels/I-feel-like-90-of-moves-are-invented-by-accident-gymnastics-sports-fails-fail-gymnast-ncaa-Ian-Gunther-1080p.mp4'),
  require('../assets/reels/One-of-my-faves-and-still-so-true-to-this-day-funnyshorts-laugh-comedy-dancing-millenials-Meaghan-Ranee-720p.mp4'),
];

const PLACEHOLDER = require('../assets/images/thumbnail-placeholder.png');

interface GameState {
  reels: BugReel[];
  friends: Friend[];
  checkpointPending: boolean;
  addReel: (reel: BugReel) => void;
  removeReel: (id: string) => void;
  nameReel: (id: string, name: string) => void;
  addFriend: (friend: Friend) => void;
  setCheckpoint: (val: boolean) => void;
}


export const useGameStore = create<GameState>((set) => ({
  reels: [
    {
      id: '1',
      name: 'controlled ant',
      thumbnail: PLACEHOLDER,
      videoUrl: require('../assets/reels/controlled_ant.mp4'),
      color: 'blue',
      caughtAt: Date.now() - 86400000,
    },
    {
      id: '2',
      name: 'gambling dog',
      thumbnail: PLACEHOLDER,
      videoUrl: require('../assets/reels/gambling_dog.mp4'),
      color: 'pink',
      caughtAt: Date.now() - 43200000,
    },
    {
      id: '3',
      name: 'slomo hamster',
      thumbnail: PLACEHOLDER,
      videoUrl: require('../assets/reels/slomo_hamster.mp4'),
      color: 'blue',
      caughtAt: Date.now() - 172800000,
    },
  ],
  friends: [
    {
      id: 'f1',
      username: 'OceanAngler99',
      reels: [
        { id: 'r-demo-1', name: 'Splashy', thumbnail: PLACEHOLDER, videoUrl: REEL_VIDEOS[0], color: 'blue', caughtAt: Date.now() - 86400000 },
        { id: 'r-demo-2', name: 'Bubblegum', thumbnail: PLACEHOLDER, videoUrl: REEL_VIDEOS[1], color: 'pink', caughtAt: Date.now() - 43200000 },
      ],
    },
    {
      id: 'f2',
      username: 'DeepSeaDiver',
      reels: [
        { id: 'r-demo-3', name: 'Cobalt', thumbnail: PLACEHOLDER, videoUrl: REEL_VIDEOS[2], color: 'blue', caughtAt: Date.now() - 172800000 },
      ],
    },
  ],
  checkpointPending: false,

  addReel: (reel) => set((state) => ({ reels: [...state.reels, reel] })),
  removeReel: (id) => set((state) => ({ reels: state.reels.filter((r) => r.id !== id) })),
  nameReel: (id, name) =>
    set((state) => ({
      reels: state.reels.map((r) => (r.id === id ? { ...r, name } : r)),
    })),
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
  setCheckpoint: (val) => set({ checkpointPending: val }),
}));
