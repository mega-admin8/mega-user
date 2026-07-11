import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Wallet,
  Hash,
  Copy,
  FileDigit,
  Files,
  Layers,
  PieChart,
  Target,
  Dices,
  Activity,
  Disc,
} from "lucide-react-native";
import { theme } from "./theme";
import Typography from "./components/Typography";
import { useFocusEffect } from "@react-navigation/native";
import api from "./api";

// Array of game modes with mapped Lucide icons
const GAME_MODES = [
  { id: "1", title: "Single Digit", icon: Hash, route: "BidSingleDigit" },
  { id: "2", title: "Jodi Digit", icon: Copy, route: "BidJodiDigit" },
  { id: "3", title: "Single Panna", icon: FileDigit, route: "BidSinglePanna" },
  { id: "4", title: "Double Panna", icon: Files, route: "BidDoublePanna" },
  { id: "5", title: "Triple Panna", icon: Layers, route: "BidTriplePanna" },
  { id: "6", title: "Half Sangam", icon: PieChart, route: "BidHalfSangam" },
  { id: "7", title: "Full Sangam", icon: Target, route: "BidFullSangam" },
  { id: "8", title: "Family Jodi", icon: Dices, route: "BidFamilyJodi" },
  { id: "9", title: "SP Motor", icon: Activity, route: "BidSPMotor" },
  { id: "10", title: "DP Motor", icon: Disc, route: "BidDPMotor" },
];

export default function MarketGameScreen({ route, navigation }) {
  // Assume we pass the market name and status via navigation parameters
  // const marketName = route.params?.marketName || "Supreme Night";
  const { marketName = "Market", marketId, userId } = route.params || {};

  const [walletBalance, setWalletBalance] = useState("...");
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);

  // Fetch the absolute latest balance securely from the server
  useFocusEffect(
    useCallback(() => {
      const fetchLiveBalance = async () => {
        setIsBalanceLoading(true);
        try {
          const response = await api.get("/auth/me");
          setWalletBalance(response.data.wallet_balance);
        } catch (error) {
          console.log("Failed to fetch live balance in game screen:", error);
          setWalletBalance("Error");
        } finally {
          setIsBalanceLoading(false);
        }
      };

      fetchLiveBalance();
    }, []),
  );

  const handleGameSelect = (gameRoute, gameTitle) => {
    // We ignore gameRoute for now, since BidBoard handles everything! 
    navigation.navigate("BidBoard", { marketName, marketId, gameTitle, userId });
  };

  const renderGameCard = ({ item }) => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.7}
        onPress={() => handleGameSelect(item.route, item.title)}
      >
        <View style={styles.iconWrapper}>
          <IconComponent
            color={theme.colors.primary}
            size={32}
            strokeWidth={1.5}
          />
        </View>
        <Typography weight="700" style={styles.cardTitle}>
          {item.title}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* --- PREMIUM HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft color={theme.colors.surface} size={24} />
          </TouchableOpacity>
          <View>
            <Typography weight="700" style={styles.headerTitle}>
              {marketName.toUpperCase()}
            </Typography>
            <Typography style={styles.headerSubtitle}>
              Market is Open
            </Typography>
          </View>
        </View>

        {/* Elegant Wallet Badge */}
        <TouchableOpacity style={styles.walletBadge} activeOpacity={0.8}>
          <Wallet color={theme.colors.warning} size={18} />
          {isBalanceLoading ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.surface}
              style={{ marginLeft: 6 }}
            />
          ) : (
            <Typography weight="700" style={styles.walletText}>
              {walletBalance} Pts
            </Typography>
          )}
        </TouchableOpacity>
      </View>

      {/* --- GRID LIST --- */}
      <View style={styles.listContainer}>
        <FlatList
          data={GAME_MODES}
          keyExtractor={(item) => item.id}
          renderItem={renderGameCard}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl, // Adjust based on your notch handling
    paddingBottom: theme.spacing.l,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...theme.shadows.card,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: theme.spacing.m,
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    color: theme.colors.surface,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.success, // e.g., a bright green for "Open"
    marginTop: 2,
  },
  walletBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Glassmorphism effect
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  walletText: {
    color: theme.colors.surface,
    marginLeft: 6,
    fontSize: 14,
  },

  // Grid Styles
  listContainer: {
    flex: 1,
    marginTop: -theme.spacing.m, // Pulls the list up slightly over the curved header
  },
  flatListContent: {
    padding: theme.spacing.m,
    paddingTop: theme.spacing.l,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: theme.spacing.m,
  },

  // Card Styles
  cardContainer: {
    width: "48%", // Leaves 4% for gap
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.l,
    padding: theme.spacing.l,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.card,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primaryLight || "rgba(106, 13, 173, 0.1)", // Soft tint of primary color
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.m,
  },
  cardTitle: {
    fontSize: 14,
    color: theme.colors.textDark,
    textAlign: "center",
  },
});
