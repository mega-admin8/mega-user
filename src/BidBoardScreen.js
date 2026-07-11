// import React, { useState, useCallback } from 'react';
// import { 
//   View, StyleSheet, TouchableOpacity, TextInput, 
//   FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
// import { ArrowLeft, Wallet, Calendar, Trash2, PlusCircle } from 'lucide-react-native';
// import { theme } from './theme';
// import Typography from './components/Typography';
// import api from './api'; 

// // --- DYNAMIC PANNA GENERATORS ---
// const generateSinglePannas = (targetAnk) => {
//   const target = parseInt(targetAnk, 10);
//   const results = [];
//   const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

//   for (let i = 0; i < digits.length - 2; i++) {
//     for (let j = i + 1; j < digits.length - 1; j++) {
//       for (let k = j + 1; k < digits.length; k++) {
//         if ((digits[i] + digits[j] + digits[k]) % 10 === target) {
//           results.push(`${digits[i]}${digits[j]}${digits[k]}`);
//         }
//       }
//     }
//   }
//   return results;
// };

// const generateDoublePannas = (targetAnk) => {
//   const target = parseInt(targetAnk, 10);
//   const results = [];
//   const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

//   for (let i = 0; i < digits.length; i++) {
//     for (let j = i; j < digits.length; j++) {
//       for (let k = j; k < digits.length; k++) {
//         if ((i === j && j !== k) || (i !== j && j === k)) {
//           if ((digits[i] + digits[j] + digits[k]) % 10 === target) {
//             results.push(`${digits[i]}${digits[j]}${digits[k]}`);
//           }
//         }
//       }
//     }
//   }
//   return results;
// };

// export default function BidBoardScreen({ route, navigation }) {
//   const { marketName = "Market", marketId, userId, gameTitle = "Single Digit" } = route.params || {};

//   // --- STATE MANAGEMENT ---
//   const [walletBalance, setWalletBalance] = useState("...");
//   const [session, setSession] = useState('Open');
//   const [tab, setTab] = useState('Classic'); 
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [bidNumber, setBidNumber] = useState('');
//   const [bidNumber2, setBidNumber2] = useState(''); 
//   const [bidAmount, setBidAmount] = useState('');
//   const [cart, setCart] = useState([]);

//   const [classicInputs, setClassicInputs] = useState({});
//   const [pannaFilter, setPannaFilter] = useState('1'); 

//   // --- FETCH LIVE BALANCE ---
//   useFocusEffect(
//     useCallback(() => {
//       const fetchLiveBalance = async () => {
//         try {
//           const response = await api.get('/auth/me'); 
//           setWalletBalance(response.data.wallet_balance);
//         } catch (error) {
//           setWalletBalance("Error");
//         }
//       };
//       fetchLiveBalance();
//     }, [])
//   );

//   const formattedDate = new Date().toLocaleDateString('en-GB', {
//     weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
//   });

//   // --- DYNAMIC GAME LOGIC ---
//   const titleLower = gameTitle ? gameTitle.toLowerCase() : '';
//   const isSangam = titleLower.includes('sangam');
//   const isMotor = titleLower.includes('motor');
//   const isTriplePanna = titleLower.includes('triple panna');

//   let maxLength1 = 3;
//   let maxLength2 = 3; 
//   let label1 = "Add Bid Number";
//   let label2 = "Close Number";
//   let placeholder1 = "Enter number";

//   if (titleLower.includes('single digit') || titleLower.includes('ank')) {
//     maxLength1 = 1; placeholder1 = "e.g. 5";
//   } else if (titleLower.includes('jodi') || titleLower.includes('family')) {
//     maxLength1 = 2; placeholder1 = "e.g. 45";
//   } else if (titleLower.includes('panna')) {
//     maxLength1 = 3; placeholder1 = "e.g. 145";
//   } else if (isMotor) {
//     maxLength1 = 10; placeholder1 = "e.g. 1234"; 
//   } else if (titleLower.includes('half sangam')) {
//     label1 = "Open Result"; label2 = "Close Result";
//     placeholder1 = "Ank or Panna";
//   } else if (titleLower.includes('full sangam')) {
//     label1 = "Open Panna"; label2 = "Close Panna";
//     placeholder1 = "3-digit Panna";
//   }

//   // --- ADVANCED MODE: ADD TO CART ---
//   const handleAddBid = () => {
//     if (!bidAmount || parseInt(bidAmount) <= 0) {
//       Alert.alert("Invalid Input", "Enter a valid bid amount.");
//       return;
//     }

//     let finalBidNumber = bidNumber;

//     if (isSangam) {
//       if (!bidNumber || !bidNumber2) {
//         Alert.alert("Invalid Input", "Sangam requires both Open and Close numbers.");
//         return;
//       }
//       finalBidNumber = `${bidNumber}-${bidNumber2}`;
//     } else {
//       if (!bidNumber) {
//         Alert.alert("Invalid Input", "Please enter a bid number.");
//         return;
//       }
//       if (!isMotor && bidNumber.length !== maxLength1) {
//         Alert.alert("Invalid Number", `Please enter exactly ${maxLength1} digits for ${gameTitle}.`);
//         return;
//       }
//       if (isMotor && bidNumber.length < 4) {
//         Alert.alert("Invalid Number", "Motors require at least 4 digits.");
//         return;
//       }
//     }

//     const newBid = { 
//       id: Date.now().toString(), 
//       number: finalBidNumber, 
//       amount: parseInt(bidAmount), 
//       session: session 
//     };

//     setCart([newBid, ...cart]);
//     setBidNumber('');
//     setBidNumber2('');
//     setBidAmount('');
//   };

//   const removeBid = (id) => setCart(cart.filter(item => item.id !== id));

//   // --- CLASSIC MODE LOGIC ---
//   const generateClassicNumbers = () => {
//     if (maxLength1 === 1) {
//       return ['1','2','3','4','5','6','7','8','9','0'];
//     } 
//     else if (maxLength1 === 2) {
//       return Array.from({length: 100}, (_, i) => i.toString().padStart(2, '0'));
//     } 
//     else if (maxLength1 === 3 && !isSangam) {
//       if (titleLower.includes('single panna')) {
//         return generateSinglePannas(pannaFilter); 
//       } 
//       else if (titleLower.includes('double panna')) {
//         return generateDoublePannas(pannaFilter); 
//       } 
//       else if (isTriplePanna) {
//         return ['111', '222', '333', '444', '555', '666', '777', '888', '999', '000']; 
//       }
//     }
//     return []; 
//   };

//   const updateClassicInput = (num, val) => {
//     setClassicInputs(prev => ({ ...prev, [num]: val }));
//   };

//   const submitBidsToDatabase = async () => {
//     let finalBids = [];

//     if (tab === 'Advanced' || isMotor) {
//       finalBids = [...cart];
//     } else {
//       finalBids = Object.entries(classicInputs)
//         .filter(([num, amt]) => amt && parseInt(amt) > 0) 
//         .map(([num, amt]) => ({ number: num, amount: parseInt(amt), session: session }));
//     }

//     if (finalBids.length === 0) {
//       Alert.alert("Empty", "Please add at least one bid amount.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         user_id: userId,
//         market_id: marketId,
//         game_type: gameTitle.toUpperCase().replace(' ', '_'),
//         bids: finalBids 
//       };

//       await api.post('/bids/place-bid', payload);

//       Alert.alert("Success!", `Successfully placed ${finalBids.length} bids.`);
//       setCart([]); 
//       setClassicInputs({});
//       navigation.goBack(); 

//     } catch (error) {
//       Alert.alert("Error", error.response?.data?.error || "Failed to place bids.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const activeTotalAmount = (tab === 'Advanced' || isMotor)
//     ? cart.reduce((sum, item) => sum + item.amount, 0)
//     : Object.values(classicInputs).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0);

//   const renderClassicGrid = () => {
//     const numbers = generateClassicNumbers();
//     if (numbers.length === 0) return <Typography style={{ textAlign: 'center', marginTop: 20 }}>Classic mode not available for this game type.</Typography>;

//     return (
//       <View>
//         {maxLength1 === 3 && !isSangam && !isTriplePanna && (
//           <View style={styles.pannaFilterCard}>
//             {['1','2','3','4','5','6','7','8','9','0'].map(num => (
//               <TouchableOpacity 
//                 key={num} 
//                 style={[styles.pannaFilterBtn, pannaFilter === num && styles.pannaFilterBtnActive]}
//                 onPress={() => setPannaFilter(num)}
//               >
//                 <Typography weight="700" style={[styles.pannaFilterText, pannaFilter === num && styles.pannaFilterTextActive]}>
//                   {num}
//                 </Typography>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         <View style={styles.classicGrid}>
//           {numbers.map((num) => (
//             <View key={num} style={styles.classicBox}>
//               <View style={styles.classicNumWrapper}>
//                 <Typography weight="700" style={styles.classicNum}>{num}</Typography>
//               </View>
//               <TextInput 
//                 style={styles.classicInput}
//                 keyboardType="number-pad"
//                 value={classicInputs[num] || ''}
//                 onChangeText={(val) => updateClassicInput(num, val)}
//               />
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const renderCartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <View style={styles.cartDetails}>
//         <Typography weight="700" style={styles.cartNumber}>{item.number}</Typography>
//         <View style={styles.cartBadge}>
//           <Typography weight="600" style={styles.cartSession}>{item.session}</Typography>
//         </View>
//       </View>
//       <View style={styles.cartRight}>
//         <Typography weight="600" style={styles.cartAmount}>₹ {item.amount}</Typography>
//         <TouchableOpacity onPress={() => removeBid(item.id)} style={styles.deleteBtn}>
//           <Trash2 color="#ef4444" size={20} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}>
//             <ArrowLeft color="#fff" size={24} />
//           </TouchableOpacity>
//           <Typography weight="700" style={styles.headerTitle}>{gameTitle}</Typography>
//         </View>
//         <View style={styles.walletBadge}>
//           <Wallet color="#fff" size={16} />
//           <Typography weight="700" style={styles.walletText}>{walletBalance}</Typography>
//         </View>
//       </View>

//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
//         <FlatList
//           data={(tab === 'Advanced' || isMotor) ? cart : []}
//           keyExtractor={(item) => item.id}
//           ListHeaderComponent={
//             <View style={styles.bodyContent}>
//               <Typography weight="700" style={styles.marketName}>{marketName.toLowerCase()}</Typography>

//               <View style={styles.dateBox}>
//                 <Calendar color={PRIMARY_COLOR} size={20} style={{ marginRight: 10 }} />
//                 <Typography weight="600" style={styles.dateText}>{formattedDate}</Typography>
//               </View>

//               {!isMotor && (
//                 <View style={styles.tabContainer}>
//                   <TouchableOpacity style={[styles.tabBtn, tab === 'Classic' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Classic')}>
//                     <Typography weight="600" style={[styles.tabText, tab === 'Classic' && styles.tabTextActive]}>Classic</Typography>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.tabBtn, tab === 'Advanced' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Advanced')}>
//                     <Typography weight="600" style={[styles.tabText, tab === 'Advanced' && styles.tabTextActive]}>Advanced</Typography>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               <Typography style={styles.label}>Choose Session</Typography>
//               <View style={styles.sessionContainer}>
//                 <TouchableOpacity style={[styles.sessionBtn, session === 'Open' ? styles.sessionActive : styles.sessionInactive]} onPress={() => setSession('Open')}>
//                   <Typography weight="600" style={[styles.sessionText, session === 'Open' && styles.sessionTextActive]}>Open</Typography>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.sessionBtn, session === 'Close' ? styles.sessionActive : styles.sessionInactive]} onPress={() => setSession('Close')}>
//                   <Typography weight="600" style={[styles.sessionText, session === 'Close' && styles.sessionTextActive]}>Close</Typography>
//                 </TouchableOpacity>
//               </View>

//               {tab === 'Advanced' || isMotor ? (
//                 <View style={styles.inputSection}>
//                   <View style={styles.inputRow}>
//                     <Typography weight="600" style={styles.inputLabel}>{label1}</Typography>
//                     <TextInput 
//                       style={styles.textInput}
//                       keyboardType="number-pad"
//                       maxLength={maxLength1}
//                       value={bidNumber}
//                       onChangeText={setBidNumber}
//                       placeholder={placeholder1}
//                     />
//                   </View>

