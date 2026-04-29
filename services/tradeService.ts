import { DB } from './firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export interface IncomingSlot {
  reelId: string;
  reelName: string;
}

export async function sendReelToFriend(
  senderUid: string,
  receiverUid: string,
  reelId: string,
  reelName: string
): Promise<void> {
  const receiverDoc = await getDoc(doc(DB, 'users', receiverUid));
  if (!receiverDoc.exists()) throw new Error('Receiver not found');

  const receiverFriends: { uid: string }[] = receiverDoc.data().friends || [];
  const senderIndex = receiverFriends.findIndex((f) => f.uid === senderUid);

  if (senderIndex === -1) throw new Error('You are not in this user\'s friends list');

  await updateDoc(doc(DB, 'users', receiverUid), {
    [`incoming.${senderIndex}`]: { reelId, reelName },
  });
}

export async function acceptIncoming(
  receiverUid: string,
  friendIndex: number,
  reelId: string,
  reelName: string,
  currentInventory: { reelId: string; name: string }[]
): Promise<void> {
  const newInventory = [...currentInventory, { reelId, name: reelName }];
  await updateDoc(doc(DB, 'users', receiverUid), {
    [`incoming.${friendIndex}`]: null,
    inventory: newInventory,
  });
}

export async function declineIncoming(
  receiverUid: string,
  friendIndex: number
): Promise<void> {
  await updateDoc(doc(DB, 'users', receiverUid), {
    [`incoming.${friendIndex}`]: null,
  });
}
