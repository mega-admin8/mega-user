// import React, { useState } from 'react';
// import { 
//   View, Text, TouchableOpacity, TextInput, ScrollView, 
//   FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
// } from 'react-native';
// import { Trash2 } from 'lucide-react-native';
// import api from './api'; // Matches your BidBoardScreen API import
// import { theme } from './theme'; // Adjust path to your theme object

// // Generate 01 - 100 Jodi Numbers
// const generateJodiNumbers = () => {
//   const nums = [];
//   for (let i = 1; i <= 100; i++) {
//     nums.push(i === 100 ? '00' : i.toString().padStart(2, '0'));
//   }
//   return nums;
// };

// // CROSSING GENERATOR (e.g., "123" -> 11, 12, 13, 21, 22, 23, 31, 32, 33)
// const generateCrossingJodis = (digitsStr) => {
//   const digits = Array.from(new Set(digitsStr.split('')));
//   const jodis = [];
//   for (let d1 of digits) {
//     for (let d2 of digits) {
//       jodis.push(`${d1}${d2}`);
//     }
//   }
//   return jodis;
// };

// export default function GaliDesawarPlayScreen({ route, navigation }) {
//   const { marketId, userId, market = "GALI DESAWAR" } = route.params || {};

  

//   const [activeTab, setActiveTab] = useState('JODI');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // --- TAB 1: JODI STATE ---
//   const [jodiBids, setJodiBids] = useState({});

//   // --- TAB 2 & 3: CROSSING & COPY PASTE STATE ---
//   const [crossingDigits, setCrossingDigits] = useState('');
//   const [crossingAmount, setCrossingAmount] = useState('');

//   const [copyDigits, setCopyDigits] = useState('');
//   const [copyAmount, setCopyAmount] = useState('');
//   const [paltiOption, setPaltiOption] = useState('with');

//   // Shared Cart for Crossing and Copy Paste additions
//   const [cart, setCart] = useState([]);

//   const tabs = ['JODI', 'CROSSING', 'COPY PASTE'];

//   // Handle Jodi/Haruf input changes
//   const handleJodiChange = (key, value) => {
//     const cleanVal = value.replace(/[^0-9]/g, '');
//     setJodiBids(prev => ({ ...prev, [key]: cleanVal }));
//   };

//   // --- ADD CROSSING BIDS TO CART ---
//   const handleAddCrossing = () => {
//     if (!crossingDigits || crossingDigits.length < 2) {
//       return Alert.alert('Invalid Input', 'Enter at least 2 digits for crossing.');
//     }
//     if (!crossingAmount || parseInt(crossingAmount) <= 0) {
//       return Alert.alert('Invalid Amount', 'Enter a valid bid amount.');
//     }

//     const generatedJodis = generateCrossingJodis(crossingDigits);
//     const amountPerBid = parseInt(crossingAmount, 10);

//     const newBids = generatedJodis.map((num, idx) => ({
//       id: `cross_${Date.now()}_${idx}`,
//       number: num,
//       amount: amountPerBid,
//       game_type: 'JODI',
//       session: 'Open'
//     }));

//     setCart(prev => [...newBids, ...prev]);
//     setCrossingDigits('');
//     setCrossingAmount('');
//   };

//   // --- ADD COPY PASTE BIDS TO CART ---
//   const handleAddCopyPaste = () => {
//     if (!copyDigits || copyDigits.length !== 2) {
//       return Alert.alert('Invalid Input', 'Enter a valid 2-digit Jodi.');
//     }
//     if (!copyAmount || parseInt(copyAmount) <= 0) {
//       return Alert.alert('Invalid Amount', 'Enter a valid bid amount.');
//     }

//     const amount = parseInt(copyAmount, 10);
//     const num1 = copyDigits;
//     const num2 = copyDigits.split('').reverse().join('');

//     let newBids = [
//       { id: `copy_${Date.now()}_1`, number: num1, amount, game_type: 'JODI', session: 'Open' }
//     ];

