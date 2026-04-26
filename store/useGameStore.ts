import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { DB } from "../services/firebase";

/**
 * ------------------------
 * TYPES
 * ------------------------
 */

export type InventoryItem = {
  reelId: string;
  name: string;    // user-defined name
};

export interface Friend {
  uid: string;
  username: string;
}

interface UserData {
  uid: string;
  username: string;
}

/**
 * ------------------------
 * STATE
 * ------------------------
 */

interface GameState {
  // auth
  authUser: any | null;
  user: UserData | null;

  // core game data
  inventory: InventoryItem[];
  friends: Friend[];

  checkpointPending: boolean;

  // ------------------------
  // AUTH
  // ------------------------
  setAuthUser: (user: any) => void;
  setUser: (user: UserData) => void;
  clearUser: () => void;

  // ------------------------
  // INVENTORY (REELS)
  // ------------------------
  setInventory: (inv: InventoryItem[]) => void;

  addReel: (reelId: string) => void;
  releaseReel: (reelId: string) => void;
  renameReel: (reelId: string, name: string) => void;

  // ------------------------
  // FRIENDS
  // ------------------------
  addFriend: (friend: Friend) => void;

  addFriendByUsername: (username: string) => Promise<void>;

  // ------------------------
  // UI / GAME STATE
  // ------------------------
  setCheckpoint: (val: boolean) => void;
}

/**
 * ------------------------
 * STORE
 * ------------------------
 */

export const useGameStore = create<GameState>((set, get) => ({
  // ------------------------
  // AUTH
  // ------------------------
  authUser: null,
  user: null,

  setAuthUser: (user) => set({ authUser: user }),

  setUser: (user) => set({ user }),

  clearUser: () =>
    set({
      authUser: null,
      user: null,
      inventory: [],
      friends: [],
      checkpointPending: false,
    }),

  // ------------------------
  // INVENTORY
  // ------------------------
  inventory: [],

  setInventory: (inv) => set({ inventory: inv }),

  addReel: (reelId) => {
    const current = get().inventory;

    if (current.some((r) => r.reelId === reelId)) return;

    set({
      inventory: [
        ...current,
        {
          reelId,
          name: "Unnamed Reel",
        },
      ],
    });
  },

  releaseReel: (reelId) => {
    set((state) => ({
      inventory: state.inventory.filter((r) => r.reelId !== reelId),
    }));
  },

  renameReel: (reelId, name) => {
    set((state) => ({
      inventory: state.inventory.map((r) =>
        r.reelId === reelId ? { ...r, name } : r
      ),
    }));
  },

  // ------------------------
  // FRIENDS (LOCAL STATE)
  // ------------------------
  friends: [],

  addFriend: (friend) =>
    set((state) => {
      // prevent duplicates
      const exists = state.friends.some((f) => f.uid === friend.uid);
      if (exists) return state;

      return {
        friends: [...state.friends, friend],
      };
    }),

  /**
   *  search + add friend by username
   */
  addFriendByUsername: async (username: string) => {
    try {
      // 1. lookup username → uid
      const snap = await getDoc(doc(DB, "usernames", username));

      if (!snap.exists()) {
        console.log("User not found");
        return;
      }

      const uid = snap.data().uid;

      // 2. fetch user profile
      const userSnap = await getDoc(doc(DB, "users", uid));

      if (!userSnap.exists()) return;

      const data = userSnap.data();

      // 3. add to store
      set((state) => {
        const alreadyFriend = state.friends.some((f) => f.uid === uid);
        if (alreadyFriend) return state;

        return {
          friends: [
            ...state.friends,
            {
              uid,
              username: data.username,
            },
          ],
        };
      });
    } catch (err) {
      console.log("addFriendByUsername error:", err);
    }
  },

  // ------------------------
  // GAME STATE
  // ------------------------
  checkpointPending: false,

  setCheckpoint: (val) => set({ checkpointPending: val }),
}));