//                   {isSangam && (
//                     <View style={styles.inputRow}>
//                       <Typography weight="600" style={styles.inputLabel}>{label2}</Typography>
//                       <TextInput 
//                         style={styles.textInput}
//                         keyboardType="number-pad"
//                         maxLength={maxLength2}
//                         value={bidNumber2}
//                         onChangeText={setBidNumber2}
//                         placeholder={placeholder1}
//                       />
//                     </View>
//                   )}

//                   <View style={styles.inputRow}>
//                     <Typography weight="600" style={styles.inputLabel}>Add Amount</Typography>
//                     <TextInput 
//                       style={styles.textInput}
//                       keyboardType="number-pad"
//                       value={bidAmount}
//                       onChangeText={setBidAmount}
//                       placeholder="₹ 0"
//                     />
//                   </View>
                  
//                   <TouchableOpacity style={styles.addBtn} onPress={handleAddBid}>
//                     <PlusCircle color="#fff" size={20} style={{ marginRight: 8 }} />
//                     <Typography weight="700" style={{ color: '#fff', fontSize: 16 }}>Add Bid</Typography>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 renderClassicGrid()
//               )}
//             </View>
//           }
//           renderItem={renderCartItem}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         />
//       </KeyboardAvoidingView>

//       <View style={styles.footer}>
//         <View style={styles.footerLeft}>
//           <Typography weight="700" style={styles.totalAmountText}>₹ {activeTotalAmount}</Typography>
//           <Typography style={styles.totalLabel}>Total Amount</Typography>
//         </View>
//         <TouchableOpacity 
//           style={[styles.continueBtn, activeTotalAmount === 0 && styles.continueBtnDisabled]}
//           disabled={activeTotalAmount === 0 || isSubmitting}
//           onPress={submitBidsToDatabase}
//         >
//           {isSubmitting ? (
//              <ActivityIndicator color="#fff" />
//           ) : (
//             <Typography weight="700" style={[styles.continueText, activeTotalAmount === 0 && styles.continueTextDisabled]}>
//               Continue
//             </Typography>
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const PRIMARY_COLOR = '#6200EA'; 
// const PRIMARY_LIGHT = '#F3E8FF'; 

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' }, 
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: PRIMARY_COLOR, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
//   headerLeft: { flexDirection: 'row', alignItems: 'center' },
//   headerTitle: { fontSize: 20, color: '#fff', marginLeft: 10, letterSpacing: 0.5 },
//   walletBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
//   walletText: { color: '#fff', marginLeft: 6, fontSize: 14 },
//   bodyContent: { padding: 20 },
//   marketName: { textAlign: 'center', color: '#D81B60', fontSize: 18, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 1 },
//   label: { fontSize: 14, color: '#666', marginBottom: 8, marginLeft: 4 },
//   dateBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
//   dateText: { fontSize: 16, color: '#333' },
//   tabContainer: { flexDirection: 'row', backgroundColor: PRIMARY_LIGHT, borderRadius: 12, marginBottom: 20, padding: 4 },
//   tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
//   tabActive: { backgroundColor: PRIMARY_COLOR, shadowColor: PRIMARY_COLOR, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
//   tabInactive: { backgroundColor: 'transparent' },
//   tabText: { fontSize: 15, color: PRIMARY_COLOR },
//   tabTextActive: { color: '#fff' },
//   sessionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
//   sessionBtn: { flex: 0.48, paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
//   sessionActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
//   sessionInactive: { backgroundColor: '#fff', borderColor: '#E5E7EB' },
//   sessionText: { fontSize: 16, color: '#666' },
//   sessionTextActive: { color: '#fff' },
//   inputSection: { marginTop: 10, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
//   inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
//   inputLabel: { fontSize: 15, color: '#444', flex: 1 },
//   textInput: { flex: 1, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15, height: 48, fontSize: 16, color: '#333' },
//   addBtn: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 10, width: '100%' },
//   cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
//   cartDetails: { flexDirection: 'row', alignItems: 'center' },
//   cartNumber: { fontSize: 20, color: '#333', width: 50 },
//   cartBadge: { backgroundColor: PRIMARY_LIGHT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//   cartSession: { color: PRIMARY_COLOR, fontSize: 12 },
//   cartRight: { flexDirection: 'row', alignItems: 'center' },
//   cartAmount: { fontSize: 16, color: '#333', marginRight: 15 },
//   deleteBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },
//   footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
//   footerLeft: { alignItems: 'flex-start', justifyContent: 'center', flex: 0.4 },
//   totalAmountText: { fontSize: 24, color: PRIMARY_COLOR },
//   totalLabel: { fontSize: 13, color: '#666', marginTop: 2 },
//   continueBtn: { flex: 0.6, backgroundColor: PRIMARY_COLOR, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
//   continueBtnDisabled: { backgroundColor: '#D1D5DB' },
//   continueText: { color: '#fff', fontSize: 16 },
//   continueTextDisabled: { color: '#9CA3AF' },
//   classicGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
//   classicBox: { width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', backgroundColor: '#fff' },
//   classicNumWrapper: { backgroundColor: PRIMARY_COLOR, paddingVertical: 14, width: 54, alignItems: 'center', justifyContent: 'center' },
//   classicNum: { color: '#fff', fontSize: 18 },
//   classicInput: { flex: 1, height: '100%', paddingHorizontal: 15, fontSize: 16, color: '#333' },
//   pannaFilterCard: { backgroundColor: PRIMARY_LIGHT, borderRadius: 12, padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
//   pannaFilterBtn: { width: '18%', paddingVertical: 10, margin: '1%', alignItems: 'center', borderRadius: 8 },
//   pannaFilterBtnActive: { backgroundColor: PRIMARY_COLOR },
//   pannaFilterText: { color: PRIMARY_COLOR, fontSize: 16 },
//   pannaFilterTextActive: { color: '#fff' },
// });

















// // After implementing Half sangam
// import React, { useState, useCallback } from 'react';
// import { 
//   View, StyleSheet, TouchableOpacity, TextInput, 
//   FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
// import { ArrowLeft, Wallet, Calendar, Trash2, PlusCircle } from 'lucide-react-native';
// import Typography from './components/Typography';
// import api from './api'; 

// const PRIMARY_COLOR = '#6200EA'; 
// const PRIMARY_LIGHT = '#F3E8FF'; 

// // --- DYNAMIC PANNA GENERATORS ---
// const generateSinglePannas = (targetAnk) => {
//   const target = parseInt(targetAnk, 10);
//   const results = [];
//   const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
//   for (let i = 0; i < digits.length - 2; i++) {
//     for (let j = i + 1; j < digits.length - 1; j++) {
//       for (let k = j + 1; k < digits.length; k++) {
//         if ((digits[i] + digits[j] + digits[k]) % 10 === target) results.push(`${digits[i]}${digits[j]}${digits[k]}`);
//       }
//     }
//   }
//   return results;
// };

// const generateDoublePannas = (targetAnk) => {
//   const target = parseInt(targetAnk, 10);
//   const results = [];
//   const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
//   for (let i = 0; i < digits.length; i++) {
//     for (let j = i; j < digits.length; j++) {
//       for (let k = j; k < digits.length; k++) {
//         if ((i === j && j !== k) || (i !== j && j === k)) {
//           if ((digits[i] + digits[j] + digits[k]) % 10 === target) results.push(`${digits[i]}${digits[j]}${digits[k]}`);
//         }
//       }
//     }
//   }
//   return results;
// };

// export default function BidBoardScreen({ route, navigation }) {
//   const { marketName = "Market", marketId, userId, gameTitle = "Single Digit" } = route.params || {};

//   // --- STATE MANAGEMENT ---
//   const [walletBalance, setWalletBalance] = useState("...");
//   const [session, setSession] = useState('Open');
//   const [tab, setTab] = useState('Advanced'); 
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [bidNumber, setBidNumber] = useState('');
//   const [bidNumber2, setBidNumber2] = useState(''); 
//   const [bidAmount, setBidAmount] = useState('');
//   const [cart, setCart] = useState([]);

//   const [classicInputs, setClassicInputs] = useState({});
//   const [pannaFilter, setPannaFilter] = useState('1'); 

//   // --- FETCH LIVE BALANCE ---
//   useFocusEffect(
//     useCallback(() => {
//       const fetchLiveBalance = async () => {
//         try {
//           const response = await api.get('/auth/me'); 
//           setWalletBalance(response.data.wallet_balance);
//         } catch (error) {
//           setWalletBalance("Error");
//         }
//       };
//       fetchLiveBalance();
//     }, [])
//   );

//   const formattedDate = new Date().toLocaleDateString('en-GB', {
//     weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
//   });

//   // --- DYNAMIC GAME LOGIC ---
//   const titleLower = gameTitle ? gameTitle.toLowerCase() : '';
//   const isSangam = titleLower.includes('sangam');
//   const isHalfSangam = titleLower.includes('half sangam');
//   const isFullSangam = titleLower.includes('full sangam');
//   const isMotor = titleLower.includes('motor');
//   const isTriplePanna = titleLower.includes('triple panna');

//   let maxLength1 = 3;
//   let maxLength2 = 3; 
//   let label1 = "Add Bid Number";
//   let label2 = "Close Number";
//   let placeholder1 = "Enter number";
//   let placeholder2 = "Enter number";

//   if (titleLower.includes('single digit') || titleLower.includes('ank')) {
//     maxLength1 = 1; placeholder1 = "e.g. 5";
//   } else if (titleLower.includes('jodi') || titleLower.includes('family')) {
//     maxLength1 = 2; placeholder1 = "e.g. 45";
//   } else if (titleLower.includes('panna')) {
//     maxLength1 = 3; placeholder1 = "e.g. 145";
//   } else if (isMotor) {
//     maxLength1 = 10; placeholder1 = "e.g. 1234"; 
//   } else if (isHalfSangam) {
//     // MAGICAL HALF SANGAM LOGIC: Flips exactly when session changes!
//     if (session === 'Open') {
//       label1 = "Open Panna"; maxLength1 = 3; placeholder1 = "3-digit Panna";
//       label2 = "Close Digit"; maxLength2 = 1; placeholder2 = "1-digit Ank";
//     } else {
//       label1 = "Open Digit"; maxLength1 = 1; placeholder1 = "1-digit Ank";
//       label2 = "Close Panna"; maxLength2 = 3; placeholder2 = "3-digit Panna";
//     }
//   } else if (isFullSangam) {
//     label1 = "Open Panna"; maxLength1 = 3; placeholder1 = "3-digit Panna";
//     label2 = "Close Panna"; maxLength2 = 3; placeholder2 = "3-digit Panna";
//   }

//   // --- HANDLERS ---
//   const handleSessionChange = (newSession) => {
//     setSession(newSession);
//     // Clear inputs when swapping sessions to prevent length errors
//     if (isSangam) {
//       setBidNumber(''); setBidNumber2(''); 
//     }
//   };

//   const handleAddBid = () => {
//     if (!bidAmount || parseInt(bidAmount) <= 0) return Alert.alert("Invalid Input", "Enter a valid bid amount.");

//     let finalBidNumber = bidNumber;

//     if (isSangam) {
//       if (!bidNumber || !bidNumber2) return Alert.alert("Invalid Input", "Sangam requires both Open and Close numbers.");
//       if (bidNumber.length !== maxLength1) return Alert.alert("Invalid Length", `${label1} must be exactly ${maxLength1} digits.`);
//       if (bidNumber2.length !== maxLength2) return Alert.alert("Invalid Length", `${label2} must be exactly ${maxLength2} digits.`);
//       finalBidNumber = `${bidNumber}-${bidNumber2}`;
//     } else {
//       if (!bidNumber) return Alert.alert("Invalid Input", "Please enter a bid number.");
//       if (!isMotor && bidNumber.length !== maxLength1) return Alert.alert("Invalid Number", `Please enter exactly ${maxLength1} digits.`);
//       if (isMotor && bidNumber.length < 4) return Alert.alert("Invalid Number", "Motors require at least 4 digits.");
//     }

