import { create } from "zustand";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
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
  claimedCheckpoints: Set<number>;
  claimCheckpoint: (cp: number) => void;

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
  claimedCheckpoints: new Set<number>(),

  claimCheckpoint: (cp) =>
    set((state) => ({
      claimedCheckpoints: new Set(state.claimedCheckpoints).add(cp),
    })),

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
      claimedCheckpoints: new Set<number>(),  // ← add this
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

  addFriend: async (friend) => {
    const { friends, user: authUser } = get();
    if (!authUser?.uid) return;

    // Prevent duplicates locally
    if (friends.some((f) => f.uid === friend.uid)) return;

    // --- 1. Update current user ---
    const updated = [...friends, friend];
    set({ friends: updated });

    await setDoc(
      doc(DB, "users", authUser.uid),
      { friends: updated },
      { merge: true }
    );

    // --- 2. Update the OTHER user ---
    const friendRef = doc(DB, "users", friend.uid);
    const friendSnap = await getDoc(friendRef);

    let friendFriends: Friend[] = [];

    if (friendSnap.exists()) {
      friendFriends = friendSnap.data().friends || [];
    }

    const alreadyAdded = friendFriends.some(
      (f) => f.uid === authUser.uid
    );

    if (!alreadyAdded) {
      const updatedFriendFriends = [
        ...friendFriends,
        {
          uid: authUser.uid,
          username: authUser.username, // include whatever fields you store
        },
      ];

      await setDoc(
        friendRef,
        { friends: updatedFriendFriends },
        { merge: true }
      );
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