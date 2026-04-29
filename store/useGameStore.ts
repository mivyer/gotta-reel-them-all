import { create } from "zustand";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { DB } from "../services/firebase";
import { IncomingSlot } from "../services/tradeService";

const saveToFirestore = (uid: string, data: Partial<{ inventory: InventoryItem[]; friends: Friend[] }>) => {
  updateDoc(doc(DB, "users", uid), data).catch((e) => console.log("Firestore save error:", e));
};

/**
 * ------------------------
 * TYPES
 * ------------------------
 */

export type InventoryItem = {
  reelId: string;
  name: string;
};

export type { IncomingSlot };

export interface Friend {
  uid: string;
  username: string;
}

interface UserData {
  uid: string;
  username: string;
}

// incoming map: key = friend index (as string), value = slot or null
export type IncomingMap = Record<string, IncomingSlot | null>;

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
  incoming: IncomingMap;
  steps: number;

  checkpointPending: boolean;

  // ------------------------
  // AUTH
  // ------------------------
  setAuthUser: (user: any) => void;
  setUser: (user: UserData) => void;
  clearUser: () => void;

  // ------------------------
  // INVENTORY
  // ------------------------
  setInventory: (inv: InventoryItem[]) => void;
  addReel: (reelId: string) => void;
  releaseReel: (reelId: string) => void;
  renameReel: (reelId: string, name: string) => void;

  // ------------------------
  // FRIENDS
  // ------------------------
  setFriends: (friends: Friend[]) => void;
  addFriend: (friend: Friend) => void;
  addFriendByUsername: (username: string) => Promise<void>;

  // ------------------------
  // INCOMING
  // ------------------------
  setIncoming: (incoming: IncomingMap) => void;

  // ------------------------
  // STEPS
  // ------------------------
  setSteps: (steps: number) => void;
  incrementSteps: (amount: number) => void;

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
      incoming: {},
      steps: 0,
      checkpointPending: false,
    }),

  // ------------------------
  // INVENTORY
  // ------------------------
  inventory: [],

  setInventory: (inv) => set({ inventory: inv }),

  addReel: (reelId) => {
    const { inventory, user: authUser } = get();
    if (inventory.some((r) => r.reelId === reelId)) return;
    const updated = [...inventory, { reelId, name: "Unnamed Reel" }];
    set({ inventory: updated });
    if (authUser?.uid) saveToFirestore(authUser.uid, { inventory: updated });
  },

  releaseReel: (reelId) => {
    const { inventory, user: authUser } = get();
    const updated = inventory.filter((r) => r.reelId !== reelId);
    set({ inventory: updated });
    if (authUser?.uid) saveToFirestore(authUser.uid, { inventory: updated });
  },

  renameReel: (reelId, name) => {
    const { inventory, user: authUser } = get();
    const updated = inventory.map((r) => r.reelId === reelId ? { ...r, name } : r);
    set({ inventory: updated });
    if (authUser?.uid) saveToFirestore(authUser.uid, { inventory: updated });
  },

  // ------------------------
  // FRIENDS
  // ------------------------
  friends: [],

  setFriends: (friends) => set({ friends }),

  addFriend: (friend) => {
    const { friends, user: authUser } = get();
    if (friends.some((f) => f.uid === friend.uid)) return;
    const updated = [...friends, friend];
    set({ friends: updated });
    if (authUser?.uid) saveToFirestore(authUser.uid, { friends: updated });
  },

  addFriendByUsername: async (username: string) => {
    try {
      const normalized = username.toLowerCase().trim();

      const snap = await getDoc(doc(DB, "usernames", normalized));

      if (!snap.exists()) {
        console.log("User not found");
        return;
      }

      const uid = snap.data().uid;

      const userSnap = await getDoc(doc(DB, "users", uid));

      if (!userSnap.exists()) return;

      const data = userSnap.data();

      const { friends, user: authUser } = get();
      if (friends.some((f) => f.uid === uid)) return;
      const updated = [...friends, { uid, username: data.username }];
      set({ friends: updated });
      if (authUser?.uid) saveToFirestore(authUser.uid, { friends: updated });
    } catch (err) {
      console.log("addFriendByUsername error:", err);
    }
  },

  // ------------------------
  // INCOMING
  // ------------------------
  incoming: {},

  setIncoming: (incoming) => set({ incoming }),

  // ------------------------
  // STEPS
  // ------------------------
  steps: 0,

  setSteps: (steps) => set({ steps }),

  incrementSteps: (amount) =>
    set((state) => ({
      steps: state.steps + amount,
    })),

  // ------------------------
  // GAME STATE
  // ------------------------
  checkpointPending: false,

  setCheckpoint: (val) => set({ checkpointPending: val }),
}));