//     if (paltiOption === 'with' && num1 !== num2) {
//       newBids.push({ id: `copy_${Date.now()}_2`, number: num2, amount, game_type: 'JODI', session: 'Open' });
//     }

//     setCart(prev => [...newBids, ...prev]);
//     setCopyDigits('');
//     setCopyAmount('');
//   };

//   const removeCartItem = (id) => {
//     setCart(cart.filter(item => item.id !== id));
//   };

//   // --- CALCULATE TOTAL AMOUNT ---
//   const jodiTotal = Object.values(jodiBids).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
//   const cartTotal = cart.reduce((sum, item) => sum + item.amount, 0);
//   const activeTotalAmount = activeTab === 'JODI' ? jodiTotal : cartTotal;

//   // --- SUBMIT BIDS TO SUPABASE VIA API ---
//   const submitBidsToDatabase = async () => {
//     let finalBids = [];

//     if (activeTab === 'JODI') {
//       finalBids = Object.entries(jodiBids)
//         .filter(([_, amt]) => amt && parseInt(amt, 10) > 0)
//         .map(([key, amt]) => {
//           const [type, number] = key.split('_');
//           let gameType = 'JODI';
//           if (type === 'andar') gameType = 'HARUF_ANDAR';
//           if (type === 'bahar') gameType = 'HARUF_BAHAR';

//           return {
//             number: number,
//             amount: parseInt(amt, 10),
//             game_type: gameType,
//             session: 'Open'
//           };
//         });
//     } else {
//       finalBids = cart.map(item => ({
//         number: item.number,
//         amount: item.amount,
//         game_type: item.game_type,
//         session: item.session
//       }));
//     }

//     if (finalBids.length === 0) {
//       return Alert.alert('Empty Bids', 'Please enter at least one bid amount.');
//     }

//     setIsSubmitting(true);
//     try {
//       // API call structure matching BidBoardScreen.js
//       await api.post('/bids/place-bid', {
//         user_id: userId,
//         market_id: marketId,
//         game_type: 'GALI_DESAWAR',
//         bids: finalBids
//       });

//       Alert.alert('Success!', `Successfully placed ${finalBids.length} bids.`);
//       setJodiBids({});
//       setCart([]);
//       navigation.goBack();
//     } catch (error) {
//       console.error('Submit Bids Error:', error);
//       Alert.alert('Error', error.response?.data?.error || 'Failed to place bids. Try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Render JODI Tab Content
//   const renderJodiTab = () => (
//     <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
//       <Text style={styles.sectionTitle}>Andar Haruf ( अंदर )</Text>
//       <View style={styles.harufRow}>
//         {[...Array(10).keys()].map(num => (
//           <View key={`andar-${num}`} style={styles.harufBox}>
//             <Text style={styles.harufText}>{num}</Text>
//             <TextInput 
//               style={styles.harufInput} 
//               keyboardType="number-pad" 
//               value={jodiBids[`andar_${num}`] || ''}
//               onChangeText={(val) => handleJodiChange(`andar_${num}`, val)}
//             />
//           </View>
//         ))}
//       </View>

//       <Text style={styles.sectionTitle}>Bahar Haruf ( बाहर )</Text>
//       <View style={styles.harufRow}>
//         {[...Array(10).keys()].map(num => (
//           <View key={`bahar-${num}`} style={styles.harufBox}>
//             <Text style={styles.harufText}>{num}</Text>
//             <TextInput 
//               style={styles.harufInput} 
//               keyboardType="number-pad" 
//               value={jodiBids[`bahar_${num}`] || ''}
//               onChangeText={(val) => handleJodiChange(`bahar_${num}`, val)}
//             />
//           </View>
//         ))}
//       </View>

