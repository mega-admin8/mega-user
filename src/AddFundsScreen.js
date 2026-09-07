import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { ArrowLeft, Wallet, Hash } from "lucide-react-native";
import Typography from "./components/Typography";
import api from "./api";

const PRIMARY_COLOR = "#6200EA";
const PRIMARY_LIGHT = "#F3E8FF";

const QUICK_AMOUNTS = ["300", "500", "2000", "10000", "50000", "100000"];

export default function AddFundsScreen({ navigation }) {
  const [walletBalance, setWalletBalance] = useState("...");
  const [amount, setAmount] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [amountError, setAmountError] = useState("");
  const [utrError, setUtrError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLiveBalance = async () => {
    try {
      const response = await api.get("/auth/me");
      setWalletBalance(response.data.wallet_balance);
    } catch (err) {
      setWalletBalance("Error");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLiveBalance();
    }, []),
  );

  const handleAmountChange = (val) => {
    const cleanVal = val.replace(/[^0-9]/g, "");
    setAmount(cleanVal);
    if (amountError) setAmountError("");
  };

  const handleUtrChange = (val) => {
    const cleanVal = val.replace(/[^a-zA-Z0-9]/g, "");
    setUtrNumber(cleanVal);
    if (utrError) setUtrError("");
  };

  const selectQuickAmount = (val) => {
    setAmount(val);
    if (amountError) setAmountError("");
  };

  const handleAddFunds = async () => {
    let hasError = false;

    if (!amount) {
      setAmountError("Please enter amount");
      hasError = true;
    } else if (parseInt(amount, 10) < 100) {
      setAmountError("Minimum deposit amount is ₹ 100");
      hasError = true;
    }

    if (!utrNumber) {
      setUtrError("Please enter the 12-digit UTR number");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/funds/request', { 
        amount: parseInt(amount, 10),
        utr_number: utrNumber 
      });

      Alert.alert("Success", response.data?.message || "Fund request submitted!");
      setAmount("");
      setUtrNumber("");
      await fetchLiveBalance();
    } catch (err) {
      console.error("Deposit submission failed:", err);
      Alert.alert(
        "Submission Error",
        err.response?.data?.error || "Failed to submit request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Typography weight="700" style={styles.headerTitle}>
          Add Funds
        </Typography>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* CURRENT BALANCE SECTION */}
          <View style={styles.balanceSection}>
            <Typography weight="600" style={styles.balanceLabel}>Current Balance</Typography>
            <View style={styles.balanceCircleOuter}>
              <View style={styles.balanceCircleInner}>
                <Wallet color={PRIMARY_COLOR} size={36} />
              </View>
              <Typography weight="700" style={styles.balanceAmount}>₹ {walletBalance}</Typography>
            </View>
          </View>

          {/* AMOUNT INPUT SECTION */}
          <View style={styles.inputSection}>
            <Typography weight="600" style={styles.inputLabel}>Enter Amount to Deposit</Typography>
            <View style={[styles.inputWrapper, amountError ? styles.inputWrapperError : null]}>
              <Typography weight="700" style={styles.currencySymbol}>₹</Typography>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="Enter Amount"
                placeholderTextColor="#9CA3AF"
                maxLength={7}
                editable={!isSubmitting}
              />
            </View>
            {amountError ? <Typography style={styles.errorText}>{amountError}</Typography> : null}
          </View>

          {/* QUICK AMOUNTS GRID */}
          <View style={styles.quickAmountGrid}>
            {QUICK_AMOUNTS.map((val) => (
              <TouchableOpacity
                key={val}
                disabled={isSubmitting}
                style={[styles.quickAmountBtn, amount === val && styles.quickAmountBtnActive]}
                onPress={() => selectQuickAmount(val)}
              >
                <Typography weight="600" style={[styles.quickAmountText, amount === val && styles.quickAmountTextActive]}>
                  ₹ {val}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>

          {/* UTR NUMBER INPUT SECTION */}
          <View style={styles.inputSection}>
            <Typography weight="600" style={styles.inputLabel}>Transaction UTR / Ref Number</Typography>
            <View style={[styles.inputWrapper, utrError ? styles.inputWrapperError : null]}>
              <Hash color="#9CA3AF" size={20} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                keyboardType="default"
                value={utrNumber}
                onChangeText={handleUtrChange}
                placeholder="Enter 12-Digit UTR Number"
                placeholderTextColor="#9CA3AF"
                maxLength={20}
                editable={!isSubmitting}
                autoCapitalize="characters"
              />
            </View>
            {utrError ? <Typography style={styles.errorText}>{utrError}</Typography> : null}
          </View>

          {/* MAIN ACTION BUTTON */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleAddFunds}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography weight="700" style={styles.submitBtnText}>SUBMIT DEPOSIT REQUEST</Typography>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manualDepositBtn}
            disabled={isSubmitting}
            onPress={() => navigation.navigate("ManualFundsScreen")}
          >
            <Typography style={styles.manualDepositText}>View Alternate Payment Methods</Typography>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
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
  scrollContent: { padding: 24, alignItems: "center", width: "100%" },
  balanceSection: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  balanceLabel: { fontSize: 16, color: PRIMARY_COLOR, marginBottom: 15 },
  balanceCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
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
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  balanceAmount: { fontSize: 20, color: "#F59E0B" },
  inputSection: { width: "100%", marginBottom: 18 },
  inputLabel: { fontSize: 14, color: "#333", marginBottom: 8, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 54,
    width: "100%", // Fixes cross-axis collapse under alignItems center
  },
  inputWrapperError: { borderColor: "#EF4444" },
  currencySymbol: { fontSize: 18, color: "#333", marginRight: 10 },
  textInput: { 
    flex: 1, 
    fontSize: 16, 
    color: "#333", 
    fontWeight: "600",
    paddingVertical: 0, // Fixes Android vertical text cutoffs & touch registration bugs
  },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 5, marginLeft: 4 },
  quickAmountGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContext: "space-between", marginBottom: 20 },
  quickAmountBtn: {
    width: "31%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
    elevation: 1,
  },
  quickAmountBtnActive: { backgroundColor: PRIMARY_LIGHT, borderColor: PRIMARY_COLOR },
  quickAmountText: { fontSize: 13, color: "#333" },
  quickAmountTextActive: { color: PRIMARY_COLOR },
  submitBtn: {
    width: "100%",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    marginTop: 10,
    marginBottom: 15,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: "#fff", fontSize: 15, letterSpacing: 1 },
  manualDepositBtn: { padding: 10 },
  manualDepositText: { color: PRIMARY_COLOR, fontSize: 13, textDecorationLine: "underline" },
});