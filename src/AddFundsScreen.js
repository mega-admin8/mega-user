import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { ArrowLeft, Wallet } from "lucide-react-native";
import Typography from "./components/Typography";
import api from "./api";

const PRIMARY_COLOR = "#6200EA";
const PRIMARY_LIGHT = "#F3E8FF";

const QUICK_AMOUNTS = ["300", "500", "2000", "10000", "50000", "100000"];

export default function AddFundsScreen({ navigation }) {
  const [walletBalance, setWalletBalance] = useState("...");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live balance
  useFocusEffect(
    useCallback(() => {
      const fetchLiveBalance = async () => {
        try {
          const response = await api.get("/auth/me");
          setWalletBalance(response.data.wallet_balance);
        } catch (err) {
          setWalletBalance("Error");
        }
      };
      fetchLiveBalance();
    }, []),
  );

  // Function to trigger the WhatsApp Alert
  const handleManualFund = (actionType) => {
    Alert.alert(
      `${actionType} Funds`,
      `To ${actionType.toLowerCase()} funds securely, please contact our support team directly on WhatsApp.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open WhatsApp",
          // You can replace the phone number below with your actual company WhatsApp number!
          onPress: () =>
            Linking.openURL(
              "whatsapp://send?text=Hello MegaPlay Support, I want to " +
                actionType.toLowerCase() +
                " my funds.",
            ).catch(() =>
              Alert.alert(
                "Error",
                "Make sure WhatsApp is installed on your phone.",
              ),
            ),
        },
      ],
    );
  };

  const handleAmountChange = (val) => {
    // Only allow numbers
    const cleanVal = val.replace(/[^0-9]/g, "");
    setAmount(cleanVal);
    if (error) setError("");
  };

  const selectQuickAmount = (val) => {
    setAmount(val);
    if (error) setError("");
  };

  const handleAddFunds = async () => {
    if (!amount) {
      setError("Please enter amount");
      return;
    }

    const numAmount = parseInt(amount, 10);
    if (numAmount < 100) {
      setError("Minimum deposit amount is ₹ 100");
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace this endpoint with your actual payment gateway or deposit request endpoint
      // await api.post('/wallet/add-funds', { amount: numAmount });

      // Simulating network request
      setTimeout(() => {
        Alert.alert("Success", `Request to add ₹ ${numAmount} initiated.`);
        setAmount("");
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Failed to initiate deposit.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Typography weight="700" style={styles.headerTitle}>
          Add Funds
        </Typography>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* CURRENT BALANCE SECTION */}
          <View style={styles.balanceSection}>
            <Typography weight="600" style={styles.balanceLabel}>
              Current Balance
            </Typography>
            <View style={styles.balanceCircleOuter}>
              <View style={styles.balanceCircleInner}>
                <Wallet color={PRIMARY_COLOR} size={36} />
              </View>
              <Typography weight="700" style={styles.balanceAmount}>
                ₹ {walletBalance}
              </Typography>
            </View>
          </View>

          {/* INPUT SECTION */}
          <View style={styles.inputSection}>
            <Typography weight="600" style={styles.inputLabel}>
              Enter Amount to Deposit
            </Typography>

            <View
              style={[
                styles.inputWrapper,
                error ? styles.inputWrapperError : null,
              ]}
            >
              <Typography weight="700" style={styles.currencySymbol}>
                ₹
              </Typography>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="Enter Amount"
                placeholderTextColor="#9CA3AF"
                maxLength={7}
              />
            </View>
            {error ? (
              <Typography style={styles.errorText}>{error}</Typography>
            ) : null}
          </View>

          {/* QUICK AMOUNTS GRID */}
          <View style={styles.quickAmountGrid}>
            {QUICK_AMOUNTS.map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.quickAmountBtn,
                  amount === val && styles.quickAmountBtnActive,
                ]}
                onPress={() => selectQuickAmount(val)}
              >
                <Typography
                  weight="600"
                  style={[
                    styles.quickAmountText,
                    amount === val && styles.quickAmountTextActive,
                  ]}
                >
                  ₹ {val}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>

          {/* MAIN ACTION BUTTON */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            // onPress={handleAddFunds}
            onPress={() => handleManualFund("Add")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography weight="700" style={styles.submitBtnText}>
                ADD FUNDS
              </Typography>
            )}
          </TouchableOpacity>

          {/* MANUAL DEPOSIT LINK */}
          <TouchableOpacity
            style={styles.manualDepositBtn}
            // onPress={() => handleManualFund("Add")}
            onPress={() => navigation.navigate("ManualFundsScreen")}
          >
            <Typography style={styles.manualDepositText}>
              Manual Deposit
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, color: "#fff", letterSpacing: 0.5 },

  scrollContent: {
    padding: 24,
    alignItems: "center",
  },

  // Balance Display
  balanceSection: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    marginBottom: 20,
  },
  balanceCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  balanceCircleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  balanceAmount: {
    fontSize: 22,
    color: "#F59E0B", // Amber color similar to reference
  },

  // Input
  inputSection: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
  },
  inputWrapperError: {
    borderColor: "#EF4444",
  },
  currencySymbol: {
    fontSize: 20,
    color: "#333",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    height: "100%",
    fontWeight: "600",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },

  // Grid
  quickAmountGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  quickAmountBtn: {
    width: "31%", // Fits 3 in a row
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickAmountBtnActive: {
    backgroundColor: PRIMARY_LIGHT,
    borderColor: PRIMARY_COLOR,
  },
  quickAmountText: {
    fontSize: 14,
    color: "#333",
  },
  quickAmountTextActive: {
    color: PRIMARY_COLOR,
  },

  // Submit Button
  submitBtn: {
    width: "100%",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 1,
  },

  // Manual Deposit
  manualDepositBtn: {
    padding: 10,
  },
  manualDepositText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