//       <View style={styles.jodiGrid}>
//         {generateJodiNumbers().map(num => (
//           <View key={`jodi-${num}`} style={styles.jodiBox}>
//             <Text style={styles.jodiText}>{num}</Text>
//             <TextInput 
//               style={styles.jodiInput} 
//               keyboardType="number-pad" 
//               value={jodiBids[`jodi_${num}`] || ''}
//               onChangeText={(val) => handleJodiChange(`jodi_${num}`, val)}
//             />
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );

//   // Render Cart List for Crossing & Copy Paste
//   const renderCartList = () => (
//     <View style={styles.cartContainer}>
//       <Text style={styles.sectionTitle}>Added Bids ({cart.length})</Text>
//       {cart.map(item => (
//         <View key={item.id} style={styles.cartItem}>
//           <Text style={styles.cartNumber}>{item.number}</Text>
//           <Text style={styles.cartAmount}>₹ {item.amount}</Text>
//           <TouchableOpacity onPress={() => removeCartItem(item.id)} style={styles.deleteBtn}>
//             <Trash2 color={theme.colors.danger} size={18} />
//           </TouchableOpacity>
//         </View>
//       ))}
//     </View>
//   );

//   // Render CROSSING Tab Content
//   const renderCrossingTab = () => (
//     <ScrollView style={styles.tabContent}>
//       <TextInput 
//         style={styles.genericInput} 
//         placeholder="Enter Digits (Max 6)" 
//         placeholderTextColor={theme.colors.textMuted} 
//         keyboardType="number-pad" 
//         maxLength={6} 
//         value={crossingDigits}
//         onChangeText={setCrossingDigits}
//       />
//       <TextInput 
//         style={styles.genericInput} 
//         placeholder="Enter Amount" 
//         placeholderTextColor={theme.colors.textMuted} 
//         keyboardType="number-pad" 
//         value={crossingAmount}
//         onChangeText={setCrossingAmount}
//       />
//       <TouchableOpacity style={styles.submitBtn} onPress={handleAddCrossing}>
//         <Text style={styles.submitBtnText}>ADD</Text>
//       </TouchableOpacity>

//       {cart.length > 0 && renderCartList()}
//     </ScrollView>
//   );

//   // Render COPY PASTE Tab Content
//   const renderCopyPasteTab = () => (
//     <ScrollView style={styles.tabContent}>
//       <TextInput 
//         style={styles.genericInput} 
//         placeholder="Enter 2-Digit Jodi (Max 6 Digits Input)" 
//         placeholderTextColor={theme.colors.textMuted} 
//         keyboardType="number-pad" 
//         maxLength={6} 
//         value={copyDigits}
//         onChangeText={setCopyDigits}
//       />
//       <TextInput 
//         style={styles.genericInput} 
//         placeholder="Enter Amount" 
//         placeholderTextColor={theme.colors.textMuted} 
//         keyboardType="number-pad" 
//         value={copyAmount}
//         onChangeText={setCopyAmount}
//       />
      
//       <View style={styles.radioGroup}>
//         <TouchableOpacity 
//           style={[styles.radioBtn, paltiOption === 'with' ? styles.radioBtnActive : styles.radioBtnInactive]} 
//           onPress={() => setPaltiOption('with')}
//         >
//           <Text style={[styles.radioText, paltiOption === 'with' ? styles.radioTextActive : styles.radioTextInactive]}>With Palti</Text>
//           <View style={[styles.radioCircle, paltiOption === 'with' && styles.radioCircleActive]} />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.radioBtn, paltiOption === 'without' ? styles.radioBtnActive : styles.radioBtnInactive]} 
//           onPress={() => setPaltiOption('without')}
//         >
//           <Text style={[styles.radioText, paltiOption === 'without' ? styles.radioTextActive : styles.radioTextInactive]}>Without Palti</Text>
//           <View style={[styles.radioCircle, paltiOption === 'without' && styles.radioCircleActive]} />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity style={styles.submitBtn} onPress={handleAddCopyPaste}>
//         <Text style={styles.submitBtnText}>ADD</Text>
//       </TouchableOpacity>

