// src/MainTabs.js
import React from "react";
import { View, Text, Linking, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  ActivitySquare,
  BookText,
  Home,
  CircleDollarSign,
  MessageCircle,
} from "lucide-react-native";

import DashboardScreen from "./DashboardScreen";
import MyBidsScreen from "./MyBidsScreen";
import PassbookScreen from "./PassbookScreen";
import FundsScreen from './FundsScreen';

const Tab = createBottomTabNavigator();
const DummySupportScreen = () => null; // Never actually renders because we intercept the click

export default function MainTabs({ user, onLogout }) {
  // WhatsApp Redirect Function
  const openWhatsApp = () => {
    // Replace with your client's actual WhatsApp business number
    const phoneNumber = "+919876543210";
    const message = "Hello Support, I need help with MegaPlay.";
    Linking.openURL(
      `whatsapp://send?phone=${phoneNumber}&text=${message}`,
    ).catch(() => alert("Make sure WhatsApp is installed on your device."));
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // We have our own header in Dashboard
        tabBarActiveTintColor: "#6a0dad", // The purple color from your image
        tabBarInactiveTintColor: "#6c757d",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 10, // Shadow for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="My Bids"
        children={() => <MyBidsScreen user={user} />}
        options={{
          headerShown: true, // Show header if you want a title at the top
          title: "My Bids",
          tabBarIcon: ({ color }) => <BookText color={color} size={24} />,
        }}
      />

      <Tab.Screen
        name="Passbook"
        children={() => <PassbookScreen user={user} />}
        options={{
          headerShown: true,
          title: "Passbook",
          tabBarIcon: ({ color }) => <ActivitySquare color={color} size={24} />,
        }}
      />

      <Tab.Screen
        name="Home"
        // We pass the user data to Dashboard via children instead of component
        children={() => <DashboardScreen user={user} onLogout={onLogout} />}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={28} />,
        }}
      />

      <Tab.Screen
        name="Funds"
        children={(props) => <FundsScreen {...props} user={user} />}
        options={{
          headerShown: true,
          title: 'Manage Funds',
          tabBarIcon: ({ color }) => (
            <CircleDollarSign color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Support"
        component={DummySupportScreen}
        options={{
          tabBarIcon: () => <MessageCircle color="#25D366" size={28} />, // WhatsApp Green
          tabBarLabel: "Support",
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default action (navigating to a screen)
            e.preventDefault();
            // Open WhatsApp instead
            openWhatsApp();
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