//     const newBid = { id: Date.now().toString(), number: finalBidNumber, amount: parseInt(bidAmount), session: session };
//     setCart([newBid, ...cart]);
//     setBidNumber(''); setBidNumber2(''); setBidAmount('');
//   };

//   const removeBid = (id) => setCart(cart.filter(item => item.id !== id));

//   const generateClassicNumbers = () => {
//     if (maxLength1 === 1) return ['1','2','3','4','5','6','7','8','9','0'];
//     if (maxLength1 === 2) return Array.from({length: 100}, (_, i) => i.toString().padStart(2, '0'));
//     if (maxLength1 === 3 && !isSangam) {
//       if (titleLower.includes('single panna')) return generateSinglePannas(pannaFilter); 
//       if (titleLower.includes('double panna')) return generateDoublePannas(pannaFilter); 
//       if (isTriplePanna) return ['111', '222', '333', '444', '555', '666', '777', '888', '999', '000']; 
//     }
//     return []; 
//   };

//   const submitBidsToDatabase = async () => {
//     let finalBids = (tab === 'Advanced' || isMotor || isSangam) ? [...cart] : Object.entries(classicInputs).filter(([num, amt]) => amt && parseInt(amt) > 0).map(([num, amt]) => ({ number: num, amount: parseInt(amt), session: session }));
//     if (finalBids.length === 0) return Alert.alert("Empty", "Please add at least one bid amount.");

//     setIsSubmitting(true);
//     try {
//       await api.post('/bids/place-bid', { user_id: userId, market_id: marketId, game_type: gameTitle.toUpperCase().replace(' ', '_'), bids: finalBids });
//       Alert.alert("Success!", `Successfully placed ${finalBids.length} bids.`);
//       setCart([]); setClassicInputs({}); navigation.goBack(); 
//     } catch (error) {
//       Alert.alert("Error", error.response?.data?.error || "Failed to place bids.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const activeTotalAmount = (tab === 'Advanced' || isMotor || isSangam) ? cart.reduce((sum, item) => sum + item.amount, 0) : Object.values(classicInputs).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0);

//   const renderClassicGrid = () => {
//     const numbers = generateClassicNumbers();
//     if (numbers.length === 0) return <Typography style={{ textAlign: 'center', marginTop: 20 }}>Classic mode not available for this game type.</Typography>;

//     return (
//       <View>
//         {maxLength1 === 3 && !isSangam && !isTriplePanna && (
//           <View style={styles.pannaFilterCard}>
//             {['1','2','3','4','5','6','7','8','9','0'].map(num => (
//               <TouchableOpacity key={num} style={[styles.pannaFilterBtn, pannaFilter === num && styles.pannaFilterBtnActive]} onPress={() => setPannaFilter(num)}>
//                 <Typography weight="700" style={[styles.pannaFilterText, pannaFilter === num && styles.pannaFilterTextActive]}>{num}</Typography>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//         <View style={styles.classicGrid}>
//           {numbers.map((num) => (
//             <View key={num} style={styles.classicBox}>
//               <View style={styles.classicNumWrapper}><Typography weight="700" style={styles.classicNum}>{num}</Typography></View>
//               <TextInput style={styles.classicInput} keyboardType="number-pad" value={classicInputs[num] || ''} onChangeText={(val) => setClassicInputs(prev => ({ ...prev, [num]: val }))} />
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const renderCartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <View style={styles.cartDetails}>
//         <Typography weight="700" style={styles.cartNumber}>{item.number}</Typography>
//         <View style={styles.cartBadge}><Typography weight="600" style={styles.cartSession}>{item.session}</Typography></View>
//       </View>
//       <View style={styles.cartRight}>
//         <Typography weight="600" style={styles.cartAmount}>₹ {item.amount}</Typography>
//         <TouchableOpacity onPress={() => removeBid(item.id)} style={styles.deleteBtn}><Trash2 color="#ef4444" size={20} /></TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
//           <Typography weight="700" style={styles.headerTitle}>{gameTitle}</Typography>
//         </View>
//         <View style={styles.walletBadge}>
//           <Wallet color="#fff" size={16} />
//           <Typography weight="700" style={styles.walletText}>{walletBalance}</Typography>
//         </View>
//       </View>

//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
//         <FlatList
//           data={(tab === 'Advanced' || isMotor || isSangam) ? cart : []}
//           keyExtractor={(item) => item.id}
//           ListHeaderComponent={
//             <View style={styles.bodyContent}>
//               <Typography weight="700" style={styles.marketName}>{marketName.toLowerCase()}</Typography>

//               <View style={styles.dateBox}>
//                 <Calendar color={PRIMARY_COLOR} size={20} style={{ marginRight: 10 }} />
//                 <Typography weight="600" style={styles.dateText}>{formattedDate}</Typography>
//               </View>

//               {/* TABS (Hidden for Sangam & Motor) */}
//               {!isMotor && !isSangam && (
//                 <View style={styles.tabContainer}>
//                   <TouchableOpacity style={[styles.tabBtn, tab === 'Classic' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Classic')}>
//                     <Typography weight="600" style={[styles.tabText, tab === 'Classic' && styles.tabTextActive]}>Classic</Typography>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.tabBtn, tab === 'Advanced' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Advanced')}>
//                     <Typography weight="600" style={[styles.tabText, tab === 'Advanced' && styles.tabTextActive]}>Advanced</Typography>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               <Typography style={styles.label}>Choose Session</Typography>
//               <View style={styles.sessionContainer}>
//                 <TouchableOpacity style={[styles.sessionBtn, session === 'Open' ? styles.sessionActive : styles.sessionInactive]} onPress={() => handleSessionChange('Open')}>
//                   <Typography weight="600" style={[styles.sessionText, session === 'Open' && styles.sessionTextActive]}>Open</Typography>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.sessionBtn, session === 'Close' ? styles.sessionActive : styles.sessionInactive]} onPress={() => handleSessionChange('Close')}>
//                   <Typography weight="600" style={[styles.sessionText, session === 'Close' && styles.sessionTextActive]}>Close</Typography>
//                 </TouchableOpacity>
//               </View>

//               {tab === 'Advanced' || isMotor || isSangam ? (
//                 <View style={styles.inputSection}>
                  
//                   {/* FIRST INPUT */}
//                   <View style={styles.inputRow}>
//                     <Typography weight="600" style={styles.inputLabel}>{label1}</Typography>
//                     <TextInput 
//                       style={styles.textInput} keyboardType="number-pad" maxLength={maxLength1}
//                       value={bidNumber} onChangeText={setBidNumber} placeholder={placeholder1}
//                     />
//                   </View>

//                   {/* SECOND INPUT (SANGAM ONLY) */}
//                   {isSangam && (
//                     <View style={styles.inputRow}>
//                       <Typography weight="600" style={styles.inputLabel}>{label2}</Typography>
//                       <TextInput 
//                         style={styles.textInput} keyboardType="number-pad" maxLength={maxLength2}
//                         value={bidNumber2} onChangeText={setBidNumber2} placeholder={placeholder2}
//                       />
//                     </View>
//                   )}

//                   {/* AMOUNT INPUT */}
//                   <View style={styles.inputRow}>
//                     <Typography weight="600" style={styles.inputLabel}>Add Amount</Typography>
//                     <TextInput style={styles.textInput} keyboardType="number-pad" value={bidAmount} onChangeText={setBidAmount} placeholder="₹ 0" />
//                   </View>
                  
//                   <TouchableOpacity style={styles.addBtn} onPress={handleAddBid}>
//                     <PlusCircle color="#fff" size={20} style={{ marginRight: 8 }} />
//                     <Typography weight="700" style={{ color: '#fff', fontSize: 16 }}>Add Bid</Typography>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 renderClassicGrid()
//               )}
//             </View>
//           }
//           renderItem={renderCartItem}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         />
//       </KeyboardAvoidingView>

//       <View style={styles.footer}>
//         <View style={styles.footerLeft}>
//           <Typography weight="700" style={styles.totalAmountText}>₹ {activeTotalAmount}</Typography>
//           <Typography style={styles.totalLabel}>Total Amount</Typography>
//         </View>
//         <TouchableOpacity style={[styles.continueBtn, activeTotalAmount === 0 && styles.continueBtnDisabled]} disabled={activeTotalAmount === 0 || isSubmitting} onPress={submitBidsToDatabase}>
//           {isSubmitting ? <ActivityIndicator color="#fff" /> : <Typography weight="700" style={[styles.continueText, activeTotalAmount === 0 && styles.continueTextDisabled]}>Continue</Typography>}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' }, 
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: PRIMARY_COLOR, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
//   headerLeft: { flexDirection: 'row', alignItems: 'center' },
//   headerTitle: { fontSize: 20, color: '#fff', marginLeft: 10, letterSpacing: 0.5 },
//   walletBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
//   walletText: { color: '#fff', marginLeft: 6, fontSize: 14 },
//   bodyContent: { padding: 20 },
//   marketName: { textAlign: 'center', color: '#D81B60', fontSize: 18, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 1 },
//   label: { fontSize: 14, color: '#666', marginBottom: 8, marginLeft: 4 },
//   dateBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
//   dateText: { fontSize: 16, color: '#333' },
//   tabContainer: { flexDirection: 'row', backgroundColor: PRIMARY_LIGHT, borderRadius: 12, marginBottom: 20, padding: 4 },
//   tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
//   tabActive: { backgroundColor: PRIMARY_COLOR, shadowColor: PRIMARY_COLOR, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
//   tabInactive: { backgroundColor: 'transparent' },
//   tabText: { fontSize: 15, color: PRIMARY_COLOR },
//   tabTextActive: { color: '#fff' },
//   sessionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
//   sessionBtn: { flex: 0.48, paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
//   sessionActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
//   sessionInactive: { backgroundColor: '#fff', borderColor: '#E5E7EB' },
//   sessionText: { fontSize: 16, color: '#666' },
//   sessionTextActive: { color: '#fff' },
//   inputSection: { marginTop: 10, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
//   inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
//   inputLabel: { fontSize: 15, color: '#444', flex: 1 },
//   textInput: { flex: 1, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15, height: 48, fontSize: 16, color: '#333' },
//   addBtn: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 10, width: '100%' },
//   cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
//   cartDetails: { flexDirection: 'row', alignItems: 'center' },
//   cartNumber: { fontSize: 20, color: '#333', minWidth: 60 },
//   cartBadge: { backgroundColor: PRIMARY_LIGHT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
//   cartSession: { color: PRIMARY_COLOR, fontSize: 12 },
//   cartRight: { flexDirection: 'row', alignItems: 'center' },
//   cartAmount: { fontSize: 16, color: '#333', marginRight: 15 },
//   deleteBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },
//   footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
//   footerLeft: { alignItems: 'flex-start', justifyContent: 'center', flex: 0.4 },
//   totalAmountText: { fontSize: 24, color: PRIMARY_COLOR },
//   totalLabel: { fontSize: 13, color: '#666', marginTop: 2 },
//   continueBtn: { flex: 0.6, backgroundColor: PRIMARY_COLOR, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
//   continueBtnDisabled: { backgroundColor: '#D1D5DB' },
//   continueText: { color: '#fff', fontSize: 16 },
//   continueTextDisabled: { color: '#9CA3AF' },
//   classicGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
//   classicBox: { width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', backgroundColor: '#fff' },
//   classicNumWrapper: { backgroundColor: PRIMARY_COLOR, paddingVertical: 14, width: 54, alignItems: 'center', justifyContent: 'center' },
//   classicNum: { color: '#fff', fontSize: 18 },
//   classicInput: { flex: 1, height: '100%', paddingHorizontal: 15, fontSize: 16, color: '#333' },
//   pannaFilterCard: { backgroundColor: PRIMARY_LIGHT, borderRadius: 12, padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
//   pannaFilterBtn: { width: '18%', paddingVertical: 10, margin: '1%', alignItems: 'center', borderRadius: 8 },
//   pannaFilterBtnActive: { backgroundColor: PRIMARY_COLOR },
//   pannaFilterText: { color: PRIMARY_COLOR, fontSize: 16 },
//   pannaFilterTextActive: { color: '#fff' },
// });


