//       {cart.length > 0 && renderCartList()}
//     </ScrollView>
//   );

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
//       {/* Custom Header Tabs */}
//       <View style={styles.tabBar}>
//         {tabs.map(tab => (
//           <TouchableOpacity 
//             key={tab} 
//             style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
//             onPress={() => setActiveTab(tab)}
//           >
//             <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Tab Screen Selection */}
//       {activeTab === 'JODI' && renderJodiTab()}
//       {activeTab === 'CROSSING' && renderCrossingTab()}
//       {activeTab === 'COPY PASTE' && renderCopyPasteTab()}

//       {/* Sticky Bottom Bar */}
//       <View style={styles.bottomBar}>
//         <Text style={styles.totalText}>₹ {activeTotalAmount}</Text>
//         <TouchableOpacity 
//           style={[styles.playNowBtn, activeTotalAmount === 0 && styles.playNowBtnDisabled]} 
//           disabled={activeTotalAmount === 0 || isSubmitting}
//           onPress={submitBidsToDatabase}
//         >
//           {isSubmitting ? (
//             <ActivityIndicator color={theme.colors.surface} />
//           ) : (
//             <Text style={styles.playNowText}>PLAY</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: theme.colors.background },
//   tabBar: { 
//     flexDirection: 'row', 
//     backgroundColor: theme.colors.surface, 
//     borderBottomWidth: 1, 
//     borderBottomColor: theme.colors.border 
//   },
//   tabItem: { 
//     flex: 1, 
//     paddingVertical: theme.spacing.m, 
//     alignItems: 'center', 
//     borderBottomWidth: 2, 
//     borderBottomColor: 'transparent' 
//   },
//   tabItemActive: { borderBottomColor: theme.colors.primary },
//   tabText: { color: theme.colors.textMuted, fontWeight: 'bold', fontSize: 12 },
//   tabTextActive: { color: theme.colors.primary },
//   tabContent: { flex: 1, padding: theme.spacing.m },
//   sectionTitle: { color: theme.colors.textDark, fontWeight: 'bold', marginVertical: theme.spacing.s, fontSize: 16 },
  
//   // Haruf Grid
//   harufRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.m },
//   harufBox: { flex: 1, borderWidth: 1, borderColor: theme.colors.border, marginHorizontal: 2, backgroundColor: theme.colors.surface, borderRadius: theme.radius.s, overflow: 'hidden' },
//   harufText: { textAlign: 'center', backgroundColor: theme.colors.primaryLight, color: theme.colors.primary, paddingVertical: theme.spacing.xs, fontWeight: 'bold', fontSize: 12 },
//   harufInput: { height: 35, textAlign: 'center', padding: 0, color: theme.colors.textDark },
  
//   // Jodi Grid
//   jodiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: theme.spacing.s },
//   jodiBox: { width: '9.5%', borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.s, backgroundColor: theme.colors.surface, borderRadius: 4, overflow: 'hidden' },
//   jodiText: { textAlign: 'center', backgroundColor: theme.colors.primaryLight, color: theme.colors.primary, paddingVertical: theme.spacing.xs, fontSize: 11, fontWeight: 'bold' },
//   jodiInput: { height: 35, textAlign: 'center', padding: 0, color: theme.colors.textDark },
  
//   // Crossing & Copy Paste Inputs
//   genericInput: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.s, padding: theme.spacing.m, marginBottom: theme.spacing.m, fontSize: 16, color: theme.colors.textDark },
//   submitBtn: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: theme.radius.s, alignItems: 'center', ...theme.shadows.card },
//   submitBtnText: { color: theme.colors.surface, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  
//   // Radio Buttons
//   radioGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.m },
//   radioBtn: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.m, borderRadius: theme.radius.s, borderWidth: 1 },
//   radioBtnActive: { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary },
//   radioBtnInactive: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
//   radioText: { fontWeight: '600' },
//   radioTextActive: { color: theme.colors.primary },
//   radioTextInactive: { color: theme.colors.textMuted },
//   radioCircle: { height: 20, width: 20, borderRadius: theme.radius.round, borderWidth: 2, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
//   radioCircleActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },

