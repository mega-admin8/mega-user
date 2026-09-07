import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import {
  PlusCircle,
  ArrowDownCircle,
  FileText,
  MessageCircle,
  ChevronRight,
  Wallet,
} from "lucide-react-native";
import { theme } from "./theme";
import Typography from "./components/Typography";
import { useFocusEffect } from '@react-navigation/native';
import api from './api';

export default function FundsScreen({ navigation, user }) {
  const [liveBalance, setLiveBalance] = useState(user?.balance || "0");

  useFocusEffect(
    useCallback(() => {
      const fetchFreshBalance = async () => {
        try {
          const response = await api.get('/auth/me'); 
          setLiveBalance(response.data.wallet_balance);
        } catch (error) {
          console.log("Failed to refresh balance in Funds:", error);
        }
      };

      fetchFreshBalance();
    }, [])
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
              "whatsapp://send?phone=${918368173691}&text=Hello MegaPlay Support, I want to " +
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

  return (
    <View style={styles.container}>
      {/* --- TOP BALANCE CARD --- */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Wallet
            color={theme.colors.surface}
            size={24}
            style={{ opacity: 0.8 }}
          />
          <Typography weight="500" style={styles.balanceLabel}>
            Current Balance
          </Typography>
        </View>
        <Typography weight="700" style={styles.balanceAmount}>
          {liveBalance}{" "}
          <Typography style={styles.ptsText}>Pts</Typography>
        </Typography>
      </View>

      <Typography weight="700" style={styles.sectionTitle}>
        Fund Management
      </Typography>

      {/* --- ADD FUNDS BUTTON --- */}
      <TouchableOpacity
        style={styles.actionCard}
        // onPress={() => handleManualFund("Add")}
        onPress={() => navigation.navigate("AddFundsScreen")}
        activeOpacity={0.7}
      >
        <View style={styles.actionLeft}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.colors.successLight },
            ]}
          >
            <PlusCircle color={theme.colors.success} size={24} />
          </View>
          <View>
            <Typography weight="600" style={styles.actionTitle}>
              Add Funds
            </Typography>
            <Typography style={styles.actionSub}>
              Deposit points to your wallet
            </Typography>
          </View>
        </View>
        {/* WhatsApp Green Icon */}
        {/* <MessageCircle color="#25D366" size={22} /> */}
      </TouchableOpacity>

      {/* --- WITHDRAW FUNDS BUTTON --- */}
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => handleManualFund("Withdraw")}
        activeOpacity={0.7}
      >
        <View style={styles.actionLeft}>
          <View style={[styles.iconCircle, { backgroundColor: "#fdf2f2" }]}>
            <ArrowDownCircle color="#d9534f" size={24} />
          </View>
          <View>
            <Text style={styles.actionTitle}>Withdraw Funds</Text>
            <Text style={styles.actionSub}>Transfer points to bank/UPI</Text>
          </View>
        </View>
        {/* <MessageCircle color="#25D366" size={22} /> */}
      </TouchableOpacity>

      {/* Manual add funds button */}
      <TouchableOpacity
        style={styles.actionCard}
        // onPress={() => handleManualFund("Withdraw")}
        onPress={() => navigation.navigate("ManualFundsScreen")}
        activeOpacity={0.7}
      >
        <View style={styles.actionLeft}>
          <View style={[styles.iconCircle, { backgroundColor: "#fdf2f2" }]}>
            <ArrowDownCircle color="#d9534f" size={24} />
          </View>
          <View>
            <Text style={styles.actionTitle}>Add Manual Funds</Text>
            <Text style={styles.actionSub}>Deposit points to your wallet</Text>
          </View>
        </View>
        {/* <MessageCircle color="#25D366" size={22} /> */}
      </TouchableOpacity>

      {/* --- ACCOUNT STATEMENTS BUTTON --- */}
      {/* This redirects directly to the Passbook screen we just built! */}
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("Passbook")}
        activeOpacity={0.7}
      >
        <View style={styles.actionLeft}>
          <View style={[styles.iconCircle, { backgroundColor: "#f0e6fa" }]}>
            <FileText color="#6a0dad" size={24} />
          </View>
          <View>
            <Text style={styles.actionTitle}>Account Statements</Text>
            <Text style={styles.actionSub}>View all your transactions</Text>
          </View>
        </View>
        <ChevronRight color="#ccc" size={22} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // 4. Look how clean the StyleSheet is when using the theme!
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },

  balanceCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card, // Instantly apply perfect shadows!
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.s,
  },
  balanceLabel: { color: theme.colors.surface, marginLeft: theme.spacing.s },
  balanceAmount: { fontSize: 36, color: theme.colors.surface },
  ptsText: { fontSize: 20, color: theme.colors.primaryLight },

  sectionTitle: {
    fontSize: 16,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.m,
    marginLeft: theme.spacing.xs,
  },

  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.l,
    padding: theme.spacing.m,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.m,
    ...theme.shadows.card,
  },
  actionLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.round,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.m,
  },
  actionTitle: { fontSize: 16, color: theme.colors.textDark, marginBottom: 2 },
  actionSub: { fontSize: 12, color: theme.colors.textMuted },
});
