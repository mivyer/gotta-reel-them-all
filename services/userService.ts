import { DB } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Find a user by username
 */
export async function findUserByUsername(username: string) {
  const q = query(
    collection(DB, 'users'),
    where('username', '==', username.toLowerCase())
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  return {
    id: doc.id, 
    username: doc.data().username,
    friends: doc.data().friends || [],
  };
}