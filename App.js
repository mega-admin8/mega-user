// import React, { useState, useEffect, useRef } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { AppState } from 'react-native';
// import LoginScreen from "./src/LoginScreen";
// import RegisterScreen from "./src/RegisterScreen";
// import MainDrawer from "./src/MainDrawer";
// import MarketGameScreen from "./src/MarketGameScreen";
// import {
//   useFonts,
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
// } from "@expo-google-fonts/inter";
// import { ActivityIndicator, View } from "react-native";
// import { theme } from "./src/theme";
// import BidBoardScreen from "./src/BidBoardScreen";
// import AddFundsScreen from "./src/AddFundsScreen";
// import ManualFundsScreen from "./src/ManualFundsScreen";

// import * as Notifications from "expo-notifications";

// const Stack = createNativeStackNavigator();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [authView, setAuthView] = useState("login");
//   const [isCheckingSession, setIsCheckingSession] = useState(true); // 👈 1. ADDED: Session loading state

//   const appState = useRef(AppState.currentState);

//   let [fontsLoaded] = useFonts({
//     Inter_400Regular,
//     Inter_500Medium,
//     Inter_600SemiBold,
//     Inter_700Bold,
//   });

//   // 👈 2. ADDED: Check AsyncStorage on app startup
//   useEffect(() => {
//     const restoreSession = async () => {
//       try {
//         const storedUser = await AsyncStorage.getItem("userData");
//         const storedToken = await AsyncStorage.getItem("userToken");

//         if (storedUser && storedToken) {
//           setUserData(JSON.parse(storedUser));
//           setIsLoggedIn(true); // Automatically logs user in!
//         }
//       } catch (error) {
//         console.error("Failed to restore session from AsyncStorage:", error);
//       } finally {
//         setIsCheckingSession(false); // Stop loading spinner
//       }
//     };

//     restoreSession();
//   }, []);

//   // 👈 ADD THIS ENTIRE EFFECT
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', async (nextAppState) => {
//       // Check if app is moving from foreground to background
//       if (
//         appState.current.match(/active/) &&
//         (nextAppState === 'background' || nextAppState === 'inactive')
//       ) {
//         console.log('App minimized. Auto-logging out...');
//         try {
//           // Remove session data, but DO NOT remove "savedPhone"
//           await AsyncStorage.removeItem("userToken");
//           await AsyncStorage.removeItem("userData");
          
//           // Reset auth state to boot user back to LoginScreen
//           setUserData(null);
//           setIsLoggedIn(false);
//           setAuthView("login");
//         } catch (error) {
//           console.error("Error during auto-logout:", error);
//         }
//       }
//       appState.current = nextAppState;
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   useEffect(() => {
//     const subscription = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         const data = response.notification.request.content.data;

//         if (data?.type === "FUND_REQUEST") {
//           if (data.status === "REJECTED") {
//             console.log("User tapped on REJECTED notification");
//           }
//         }
//       }
//     );

//     return () => subscription.remove();
//   }, []);

//   // 👈 3. UPDATED: Wait for both fonts AND session check before rendering UI
//   if (!fontsLoaded || isCheckingSession) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: theme.colors.background,
//         }}
//       >
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
//     setUserData(updatedUser);
//     await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
//   };

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

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="RootDrawer">
//           {(props) => (
//             <MainDrawer
//               {...props}
//               user={userData}
//               onLogout={handleLogout}
//               onUserUpdate={handleUserUpdate}
//             />
//           )}
//         </Stack.Screen>

//         <Stack.Screen name="MarketGame" component={MarketGameScreen} />
//         <Stack.Screen name="BidBoard" component={BidBoardScreen} />
//         <Stack.Screen name="AddFundsScreen" component={AddFundsScreen} />
//         <Stack.Screen name="ManualFundsScreen" component={ManualFundsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }






import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, ActivityIndicator, View } from "react-native";
import LoginScreen from "./src/LoginScreen";
import RegisterScreen from "./src/RegisterScreen";
import MainDrawer from "./src/MainDrawer";
import MarketGameScreen from "./src/MarketGameScreen";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { theme } from "./src/theme";
import BidBoardScreen from "./src/BidBoardScreen";
import AddFundsScreen from "./src/AddFundsScreen";
import ManualFundsScreen from "./src/ManualFundsScreen";

import * as Notifications from "expo-notifications";

const Stack = createNativeStackNavigator();

// 5 Minutes timeout in milliseconds
const BACKGROUND_TIMEOUT = 5 * 60 * 1000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authView, setAuthView] = useState("login");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const appState = useRef(AppState.currentState);
  const backgroundTimestamp = useRef(null);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Restore session from AsyncStorage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        const storedToken = await AsyncStorage.getItem("userToken");

        if (storedUser && storedToken) {
          setUserData(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to restore session from AsyncStorage:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    restoreSession();
  }, []);

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

  // Auto-logout after 5 minutes in background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      // 1. Save timestamp when app enters background
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        backgroundTimestamp.current = Date.now();
      }

      // 2. When app returns to foreground, check elapsed background time
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (backgroundTimestamp.current) {
          const elapsedTime = Date.now() - backgroundTimestamp.current;

          if (elapsedTime >= BACKGROUND_TIMEOUT) {
            console.log("App was in background for >5 mins. Logging out...");
            await handleLogout();
          }
        }
        backgroundTimestamp.current = null;
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.type === "FUND_REQUEST") {
          if (data.status === "REJECTED") {
            console.log("User tapped on REJECTED notification");
          }
        }
      }
    );

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded || isCheckingSession) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
        onLoginSuccess={(user) => {
          setUserData(user);
          setIsLoggedIn(true);
        }}
        onNavigateToRegister={() => setAuthView("register")}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RootDrawer">
          {(props) => (
            <MainDrawer
              {...props}
              user={userData}
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MarketGame" component={MarketGameScreen} />
        <Stack.Screen name="BidBoard" component={BidBoardScreen} />
        <Stack.Screen name="AddFundsScreen" component={AddFundsScreen} />
        <Stack.Screen name="ManualFundsScreen" component={ManualFundsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}