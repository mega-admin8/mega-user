// import React, { useState } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import LoginScreen from "./src/LoginScreen";
// import RegisterScreen from "./src/RegisterScreen";
// import MainTabs from "./src/MainTabs";
// import MainDrawer from "./src/MainDrawer";
// import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
// import { ActivityIndicator, View } from 'react-native';
// import { theme } from './src/theme';

// export default function App() {
//   let [fontsLoaded] = useFonts({
//     Inter_400Regular,
//     Inter_500Medium,
//     Inter_600SemiBold,
//     Inter_700Bold,
//   });

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [authView, setAuthView] = useState("login");

//   // Prevent app from rendering until fonts are ready
//   if (!fontsLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("userToken");
//       await AsyncStorage.removeItem("userData");
//       setUserData(null);
//       setIsLoggedIn(false);
//       setAuthView("login");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   const handleUserUpdate = async (updatedUser) => {
//     setUserData(updatedUser); // Update the live app state instantly
//     await AsyncStorage.setItem("userData", JSON.stringify(updatedUser)); // Save it to phone storage
//   };

//   // If the user is NOT logged in, show either Login or Register
//   if (!isLoggedIn) {
//     if (authView === "register") {
//       return <RegisterScreen onNavigateToLogin={() => setAuthView("login")} />;
//     }

//     return (
//       <LoginScreen
//         onLoginSuccess={(user) => {
//           setUserData(user);
//           setIsLoggedIn(true);
//         }}
//         onNavigateToRegister={() => setAuthView("register")}
//       />
//     );
//   }

//   // If they ARE logged in, show the main app
//   return (
//     <NavigationContainer>
//       <MainDrawer user={userData} onLogout={handleLogout} />
//     </NavigationContainer>
//   );
// }


import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Added Stack
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./src/LoginScreen";
import RegisterScreen from "./src/RegisterScreen";
import MainDrawer from "./src/MainDrawer";
import MarketGameScreen from "./src/MarketGameScreen"; // Added Game Screen
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';
import { theme } from './src/theme';
import BidBoardScreen from "./src/BidBoardScreen";
import AddFundsScreen from "./src/AddFundsScreen";
import ManualFundsScreen from "./src/ManualFundsScreen";

const Stack = createNativeStackNavigator(); // Initialize Stack

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authView, setAuthView] = useState("login");

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      setUserData(null);
      setIsLoggedIn(false);
      setAuthView("login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUserUpdate = async (updatedUser) => {
    setUserData(updatedUser); 
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser)); 
  };

  if (!isLoggedIn) {
    if (authView === "register") {
      return <RegisterScreen onNavigateToLogin={() => setAuthView("login")} />;
    }
    return (
      <LoginScreen
        onLoginSuccess={(user) => { setUserData(user); setIsLoggedIn(true); }}
        onNavigateToRegister={() => setAuthView("register")}
      />
    );
  }

  // Wrapped MainDrawer in the Stack
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RootDrawer">
          {(props) => <MainDrawer {...props} user={userData} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />}
        </Stack.Screen>
        
        {/* The new Market Game Screen */}
        <Stack.Screen name="MarketGame" component={MarketGameScreen} />
        <Stack.Screen name="BidBoard" component={BidBoardScreen} />
        <Stack.Screen name="AddFundsScreen" component={AddFundsScreen} />
        <Stack.Screen name="ManualFundsScreen" component={ManualFundsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}