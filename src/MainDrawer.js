// import React from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
// } from "@react-navigation/drawer";
// import { User, FileText, LogOut, Phone, Home, TrendingUp, Trophy } from "lucide-react-native";
// import MainTabs from "./MainTabs";
// import ProfileScreen from "./ProfileScreen";
// import GameRatesScreen from './GameRatesScreen';
// import TermsScreen from './TermsScreen';
// import WinHistoryScreen from './WinHistoryScreen';

// const Drawer = createDrawerNavigator();

// // --- 1. Custom Sidebar Layout ---
// function CustomDrawerContent(props) {
//   // Grab user data and logout function passed from App.js
//   const { user, onLogout } = props;

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Purple Header matching your screenshot */}
//       <View style={styles.drawerHeader}>
//         <View style={styles.avatarPlaceholder}>
//           <User color="#6a0dad" size={32} />
//         </View>
//         <View style={styles.userInfo}>
//           {/* Display the new full_name and phone */}
//           <Text style={styles.userName}>
//             {user?.full_name || "MegaPlay User"}
//           </Text>
//           <Text style={styles.userPhone}>
//             {user?.phone_number || "No phone"}
//           </Text>
//         </View>
//       </View>

//       <DrawerContentScrollView
//         {...props}
//         contentContainerStyle={{ paddingTop: 10 }}
//       >
//         {/* Renders standard navigation items */}
//         <DrawerItemList {...props} />
//       </DrawerContentScrollView>

//       {/* Logout Button moved to bottom of sidebar */}
//       <View style={styles.drawerFooter}>
//         <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
//           <LogOut color="#d9534f" size={24} style={{ marginRight: 15 }} />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // --- 2. Drawer Navigator Wrapper ---
// export default function MainDrawer({ user, onLogout, onUserUpdate }) {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => (
//         <CustomDrawerContent {...props} user={user} onLogout={onLogout} />
//       )}
//       screenOptions={{
//         headerShown: false, // Hide default header
//         drawerActiveBackgroundColor: "#f0f0f0",
//         drawerActiveTintColor: "#6a0dad",
//       }}
//     >
//       {/* The main app content (Tabs) is the first screen in the drawer */}
//       <Drawer.Screen
//         name="Dashboard Area"
//         options={{
//           title: "Home",
//           drawerIcon: ({ color }) => <Phone color={color} size={24} />,
//         }}
//       >
//         {() => <MainTabs user={user} />}
//       </Drawer.Screen>

//       {/* Profile Screen Tab */}
//       <Drawer.Screen
//         name="My Profile"
//         options={{
//           title: "My Profile",
//           drawerIcon: ({ color }) => <User color={color} size={24} />,
//           headerShown: true, // Show the default header so they can click 'back' easily
//           headerTitle: "Edit Profile",
//         }}
//       >
//         {() => <ProfileScreen user={user} onUserUpdate={onUserUpdate} />}
//       </Drawer.Screen>

//       {/* NEW: Game Rates Screen */}
//       <Drawer.Screen 
//         name="Game Rates" 
//         options={{ 
//             title: 'Game Rates', 
//             drawerIcon: ({ color }) => <TrendingUp color={color} size={24} />,
//             headerShown: true, // Shows the top header with the back/hamburger button
//         }}
//       >
//         {() => <GameRatesScreen />} 
//       </Drawer.Screen>

//       {/* NEW: Win History Tab */}
//       <Drawer.Screen 
//         name="Win History" 
//         options={{ 
//             title: 'Win History', 
//             drawerIcon: ({ color }) => <Trophy color={color} size={24} />,
//             headerShown: true,
//         }}
//       >
//         {() => <WinHistoryScreen />} 
//       </Drawer.Screen>

//       {/* NEW: Terms & Conditions Screen */}
//       <Drawer.Screen 
//         name="Terms & Conditions" 
//         options={{ 
//             title: 'Terms & Conditions', 
//             drawerIcon: ({ color }) => <FileText color={color} size={24} />,
//             headerShown: true, 
//         }}
//       >
//         {() => <TermsScreen />} 
//       </Drawer.Screen>

