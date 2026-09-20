import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import {
  Menu,
  Bell,
  Wallet,
  Clock,
  PlayCircle,
  Lock,
} from "lucide-react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "./api";
import { theme } from "./theme";
import Typography from "./components/Typography";
import GaliDesawarEntryCard from "./GaliDesawarEntryCard";

// Helper to calculate status based on current time
const calculateMarketStatus = (openTimeStr, closeTimeStr, isActive) => {
  if (isActive === false) return "Paused";
  if (!openTimeStr || !closeTimeStr) return "Closed";

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const parseToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const openMins = parseToMinutes(openTimeStr);
  const closeMins = parseToMinutes(closeTimeStr);

  if (closeMins < openMins) {
    if (currentTime >= openMins || currentTime <= closeMins) return "Open";
    return "Closed";
  } else {
    if (currentTime >= openMins && currentTime <= closeMins) return "Open";
    if (currentTime < openMins) return "Upcoming";
    return "Closed";
  }
};

// Helper to convert 24-hour time string ("22:40:00") to 12-hour format ("10:40 PM")
const formatTo12Hour = (timeStr) => {
  if (!timeStr) return null;

  const [hourStr, minuteStr] = timeStr.split(":");
  let hours = parseInt(hourStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedHours = hours < 10 ? `0${hours}` : hours;

  return `${formattedHours}:${minuteStr} ${ampm}`;
};

export default function DashboardScreen({ user }) {
  const navigation = useNavigation();
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveBalance, setLiveBalance] = useState(user?.balance || "0");

  const fetchFreshBalance = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data?.wallet_balance !== undefined) {
        setLiveBalance(response.data.wallet_balance);
      }
    } catch (error) {
      console.log("Failed to silent-refresh balance");
    }
  };

  const fetchMarkets = async () => {
    try {
      const response = await api.get("/markets");
      setMarkets(response.data);
    } catch (error) {
      console.error("Failed to fetch markets", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFreshBalance();
    }, [])
  );

  useEffect(() => {
    fetchMarkets().finally(() => setLoading(false));
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchMarkets(), fetchFreshBalance()]);
    setRefreshing(false);
  }, []);

  const renderMarket = ({ item }) => {
    const currentStatus = calculateMarketStatus(
      item.open_time,
      item.close_time,
      item.is_active
    );

    let badgeStyle = styles.badgeInactive;
    let textStyle = styles.statusTextInactive;
    let StatusIcon = Lock;
    let iconColor = theme.colors.textMuted;

    if (currentStatus === "Paused") {
      badgeStyle = { backgroundColor: "#fee2e2" };
      textStyle = { color: "#ef4444" };
      StatusIcon = Lock;
      iconColor = "#ef4444";
    } else if (currentStatus === "Open") {
      badgeStyle = styles.badgeActive;
      textStyle = styles.statusTextActive;
      StatusIcon = PlayCircle;
      iconColor = theme.colors.success;
    } else if (currentStatus === "Opening Soon") {
      badgeStyle = styles.badgeWarning;
      textStyle = styles.statusTextWarning;
      StatusIcon = Clock;
      iconColor = "#d97706";
    }

    const formattedOpenResultTime = item.open_result_time
      ? formatTo12Hour(item.open_result_time)
      : item.open_time
      ? formatTo12Hour(item.open_time)
      : "--:--";

    const formattedCloseResultTime = item.close_result_time
      ? formatTo12Hour(item.close_result_time)
      : item.close_time
      ? formatTo12Hour(item.close_time)
      : "--:--";

    return (
      <TouchableOpacity
        style={styles.gameCard}
        activeOpacity={0.7}
        onPress={() => {
          if (currentStatus === "Open") {
            navigation.navigate("MarketGame", {
              marketName: item.name,
              marketId: item.id,
              userId: user.id,
            });
          } else {
            alert(`${item.name} is currently ${currentStatus.toLowerCase()}.`);
          }
        }}
      >
        <View style={styles.gameHeader}>
          <View style={{ flex: 1 }}>
            <Typography weight="700" style={styles.gameTitle}>
              {item.name}
            </Typography>
            <Typography weight="700" style={styles.resultText}>
              {item.result_display || "***-**-***"}
            </Typography>
          </View>

          <View style={[styles.statusBadge, badgeStyle]}>
            <Typography weight="600" style={[styles.statusText, textStyle]}>
              {currentStatus.toUpperCase()}
            </Typography>
          </View>
        </View>

        <View style={styles.gameDetails}>
          <View style={styles.timeBlock}>
            <Typography style={styles.timeLabel}>
              Open:{" "}
              <Typography weight="600" style={styles.timeValue}>
                {formattedOpenResultTime}
              </Typography>
            </Typography>
          </View>

          <View style={styles.playAction}>
            <StatusIcon color={iconColor} size={24} />
          </View>

          <View style={[styles.timeBlock, { alignItems: "flex-end" }]}>
            <Typography style={styles.timeLabel}>
              Close:{" "}
              <Typography weight="600" style={styles.timeValue}>
                {formattedCloseResultTime}
              </Typography>
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Wallet color={theme.colors.primaryLight} size={20} />
            <Typography weight="500" style={styles.heroLabel}>
              Available Balance
            </Typography>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Funds")}
            style={styles.addMoneyBtn}
          >
            <Typography weight="600" style={styles.addMoneyText}>
              + Add
            </Typography>
          </TouchableOpacity>
        </View>
        <Typography weight="700" style={styles.heroAmount}>
          {liveBalance}
          <Typography style={styles.heroPts}>Pts</Typography>
        </Typography>
      </View>
      <Typography weight="700" style={styles.sectionTitle}>
        Live Markets
      </Typography>
    </>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.menuButton}
          >
            <Menu color={theme.colors.textDark} size={28} />
          </TouchableOpacity>
          <View>
            <Typography style={styles.greeting}>Good Morning,</Typography>
            <Typography weight="700" style={styles.username}>
              {user?.full_name || "Player"}
            </Typography>
          </View>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Bell color={theme.colors.textDark} size={24} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      < GaliDesawarEntryCard navigation={navigation} />

      <FlatList
        data={markets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMarket}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  scrollContent: { padding: theme.spacing.m, paddingBottom: theme.spacing.xxl },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  menuButton: { marginRight: theme.spacing.m },
  greeting: { fontSize: 13, color: theme.colors.textMuted },
  username: { fontSize: 18, color: theme.colors.textDark },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.card,
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.danger,
  },

  heroCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.l,
    marginVertical: theme.spacing.m,
    ...theme.shadows.card,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.s,
  },
  heroLabel: {
    color: theme.colors.primaryLight,
    marginLeft: theme.spacing.s,
    fontSize: 14,
  },
  addMoneyBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.round,
  },
  addMoneyText: { color: theme.colors.surface, fontSize: 13 },
  heroAmount: {
    fontSize: 42,
    color: theme.colors.surface,
    marginTop: theme.spacing.xs,
  },
  heroPts: { fontSize: 20, color: theme.colors.primaryLight },

  sectionTitle: {
    fontSize: 18,
    marginVertical: theme.spacing.m,
    marginLeft: theme.spacing.xs,
    color: theme.colors.textDark,
  },

  gameCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.card,
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.s,
  },
  gameTitle: {
    fontSize: 16,
    color: theme.colors.textDark,
  },
  resultText: {
    fontSize: 20,
    color: theme.colors.primary,
    letterSpacing: 1.5,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 6,
    borderRadius: theme.radius.round,
  },
  badgeActive: { backgroundColor: theme.colors.successLight },
  badgeWarning: { backgroundColor: "#fef3c7" },
  badgeInactive: { backgroundColor: theme.colors.background },

  statusText: { fontSize: 12 },
  statusTextActive: { color: theme.colors.success },
  statusTextWarning: { color: "#d97706" },
  statusTextInactive: { color: theme.colors.textMuted },

  gameDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  timeValue: {
    fontSize: 12,
    color: theme.colors.textDark,
  },
  playAction: {
    paddingHorizontal: theme.spacing.s,
    justifyContent: "center",
    alignItems: "center",
  },
});