//   // Cart List
//   cartContainer: { marginTop: theme.spacing.l, marginBottom: theme.spacing.xl },
//   cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.radius.s, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.s },
//   cartNumber: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textDark },
//   cartAmount: { fontSize: 16, fontWeight: '600', color: theme.colors.primary },
//   deleteBtn: { padding: theme.spacing.xs, backgroundColor: theme.colors.dangerLight, borderRadius: theme.radius.s },

//   // Bottom Footer Bar
//   bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderTopWidth: 1, borderTopColor: theme.colors.border, ...theme.shadows.card },
//   totalText: { fontSize: 20, color: theme.colors.success, fontWeight: 'bold', marginLeft: theme.spacing.s },
//   playNowBtn: { backgroundColor: theme.colors.success, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.m, borderRadius: theme.radius.s },
//   playNowBtnDisabled: { backgroundColor: theme.colors.border },
//   playNowText: { color: theme.colors.surface, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
// });









import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, TextInput, ScrollView, 
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import api from './api';
import { theme } from './theme';

// Generate 01 - 100 Jodi Numbers
const generateJodiNumbers = () => {
  const nums = [];
  for (let i = 1; i <= 100; i++) {
    nums.push(i === 100 ? '00' : i.toString().padStart(2, '0'));
  }
  return nums;
};

// CROSSING GENERATOR
const generateCrossingJodis = (digitsStr) => {
  const digits = Array.from(new Set(digitsStr.split('')));
  const jodis = [];
  for (let d1 of digits) {
    for (let d2 of digits) {
      jodis.push(`${d1}${d2}`);
    }
  }
  return jodis;
};

