import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import {
  User,
  Phone,
  Lock,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ user, onUserUpdate }) {
  // 1. Create a local copy of the user for instant UI updates
  const [localUser, setLocalUser] = useState(user);

  const [name, setName] = useState(localUser?.full_name || "");
  const [oldMpin, setOldMpin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [isSecurityExpanded, setIsSecurityExpanded] = useState(false);

  // 2. Add loading states to prevent double-tapping
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // 3. Compare against localUser instead of the old user prop
  const isNameChanged =
    name.trim() !== "" && name.trim() !== (localUser?.full_name || "");
  const isMpinReady =
    oldMpin.length === 4 && newMpin.length === 4 && oldMpin !== newMpin;

  const handleUpdateName = async () => {
    if (isUpdatingName) return; // Prevent multiple taps
    setIsUpdatingName(true);

    try {
      // Step 1: Update the backend
      await api.put("/auth/update-name", {
        phone_number: localUser.phone_number,
        full_name: name.trim(),
      });

      // Step 2: Instantly update the local screen UI
      setLocalUser((prev) => ({ ...prev, full_name: name.trim() }));

      // Step 3: Directly update the phone's storage as a failsafe
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.full_name = name.trim();
          await AsyncStorage.setItem("userData", JSON.stringify(parsed));
        }
      } catch (storageErr) {
        console.error("Storage save failed:", storageErr);
      }

      // Step 4: Call global update if it exists
      if (onUserUpdate) {
        onUserUpdate({ ...localUser, full_name: name.trim() });
      }

      // Step 5: Show success alert LAST so crashes don't cause double alerts
      Alert.alert("Success", "Name updated successfully!");
    } catch (error) {
      // If the backend actually fails, grab the real error message
      const errorMsg =
        error.response?.data?.error || error.message || "Failed to update name";
      Alert.alert("Error", errorMsg);
    } finally {
      setIsUpdatingName(false); // Unlock the button
    }
  };

  const handleChangeMpin = async () => {
    try {
      await api.put("/auth/change-mpin", {
        phone_number: localUser.phone_number,
        old_mpin: oldMpin,
        new_mpin: newMpin,
      });

      Alert.alert("Success", "M-PIN changed successfully!");
      setOldMpin("");
      setNewMpin("");
      toggleSecurity();
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to change M-PIN";
      Alert.alert("Error", errorMsg);
    }
  };

  const toggleSecurity = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSecurityExpanded(!isSecurityExpanded);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Area - NOW USES localUser */}
        <View style={styles.headerArea}>
          <View style={styles.avatarPlaceholder}>
            <User color="#6a0dad" size={40} />
          </View>
          <Text style={styles.headerName}>
            {localUser?.full_name || "MegaPlay User"}
          </Text>
          <Text style={styles.headerPhone}>
            {localUser?.phone_number || "No phone"}
          </Text>
        </View>

        {/* --- MAIN CARD: PERSONAL DETAILS --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={styles.inputRow}>
            <Phone color="#888" size={20} style={styles.icon} />
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={localUser?.phone_number}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <User color="#6a0dad" size={20} style={styles.icon} />
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          {/* BUTTON WITH DISABLED STATE */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!isNameChanged || isUpdatingName) && styles.disabledButton,
            ]}
            onPress={handleUpdateName}
            disabled={!isNameChanged || isUpdatingName}
          >
            <Text
              style={[
                styles.primaryButtonText,
                (!isNameChanged || isUpdatingName) && styles.disabledButtonText,
              ]}
            >
              {isUpdatingName ? "Updating..." : "Update Name"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- EXPANDABLE CARD: SECURITY --- */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={toggleSecurity}
            activeOpacity={0.7}
          >
            <View style={styles.accordionLeft}>
              <Lock color={isSecurityExpanded ? "#d9534f" : "#555"} size={22} />
              <Text
                style={[
                  styles.sectionTitle,
                  { marginBottom: 0, marginLeft: 12 },
                ]}
              >
                Change M-PIN
              </Text>
            </View>
            {isSecurityExpanded ? (
              <ChevronUp color="#888" size={24} />
            ) : (
              <ChevronDown color="#888" size={24} />
            )}
          </TouchableOpacity>

          {isSecurityExpanded && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />

              <View style={styles.inputRow}>
                <KeyRound color="#888" size={20} style={styles.icon} />
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Old M-PIN</Text>
                  <TextInput
                    style={styles.input}
                    value={oldMpin}
                    onChangeText={setOldMpin}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                    placeholder="Current 4-digit M-PIN"
                    placeholderTextColor="#aaa"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputRow}>
                <KeyRound color="#d9534f" size={20} style={styles.icon} />
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>New M-PIN</Text>
                  <TextInput
                    style={styles.input}
                    value={newMpin}
                    onChangeText={setNewMpin}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                    placeholder="New 4-digit M-PIN"
                    placeholderTextColor="#aaa"
                  />
                </View>
              </View>

              {/* M-PIN BUTTON WITH DISABLED STATE */}
              <TouchableOpacity
                style={[
                  styles.dangerButton,
                  !isMpinReady && styles.disabledGhostButton,
                ]}
                onPress={handleChangeMpin}
                disabled={!isMpinReady}
              >
                <Text
                  style={[
                    styles.dangerButtonText,
                    !isMpinReady && styles.disabledGhostButtonText,
                  ]}
                >
                  Save M-PIN
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f5f8" }, // Softer, textured-looking background
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Header
  headerArea: { alignItems: "center", marginTop: 20, marginBottom: 30 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ebdcf5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#6a0dad",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerName: { fontSize: 22, fontWeight: "700", color: "#333" },
  headerPhone: { fontSize: 14, color: "#777", marginTop: 4 },

  // Cards
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 20,
  },

  // Input Rows (Borderless design)
  inputRow: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  icon: { width: 30, textAlign: "center", marginRight: 10 },
  inputWrapper: { flex: 1 },
  label: { fontSize: 12, color: "#888", fontWeight: "500", marginBottom: 2 },
  input: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  readOnlyInput: { color: "#999" },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
    marginLeft: 40,
  }, // Offset divider to align with text

  // Accordion
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionLeft: { flexDirection: "row", alignItems: "center" },
  expandedContent: { marginTop: 5 },

  // Buttons
  primaryButton: {
    backgroundColor: "#6a0dad",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  dangerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9534f",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  dangerButtonText: {
    color: "#d9534f",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  disabledButton: {
    backgroundColor: "#e0e0e0",
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledButtonText: { color: "#a0a0a0" },
  disabledGhostButton: { borderColor: "#e0e0e0", backgroundColor: "#fafafa" },
  disabledGhostButtonText: { color: "#a0a0a0" },
});
