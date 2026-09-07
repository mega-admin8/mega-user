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
  Ticket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "./api";

export default function MyBidsScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [bidsData, setBidsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  // const totalPages = 1;

  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const onChangeStart = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) setStartDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) setEndDate(selectedDate);
  };

  const [totalPages, setTotalPages] = useState(1);

  // Add a useEffect so it fetches bids automatically when the screen loads or page changes
  React.useEffect(() => {
    fetchBids();
  }, [page]); // Re-runs if the user clicks Prev/Next

  const fetchBids = async () => {
    setIsLoading(true);
    try {
      // Format dates to YYYY-MM-DD for PostgreSQL
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      // Call the backend with dates and pagination
      const response = await api.get(
        `/bids/my-bids?startDate=${start}&endDate=${end}&page=${page}`,
      );

      // Map the database column names to match your frontend UI props perfectly
      const formattedBids = response.data.bids.map((bid) => ({
        gameName: bid.market_name,
        date: new Date(bid.placed_at).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        bidType: (bid.game_type || "").replace("_", " "),
        number: bid.bid_number,
        points: bid.amount,
        status: bid.status, // You can use this later to switch between amountBadgeRed and amountBadgeGreen!
      }));

      setBidsData(formattedBids);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBidCard = ({ item }) => (
    <View style={styles.dataCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.titleText}>{item.gameName}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View style={styles.cardBody}>
        <View>
          <Text style={styles.detailLabel}>
            Bid Type: <Text style={styles.detailValue}>{item.bidType}</Text>
          </Text>
          <Text style={styles.detailLabel}>
            Number: <Text style={styles.detailValue}>{item.number}</Text>
          </Text>
        </View>
        <View style={styles.amountBadgeRed}>
          <Text style={styles.amountTextRed}>-{item.points} Pts</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ticket color="#ccc" size={48} />
      </View>
      <Text style={styles.emptyTitle}>No Bids Found</Text>
      <Text style={styles.emptySub}>
        You haven't placed any bids in this date range.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FILTER SECTION */}
      <View style={styles.filterCard}>
        <View style={styles.dateRow}>
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
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            setPage(1);
            fetchBids();
          }}
        >
          <Search color="#fff" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.searchButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* DATE PICKERS */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onChangeStart}
          maximumDate={new Date()}
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
            data={bidsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderBidCard}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={
              bidsData.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
            }
          />
        )}
      </View>

      {/* PAGINATION */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
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
          onPress={() => setPage(page + 1)}
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

  // Custom Data Card Styles
  dataCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
    marginBottom: 10,
  },
  titleText: { fontSize: 16, fontWeight: "700", color: "#333" },
  dateText: { fontSize: 12, color: "#888" },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: { fontSize: 13, color: "#666", marginBottom: 4 },
  detailValue: { fontWeight: "600", color: "#333" },

  // Badges
  amountBadgeRed: {
    backgroundColor: "#fdf2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amountTextRed: { fontSize: 14, fontWeight: "bold", color: "#d9534f" },
  amountBadgeGreen: {
    backgroundColor: "#eefcf4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amountTextGreen: { fontSize: 14, fontWeight: "bold", color: "#28a745" },

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
});