// // After implementing Full Sangam
// import React, { useState, useCallback } from 'react';
// import { 
//   View, StyleSheet, TouchableOpacity, TextInput, 
//   FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
// import { ArrowLeft, Wallet, Calendar, Trash2, PlusCircle } from 'lucide-react-native';
// import Typography from './components/Typography';
// import api from './api'; 

// const PRIMARY_COLOR = '#6200EA'; 
// const PRIMARY_LIGHT = '#F3E8FF'; 

// // --- DYNAMIC PANNA GENERATORS ---
// const generateSinglePannas = (targetAnk) => {
//   const target = parseInt(targetAnk, 10);
//   const results = [];
//   const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
//   for (let i = 0; i < digits.length - 2; i++) {
//     for (let j = i + 1; j < digits.length - 1; j++) {
//       for (let k = j + 1; k < digits.length; k++) {
//         if ((digits[i] + digits[j] + digits[k]) % 10 === target) results.push(`${digits[i]}${digits[j]}${digits[k]}`);
//       }
//     }
//   }
//   return results;
// };

// const generateDoublePannas = (targetAnk) => {
//   const target = parseInt(targetAnk, 10);
//   const results = [];
//   const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
//   for (let i = 0; i < digits.length; i++) {
//     for (let j = i; j < digits.length; j++) {
//       for (let k = j; k < digits.length; k++) {
//         if ((i === j && j !== k) || (i !== j && j === k)) {
//           if ((digits[i] + digits[j] + digits[k]) % 10 === target) results.push(`${digits[i]}${digits[j]}${digits[k]}`);
//         }
//       }
//     }
//   }
//   return results;
// };

// export default function BidBoardScreen({ route, navigation }) {
//   const { marketName = "Market", marketId, userId, gameTitle = "Single Digit" } = route.params || {};

//   // --- STATE MANAGEMENT ---
//   const [walletBalance, setWalletBalance] = useState("...");
//   const [session, setSession] = useState('Open');
//   const [tab, setTab] = useState('Advanced'); 
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [bidNumber, setBidNumber] = useState('');
//   const [bidNumber2, setBidNumber2] = useState(''); 
//   const [bidAmount, setBidAmount] = useState('');
//   const [cart, setCart] = useState([]);

//   const [classicInputs, setClassicInputs] = useState({});
//   const [pannaFilter, setPannaFilter] = useState('1'); 

//   // --- FETCH LIVE BALANCE ---
//   useFocusEffect(
//     useCallback(() => {
//       const fetchLiveBalance = async () => {
//         try {
//           const response = await api.get('/auth/me'); 
//           setWalletBalance(response.data.wallet_balance);
//         } catch (error) {
//           setWalletBalance("Error");
//         }
//       };
//       fetchLiveBalance();
//     }, [])
//   );

//   const formattedDate = new Date().toLocaleDateString('en-GB', {
//     weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
//   });

//   // --- DYNAMIC GAME LOGIC ---
//   const titleLower = gameTitle ? gameTitle.toLowerCase() : '';
//   const isSangam = titleLower.includes('sangam');
//   const isHalfSangam = titleLower.includes('half sangam');
//   const isFullSangam = titleLower.includes('full sangam');
//   const isMotor = titleLower.includes('motor');
//   const isTriplePanna = titleLower.includes('triple panna');

//   let maxLength1 = 3;
//   let maxLength2 = 3; 
//   let label1 = "Add Bid Number";
//   let label2 = "Close Number";
//   let placeholder1 = "Enter number";
//   let placeholder2 = "Enter number";

//   if (titleLower.includes('single digit') || titleLower.includes('ank')) {
//     maxLength1 = 1; placeholder1 = "e.g. 5";
//   } else if (titleLower.includes('jodi') || titleLower.includes('family')) {
//     maxLength1 = 2; placeholder1 = "e.g. 45";
//   } else if (titleLower.includes('panna')) {
//     maxLength1 = 3; placeholder1 = "e.g. 145";
//   } else if (isMotor) {
//     maxLength1 = 10; placeholder1 = "e.g. 1234"; 
//   } else if (isHalfSangam) {
//     if (session === 'Open') {
//       label1 = "Open Panna"; maxLength1 = 3; placeholder1 = "3-digit Panna";
//       label2 = "Close Digit"; maxLength2 = 1; placeholder2 = "1-digit Ank";
//     } else {
//       label1 = "Open Digit"; maxLength1 = 1; placeholder1 = "1-digit Ank";
//       label2 = "Close Panna"; maxLength2 = 3; placeholder2 = "3-digit Panna";
//     }
//   } else if (isFullSangam) {
//     // FULL SANGAM LOGIC
//     label1 = "Open Panna"; maxLength1 = 3; placeholder1 = "3-digit Panna";
//     label2 = "Close Panna"; maxLength2 = 3; placeholder2 = "3-digit Panna";
//   }

//   // --- HANDLERS ---
//   const handleSessionChange = (newSession) => {
//     setSession(newSession);
//     if (isSangam) {
//       setBidNumber(''); setBidNumber2(''); 
//     }
//   };

//   const handleAddBid = () => {
//     if (!bidAmount || parseInt(bidAmount) <= 0) return Alert.alert("Invalid Input", "Enter a valid bid amount.");

//     let finalBidNumber = bidNumber;

//     if (isSangam) {
//       if (!bidNumber || !bidNumber2) return Alert.alert("Invalid Input", "Sangam requires both Open and Close numbers.");
//       if (bidNumber.length !== maxLength1) return Alert.alert("Invalid Length", `${label1} must be exactly ${maxLength1} digits.`);
//       if (bidNumber2.length !== maxLength2) return Alert.alert("Invalid Length", `${label2} must be exactly ${maxLength2} digits.`);
//       finalBidNumber = `${bidNumber}-${bidNumber2}`;
//     } else {
//       if (!bidNumber) return Alert.alert("Invalid Input", "Please enter a bid number.");
//       if (!isMotor && bidNumber.length !== maxLength1) return Alert.alert("Invalid Number", `Please enter exactly ${maxLength1} digits.`);
//       if (isMotor && bidNumber.length < 4) return Alert.alert("Invalid Number", "Motors require at least 4 digits.");
//     }

//     // Default to 'Open' (or 'Full' if your DB prefers) behind the scenes for Full Sangam
//     const newBid = { id: Date.now().toString(), number: finalBidNumber, amount: parseInt(bidAmount), session: isFullSangam ? 'Open' : session };
//     setCart([newBid, ...cart]);
//     setBidNumber(''); setBidNumber2(''); setBidAmount('');
//   };

//   const removeBid = (id) => setCart(cart.filter(item => item.id !== id));

//   const generateClassicNumbers = () => {
//     if (maxLength1 === 1) return ['1','2','3','4','5','6','7','8','9','0'];
//     if (maxLength1 === 2) return Array.from({length: 100}, (_, i) => i.toString().padStart(2, '0'));
//     if (maxLength1 === 3 && !isSangam) {
//       if (titleLower.includes('single panna')) return generateSinglePannas(pannaFilter); 
//       if (titleLower.includes('double panna')) return generateDoublePannas(pannaFilter); 
//       if (isTriplePanna) return ['111', '222', '333', '444', '555', '666', '777', '888', '999', '000']; 
//     }
//     return []; 
//   };

//   const submitBidsToDatabase = async () => {
//     let finalBids = (tab === 'Advanced' || isMotor || isSangam) ? [...cart] : Object.entries(classicInputs).filter(([num, amt]) => amt && parseInt(amt) > 0).map(([num, amt]) => ({ number: num, amount: parseInt(amt), session: session }));
//     if (finalBids.length === 0) return Alert.alert("Empty", "Please add at least one bid amount.");

//     setIsSubmitting(true);
//     try {
//       await api.post('/bids/place-bid', { user_id: userId, market_id: marketId, game_type: gameTitle.toUpperCase().replace(' ', '_'), bids: finalBids });
//       Alert.alert("Success!", `Successfully placed ${finalBids.length} bids.`);
//       setCart([]); setClassicInputs({}); navigation.goBack(); 
//     } catch (error) {
//       Alert.alert("Error", error.response?.data?.error || "Failed to place bids.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const activeTotalAmount = (tab === 'Advanced' || isMotor || isSangam) ? cart.reduce((sum, item) => sum + item.amount, 0) : Object.values(classicInputs).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0);

//   const renderClassicGrid = () => {
//     const numbers = generateClassicNumbers();
//     if (numbers.length === 0) return <Typography style={{ textAlign: 'center', marginTop: 20 }}>Classic mode not available for this game type.</Typography>;

//     return (
//       <View>
//         {maxLength1 === 3 && !isSangam && !isTriplePanna && (
//           <View style={styles.pannaFilterCard}>
//             {['1','2','3','4','5','6','7','8','9','0'].map(num => (
//               <TouchableOpacity key={num} style={[styles.pannaFilterBtn, pannaFilter === num && styles.pannaFilterBtnActive]} onPress={() => setPannaFilter(num)}>
//                 <Typography weight="700" style={[styles.pannaFilterText, pannaFilter === num && styles.pannaFilterTextActive]}>{num}</Typography>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//         <View style={styles.classicGrid}>
//           {numbers.map((num) => (
//             <View key={num} style={styles.classicBox}>
//               <View style={styles.classicNumWrapper}><Typography weight="700" style={styles.classicNum}>{num}</Typography></View>
//               <TextInput style={styles.classicInput} keyboardType="number-pad" value={classicInputs[num] || ''} onChangeText={(val) => setClassicInputs(prev => ({ ...prev, [num]: val }))} />
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const renderCartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <View style={styles.cartDetails}>
//         <Typography weight="700" style={styles.cartNumber}>{item.number}</Typography>
//         <View style={styles.cartBadge}><Typography weight="600" style={styles.cartSession}>{item.session}</Typography></View>
//       </View>
//       <View style={styles.cartRight}>
//         <Typography weight="600" style={styles.cartAmount}>₹ {item.amount}</Typography>
//         <TouchableOpacity onPress={() => removeBid(item.id)} style={styles.deleteBtn}><Trash2 color="#ef4444" size={20} /></TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
//           <Typography weight="700" style={styles.headerTitle}>{gameTitle}</Typography>
//         </View>
//         <View style={styles.walletBadge}>
//           <Wallet color="#fff" size={16} />
//           <Typography weight="700" style={styles.walletText}>{walletBalance}</Typography>
//         </View>
//       </View>

//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
//         <FlatList
//           data={(tab === 'Advanced' || isMotor || isSangam) ? cart : []}
//           keyExtractor={(item) => item.id}
//           ListHeaderComponent={
//             <View style={styles.bodyContent}>
//               <Typography weight="700" style={styles.marketName}>{marketName.toLowerCase()}</Typography>

//               <View style={styles.dateBox}>
//                 <Calendar color={PRIMARY_COLOR} size={20} style={{ marginRight: 10 }} />
//                 <Typography weight="600" style={styles.dateText}>{formattedDate}</Typography>
//               </View>

//               {/* TABS (Hidden for Sangam & Motor) */}
//               {!isMotor && !isSangam && (
//                 <View style={styles.tabContainer}>
//                   <TouchableOpacity style={[styles.tabBtn, tab === 'Classic' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Classic')}>
//                     <Typography weight="600" style={[styles.tabText, tab === 'Classic' && styles.tabTextActive]}>Classic</Typography>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.tabBtn, tab === 'Advanced' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Advanced')}>
//                     <Typography weight="600" style={[styles.tabText, tab === 'Advanced' && styles.tabTextActive]}>Advanced</Typography>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               {/* SESSION SELECTOR (Hidden for Full Sangam) */}
//               {!isFullSangam && (
//                 <>
//                   <Typography style={styles.label}>Choose Session</Typography>
//                   <View style={styles.sessionContainer}>
//                     <TouchableOpacity style={[styles.sessionBtn, session === 'Open' ? styles.sessionActive : styles.sessionInactive]} onPress={() => handleSessionChange('Open')}>
//                       <Typography weight="600" style={[styles.sessionText, session === 'Open' && styles.sessionTextActive]}>Open</Typography>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={[styles.sessionBtn, session === 'Close' ? styles.sessionActive : styles.sessionInactive]} onPress={() => handleSessionChange('Close')}>
//                       <Typography weight="600" style={[styles.sessionText, session === 'Close' && styles.sessionTextActive]}>Close</Typography>
//                     </TouchableOpacity>
//                   </View>
//                 </>
//               )}