//     </Drawer.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   drawerHeader: {
//     backgroundColor: "#4a0e4e",
//     padding: 20,
//     paddingTop: 50,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatarPlaceholder: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#ffca28",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 15,
//   },
//   userName: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   userPhone: { color: "#fff", fontSize: 14, opacity: 0.8 },
//   drawerFooter: { padding: 20, borderTopWidth: 1, borderTopColor: "#eee" },
//   logoutButton: { flexDirection: "row", alignItems: "center" },
//   logoutText: { fontSize: 16, color: "#d9534f", fontWeight: "bold" },
//   customDrawerItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   customItemText: { fontSize: 14, color: "#333", fontWeight: "500" },
// });



import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  User,
  FileText,
  LogOut,
  Phone,
  TrendingUp,
  Trophy,
  Share2,
} from "lucide-react-native";
import MainTabs from "./MainTabs";
import ProfileScreen from "./ProfileScreen";
import GameRatesScreen from "./GameRatesScreen";
import TermsScreen from "./TermsScreen";
import WinHistoryScreen from "./WinHistoryScreen";
import api from './api';

const Drawer = createDrawerNavigator();

// --- 1. Custom Sidebar Layout ---
function CustomDrawerContent(props) {
  const { user, onLogout } = props;

  // Function to handle native device sharing
  const handleShareApp = async () => {
    try {
      let shareUrl = "https://your-domain.com/download"; // Fallback URL

    // Fetch settings from your backend
    const response = await api.get('/admin/settings');
    if (response.data?.share_url) {
      shareUrl = response.data.share_url;
    }

      await Share.share({
        message: `🎮 Join me on MegaPlay! Download the app: ${shareUrl}`,
      });
    } catch (error) {
      console.error("Error sharing app:", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Purple Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatarPlaceholder}>
          <User color="#6a0dad" size={32} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.full_name || "MegaPlay User"}
          </Text>
          <Text style={styles.userPhone}>
            {user?.phone_number || "No phone"}
          </Text>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        {/* Renders standard navigation items */}
        <DrawerItemList {...props} />

        {/* --- SHARE APP BUTTON --- */}
        <DrawerItem
          label="Share App"
          icon={({ color }) => <Share2 color={color} size={24} />}
          onPress={handleShareApp}
          inactiveTintColor="#333"
          labelStyle={{ fontSize: 14, fontWeight: "500" }}
        />
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <LogOut color="#d9534f" size={24} style={{ marginRight: 15 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- 2. Drawer Navigator Wrapper ---
export default function MainDrawer({ user, onLogout, onUserUpdate }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} user={user} onLogout={onLogout} />
      )}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#f0f0f0",
        drawerActiveTintColor: "#6a0dad",
      }}
    >
      <Drawer.Screen
        name="Dashboard Area"
        options={{
          title: "Home",
          drawerIcon: ({ color }) => <Phone color={color} size={24} />,
        }}
      >
        {() => <MainTabs user={user} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="My Profile"
        options={{
          title: "My Profile",
          drawerIcon: ({ color }) => <User color={color} size={24} />,
          headerShown: true,
          headerTitle: "Edit Profile",
        }}
      >
        {() => <ProfileScreen user={user} onUserUpdate={onUserUpdate} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Game Rates"
        options={{
          title: "Game Rates",
          drawerIcon: ({ color }) => <TrendingUp color={color} size={24} />,
          headerShown: true,
        }}
      >
        {() => <GameRatesScreen />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Win History"
        options={{
          title: "Win History",
          drawerIcon: ({ color }) => <Trophy color={color} size={24} />,
          headerShown: true,
        }}
      >
        {() => <WinHistoryScreen />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Terms & Conditions"
        options={{
          title: "Terms & Conditions",
          drawerIcon: ({ color }) => <FileText color={color} size={24} />,
          headerShown: true,
        }}
      >
        {() => <TermsScreen />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: "#4a0e4e",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffca28",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userPhone: { color: "#fff", fontSize: 14, opacity: 0.8 },
  drawerFooter: { padding: 20, borderTopWidth: 1, borderTopColor: "#eee" },
  logoutButton: { flexDirection: "row", alignItems: "center" },
  logoutText: { fontSize: 16, color: "#d9534f", fontWeight: "bold" },
});