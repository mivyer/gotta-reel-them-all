import { useLocalSearchParams } from 'expo-router';

export default function TradeScreen() {
  const { reelId, name } = useLocalSearchParams<{ reelId: string, name: string }>();
  // ...
}