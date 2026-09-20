// // src/GameRatesScreen.js
// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import api from './api'; // Ensure this points to your configured Axios instance

// export default function GameRatesScreen() {
//   const [rates, setRates] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchRates = async () => {
//       try {
//         // Fetch the live settings from the database
//         const response = await api.get('/admin/settings'); // Adjust path if your route is named differently
//         const data = response.data;

//         // Map the database columns exactly to your UI layout
//         const dynamicRates = [
//           { id: "1", name: "single digit", rate: Number(data.single_digit_rate).toFixed(2) },
//           { id: "2", name: "jodi digit", rate: Number(data.jodi_digit_rate).toFixed(2) },
//           { id: "3", name: "single panna", rate: Number(data.single_panna_rate).toFixed(2) },
//           { id: "4", name: "double panna", rate: Number(data.double_panna_rate).toFixed(2) },
//           { id: "5", name: "tripple panna", rate: Number(data.triple_panna_rate).toFixed(2) },
//           { id: "6", name: "half sangam", rate: Number(data.half_sangam_rate).toFixed(2) },
//           { id: "7", name: "full sangam", rate: Number(data.full_sangam_rate).toFixed(2) },
//           { id: "8", name: "family_jodi", rate: Number(data.family_jodi_rate).toFixed(2) },
//           { id: "9", name: "SP Motor", rate: Number(data.sp_motor_rate).toFixed(2) },
//           { id: "10", name: "DP Motor", rate: Number(data.dp_motor_rate).toFixed(2) },
//         ];

//         setRates(dynamicRates);
//       } catch (error) {
//         console.error("Failed to load game rates:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRates();
//   }, []);

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <Text style={styles.subHeader}>Main Game Win Ratio for All Bids</Text>

//       <View style={styles.card}>
//         {isLoading ? (
//           <ActivityIndicator size="large" color="#6a0dad" style={{ padding: 40 }} />
//         ) : (
//           rates.map((item, index) => (
//             <View key={item.id}>
//               <View style={styles.row}>
//                 <Text style={styles.gameName}>{item.name}</Text>
//                 <Text style={styles.gameRate}>{item.rate}</Text>
//               </View>
//               {/* Add a subtle divider between items, but not after the very last one */}
//               {index < rates.length - 1 && <View style={styles.divider} />}
//             </View>
//           ))
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f4f5f8" },
//   content: { padding: 20, paddingBottom: 40 },
//   subHeader: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#555",
//     marginBottom: 15,
//     marginLeft: 5,
//   },

//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 14,
//   },

//   gameName: { fontSize: 16, color: "#333", textTransform: "capitalize" },
//   gameRate: { fontSize: 16, fontWeight: "700", color: "#6a0dad" },
//   divider: { height: 1, backgroundColor: "#f0f0f0" },
// });




// src/GameRatesScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import api from './api';

export default function GameRatesScreen() {
  const [mainRates, setMainRates] = useState([]);
  const [galiDesawarRates, setGaliDesawarRates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await api.get('/admin/settings');
        const data = response.data;

        // 1. Main Market Rates
        const dynamicMainRates = [
          { id: "1", name: "single digit", rate: Number(data.single_digit_rate || 0).toFixed(2) },
          { id: "2", name: "jodi digit", rate: Number(data.jodi_digit_rate || 0).toFixed(2) },
          { id: "3", name: "single panna", rate: Number(data.single_panna_rate || 0).toFixed(2) },
          { id: "4", name: "double panna", rate: Number(data.double_panna_rate || 0).toFixed(2) },
          { id: "5", name: "tripple panna", rate: Number(data.triple_panna_rate || 0).toFixed(2) },
          { id: "6", name: "half sangam", rate: Number(data.half_sangam_rate || 0).toFixed(2) },
          { id: "7", name: "full sangam", rate: Number(data.full_sangam_rate || 0).toFixed(2) },
          { id: "8", name: "family_jodi", rate: Number(data.family_jodi_rate || 0).toFixed(2) },
          { id: "9", name: "SP Motor", rate: Number(data.sp_motor_rate || 0).toFixed(2) },
          { id: "10", name: "DP Motor", rate: Number(data.dp_motor_rate || 0).toFixed(2) },
        ];

        // 2. Gali Desawar Rates
        const dynamicGdRates = [
          { id: "gd1", name: "jodi digit", rate: Number(data.gd_jodi_rate || 0).toFixed(2) },
          { id: "gd2", name: "andar haruf", rate: Number(data.gd_haruf_andar_rate || 0).toFixed(2) },
          { id: "gd3", name: "bahar haruf", rate: Number(data.gd_haruf_bahar_rate || 0).toFixed(2) },
        ];

        setMainRates(dynamicMainRates);
        setGaliDesawarRates(dynamicGdRates);
      } catch (error) {
        console.error("Failed to load game rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  const renderRateCard = (rateList) => (
    <View style={styles.card}>
      {rateList.map((item, index) => (
        <View key={item.id}>
          <View style={styles.row}>
            <Text style={styles.gameName}>{item.name}</Text>
            <Text style={styles.gameRate}>{item.rate}</Text>
          </View>
          {index < rateList.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#6a0dad" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* MAIN MARKETS */}
          <Text style={styles.subHeader}>Main Market Rates</Text>
          {renderRateCard(mainRates)}

          {/* GALI DESAWAR MARKETS */}
          <Text style={[styles.subHeader, { marginTop: 24 }]}>Gali Desawar Rates</Text>
          {renderRateCard(galiDesawarRates)}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f5f8" },
  content: { padding: 20, paddingBottom: 40 },
  subHeader: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    marginBottom: 12,
    marginLeft: 5,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },

  gameName: { fontSize: 16, color: "#333", textTransform: "capitalize" },
  gameRate: { fontSize: 16, fontWeight: "700", color: "#6a0dad" },
  divider: { height: 1, backgroundColor: "#f0f0f0" },
});