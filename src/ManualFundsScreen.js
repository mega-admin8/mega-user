import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Image, Linking, Alert, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft, Wallet, Copy, MessageCircle } from 'lucide-react-native';
import Typography from './components/Typography'; // Adjust path if needed
import api from './api';

const PRIMARY_COLOR = '#6200EA'; 
const PRIMARY_LIGHT = '#F3E8FF'; 

export default function ManualFundsScreen({ navigation }) {
  const [walletBalance, setWalletBalance] = useState("...");
  
  // --- Admin Settings State ---
  // In a real app, fetch these from your backend. Here are safe defaults.
  const [adminSettings, setAdminSettings] = useState({
    upiId: "admin@megaplay",
    whatsappNumber: "+919876543210",
    qrCodeUrl: null, // Replace with actual URL string when API is connected
    minAmount: 200
  });

  useFocusEffect(
    useCallback(() => {
      const fetchLiveBalance = async () => {
        try {
          const response = await api.get('/auth/me'); 
          setWalletBalance(response.data.wallet_balance);
        } catch (err) { setWalletBalance("Error"); }
      };
      fetchLiveBalance();
    }, [])
  );

  // Fetch admin settings (UPI, QR, Phone)
  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        // Adjust the route path if you put it somewhere else
        const response = await api.get('/admin/settings'); 
        
        setAdminSettings({
          upiId: response.data.upi_id,
          whatsappNumber: response.data.whatsapp_number,
          qrCodeUrl: response.data.qr_code_url, // Matches the DB column
          minAmount: response.data.min_amount
        });
      } catch (err) {
        console.log("Failed to fetch admin settings");
      }
    };
    fetchAdminSettings();
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(adminSettings.upiId);
    Alert.alert("Copied!", "UPI ID copied to clipboard.");
  };

  const openWhatsApp = () => {
    const message = `Hello MegaPlay, I have deposited funds via UPI and here is my screenshot.`;
    Linking.openURL(`whatsapp://send?phone=${adminSettings.whatsappNumber}&text=${message}`)
      .catch(() => Alert.alert("Error", "Make sure WhatsApp is installed on your device."));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Typography weight="700" style={styles.headerTitle}>Add Manual Funds</Typography>
        <View style={{ width: 40 }} />
      </View>

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

        {/* INSTRUCTIONS */}
        <View style={styles.instructionsContainer}>
          <Typography weight="700" style={styles.welcomeText}>Welcome To MegaPlay</Typography>
          <Typography weight="600" style={styles.hindiInstruction}>Manual रिचार्ज करने के लिये.</Typography>
          
          <Typography style={styles.stepText}>
            Step 1 - UPI copy kijiye aur minimum ₹{adminSettings.minAmount} pay kijiye
          </Typography>
          <Typography style={styles.stepText}>
            Step 2 - WhatsApp per screenshot send kar dijiye
          </Typography>
        </View>

        {/* WHATSAPP BUTTON */}
        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <MessageCircle color="#25D366" size={24} style={{ marginRight: 10 }} />
          <Typography weight="600" style={styles.whatsappText}>{adminSettings.whatsappNumber}</Typography>
        </TouchableOpacity>

        {/* UPI ID DASHED BOX */}
        <View style={styles.upiContainer}>
          <Typography style={styles.upiIdText}>{adminSettings.upiId}</Typography>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyBtn}>
            <Copy color="#555" size={22} />
          </TouchableOpacity>
        </View>

        {/* HELP LINK */}
        <View style={styles.helpRow}>
          <Typography style={styles.helpText}>How to add funds? </Typography>
          <TouchableOpacity>
            <Typography style={styles.helpLink}>Click Here</Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* QR CODE SECTION */}
        <View style={styles.qrSection}>
          <Typography weight="600" style={styles.qrLabel}>Scan to Pay</Typography>
            {adminSettings.qrCodeUrl ? (
            <Image 
              source={{ uri: adminSettings.qrCodeUrl }} 
              style={styles.qrImage} 
              resizeMode="contain"
            />
          ) : (
            <Typography style={{ color: '#888', marginTop: 20, textAlign: 'center' }}>
              Loading QR Code...
            </Typography>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: PRIMARY_COLOR, paddingHorizontal: 16, paddingVertical: 15,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, color: '#fff', letterSpacing: 0.5 },
  scrollContent: { padding: 24, alignItems: 'center', paddingBottom: 40 },

  // Balance
  balanceSection: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  balanceLabel: { fontSize: 16, color: PRIMARY_COLOR, marginBottom: 15 },
  balanceCircleOuter: {
    width: 150, height: 150, borderRadius: 75, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  balanceCircleInner: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: PRIMARY_LIGHT,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8
  },
  balanceAmount: { fontSize: 20, color: '#F59E0B' },

  // Instructions
  instructionsContainer: { alignItems: 'center', width: '100%', marginBottom: 20 },
  welcomeText: { fontSize: 18, color: '#333', marginBottom: 6 },
  hindiInstruction: { fontSize: 16, color: '#0ea5e9', marginBottom: 12 }, // Sky blue from reference
  stepText: { fontSize: 13, color: '#444', textAlign: 'center', marginBottom: 4, lineHeight: 20 },

  // WhatsApp Button
  whatsappBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', backgroundColor: '#fff', 
    borderWidth: 1, borderColor: '#25D366', borderRadius: 25, // Green border
    paddingVertical: 14, marginBottom: 20
  },
  whatsappText: { fontSize: 16, color: '#25D366' },

  // UPI Box
  upiContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#ccc', borderStyle: 'dashed', borderRadius: 8,
    paddingHorizontal: 20, paddingVertical: 16, marginBottom: 20
  },
  upiIdText: { fontSize: 16, color: '#333', flex: 1, textAlign: 'center', marginLeft: 20 },
  copyBtn: { padding: 4 },

  // Help Row
  helpRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  helpText: { fontSize: 14, color: '#555' },
  helpLink: { fontSize: 14, color: '#333', textDecorationLine: 'underline' },

  divider: { width: '100%', height: 1, backgroundColor: '#E5E7EB', marginBottom: 25 },

  // QR Section
  qrSection: { alignItems: 'center', width: '100%' },
  qrLabel: { fontSize: 16, color: '#333', marginBottom: 15 },
  qrImage: { width: 200, height: 200, borderRadius: 12 },
  noImageContainer: {
    width: 200, height: 200, backgroundColor: '#E5E7EB', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center'
  },
  noImageText: { color: '#666', fontSize: 14 }
});