//               {tab === 'Advanced' || isMotor || isSangam ? (
//                 <View style={styles.inputSection}>
                  
//                   {/* FIRST INPUT */}
//                   <View style={styles.inputRow}>
//                     <Typography weight="600" style={styles.inputLabel}>{label1}</Typography>
//                     <TextInput 
//                       style={styles.textInput} keyboardType="number-pad" maxLength={maxLength1}
//                       value={bidNumber} onChangeText={setBidNumber} placeholder={placeholder1}
//                     />
//                   </View>

//                   {/* SECOND INPUT (SANGAM ONLY) */}
//                   {isSangam && (
//                     <View style={styles.inputRow}>
//                       <Typography weight="600" style={styles.inputLabel}>{label2}</Typography>
//                       <TextInput 
//                         style={styles.textInput} keyboardType="number-pad" maxLength={maxLength2}
//                         value={bidNumber2} onChangeText={setBidNumber2} placeholder={placeholder2}
//                       />
//                     </View>
//                   )}

//                   {/* AMOUNT INPUT */}
//                   <View style={styles.inputRow}>
//                     <Typography weight="600" style={styles.inputLabel}>Add Amount</Typography>
//                     <TextInput style={styles.textInput} keyboardType="number-pad" value={bidAmount} onChangeText={setBidAmount} placeholder="₹ 0" />
//                   </View>
                  
//                   <TouchableOpacity style={styles.addBtn} onPress={handleAddBid}>
//                     <PlusCircle color="#fff" size={20} style={{ marginRight: 8 }} />
//                     <Typography weight="700" style={{ color: '#fff', fontSize: 16 }}>Add Bid</Typography>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 renderClassicGrid()
//               )}
//             </View>
//           }
//           renderItem={renderCartItem}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         />
//       </KeyboardAvoidingView>

//       <View style={styles.footer}>
//         <View style={styles.footerLeft}>
//           <Typography weight="700" style={styles.totalAmountText}>₹ {activeTotalAmount}</Typography>
//           <Typography style={styles.totalLabel}>Total Amount</Typography>
//         </View>
//         <TouchableOpacity style={[styles.continueBtn, activeTotalAmount === 0 && styles.continueBtnDisabled]} disabled={activeTotalAmount === 0 || isSubmitting} onPress={submitBidsToDatabase}>
//           {isSubmitting ? <ActivityIndicator color="#fff" /> : <Typography weight="700" style={[styles.continueText, activeTotalAmount === 0 && styles.continueTextDisabled]}>Continue</Typography>}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' }, 
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: PRIMARY_COLOR, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
//   headerLeft: { flexDirection: 'row', alignItems: 'center' },
//   headerTitle: { fontSize: 20, color: '#fff', marginLeft: 10, letterSpacing: 0.5 },
//   walletBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
//   walletText: { color: '#fff', marginLeft: 6, fontSize: 14 },
//   bodyContent: { padding: 20 },
//   marketName: { textAlign: 'center', color: '#D81B60', fontSize: 18, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 1 },
//   label: { fontSize: 14, color: '#666', marginBottom: 8, marginLeft: 4 },
//   dateBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
//   dateText: { fontSize: 16, color: '#333' },
//   tabContainer: { flexDirection: 'row', backgroundColor: PRIMARY_LIGHT, borderRadius: 12, marginBottom: 20, padding: 4 },
//   tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
//   tabActive: { backgroundColor: PRIMARY_COLOR, shadowColor: PRIMARY_COLOR, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
//   tabInactive: { backgroundColor: 'transparent' },
//   tabText: { fontSize: 15, color: PRIMARY_COLOR },
//   tabTextActive: { color: '#fff' },
//   sessionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
//   sessionBtn: { flex: 0.48, paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
//   sessionActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
//   sessionInactive: { backgroundColor: '#fff', borderColor: '#E5E7EB' },
//   sessionText: { fontSize: 16, color: '#666' },
//   sessionTextActive: { color: '#fff' },
//   inputSection: { marginTop: 10, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
//   inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
//   inputLabel: { fontSize: 15, color: '#444', flex: 1 },
//   textInput: { flex: 1, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15, height: 48, fontSize: 16, color: '#333' },
//   addBtn: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 10, width: '100%' },
//   cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
//   cartDetails: { flexDirection: 'row', alignItems: 'center' },
//   cartNumber: { fontSize: 20, color: '#333', minWidth: 60 },
//   cartBadge: { backgroundColor: PRIMARY_LIGHT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
//   cartSession: { color: PRIMARY_COLOR, fontSize: 12 },
//   cartRight: { flexDirection: 'row', alignItems: 'center' },
//   cartAmount: { fontSize: 16, color: '#333', marginRight: 15 },
//   deleteBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },
//   footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
//   footerLeft: { alignItems: 'flex-start', justifyContent: 'center', flex: 0.4 },
//   totalAmountText: { fontSize: 24, color: PRIMARY_COLOR },
//   totalLabel: { fontSize: 13, color: '#666', marginTop: 2 },
//   continueBtn: { flex: 0.6, backgroundColor: PRIMARY_COLOR, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
//   continueBtnDisabled: { backgroundColor: '#D1D5DB' },
//   continueText: { color: '#fff', fontSize: 16 },
//   continueTextDisabled: { color: '#9CA3AF' },
//   classicGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
//   classicBox: { width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', backgroundColor: '#fff' },
//   classicNumWrapper: { backgroundColor: PRIMARY_COLOR, paddingVertical: 14, width: 54, alignItems: 'center', justifyContent: 'center' },
//   classicNum: { color: '#fff', fontSize: 18 },
//   classicInput: { flex: 1, height: '100%', paddingHorizontal: 15, fontSize: 16, color: '#333' },
//   pannaFilterCard: { backgroundColor: PRIMARY_LIGHT, borderRadius: 12, padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
//   pannaFilterBtn: { width: '18%', paddingVertical: 10, margin: '1%', alignItems: 'center', borderRadius: 8 },
//   pannaFilterBtnActive: { backgroundColor: PRIMARY_COLOR },
//   pannaFilterText: { color: PRIMARY_COLOR, fontSize: 16 },
//   pannaFilterTextActive: { color: '#fff' },
// });












// // After Implementing Family Jodi
// import React, { useState, useCallback } from 'react';
// import { 
//   View, StyleSheet, TouchableOpacity, TextInput, 
//   FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
// import { ArrowLeft, Wallet, Calendar, Trash2, PlusCircle, Settings2 } from 'lucide-react-native';
// import Typography from './components/Typography';
// import api from './api'; 

// const PRIMARY_COLOR = '#6200EA'; 
// const PRIMARY_LIGHT = '#F3E8FF'; 

// // --- DYNAMIC GENERATORS ---
// const generateSinglePannas = (targetAnk) => {
//   const target = parseInt(targetAnk, 10);
//   const results = [];
//   const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
//   for (let i = 0; i < digits.length - 2; i++) {
//     for (let j = i + 1; j < digits.length - 1; j++) {
//       for (let k = j + 1; k < digits.length; k++) {
//         if ((digits[i] + digits[j] + digits[k]) % 10 === target) results.push(`${digits[i]}${digits[j]}${digits[k]}`);
//       }
//     }
//   }
//   return results;
// };

// const generateDoublePannas = (targetAnk) => {
//   const target = parseInt(targetAnk, 10);
//   const results = [];
//   const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
//   for (let i = 0; i < digits.length; i++) {
//     for (let j = i; j < digits.length; j++) {
//       for (let k = j; k < digits.length; k++) {
//         if ((i === j && j !== k) || (i !== j && j === k)) {
//           if ((digits[i] + digits[j] + digits[k]) % 10 === target) results.push(`${digits[i]}${digits[j]}${digits[k]}`);
//         }
//       }
//     }
//   }
//   return results;
// };

// // NEW: Family Jodi Expansion Logic
// const getFamilyJodis = (jodi) => {
//   if (jodi.length !== 2) return [];
//   const cut = {'0':'5', '1':'6', '2':'7', '3':'8', '4':'9', '5':'0', '6':'1', '7':'2', '8':'3', '9':'4'};
//   const a = jodi[0];
//   const b = jodi[1];
//   const ca = cut[a];
//   const cb = cut[b];

//   // Using a Set automatically removes duplicates for doubles (like 11) or half-doubles (like 16)
//   const set = new Set([
//     `${a}${b}`, `${a}${cb}`, `${ca}${b}`, `${ca}${cb}`,
//     `${b}${a}`, `${cb}${a}`, `${b}${ca}`, `${cb}${ca}`
//   ]);
//   return Array.from(set);
// };

// export default function BidBoardScreen({ route, navigation }) {
//   const { marketName = "Market", marketId, userId, gameTitle = "Single Digit" } = route.params || {};

//   // --- STATE MANAGEMENT ---
//   const [walletBalance, setWalletBalance] = useState("...");
//   const [session, setSession] = useState('Open');
//   const [tab, setTab] = useState('Advanced'); 
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [bidNumber, setBidNumber] = useState('');
//   const [bidNumber2, setBidNumber2] = useState(''); 
//   const [bidAmount, setBidAmount] = useState('');
//   const [cart, setCart] = useState([]);

//   const [classicInputs, setClassicInputs] = useState({});
//   const [pannaFilter, setPannaFilter] = useState('1'); 

//   // --- FETCH LIVE BALANCE ---
//   useFocusEffect(
//     useCallback(() => {
//       const fetchLiveBalance = async () => {
//         try {
//           const response = await api.get('/auth/me'); 
//           setWalletBalance(response.data.wallet_balance);
//         } catch (error) {
//           setWalletBalance("Error");
//         }
//       };
//       fetchLiveBalance();
//     }, [])
//   );

//   const formattedDate = new Date().toLocaleDateString('en-GB', {
//     weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
//   });

//   // --- DYNAMIC GAME LOGIC ---
//   const titleLower = gameTitle ? gameTitle.toLowerCase() : '';
//   const isSangam = titleLower.includes('sangam');
//   const isHalfSangam = titleLower.includes('half sangam');
//   const isFullSangam = titleLower.includes('full sangam');
//   const isMotor = titleLower.includes('motor');
//   const isTriplePanna = titleLower.includes('triple panna');
//   const isFamilyJodi = titleLower.includes('family jodi'); // NEW

//   // UI Toggles to keep rendering clean
//   const hideTabs = isMotor || isSangam || isFamilyJodi;
//   const hideSession = isFullSangam || isFamilyJodi;

//   let maxLength1 = 3;
//   let maxLength2 = 3; 
//   let label1 = "Add Bid Number";
//   let label2 = "Close Number";
//   let placeholder1 = "Enter number";
//   let placeholder2 = "Enter number";

//   if (titleLower.includes('single digit') || titleLower.includes('ank')) {
//     maxLength1 = 1; placeholder1 = "e.g. 5";
//   } else if (titleLower.includes('jodi') && !isFamilyJodi) {
//     maxLength1 = 2; placeholder1 = "e.g. 45";
//   } else if (titleLower.includes('panna')) {
//     maxLength1 = 3; placeholder1 = "e.g. 145";
//   } else if (isMotor) {
//     maxLength1 = 10; placeholder1 = "e.g. 1234"; 
//   } else if (isFamilyJodi) {
//     label1 = "Enter Digit"; maxLength1 = 2; placeholder1 = "2-digit Jodi";
//   } else if (isHalfSangam) {
//     if (session === 'Open') {
//       label1 = "Open Panna"; maxLength1 = 3; placeholder1 = "3-digit Panna";
//       label2 = "Close Digit"; maxLength2 = 1; placeholder2 = "1-digit Ank";
//     } else {
//       label1 = "Open Digit"; maxLength1 = 1; placeholder1 = "1-digit Ank";
//       label2 = "Close Panna"; maxLength2 = 3; placeholder2 = "3-digit Panna";
//     }
//   } else if (isFullSangam) {
//     label1 = "Open Panna"; maxLength1 = 3; placeholder1 = "3-digit Panna";
//     label2 = "Close Panna"; maxLength2 = 3; placeholder2 = "3-digit Panna";
//   }

