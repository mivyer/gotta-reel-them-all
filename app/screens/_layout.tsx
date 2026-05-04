// import { Tabs } from 'expo-router';
// import { Text } from 'react-native';

// function TabLabel({ label, focused }: { label: string; focused: boolean }) {
//   return (
//     <Text style={{
//       fontFamily: 'Agdasima',
//       fontSize: 13,
//       color: focused ? '#000000' : '#a7a7a7',
//     }}>
//       {label}
//     </Text>
//   );
// }

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarStyle: {
//           backgroundColor: '#ffffff',
//           borderTopColor: '#e8e8e8',
//           borderTopWidth: 1,
//           height: 60,
//           paddingBottom: 8,
//         },
//         tabBarActiveTintColor: '#000000',
//         tabBarInactiveTintColor: '#a7a7a7',
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
//         }}
//       />
//       <Tabs.Screen
//         name="inventory"
//         options={{
//           title: 'Inventory',
//           tabBarLabel: ({ focused }) => <TabLabel label="Inventory" focused={focused} />,
//         }}
//       />
//       <Tabs.Screen
//         name="friends"
//         options={{
//           title: 'Friends',
//           tabBarLabel: ({ focused }) => <TabLabel label="Friends" focused={focused} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
//         }}
//       />
//     </Tabs>
//   );
// }

import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{
      fontFamily: 'Agdasima',
      fontSize: 13,
      color: focused ? '#000000' : '#a7a7a7',
    }}>
      {label}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e8e8e8',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#a7a7a7',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={22} color={color} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Inventory" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={22} color={color} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Friends" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={22} color={color} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}