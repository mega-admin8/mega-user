import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Platform } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Calendar, Search, Wallet, ChevronLeft, ChevronRight } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from './api'; // Ensure this points to your configured Axios instance

export default function PassbookScreen() {
  // Filter States
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30))); // Default to last 30 days
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Data & UI States
  // const [allData, setAllData] = useState([]); // Holds all fetched admin txns
  // const [filteredData, setFilteredData] = useState([]); // Holds data after date filter
  const [passbookData, setPassbookData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const itemsPerPage = 10;
  // const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Fetch data on mount AND whenever the 'page' changes
  useFocusEffect(
    useCallback(() => {
      fetchPassbook();
    }, [page])
  );

  const fetchPassbook = async () => {
    setIsLoading(true);
    try {
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const response = await api.get(`/user/passbook?page=${page}&startDate=${startStr}&endDate=${endStr}`);
      
      // I noticed your old code filtered out user bids. If you want a TRUE Universal Passbook, 
      // you should show everything (Bets, Wins, Deposits). We apply it directly here:
      setPassbookData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);

    } catch (error) {
      console.log('Error fetching passbook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualFilter = () => {
    // If we are already on page 1, changing the date won't trigger the useEffect, 
    // so we call fetch manually. Otherwise, resetting to page 1 triggers it automatically.
    if (page === 1) {
      fetchPassbook();
    } else {
      setPage(1);
    }
  };

  const onChangeStart = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) setStartDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) setEndDate(selectedDate);
  };

  // const getTransactionDetails = (type) => {
  //   const txType = type ? type.toUpperCase() : '';

  //   switch (txType) {
  //     case 'WIN':
  //     case 'WINNING':
  //       return { title: 'Winning Amount', isPositive: true };
  //     case 'BET':
  //     case 'PLAY':
  //       return { title: 'Bid Placed', isPositive: false };
  //     case 'ADMIN_CREDIT':
  //     case 'CREDIT':
  //     case 'DEPOSIT':
  //     case 'ADD':
  //       return { title: 'Funds Added by Admin', isPositive: true };
  //     case 'ADMIN_DEBIT':
  //     case 'DEBIT':
  //     case 'WITHDRAW':
  //     case 'DEDUCT':
  //       return { title: 'Funds Deducted by Admin', isPositive: false };
  //     default:
  //       // Fallback for any unknown transaction types
  //       return { title: 'Transaction', isPositive: false }; 
  //   }
  // };

  const getTransactionDetails = (type) => {
    // If type is null or undefined, label it 'UNKNOWN'
    const txType = type ? type.toUpperCase() : 'UNKNOWN';

    switch (txType) {
      case 'WIN':
      case 'WINNING':
        return { title: 'Winning Amount', isPositive: true };
      case 'BET':
      case 'BID':  // <-- I added 'BID' here just in case!
      case 'PLAY':
        return { title: 'Bid Placed', isPositive: false };
      case 'ADMIN_CREDIT':
      case 'CREDIT':
      case 'DEPOSIT':
      case 'ADD':
        return { title: 'Funds Added by Admin', isPositive: true };
      case 'ADMIN_DEBIT':
      case 'DEBIT':
      case 'WITHDRAW':
      case 'DEDUCT':
        return { title: 'Funds Deducted by Admin', isPositive: false };
      default:
        // FIX: Instead of just saying "Transaction", this will now print exactly 
        // what word your database is sending (e.g., "Unknown: WITHDRAW_REQ")
        return { title: `${txType}`, isPositive: false }; 
    }
  };

  const renderTransactionCard = ({ item }) => {
    // 1. Get the exact title and +/- sign from our new helper
    const { title, isPositive } = getTransactionDetails(item.type);
    
    // Convert PostgreSQL timestamp to a readable format
    const txDateObj = new Date(item.created_at);
    const displayDate = txDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const displayTime = txDateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
      <View style={styles.dataCard}>
        <View style={styles.cardHeader}>
          {/* 2. Use the dynamic title here */}
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.dateText}>{displayDate} {displayTime}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.detailLabel}>
            Txn ID: <Text style={styles.detailValue}>#{item.id}</Text>
          </Text>

          {/* 3. The colors and signs will now correctly match the transaction type */}
          <View style={isPositive ? styles.amountBadgeGreen : styles.amountBadgeRed}>
            <Text style={isPositive ? styles.amountTextGreen : styles.amountTextRed}>
              {isPositive ? "+" : "-"}{item.amount} Pts
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Wallet color="#ccc" size={48} />
      </View>
      <Text style={styles.emptyTitle}>No Transactions</Text>
      <Text style={styles.emptySub}>No admin deposits or withdrawals found for this date range.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FILTER SECTION */}
      <View style={styles.filterCard}>
        <View style={styles.dateRow}>
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity style={styles.inputBox} onPress={() => setShowStartPicker(true)}>
              <Calendar color="#888" size={18} style={styles.icon} />
              <Text style={styles.inputText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity style={styles.inputBox} onPress={() => setShowEndPicker(true)}>
              <Calendar color="#888" size={18} style={styles.icon} />
              <Text style={styles.inputText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleManualFilter}>
          <Search color="#fff" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.searchButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* DATE PICKERS */}
      {showStartPicker && (
        <DateTimePicker value={startDate} mode="date" display="default" onChange={onChangeStart} maximumDate={new Date()} />
      )}
      {showEndPicker && (
        <DateTimePicker value={endDate} mode="date" display="default" onChange={onChangeEnd} maximumDate={new Date()} />
      )}

      {/* LIST SECTION */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6a0dad" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={passbookData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTransactionCard}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={passbookData.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* PAGINATION SECTION */}
      {passbookData.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]} 
            disabled={page === 1}
            onPress={() => setPage(page - 1)}
          >
            <ChevronLeft color={page === 1 ? "#aaa" : "#6a0dad"} size={20} />
            <Text style={[styles.pageText, page === 1 && styles.pageTextDisabled]}>Prev</Text>
          </TouchableOpacity>
          
          <Text style={styles.pageIndicator}>{page} / {totalPages}</Text>
          
          <TouchableOpacity 
            style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]} 
            disabled={page === totalPages}
            onPress={() => setPage(page + 1)}
          >
            <Text style={[styles.pageText, page === totalPages && styles.pageTextDisabled]}>Next</Text>
            <ChevronRight color={page === totalPages ? "#aaa" : "#6a0dad"} size={20} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ... Keep your exact StyleSheet here (I did not alter a single style so your design remains untouched) ...

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