//   // --- HANDLERS ---
//   const handleSessionChange = (newSession) => {
//     setSession(newSession);
//     if (isSangam) { setBidNumber(''); setBidNumber2(''); }
//   };

//   const handleAddBid = () => {
//     if (!bidAmount || parseInt(bidAmount) <= 0) return Alert.alert("Invalid Input", "Enter a valid bid amount.");

//     // NEW: Handle Family Jodi Batch Generation
//     if (isFamilyJodi) {
//       if (bidNumber.length !== 2) return Alert.alert("Invalid Length", "Family Jodi requires exactly 2 digits.");
      
//       const familyArray = getFamilyJodis(bidNumber);
//       const generatedBids = familyArray.map((num, idx) => ({
//         id: Date.now().toString() + idx, // Unique ID for each array item
//         number: num,
//         amount: parseInt(bidAmount),
//         session: 'Open' // Defaults to Open for Jodi games
//       }));

//       setCart(generatedBids);
//       setBidNumber(''); setBidAmount('');
//       return; 
//     }

//     // Standard Processing
//     let finalBidNumber = bidNumber;
//     if (isSangam) {
//       if (!bidNumber || !bidNumber2) return Alert.alert("Invalid Input", "Sangam requires both Open and Close numbers.");
//       if (bidNumber.length !== maxLength1) return Alert.alert("Invalid Length", `${label1} must be exactly ${maxLength1} digits.`);
//       if (bidNumber2.length !== maxLength2) return Alert.alert("Invalid Length", `${label2} must be exactly ${maxLength2} digits.`);
//       finalBidNumber = `${bidNumber}-${bidNumber2}`;
//     } else {
//       if (!bidNumber) return Alert.alert("Invalid Input", "Please enter a bid number.");
//       if (!isMotor && bidNumber.length !== maxLength1) return Alert.alert("Invalid Number", `Please enter exactly ${maxLength1} digits.`);
//       if (isMotor && bidNumber.length < 4) return Alert.alert("Invalid Number", "Motors require at least 4 digits.");
//     }

//     const newBid = { id: Date.now().toString(), number: finalBidNumber, amount: parseInt(bidAmount), session: isFullSangam ? 'Open' : session };
//     setCart([newBid, ...cart]);
//     setBidNumber(''); setBidNumber2(''); setBidAmount('');
//   };

//   const removeBid = (id) => setCart(cart.filter(item => item.id !== id));

//   const generateClassicNumbers = () => {
//     if (maxLength1 === 1) return ['1','2','3','4','5','6','7','8','9','0'];
//     if (maxLength1 === 2) return Array.from({length: 100}, (_, i) => i.toString().padStart(2, '0'));
//     if (maxLength1 === 3 && !isSangam) {
//       if (titleLower.includes('single panna')) return generateSinglePannas(pannaFilter); 
//       if (titleLower.includes('double panna')) return generateDoublePannas(pannaFilter); 
//       if (isTriplePanna) return ['111', '222', '333', '444', '555', '666', '777', '888', '999', '000']; 
//     }
//     return []; 
//   };

//   const submitBidsToDatabase = async () => {
//     let finalBids = (!hideTabs && tab === 'Classic') ? Object.entries(classicInputs).filter(([num, amt]) => amt && parseInt(amt) > 0).map(([num, amt]) => ({ number: num, amount: parseInt(amt), session: session })) : [...cart];
    
//     if (finalBids.length === 0) return Alert.alert("Empty", "Please add at least one bid amount.");

//     setIsSubmitting(true);
//     try {
//       await api.post('/bids/place-bid', { user_id: userId, market_id: marketId, game_type: gameTitle.toUpperCase().replace(' ', '_'), bids: finalBids });
//       Alert.alert("Success!", `Successfully placed ${finalBids.length} bids.`);
//       setCart([]); setClassicInputs({}); navigation.goBack(); 
//     } catch (error) {
//       Alert.alert("Error", error.response?.data?.error || "Failed to place bids.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const activeTotalAmount = (!hideTabs && tab === 'Classic') ? Object.values(classicInputs).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0) : cart.reduce((sum, item) => sum + item.amount, 0);

//   const renderClassicGrid = () => {
//     const numbers = generateClassicNumbers();
//     if (numbers.length === 0) return <Typography style={{ textAlign: 'center', marginTop: 20 }}>Classic mode not available for this game type.</Typography>;

//     return (
//       <View>
//         {maxLength1 === 3 && !isSangam && !isTriplePanna && (
//           <View style={styles.pannaFilterCard}>
//             {['1','2','3','4','5','6','7','8','9','0'].map(num => (
//               <TouchableOpacity key={num} style={[styles.pannaFilterBtn, pannaFilter === num && styles.pannaFilterBtnActive]} onPress={() => setPannaFilter(num)}>
//                 <Typography weight="700" style={[styles.pannaFilterText, pannaFilter === num && styles.pannaFilterTextActive]}>{num}</Typography>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//         <View style={styles.classicGrid}>
//           {numbers.map((num) => (
//             <View key={num} style={styles.classicBox}>
//               <View style={styles.classicNumWrapper}><Typography weight="700" style={styles.classicNum}>{num}</Typography></View>
//               <TextInput style={styles.classicInput} keyboardType="number-pad" value={classicInputs[num] || ''} onChangeText={(val) => setClassicInputs(prev => ({ ...prev, [num]: val }))} />
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const renderCartItem = ({ item }) => (
//     <View style={styles.cartItem}>
//       <View style={styles.cartDetails}>
//         <Typography weight="700" style={styles.cartNumber}>{item.number}</Typography>
//         <View style={styles.cartBadge}><Typography weight="600" style={styles.cartSession}>{item.session}</Typography></View>
//       </View>
//       <View style={styles.cartRight}>
//         <Typography weight="600" style={styles.cartAmount}>₹ {item.amount}</Typography>
//         <TouchableOpacity onPress={() => removeBid(item.id)} style={styles.deleteBtn}><Trash2 color="#ef4444" size={20} /></TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
//           <Typography weight="700" style={styles.headerTitle}>{gameTitle}</Typography>
//         </View>
//         <View style={styles.walletBadge}>
//           <Wallet color="#fff" size={16} />
//           <Typography weight="700" style={styles.walletText}>{walletBalance}</Typography>
//         </View>
//       </View>

//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
//         <FlatList
//           data={(hideTabs || tab === 'Advanced') ? cart : []}
//           keyExtractor={(item) => item.id}
//           ListHeaderComponent={
//             <View style={styles.bodyContent}>
//               <Typography weight="700" style={styles.marketName}>{marketName.toLowerCase()}</Typography>

//               <View style={styles.dateBox}>
//                 <Calendar color={PRIMARY_COLOR} size={20} style={{ marginRight: 10 }} />
//                 <Typography weight="600" style={styles.dateText}>{formattedDate}</Typography>
//               </View>

//               {!hideTabs && (
//                 <View style={styles.tabContainer}>
//                   <TouchableOpacity style={[styles.tabBtn, tab === 'Classic' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Classic')}>
//                     <Typography weight="600" style={[styles.tabText, tab === 'Classic' && styles.tabTextActive]}>Classic</Typography>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.tabBtn, tab === 'Advanced' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Advanced')}>
//                     <Typography weight="600" style={[styles.tabText, tab === 'Advanced' && styles.tabTextActive]}>Advanced</Typography>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               {!hideSession && (
//                 <>
//                   <Typography style={styles.label}>Choose Session</Typography>
//                   <View style={styles.sessionContainer}>
//                     <TouchableOpacity style={[styles.sessionBtn, session === 'Open' ? styles.sessionActive : styles.sessionInactive]} onPress={() => handleSessionChange('Open')}>
//                       <Typography weight="600" style={[styles.sessionText, session === 'Open' && styles.sessionTextActive]}>Open</Typography>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={[styles.sessionBtn, session === 'Close' ? styles.sessionActive : styles.sessionInactive]} onPress={() => handleSessionChange('Close')}>
//                       <Typography weight="600" style={[styles.sessionText, session === 'Close' && styles.sessionTextActive]}>Close</Typography>
//                     </TouchableOpacity>
//                   </View>
//                 </>
//               )}

//               {hideTabs || tab === 'Advanced' ? (
//                 <View style={styles.inputSection}>
                  
//                   <View style={styles.inputRow}>
//                     <Typography weight="600" style={styles.inputLabel}>{label1}</Typography>
//                     <TextInput 
//                       style={styles.textInput} keyboardType="number-pad" maxLength={maxLength1}
//                       value={bidNumber} onChangeText={setBidNumber} placeholder={placeholder1}
//                     />
//                   </View>

//                   {isSangam && (
//                     <View style={styles.inputRow}>
//                       <Typography weight="600" style={styles.inputLabel}>{label2}</Typography>
//                       <TextInput 
//                         style={styles.textInput} keyboardType="number-pad" maxLength={maxLength2}
//                         value={bidNumber2} onChangeText={setBidNumber2} placeholder={placeholder2}
//                       />
//                     </View>
//                   )}

//                   <View style={styles.inputRow}>
//                     <Typography weight="600" style={styles.inputLabel}>Add Amount</Typography>
//                     <TextInput style={styles.textInput} keyboardType="number-pad" value={bidAmount} onChangeText={setBidAmount} placeholder="₹ 0" />
//                   </View>
                  
//                   <TouchableOpacity style={styles.addBtn} onPress={handleAddBid}>
//                     {/* DYNAMIC BUTTON TEXT & ICON */}
//                     {isFamilyJodi ? (
//                       <>
//                         <Settings2 color="#fff" size={20} style={{ marginRight: 8 }} />
//                         <Typography weight="700" style={{ color: '#fff', fontSize: 16 }}>Generate</Typography>
//                       </>
//                     ) : (
//                       <>
//                         <PlusCircle color="#fff" size={20} style={{ marginRight: 8 }} />
//                         <Typography weight="700" style={{ color: '#fff', fontSize: 16 }}>Add Bid</Typography>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 renderClassicGrid()
//               )}
//             </View>
//           }
//           renderItem={renderCartItem}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         />
//       </KeyboardAvoidingView>

//       <View style={styles.footer}>
//         <View style={styles.footerLeft}>
//           <Typography weight="700" style={styles.totalAmountText}>₹ {activeTotalAmount}</Typography>
//           <Typography style={styles.totalLabel}>Total Amount</Typography>
//         </View>
//         <TouchableOpacity style={[styles.continueBtn, activeTotalAmount === 0 && styles.continueBtnDisabled]} disabled={activeTotalAmount === 0 || isSubmitting} onPress={submitBidsToDatabase}>
//           {isSubmitting ? <ActivityIndicator color="#fff" /> : <Typography weight="700" style={[styles.continueText, activeTotalAmount === 0 && styles.continueTextDisabled]}>Continue</Typography>}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' }, 
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: PRIMARY_COLOR, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
//   headerLeft: { flexDirection: 'row', alignItems: 'center' },
//   headerTitle: { fontSize: 20, color: '#fff', marginLeft: 10, letterSpacing: 0.5 },
//   walletBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
//   walletText: { color: '#fff', marginLeft: 6, fontSize: 14 },
//   bodyContent: { padding: 20 },
//   marketName: { textAlign: 'center', color: '#D81B60', fontSize: 18, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 1 },
//   label: { fontSize: 14, color: '#666', marginBottom: 8, marginLeft: 4 },
//   dateBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
//   dateText: { fontSize: 16, color: '#333' },
//   tabContainer: { flexDirection: 'row', backgroundColor: PRIMARY_LIGHT, borderRadius: 12, marginBottom: 20, padding: 4 },
//   tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
//   tabActive: { backgroundColor: PRIMARY_COLOR, shadowColor: PRIMARY_COLOR, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
//   tabInactive: { backgroundColor: 'transparent' },
//   tabText: { fontSize: 15, color: PRIMARY_COLOR },
//   tabTextActive: { color: '#fff' },
//   sessionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
//   sessionBtn: { flex: 0.48, paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
//   sessionActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
//   sessionInactive: { backgroundColor: '#fff', borderColor: '#E5E7EB' },
//   sessionText: { fontSize: 16, color: '#666' },
//   sessionTextActive: { color: '#fff' },
//   inputSection: { marginTop: 10, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
//   inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
//   inputLabel: { fontSize: 15, color: '#444', flex: 1 },
//   textInput: { flex: 1, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15, height: 48, fontSize: 16, color: '#333' },
//   addBtn: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 10, width: '100%' },
//   cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
//   cartDetails: { flexDirection: 'row', alignItems: 'center' },
//   cartNumber: { fontSize: 20, color: '#333', minWidth: 60 },
//   cartBadge: { backgroundColor: PRIMARY_LIGHT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
//   cartSession: { color: PRIMARY_COLOR, fontSize: 12 },
//   cartRight: { flexDirection: 'row', alignItems: 'center' },
//   cartAmount: { fontSize: 16, color: '#333', marginRight: 15 },
//   deleteBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },
//   footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
//   footerLeft: { alignItems: 'flex-start', justifyContent: 'center', flex: 0.4 },
//   totalAmountText: { fontSize: 24, color: PRIMARY_COLOR },
//   totalLabel: { fontSize: 13, color: '#666', marginTop: 2 },
//   continueBtn: { flex: 0.6, backgroundColor: PRIMARY_COLOR, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
//   continueBtnDisabled: { backgroundColor: '#D1D5DB' },
//   continueText: { color: '#fff', fontSize: 16 },
//   continueTextDisabled: { color: '#9CA3AF' },
//   classicGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
//   classicBox: { width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', backgroundColor: '#fff' },
//   classicNumWrapper: { backgroundColor: PRIMARY_COLOR, paddingVertical: 14, width: 54, alignItems: 'center', justifyContent: 'center' },
//   classicNum: { color: '#fff', fontSize: 18 },
//   classicInput: { flex: 1, height: '100%', paddingHorizontal: 15, fontSize: 16, color: '#333' },
//   pannaFilterCard: { backgroundColor: PRIMARY_LIGHT, borderRadius: 12, padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
//   pannaFilterBtn: { width: '18%', paddingVertical: 10, margin: '1%', alignItems: 'center', borderRadius: 8 },
//   pannaFilterBtnActive: { backgroundColor: PRIMARY_COLOR },
//   pannaFilterText: { color: PRIMARY_COLOR, fontSize: 16 },
//   pannaFilterTextActive: { color: '#fff' },
// });



















// After implementing SP motor & DP motor generate function
import React, { useState, useCallback } from 'react';
import { 
  View, StyleSheet, TouchableOpacity, TextInput, 
  FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Wallet, Calendar, Trash2, PlusCircle, Settings2 } from 'lucide-react-native';
import Typography from './components/Typography';
import api from './api'; 

const PRIMARY_COLOR = '#6200EA'; 
const PRIMARY_LIGHT = '#F3E8FF'; 

// --- MATKA SORTING HELPER ('0' goes at the end) ---
const sortMatkaDigits = (digitsArray) => {
  const order = "1234567890";
  return digitsArray.sort((a, b) => order.indexOf(a) - order.indexOf(b));
};

// --- DYNAMIC GENERATORS ---
const generateSinglePannas = (targetAnk) => {
  const target = parseInt(targetAnk, 10);
  const results = [];
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  for (let i = 0; i < digits.length - 2; i++) {
    for (let j = i + 1; j < digits.length - 1; j++) {
      for (let k = j + 1; k < digits.length; k++) {
        if ((digits[i] + digits[j] + digits[k]) % 10 === target) results.push(`${digits[i]}${digits[j]}${digits[k]}`);
      }
    }
  }
  return results;
};

const generateDoublePannas = (targetAnk) => {
  const target = parseInt(targetAnk, 10);
  const results = [];
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  for (let i = 0; i < digits.length; i++) {
    for (let j = i; j < digits.length; j++) {
      for (let k = j; k < digits.length; k++) {
        if ((i === j && j !== k) || (i !== j && j === k)) {
          if ((digits[i] + digits[j] + digits[k]) % 10 === target) results.push(`${digits[i]}${digits[j]}${digits[k]}`);
        }
      }
    }
  }
  return results;
};

// FAMILY JODI GENERATOR
const getFamilyJodis = (jodi) => {
  if (jodi.length !== 2) return [];
  const cut = {'0':'5', '1':'6', '2':'7', '3':'8', '4':'9', '5':'0', '6':'1', '7':'2', '8':'3', '9':'4'};
  const a = jodi[0]; const b = jodi[1];
  const ca = cut[a]; const cb = cut[b];
  const set = new Set([ `${a}${b}`, `${a}${cb}`, `${ca}${b}`, `${ca}${cb}`, `${b}${a}`, `${cb}${a}`, `${b}${ca}`, `${cb}${ca}` ]);
  return Array.from(set);
};

// SP MOTOR GENERATOR
const getSPMotor = (inputStr) => {
  // Extract unique digits and sort them in Matka order
  const uniqueDigits = Array.from(new Set(inputStr.split('')));
  const digits = sortMatkaDigits(uniqueDigits);
  const results = [];
  if (digits.length < 3) return results;

  for (let i = 0; i < digits.length - 2; i++) {
    for (let j = i + 1; j < digits.length - 1; j++) {
      for (let k = j + 1; k < digits.length; k++) {
        results.push(`${digits[i]}${digits[j]}${digits[k]}`);
      }
    }
  }
  return results;
};

// DP MOTOR GENERATOR
const getDPMotor = (inputStr) => {
  const uniqueDigits = Array.from(new Set(inputStr.split('')));
  const digits = sortMatkaDigits(uniqueDigits);
  const results = [];
  if (digits.length < 2) return results;

  for (let i = 0; i < digits.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      if (i !== j) {
        // Double digit i, single digit j
        const panna = sortMatkaDigits([digits[i], digits[i], digits[j]]).join('');
        results.push(panna);
      }
    }
  }
  // Use Set to ensure we don't accidentally push duplicates 
  return Array.from(new Set(results));
};

