// src/LoginScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Phone, Lock } from "lucide-react-native";
import api from "./api";
import { theme } from "./theme";
import Typography from "./components/Typography";

// 1. IMPORT THE NOTIFICATION HELPER
import { registerForPushNotificationsAsync } from "./utils/pushNotifications";

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }) {
  const [phone, setPhone] = useState("");
  const [mpin, setMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  // NEW EFFECT: Check for saved phone number on load
  useEffect(() => {
    const loadSavedPhone = async () => {
      try {
        const savedPhone = await AsyncStorage.getItem("savedPhone");
        if (savedPhone) {
          setPhone(savedPhone);
          setIsReturningUser(true);
        }
      } catch (error) {
        console.log("Error loading saved phone:", error);
      }
    };
    loadSavedPhone();
  }, []);

  const handleLogin = async () => {
    if (!phone || !mpin) {
      Alert.alert("Error", "Please enter Phone and M-PIN");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        phone_number: phone,
        mpin: mpin,
      });

      // Save token and user details to device storage
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response.data.user),
      );
      await AsyncStorage.setItem("savedPhone", phone);

      

      // 2. TRIGGER PUSH NOTIFICATION SETUP
      // We wrap this in a try-catch so that if the user denies permissions,
      // it won't crash the app and they can still log in normally.
      try {
        await registerForPushNotificationsAsync();
      } catch (pushError) {
        console.log(
          "Push notification registration skipped or failed:",
          pushError,
        );
      }

      setIsLoading(false);
      onLoginSuccess(response.data.user); // Tell the main app to change the screen
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.error || "Network Error";
      console.log(error);
      Alert.alert("Login Failed", errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.logoPlaceholder}>
          <Typography weight="700" style={styles.logoText}>
            M
          </Typography>
        </View>
        <Typography weight="700" style={styles.title}>
          Welcome to MegaPlay
        </Typography>
        <Typography style={styles.subtitle}>
          Enter your details to securely access your account.
        </Typography>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        {/* <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>
            Phone Number
          </Typography>
          <View style={styles.inputWrapper}>
            <Phone
              color={theme.colors.textMuted}
              size={20}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter 10-digit number"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View> */}


        {/* Conditional Phone Input Section */}
        {!isReturningUser ? (
          <View style={styles.inputGroup}>
            <Typography weight="600" style={styles.label}>
              Phone Number
            </Typography>
            <View style={styles.inputWrapper}>
              <Phone color={theme.colors.textMuted} size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter 10-digit number"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>
        ) : (
          <View style={styles.returningUserContainer}>
            <View style={styles.returningUserTextGroup}>
              <Phone color={theme.colors.primary} size={20} style={styles.icon} />
              <Typography weight="600" style={styles.returningUserText}>
                +91 {phone}
              </Typography>
            </View>
            <TouchableOpacity 
              onPress={() => {
                setIsReturningUser(false);
                setPhone("");
              }}
            >
              <Typography weight="600" style={styles.switchAccountText}>
                Switch Account
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Typography weight="600" style={styles.label}>
            Secure M-PIN
          </Typography>
          <View style={styles.inputWrapper}>
            <Lock
              color={theme.colors.textMuted}
              size={20}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={mpin}
              onChangeText={setMpin}
              placeholder="Enter 4-digit PIN"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!phone || !mpin) && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!phone || !mpin || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <Typography weight="600" style={styles.buttonText}>
              Secure Login
            </Typography>
          )}
        </TouchableOpacity>

        {/* Secondary Action */}
        <TouchableOpacity
          onPress={onNavigateToRegister}
          style={styles.secondaryAction}
          activeOpacity={0.6}
        >
          <Typography style={styles.secondaryText}>
            Don't have an account?{" "}
            <Typography weight="700" style={styles.linkText}>
              Register here
            </Typography>
          </Typography>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  headerContainer: { marginBottom: theme.spacing.xxl, alignItems: "center" },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.xl,
    backgroundColor: "#ff99a8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.m,
    ...theme.shadows.card,
  },
  logoText: { fontSize: 32, color: theme.colors.surface },
  title: { fontSize: 24, marginBottom: theme.spacing.xs, textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: "center",
    paddingHorizontal: theme.spacing.l,
  },
  formContainer: { width: "100%" },
  inputGroup: { marginBottom: theme.spacing.m },
  label: {
    fontSize: 12,
    marginBottom: theme.spacing.s,
    color: theme.colors.textDark,
    marginLeft: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    height: 52,
  },
  icon: { marginRight: theme.spacing.s },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textDark,
    fontFamily: "Inter_500Medium",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: theme.radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.l,
    ...theme.shadows.card,
  },
  buttonDisabled: { backgroundColor: theme.colors.border, shadowOpacity: 0 },
  buttonText: { color: theme.colors.surface, fontSize: 16 },
  secondaryAction: { marginTop: theme.spacing.xl, alignItems: "center" },
  secondaryText: { color: theme.colors.textMuted },
  linkText: { color: theme.colors.primary },
  // Add these inside your styles object:
  returningUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    height: 52,
    marginBottom: theme.spacing.m,
  },
  returningUserTextGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  returningUserText: {
    fontSize: 16,
    color: theme.colors.textDark,
  },
  switchAccountText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
});