export default function GaliDesawarPlayScreen({ route, navigation }) {
  // 1. Correctly extract the market object passed from the List screen
  const { market } = route.params || {};

  const [activeTab, setActiveTab] = useState('JODI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- TAB 1: JODI STATE ---
  const [jodiBids, setJodiBids] = useState({});

  // --- TAB 2 & 3: CROSSING & COPY PASTE STATE ---
  const [crossingDigits, setCrossingDigits] = useState('');
  const [crossingAmount, setCrossingAmount] = useState('');

  const [copyDigits, setCopyDigits] = useState('');
  const [copyAmount, setCopyAmount] = useState('');
  const [paltiOption, setPaltiOption] = useState('with');

  // Shared Cart for Crossing and Copy Paste additions
  const [cart, setCart] = useState([]);

  const tabs = ['JODI', 'CROSSING', 'COPY PASTE'];

  // Handle Jodi/Haruf input changes
  const handleJodiChange = (key, value) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    setJodiBids(prev => ({ ...prev, [key]: cleanVal }));
  };

  // --- ADD CROSSING BIDS TO CART ---
  const handleAddCrossing = () => {
    if (!crossingDigits || crossingDigits.length < 2) {
      return Alert.alert('Invalid Input', 'Enter at least 2 digits for crossing.');
    }
    if (!crossingAmount || parseInt(crossingAmount) <= 0) {
      return Alert.alert('Invalid Amount', 'Enter a valid bid amount.');
    }

    const generatedJodis = generateCrossingJodis(crossingDigits);
    const amountPerBid = parseInt(crossingAmount, 10);

    const newBids = generatedJodis.map((num, idx) => ({
      id: `cross_${Date.now()}_${idx}`,
      number: num,
      amount: amountPerBid,
      game_type: 'JODI',
    }));

    setCart(prev => [...newBids, ...prev]);
    setCrossingDigits('');
    setCrossingAmount('');
  };

  // --- ADD COPY PASTE BIDS TO CART ---
  const handleAddCopyPaste = () => {
    if (!copyDigits || copyDigits.length !== 2) {
      return Alert.alert('Invalid Input', 'Enter a valid 2-digit Jodi.');
    }
    if (!copyAmount || parseInt(copyAmount) <= 0) {
      return Alert.alert('Invalid Amount', 'Enter a valid bid amount.');
    }

    const amount = parseInt(copyAmount, 10);
    const num1 = copyDigits;
    const num2 = copyDigits.split('').reverse().join('');

    let newBids = [
      { id: `copy_${Date.now()}_1`, number: num1, amount, game_type: 'JODI' }
    ];

    if (paltiOption === 'with' && num1 !== num2) {
      newBids.push({ id: `copy_${Date.now()}_2`, number: num2, amount, game_type: 'JODI' });
    }

    setCart(prev => [...newBids, ...prev]);
    setCopyDigits('');
    setCopyAmount('');
  };

  const removeCartItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // --- CALCULATE TOTAL AMOUNT ---
  const jodiTotal = Object.values(jodiBids).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.amount, 0);
  const activeTotalAmount = activeTab === 'JODI' ? jodiTotal : cartTotal;

  // --- SUBMIT BIDS TO BACKEND ---
  const submitBidsToDatabase = async () => {
    let finalBids = [];

    // Format bids based on active tab
    if (activeTab === 'JODI') {
      finalBids = Object.entries(jodiBids)
        .filter(([_, amt]) => amt && parseInt(amt, 10) > 0)
        .map(([key, amt]) => {
          const [type, number] = key.split('_');
          let gameType = 'JODI';
          if (type === 'andar') gameType = 'HARUF_ANDAR';
          if (type === 'bahar') gameType = 'HARUF_BAHAR';

          return {
            bid_number: number, // Use 'bid_number' to match backend schema
            amount: parseInt(amt, 10),
            game_type: gameType,
          };
        });
    } else {
      finalBids = cart.map(item => ({
        bid_number: item.number, // Use 'bid_number' to match backend schema
        amount: item.amount,
        game_type: item.game_type,
      }));
    }

    // Validations
    if (finalBids.length === 0) {
      return Alert.alert('Empty Bids', 'Please enter at least one bid amount.');
    }
    if (!market?.id) {
      return Alert.alert('Error', 'Market ID is missing. Please go back and select a market.');
    }

    setIsSubmitting(true);
    
    // Create correct payload
    const payload = {
      market_id: market.id,
      bids: finalBids
    };

    console.log("FRONTEND SUBMITTING PAYLOAD:", JSON.stringify(payload, null, 2));

    try {
      // Point to Gali Desawar specific route
      await api.post('/gali-desawar/place-bid', payload);

      Alert.alert('Success!', `Successfully placed ${finalBids.length} bids.`);
      setJodiBids({});
      setCart([]);
      navigation.goBack();
    } catch (error) {
      console.error('Submit Bids Error Details:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Failed to place bids. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render JODI Tab Content
  const renderJodiTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Andar Haruf ( अंदर )</Text>
      <View style={styles.harufRow}>
        {[...Array(10).keys()].map(num => (
          <View key={`andar-${num}`} style={styles.harufBox}>
            <Text style={styles.harufText}>{num}</Text>
            <TextInput 
              style={styles.harufInput} 
              keyboardType="number-pad" 
              value={jodiBids[`andar_${num}`] || ''}
              onChangeText={(val) => handleJodiChange(`andar_${num}`, val)}
            />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Bahar Haruf ( बाहर )</Text>
      <View style={styles.harufRow}>
        {[...Array(10).keys()].map(num => (
          <View key={`bahar-${num}`} style={styles.harufBox}>
            <Text style={styles.harufText}>{num}</Text>
            <TextInput 
              style={styles.harufInput} 
              keyboardType="number-pad" 
              value={jodiBids[`bahar_${num}`] || ''}
              onChangeText={(val) => handleJodiChange(`bahar_${num}`, val)}
            />
          </View>
        ))}
      </View>

      <View style={styles.jodiGrid}>
        {generateJodiNumbers().map(num => (
          <View key={`jodi-${num}`} style={styles.jodiBox}>
            <Text style={styles.jodiText}>{num}</Text>
            <TextInput 
              style={styles.jodiInput} 
              keyboardType="number-pad" 
              value={jodiBids[`jodi_${num}`] || ''}
              onChangeText={(val) => handleJodiChange(`jodi_${num}`, val)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Render Cart List for Crossing & Copy Paste
  const renderCartList = () => (
    <View style={styles.cartContainer}>
      <Text style={styles.sectionTitle}>Added Bids ({cart.length})</Text>
      {cart.map(item => (
        <View key={item.id} style={styles.cartItem}>
          <Text style={styles.cartNumber}>{item.number}</Text>
          <Text style={styles.cartAmount}>₹ {item.amount}</Text>
          <TouchableOpacity onPress={() => removeCartItem(item.id)} style={styles.deleteBtn}>
            <Trash2 color={theme.colors.danger} size={18} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  // Render CROSSING Tab Content
  const renderCrossingTab = () => (
    <ScrollView style={styles.tabContent}>
      <TextInput 
        style={styles.genericInput} 
        placeholder="Enter Digits (Max 6)" 
        placeholderTextColor={theme.colors.textMuted} 
        keyboardType="number-pad" 
        maxLength={6} 
        value={crossingDigits}
        onChangeText={setCrossingDigits}
      />
      <TextInput 
        style={styles.genericInput} 
        placeholder="Enter Amount" 
        placeholderTextColor={theme.colors.textMuted} 
        keyboardType="number-pad" 
        value={crossingAmount}
        onChangeText={setCrossingAmount}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={handleAddCrossing}>
        <Text style={styles.submitBtnText}>ADD</Text>
      </TouchableOpacity>

      {cart.length > 0 && renderCartList()}
    </ScrollView>
  );

  // Render COPY PASTE Tab Content
  const renderCopyPasteTab = () => (
    <ScrollView style={styles.tabContent}>
      <TextInput 
        style={styles.genericInput} 
        placeholder="Enter 2-Digit Jodi" 
        placeholderTextColor={theme.colors.textMuted} 
        keyboardType="number-pad" 
        maxLength={2} 
        value={copyDigits}
        onChangeText={setCopyDigits}
      />
      <TextInput 
        style={styles.genericInput} 
        placeholder="Enter Amount" 
        placeholderTextColor={theme.colors.textMuted} 
        keyboardType="number-pad" 
        value={copyAmount}
        onChangeText={setCopyAmount}
      />
      
      <View style={styles.radioGroup}>
        <TouchableOpacity 
          style={[styles.radioBtn, paltiOption === 'with' ? styles.radioBtnActive : styles.radioBtnInactive]} 
          onPress={() => setPaltiOption('with')}
        >
          <Text style={[styles.radioText, paltiOption === 'with' ? styles.radioTextActive : styles.radioTextInactive]}>With Palti</Text>
          <View style={[styles.radioCircle, paltiOption === 'with' && styles.radioCircleActive]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.radioBtn, paltiOption === 'without' ? styles.radioBtnActive : styles.radioBtnInactive]} 
          onPress={() => setPaltiOption('without')}
        >
          <Text style={[styles.radioText, paltiOption === 'without' ? styles.radioTextActive : styles.radioTextInactive]}>Without Palti</Text>
          <View style={[styles.radioCircle, paltiOption === 'without' && styles.radioCircleActive]} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleAddCopyPaste}>
        <Text style={styles.submitBtnText}>ADD</Text>
      </TouchableOpacity>

      {cart.length > 0 && renderCartList()}
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'JODI' && renderJodiTab()}
      {activeTab === 'CROSSING' && renderCrossingTab()}
      {activeTab === 'COPY PASTE' && renderCopyPasteTab()}

      <View style={styles.bottomBar}>
        <Text style={styles.totalText}>₹ {activeTotalAmount}</Text>
        <TouchableOpacity 
          style={[styles.playNowBtn, activeTotalAmount === 0 && styles.playNowBtnDisabled]} 
          disabled={activeTotalAmount === 0 || isSubmitting}
          onPress={submitBidsToDatabase}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <Text style={styles.playNowText}>PLAY</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabBar: { 
    flexDirection: 'row', 
    backgroundColor: theme.colors.surface, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border 
  },
  tabItem: { 
    flex: 1, 
    paddingVertical: theme.spacing.m, 
    alignItems: 'center', 
    borderBottomWidth: 2, 
    borderBottomColor: 'transparent' 
  },
  tabItemActive: { borderBottomColor: theme.colors.primary },
  tabText: { color: theme.colors.textMuted, fontWeight: 'bold', fontSize: 12 },
  tabTextActive: { color: theme.colors.primary },
  tabContent: { flex: 1, padding: theme.spacing.m },
  sectionTitle: { color: theme.colors.textDark, fontWeight: 'bold', marginVertical: theme.spacing.s, fontSize: 16 },
  
  // Haruf Grid
  harufRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.m },
  harufBox: { flex: 1, borderWidth: 1, borderColor: theme.colors.border, marginHorizontal: 2, backgroundColor: theme.colors.surface, borderRadius: theme.radius.s, overflow: 'hidden' },
  harufText: { textAlign: 'center', backgroundColor: theme.colors.primaryLight, color: theme.colors.primary, paddingVertical: theme.spacing.xs, fontWeight: 'bold', fontSize: 12 },
  harufInput: { height: 35, textAlign: 'center', padding: 0, color: theme.colors.textDark },
  
  // Jodi Grid
  jodiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: theme.spacing.s },
  jodiBox: { width: '9.5%', borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.s, backgroundColor: theme.colors.surface, borderRadius: 4, overflow: 'hidden' },
  jodiText: { textAlign: 'center', backgroundColor: theme.colors.primaryLight, color: theme.colors.primary, paddingVertical: theme.spacing.xs, fontSize: 11, fontWeight: 'bold' },
  jodiInput: { height: 35, textAlign: 'center', padding: 0, color: theme.colors.textDark },
  
  // Crossing & Copy Paste Inputs
  genericInput: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.s, padding: theme.spacing.m, marginBottom: theme.spacing.m, fontSize: 16, color: theme.colors.textDark },
  submitBtn: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: theme.radius.s, alignItems: 'center', ...theme.shadows.card },
  submitBtnText: { color: theme.colors.surface, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  
  // Radio Buttons
  radioGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.m },
  radioBtn: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.m, borderRadius: theme.radius.s, borderWidth: 1 },
  radioBtnActive: { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary },
  radioBtnInactive: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
  radioText: { fontWeight: '600' },
  radioTextActive: { color: theme.colors.primary },
  radioTextInactive: { color: theme.colors.textMuted },
  radioCircle: { height: 20, width: 20, borderRadius: theme.radius.round, borderWidth: 2, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  radioCircleActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },

  // Cart List
  cartContainer: { marginTop: theme.spacing.l, marginBottom: theme.spacing.xl },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.radius.s, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.s },
  cartNumber: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textDark },
  cartAmount: { fontSize: 16, fontWeight: '600', color: theme.colors.primary },
  deleteBtn: { padding: theme.spacing.xs, backgroundColor: theme.colors.dangerLight, borderRadius: theme.radius.s },

  // Bottom Footer Bar
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderTopWidth: 1, borderTopColor: theme.colors.border, ...theme.shadows.card },
  totalText: { fontSize: 20, color: theme.colors.success, fontWeight: 'bold', marginLeft: theme.spacing.s },
  playNowBtn: { backgroundColor: theme.colors.success, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.m, borderRadius: theme.radius.s },
  playNowBtnDisabled: { backgroundColor: theme.colors.border },
  playNowText: { color: theme.colors.surface, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});