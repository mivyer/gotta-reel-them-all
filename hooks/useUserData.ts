import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { DB } from "../services/firebase";
import { useGameStore } from "../store/useGameStore";

export const useUserData = (uid: string | null) => {
  const setInventory = useGameStore((s) => s.setInventory);
  const setUser = useGameStore((s) => s.setUser);

  useEffect(() => {
    if (!uid) return;

    const ref = doc(DB, "users", uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      setUser(data);
      setInventory(data.inventory || []);
    });

    return unsub;
  }, [uid]);
};