export default function BidBoardScreen({ route, navigation }) {
  const { marketName = "Market", marketId, userId, gameTitle = "Single Digit" } = route.params || {};

  const [walletBalance, setWalletBalance] = useState("...");
  const [session, setSession] = useState('Open');
  const [tab, setTab] = useState('Advanced'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bidNumber, setBidNumber] = useState('');
  const [bidNumber2, setBidNumber2] = useState(''); 
  const [bidAmount, setBidAmount] = useState('');
  const [cart, setCart] = useState([]);
  const [classicInputs, setClassicInputs] = useState({});
  const [pannaFilter, setPannaFilter] = useState('1'); 

  useFocusEffect(
    useCallback(() => {
      const fetchLiveBalance = async () => {
        try {
          const response = await api.get('/auth/me'); 
          setWalletBalance(response.data.wallet_balance);
        } catch (error) { setWalletBalance("Error"); }
      };
      fetchLiveBalance();
    }, [])
  );

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const titleLower = gameTitle ? gameTitle.toLowerCase() : '';
  const isSangam = titleLower.includes('sangam');
  const isHalfSangam = titleLower.includes('half sangam');
  const isFullSangam = titleLower.includes('full sangam');
  const isFamilyJodi = titleLower.includes('family jodi');
  const isSPMotor = titleLower.includes('sp motor');
  const isDPMotor = titleLower.includes('dp motor');
  const isMotor = isSPMotor || isDPMotor || titleLower.includes('motor'); 
  const isTriplePanna = titleLower.includes('triple panna');

  const hideTabs = isMotor || isSangam || isFamilyJodi;
  const hideSession = isFullSangam || isFamilyJodi;

  let maxLength1 = 3;
  let maxLength2 = 3; 
  let label1 = "Add Bid Number";
  let label2 = "Close Number";
  let placeholder1 = "Enter number";
  let placeholder2 = "Enter number";

  if (titleLower.includes('single digit') || titleLower.includes('ank')) {
    maxLength1 = 1; placeholder1 = "e.g. 5";
  } else if (titleLower.includes('jodi') && !isFamilyJodi) {
    maxLength1 = 2; placeholder1 = "e.g. 45";
  } else if (titleLower.includes('panna')) {
    maxLength1 = 3; placeholder1 = "e.g. 145";
  } else if (isMotor) {
    // label1 = "Number"; maxLength1 = 10; placeholder1 = "Enter Digits"; 
    label1 = "Number"; maxLength1 = 7; placeholder1 = "Enter 4 to 7 digits";
  } else if (isFamilyJodi) {
    label1 = "Enter Digit"; maxLength1 = 2; placeholder1 = "2-digit Jodi";
  } else if (isHalfSangam) {
    if (session === 'Open') {
      label1 = "Open Panna"; maxLength1 = 3; placeholder1 = "3-digit Panna";
      label2 = "Close Digit"; maxLength2 = 1; placeholder2 = "1-digit Ank";
    } else {
      label1 = "Open Digit"; maxLength1 = 1; placeholder1 = "1-digit Ank";
      label2 = "Close Panna"; maxLength2 = 3; placeholder2 = "3-digit Panna";
    }
  } else if (isFullSangam) {
    label1 = "Open Panna"; maxLength1 = 3; placeholder1 = "3-digit Panna";
    label2 = "Close Panna"; maxLength2 = 3; placeholder2 = "3-digit Panna";
  }

  const handleSessionChange = (newSession) => {
    setSession(newSession);
    if (isSangam) { setBidNumber(''); setBidNumber2(''); }
  };

  const handleAddBid = () => {
    if (!bidAmount || parseInt(bidAmount) <= 0) return Alert.alert("Invalid Input", "Enter a valid bid amount.");

    // 1. Handle Family Jodi Generation
    if (isFamilyJodi) {
      if (bidNumber.length !== 2) return Alert.alert("Invalid Length", "Family Jodi requires exactly 2 digits.");
      const generatedBids = getFamilyJodis(bidNumber).map((num, idx) => ({
        id: Date.now().toString() + idx, number: num, amount: parseInt(bidAmount), session: 'Open'
      }));
      setCart(generatedBids); setBidNumber(''); setBidAmount('');
      return; 
    }

    // 2. Handle Motor Generation
    if (isMotor) {
      // NEW: Strict length validation for Motors
      if (bidNumber.length < 4 || bidNumber.length > 7) {
        return Alert.alert("Invalid Length", "Motor games require between 4 and 7 digits.");
      }

      const uniqueCount = new Set(bidNumber.split('')).size;

      // === ADD THIS NEW CHECK RIGHT HERE ===
      if (uniqueCount !== bidNumber.length) {
        return Alert.alert("Invalid Input", "All digits in a Motor must be unique. Do not repeat digits.");
      }
      
      if (isSPMotor && uniqueCount < 3) return Alert.alert("Invalid Input", "SP Motor requires at least 3 unique digits.");
      if (isDPMotor && uniqueCount < 2) return Alert.alert("Invalid Input", "DP Motor requires at least 2 unique digits.");
      
      const motorArray = isSPMotor ? getSPMotor(bidNumber) : (isDPMotor ? getDPMotor(bidNumber) : []);
      
      const generatedBids = motorArray.map((num, idx) => ({
        id: Date.now().toString() + idx, number: num, amount: parseInt(bidAmount), session: session 
      }));
      
      setCart(generatedBids); setBidNumber(''); setBidAmount('');
      return;
    }

    // 3. Standard Processing
    let finalBidNumber = bidNumber;
    if (isSangam) {
      if (!bidNumber || !bidNumber2) return Alert.alert("Invalid Input", "Sangam requires both Open and Close numbers.");
      if (bidNumber.length !== maxLength1) return Alert.alert("Invalid Length", `${label1} must be exactly ${maxLength1} digits.`);
      if (bidNumber2.length !== maxLength2) return Alert.alert("Invalid Length", `${label2} must be exactly ${maxLength2} digits.`);
      finalBidNumber = `${bidNumber}-${bidNumber2}`;
    } else {
      if (!bidNumber) return Alert.alert("Invalid Input", "Please enter a bid number.");
      if (bidNumber.length !== maxLength1) return Alert.alert("Invalid Number", `Please enter exactly ${maxLength1} digits.`);
    }

    const newBid = { id: Date.now().toString(), number: finalBidNumber, amount: parseInt(bidAmount), session: isFullSangam ? 'Open' : session };
    setCart([newBid, ...cart]); setBidNumber(''); setBidNumber2(''); setBidAmount('');
  };

  const removeBid = (id) => setCart(cart.filter(item => item.id !== id));

  const generateClassicNumbers = () => {
    if (maxLength1 === 1) return ['1','2','3','4','5','6','7','8','9','0'];
    if (maxLength1 === 2) return Array.from({length: 100}, (_, i) => i.toString().padStart(2, '0'));
    if (maxLength1 === 3 && !isSangam) {
      if (titleLower.includes('single panna')) return generateSinglePannas(pannaFilter); 
      if (titleLower.includes('double panna')) return generateDoublePannas(pannaFilter); 
      if (isTriplePanna) return ['111', '222', '333', '444', '555', '666', '777', '888', '999', '000']; 
    }
    return []; 
  };

  const submitBidsToDatabase = async () => {
    let finalBids = (!hideTabs && tab === 'Classic') ? Object.entries(classicInputs).filter(([num, amt]) => amt && parseInt(amt) > 0).map(([num, amt]) => ({ number: num, amount: parseInt(amt), session: session })) : [...cart];
    if (finalBids.length === 0) return Alert.alert("Empty", "Please add at least one bid amount.");

    setIsSubmitting(true);
    try {
      await api.post('/bids/place-bid', { user_id: userId, market_id: marketId, game_type: gameTitle.toUpperCase().replace(' ', '_'), bids: finalBids });
      Alert.alert("Success!", `Successfully placed ${finalBids.length} bids.`);
      setCart([]); setClassicInputs({}); navigation.goBack(); 
    } catch (error) { Alert.alert("Error", error.response?.data?.error || "Failed to place bids."); } 
    finally { setIsSubmitting(false); }
  };

  const activeTotalAmount = (!hideTabs && tab === 'Classic') ? Object.values(classicInputs).reduce((sum, amt) => sum + (parseInt(amt) || 0), 0) : cart.reduce((sum, item) => sum + item.amount, 0);

  const renderClassicGrid = () => {
    const numbers = generateClassicNumbers();
    if (numbers.length === 0) return <Typography style={{ textAlign: 'center', marginTop: 20 }}>Classic mode not available for this game type.</Typography>;

    return (
      <View>
        {maxLength1 === 3 && !isSangam && !isTriplePanna && (
          <View style={styles.pannaFilterCard}>
            {['1','2','3','4','5','6','7','8','9','0'].map(num => (
              <TouchableOpacity key={num} style={[styles.pannaFilterBtn, pannaFilter === num && styles.pannaFilterBtnActive]} onPress={() => setPannaFilter(num)}>
                <Typography weight="700" style={[styles.pannaFilterText, pannaFilter === num && styles.pannaFilterTextActive]}>{num}</Typography>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.classicGrid}>
          {numbers.map((num) => (
            <View key={num} style={styles.classicBox}>
              <View style={styles.classicNumWrapper}><Typography weight="700" style={styles.classicNum}>{num}</Typography></View>
              <TextInput style={styles.classicInput} keyboardType="number-pad" value={classicInputs[num] || ''} onChangeText={(val) => setClassicInputs(prev => ({ ...prev, [num]: val }))} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartDetails}>
        <Typography weight="700" style={styles.cartNumber}>{item.number}</Typography>
        <View style={styles.cartBadge}><Typography weight="600" style={styles.cartSession}>{item.session}</Typography></View>
      </View>
      <View style={styles.cartRight}>
        <Typography weight="600" style={styles.cartAmount}>₹ {item.amount}</Typography>
        <TouchableOpacity onPress={() => removeBid(item.id)} style={styles.deleteBtn}><Trash2 color="#ef4444" size={20} /></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
          <Typography weight="700" style={styles.headerTitle}>{gameTitle}</Typography>
        </View>
        <View style={styles.walletBadge}>
          <Wallet color="#fff" size={16} />
          <Typography weight="700" style={styles.walletText}>{walletBalance}</Typography>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <FlatList
          data={(hideTabs || tab === 'Advanced') ? cart : []}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.bodyContent}>
              <Typography weight="700" style={styles.marketName}>{marketName.toLowerCase()}</Typography>

              <View style={styles.dateBox}>
                <Calendar color={PRIMARY_COLOR} size={20} style={{ marginRight: 10 }} />
                <Typography weight="600" style={styles.dateText}>{formattedDate}</Typography>
              </View>

              {!hideTabs && (
                <View style={styles.tabContainer}>
                  <TouchableOpacity style={[styles.tabBtn, tab === 'Classic' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Classic')}>
                    <Typography weight="600" style={[styles.tabText, tab === 'Classic' && styles.tabTextActive]}>Classic</Typography>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tabBtn, tab === 'Advanced' ? styles.tabActive : styles.tabInactive]} onPress={() => setTab('Advanced')}>
                    <Typography weight="600" style={[styles.tabText, tab === 'Advanced' && styles.tabTextActive]}>Advanced</Typography>
                  </TouchableOpacity>
                </View>
              )}

              {!hideSession && (
                <>
                  <Typography style={styles.label}>Choose Session</Typography>
                  <View style={styles.sessionContainer}>
                    <TouchableOpacity style={[styles.sessionBtn, session === 'Open' ? styles.sessionActive : styles.sessionInactive]} onPress={() => handleSessionChange('Open')}>
                      <Typography weight="600" style={[styles.sessionText, session === 'Open' && styles.sessionTextActive]}>Open</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.sessionBtn, session === 'Close' ? styles.sessionActive : styles.sessionInactive]} onPress={() => handleSessionChange('Close')}>
                      <Typography weight="600" style={[styles.sessionText, session === 'Close' && styles.sessionTextActive]}>Close</Typography>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {hideTabs || tab === 'Advanced' ? (
                <View style={styles.inputSection}>
                  
                  <View style={styles.inputRow}>
                    <Typography weight="600" style={styles.inputLabel}>{label1}</Typography>
                    <TextInput 
                      style={styles.textInput} keyboardType="number-pad" maxLength={maxLength1}
                      value={bidNumber} onChangeText={setBidNumber} placeholder={placeholder1}
                    />
                  </View>

                  {isSangam && (
                    <View style={styles.inputRow}>
                      <Typography weight="600" style={styles.inputLabel}>{label2}</Typography>
                      <TextInput 
                        style={styles.textInput} keyboardType="number-pad" maxLength={maxLength2}
                        value={bidNumber2} onChangeText={setBidNumber2} placeholder={placeholder2}
                      />
                    </View>
                  )}

                  <View style={styles.inputRow}>
                    <Typography weight="600" style={styles.inputLabel}>Enter Point</Typography>
                    <TextInput style={styles.textInput} keyboardType="number-pad" value={bidAmount} onChangeText={setBidAmount} placeholder="₹ 0" />
                  </View>
                  
                  <TouchableOpacity style={styles.addBtn} onPress={handleAddBid}>
                    {/* DYNAMIC BUTTON TEXT FOR GENERATORS */}
                    {(isFamilyJodi || isMotor) ? (
                      <>
                        <Settings2 color="#fff" size={20} style={{ marginRight: 8 }} />
                        <Typography weight="700" style={{ color: '#fff', fontSize: 16 }}>Generate</Typography>
                      </>
                    ) : (
                      <>
                        <PlusCircle color="#fff" size={20} style={{ marginRight: 8 }} />
                        <Typography weight="700" style={{ color: '#fff', fontSize: 16 }}>Add Bid</Typography>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                renderClassicGrid()
              )}
            </View>
          }
          renderItem={renderCartItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Typography weight="700" style={styles.totalAmountText}>₹ {activeTotalAmount}</Typography>
          <Typography style={styles.totalLabel}>Total Amount</Typography>
        </View>
        <TouchableOpacity style={[styles.continueBtn, activeTotalAmount === 0 && styles.continueBtnDisabled]} disabled={activeTotalAmount === 0 || isSubmitting} onPress={submitBidsToDatabase}>
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Typography weight="700" style={[styles.continueText, activeTotalAmount === 0 && styles.continueTextDisabled]}>Continue</Typography>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' }, 
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: PRIMARY_COLOR, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, color: '#fff', marginLeft: 10, letterSpacing: 0.5 },
  walletBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  walletText: { color: '#fff', marginLeft: 6, fontSize: 14 },
  bodyContent: { padding: 20 },
  marketName: { textAlign: 'center', color: '#D81B60', fontSize: 18, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 1 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, marginLeft: 4 },
  dateBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  dateText: { fontSize: 16, color: '#333' },
  tabContainer: { flexDirection: 'row', backgroundColor: PRIMARY_LIGHT, borderRadius: 12, marginBottom: 20, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: PRIMARY_COLOR, shadowColor: PRIMARY_COLOR, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  tabInactive: { backgroundColor: 'transparent' },
  tabText: { fontSize: 15, color: PRIMARY_COLOR },
  tabTextActive: { color: '#fff' },
  sessionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  sessionBtn: { flex: 0.48, paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  sessionActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  sessionInactive: { backgroundColor: '#fff', borderColor: '#E5E7EB' },
  sessionText: { fontSize: 16, color: '#666' },
  sessionTextActive: { color: '#fff' },
  inputSection: { marginTop: 10, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  inputLabel: { fontSize: 15, color: '#444', flex: 1 },
  textInput: { flex: 1, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15, height: 48, fontSize: 16, color: '#333' },
  addBtn: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 10, width: '100%' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cartDetails: { flexDirection: 'row', alignItems: 'center' },
  cartNumber: { fontSize: 20, color: '#333', minWidth: 60 },
  cartBadge: { backgroundColor: PRIMARY_LIGHT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
  cartSession: { color: PRIMARY_COLOR, fontSize: 12 },
  cartRight: { flexDirection: 'row', alignItems: 'center' },
  cartAmount: { fontSize: 16, color: '#333', marginRight: 15 },
  deleteBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  footerLeft: { alignItems: 'flex-start', justifyContent: 'center', flex: 0.4 },
  totalAmountText: { fontSize: 24, color: PRIMARY_COLOR },
  totalLabel: { fontSize: 13, color: '#666', marginTop: 2 },
  continueBtn: { flex: 0.6, backgroundColor: PRIMARY_COLOR, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  continueBtnDisabled: { backgroundColor: '#D1D5DB' },
  continueText: { color: '#fff', fontSize: 16 },
  continueTextDisabled: { color: '#9CA3AF' },
  classicGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  classicBox: { width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', backgroundColor: '#fff' },
  classicNumWrapper: { backgroundColor: PRIMARY_COLOR, paddingVertical: 14, width: 54, alignItems: 'center', justifyContent: 'center' },
  classicNum: { color: '#fff', fontSize: 18 },
  classicInput: { flex: 1, height: '100%', paddingHorizontal: 15, fontSize: 16, color: '#333' },
  pannaFilterCard: { backgroundColor: PRIMARY_LIGHT, borderRadius: 12, padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
  pannaFilterBtn: { width: '18%', paddingVertical: 10, margin: '1%', alignItems: 'center', borderRadius: 8 },
  pannaFilterBtnActive: { backgroundColor: PRIMARY_COLOR },
  pannaFilterText: { color: PRIMARY_COLOR, fontSize: 16 },
  pannaFilterTextActive: { color: '#fff' },
});