// // src/LoginScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from './api';

// export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }) {
//   const [phone, setPhone] = useState('');
//   const [mpin, setMpin] = useState('');

//   const handleLogin = async () => {
//     if (!phone || !mpin) {
//       Alert.alert('Error', 'Please enter Phone and M-PIN');
//       return;
//     }

//     try {
//       const response = await api.post('/auth/login', {
//         phone_number: phone,
//         mpin: mpin,
//       });

//       // Save token and user details to device storage
//       await AsyncStorage.setItem('userToken', response.data.token);
//       await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      
//       Alert.alert('Success', 'Logged in safely!');
//       onLoginSuccess(response.data.user); // Tell the main app to change the screen

//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Network Error';
//       console.log(error)
//       Alert.alert('Login Failed', errorMsg);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>MegaPlay</Text>
      
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         keyboardType="numeric"
//         maxLength={10}
//         value={phone}
//         onChangeText={setPhone}
//       />
      
//       <TextInput
//         style={styles.input}
//         placeholder="4-Digit M-PIN"
//         keyboardType="numeric"
//         secureTextEntry={true}
//         maxLength={4}
//         value={mpin}
//         onChangeText={setMpin}
//       />
      
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>LOGIN</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={onNavigateToRegister} style={styles.linkButton}>
//         <Text style={styles.linkText}>Don't have an account? Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
//   title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
//   input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
//   button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center' },
//   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   linkButton: { alignItems: 'center', padding: 15, marginTop: 10 },
//   linkText: { color: '#007bff', fontSize: 16 }
// });


// src/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Phone, Lock } from 'lucide-react-native';
import api from './api';
import { theme } from './theme';
import Typography from './components/Typography';

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }) {
  const [phone, setPhone] = useState('');
  const [mpin, setMpin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !mpin) {
      Alert.alert('Error', 'Please enter Phone and M-PIN');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        phone_number: phone,
        mpin: mpin,
      });

      // Save token and user details to device storage
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      
      setIsLoading(false);
      onLoginSuccess(response.data.user); // Tell the main app to change the screen

    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.error || 'Network Error';
      console.log(error);
      Alert.alert('Login Failed', errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.logoPlaceholder}>
            <Typography weight="700" style={styles.logoText}>M</Typography>
        </View>
        <Typography weight="700" style={styles.title}>Welcome to MegaPlay</Typography>
        <Typography style={styles.subtitle}>Enter your details to securely access your account.</Typography>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
            <Typography weight="600" style={styles.label}>Phone Number</Typography>
            <View style={styles.inputWrapper}>
                <Phone color={theme.colors.textMuted} size={20} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    maxLength={10}
                />
            </View>
        </View>

        <View style={styles.inputGroup}>
            <Typography weight="600" style={styles.label}>Secure M-PIN</Typography>
            <View style={styles.inputWrapper}>
                <Lock color={theme.colors.textMuted} size={20} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={mpin}
                    onChangeText={setMpin}
                    placeholder="Enter 4-digit PIN"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                />
            </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
            style={[styles.primaryButton, (!phone || !mpin) && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={!phone || !mpin || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={theme.colors.surface} />
            ) : (
                <Typography weight="600" style={styles.buttonText}>Secure Login</Typography>
            )}
        </TouchableOpacity>

        {/* Secondary Action */}
        <TouchableOpacity onPress={onNavigateToRegister} style={styles.secondaryAction} activeOpacity={0.6}>
            <Typography style={styles.secondaryText}>
                Don't have an account? <Typography weight="700" style={styles.linkText}>Register here</Typography>
            </Typography>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: theme.spacing.xl },
  headerContainer: { marginBottom: theme.spacing.xxl, alignItems: 'center' },
  logoPlaceholder: { width: 64, height: 64, borderRadius: theme.radius.xl, backgroundColor: '#ff99a8', justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.m, ...theme.shadows.card },
  logoText: { fontSize: 32, color: theme.colors.surface },
  title: { fontSize: 24, marginBottom: theme.spacing.xs, textAlign: 'center' },
  subtitle: { fontSize: 14, color: theme.colors.textMuted, textAlign: 'center', paddingHorizontal: theme.spacing.l },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: theme.spacing.m },
  label: { fontSize: 12, marginBottom: theme.spacing.s, color: theme.colors.textDark, marginLeft: theme.spacing.xs },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.m, paddingHorizontal: theme.spacing.m, height: 52 },
  icon: { marginRight: theme.spacing.s },
  input: { flex: 1, fontSize: 16, color: theme.colors.textDark, fontFamily: 'Inter_500Medium' }, 
  primaryButton: { backgroundColor: theme.colors.primary, height: 56, borderRadius: theme.radius.m, justifyContent: 'center', alignItems: 'center', marginTop: theme.spacing.l, ...theme.shadows.card },
  buttonDisabled: { backgroundColor: theme.colors.border, shadowOpacity: 0 },
  buttonText: { color: theme.colors.surface, fontSize: 16 },
  secondaryAction: { marginTop: theme.spacing.xl, alignItems: 'center' },
  secondaryText: { color: theme.colors.textMuted },
  linkText: { color: theme.colors.primary },
});
