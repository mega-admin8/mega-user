import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  Calendar,
  Search,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from './api';

export default function WinHistoryScreen() {
  // Use real Date objects instead of strings for the picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // State to control when the calendar popups are visible
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Helper to format Date object to DD-MM-YYYY for display
  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Handlers for when a user picks a date
  const onChangeStart = (event, selectedDate) => {
    // Android auto-closes the picker, iOS needs manual control
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) setStartDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) setEndDate(selectedDate);
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      // Convert JS Date objects to YYYY-MM-DD for the SQL backend
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const response = await api.get(`/bids/win-history?page=${page}&startDate=${startStr}&endDate=${endStr}`);
      
      setHistoryData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.log("Error fetching wins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch when the screen loads or when the page changes
  React.useEffect(() => {
    fetchHistory();
  }, [page]);

  // const renderWinCard = ({ item }) => (
  //   <View style={styles.winCard}>
  //     <View>
  //       <Text style={styles.gameName}>{item.gameName}</Text>
  //       <Text style={styles.winDate}>{item.date}</Text>
  //     </View>
  //     <View style={styles.amountBadge}>
  //       <Text style={styles.winAmount}>+{item.amount} Pts</Text>
  //     </View>
  //   </View>
  // );

  // const renderWinCard = ({ item }) => (
  //   <View style={styles.winCard}>
  //     <View>
  //       {/* Using market_name from your JOIN query */}
  //       <Text style={styles.gameName}>{item.market_name} ({item.game_type})</Text>
  //       <Text style={styles.winDate}>
  //         {new Date(item.placed_at).toLocaleDateString('en-IN')} - Num: {item.bid_number}
  //       </Text>
  //     </View>
  //     <View style={styles.amountBadge}>
  //       {/* Using the new permanently stored won_amount */}
  //       <Text style={styles.winAmount}>+₹{item.won_amount}</Text>
  //     </View>
  //   </View>
  // );

  const renderWinCard = ({ item }) => (
    <View style={styles.winCard}>
      {/* Top Row: Market Name & Win Amount */}
      <View style={styles.cardHeader}>
        <Text style={styles.gameName}>{item.market_name}</Text>
        <View style={styles.amountBadge}>
          <Text style={styles.winAmount}>+₹{item.won_amount}</Text>
        </View>
      </View>

      {/* Middle Row: Session & Game Type */}
      <Text style={styles.gameDetailText}>
        {item.session ? `${item.session.toUpperCase()} • ` : ''}
        {item.game_type ? item.game_type.replace('_', ' ') : 'Game'}
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Row: Bet Details */}
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Date</Text>
          <Text style={styles.footerValue}>
            {new Date(item.placed_at).toLocaleDateString("en-IN", {
              day: "2-digit", month: "short", year: "numeric"
            })}
          </Text>
        </View>
        
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Number</Text>
          <Text style={[styles.footerValue, { color: '#6a0dad', fontSize: 16 }]}>
            {item.bid_number}
          </Text>
        </View>

        <View style={[styles.footerItem, { alignItems: 'flex-end' }]}>
          <Text style={styles.footerLabel}>Bet Amount</Text>
          <Text style={styles.footerValue}>₹{item.amount}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Trophy color="#ccc" size={48} />
      </View>
      <Text style={styles.emptyTitle}>No Wins Found</Text>
      <Text style={styles.emptySub}>
        Try adjusting your date filters to see older records.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FILTER SECTION */}
      <View style={styles.filterCard}>
        <View style={styles.dateRow}>
          {/* Start Date Picker Button */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowStartPicker(true)}
            >
              <Calendar color="#888" size={18} style={styles.icon} />
              <Text style={styles.inputText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
          </View>

          {/* End Date Picker Button */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowEndPicker(true)}
            >
              <Calendar color="#888" size={18} style={styles.icon} />
              <Text style={styles.inputText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={fetchHistory}>
          <Search color="#fff" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.searchButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* THE ACTUAL NATIVE CALENDARS */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onChangeStart}
          maximumDate={new Date()} // Optional: Prevents selecting future dates
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onChangeEnd}
          maximumDate={new Date()}
        />
      )}

      {/* LIST SECTION */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#6a0dad"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={historyData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWinCard}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={
              historyData.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
            }
          />
        )}
      </View>

      {/* PAGINATION SECTION */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
          disabled={page === 1}
          onPress={() => setPage(page-1)}
        >
          <ChevronLeft color={page === 1 ? "#aaa" : "#6a0dad"} size={20} />
          <Text
            style={[styles.pageText, page === 1 && styles.pageTextDisabled]}
          >
            Prev
          </Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>
          {page} / {totalPages}
        </Text>

        <TouchableOpacity
          style={[
            styles.pageButton,
            page === totalPages && styles.pageButtonDisabled,
          ]}
          disabled={page === totalPages}
          onPress={() => setPage(page+1)}
        >
          <Text
            style={[
              styles.pageText,
              page === totalPages && styles.pageTextDisabled,
            ]}
          >
            Next
          </Text>
          <ChevronRight
            color={page === totalPages ? "#aaa" : "#6a0dad"}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f5f8" },

  filterCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateInputContainer: { flex: 0.48 },
  label: { fontSize: 12, fontWeight: "600", color: "#555", marginBottom: 6 },

  // Updated input styles to act nicely as a button
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#eaeaea",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 44,
  },
  inputText: { flex: 1, fontSize: 14, color: "#333" },
  icon: { marginRight: 8 },

  searchButton: {
    flexDirection: "row",
    backgroundColor: "#6a0dad",
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: { color: "#fff", fontSize: 15, fontWeight: "bold" },

  listContainer: { flex: 1, paddingHorizontal: 15 },
  winDate: { fontSize: 12, color: "#888" },
  

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 40,
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  pageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0e6fa",
  },
  pageButtonDisabled: { backgroundColor: "#f5f5f5" },
  pageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6a0dad",
    marginHorizontal: 4,
  },
  pageTextDisabled: { color: "#aaa" },
  pageIndicator: { fontSize: 14, fontWeight: "600", color: "#555" },

  winCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gameName: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#333", 
    textTransform: "uppercase" 
  },
  gameDetailText: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    fontWeight: "500",
  },
  amountBadge: {
    backgroundColor: "#e6f2ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  winAmount: { 
    fontSize: 15, 
    fontWeight: "bold", 
    color: "#007bff" 
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  footerValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
