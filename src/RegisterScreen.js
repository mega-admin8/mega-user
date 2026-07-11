// // src/RegisterScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import api from './api';

// export default function RegisterScreen({ onNavigateToLogin }) {
//   const [phone, setPhone] = useState('');
//   const [mpin, setMpin] = useState('');
//   const [name, setName] = useState('');

//   const handleRegister = async () => {
//     if (!phone || !mpin) {
//       Alert.alert('Error', 'Please enter Phone and an M-PIN');
//       return;
//     }

//     try {
//       // Hit our backend register route
//       await api.post('/auth/register', {
//         full_name: name,
//         phone_number: phone,
//         mpin: mpin,
//       });

//       Alert.alert('Success', 'Account created! You can now log in.');
//       onNavigateToLogin(); // Send them back to the login screen
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Registration Failed';
//       Alert.alert('Error', errorMsg);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Full Name"
//         value={name}
//         onChangeText={setName}
//      />
      
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Phone Number"
//         keyboardType="numeric"
//         maxLength={10}
//         value={phone}
//         onChangeText={setPhone}
//       />
      
//       <TextInput
//         style={styles.input}
//         placeholder="Create 4-Digit M-PIN"
//         keyboardType="numeric"
//         secureTextEntry={true}
//         maxLength={4}
//         value={mpin}
//         onChangeText={setMpin}
//       />
      
//       <TouchableOpacity style={styles.button} onPress={handleRegister}>
//         <Text style={styles.buttonText}>REGISTER</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={onNavigateToLogin} style={styles.linkButton}>
//         <Text style={styles.linkText}>Already have an account? Log in</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
//   title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
//   input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
//   button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
//   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   linkButton: { alignItems: 'center', padding: 10 },
//   linkText: { color: '#007bff', fontSize: 16 }
// });



// src/RegisterScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Phone, Lock, User } from 'lucide-react-native';
import api from './api';
import { theme } from './theme';
import Typography from './components/Typography';

export default function RegisterScreen({ onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mpin, setMpin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !mpin) {
      Alert.alert('Error', 'Please fill in all fields to register.');
      return;
    }

    setIsLoading(true);

    try {
      // Hit our backend register route
      await api.post('/auth/register', {
        full_name: name,
        phone_number: phone,
        mpin: mpin,
      });

      setIsLoading(false);
      Alert.alert('Success', 'Account created! You can now log in.');
      onNavigateToLogin(); // Send them back to the login screen
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.error || 'Registration Failed';
      Alert.alert('Error', errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Typography weight="700" style={styles.title}>Create Account</Typography>
        <Typography style={styles.subtitle}>Join MegaPlay today and start your journey securely.</Typography>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        
        {/* Full Name Input */}
        <View style={styles.inputGroup}>
            <Typography weight="600" style={styles.label}>Full Name</Typography>
            <View style={styles.inputWrapper}>
                <User color={theme.colors.textMuted} size={20} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.colors.textMuted}
                />
            </View>
        </View>

        {/* Phone Input */}
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

        {/* M-PIN Input */}
        <View style={styles.inputGroup}>
            <Typography weight="600" style={styles.label}>Secure M-PIN</Typography>
            <View style={styles.inputWrapper}>
                <Lock color={theme.colors.textMuted} size={20} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={mpin}
                    onChangeText={setMpin}
                    placeholder="Create a 4-digit PIN"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                />
            </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
            style={[styles.primaryButton, (!name || !phone || !mpin) && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={!name || !phone || !mpin || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={theme.colors.surface} />
            ) : (
                <Typography weight="600" style={styles.buttonText}>Register Now</Typography>
            )}
        </TouchableOpacity>

        {/* Secondary Action */}
        <TouchableOpacity onPress={onNavigateToLogin} style={styles.secondaryAction} activeOpacity={0.6}>
            <Typography style={styles.secondaryText}>
                Already have an account? <Typography weight="700" style={styles.linkText}>Log in</Typography>
            </Typography>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: theme.spacing.xl },
  headerContainer: { marginBottom: theme.spacing.xxl, alignItems: 'center' },
  title: { fontSize: 28, marginBottom: theme.spacing.xs, textAlign: 'center', color: theme.colors.textDark },
  subtitle: { fontSize: 14, color: theme.colors.textMuted, textAlign: 'center', paddingHorizontal: theme.spacing.l },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: theme.spacing.m },
  label: { fontSize: 12, marginBottom: theme.spacing.s, color: theme.colors.textDark, marginLeft: theme.spacing.xs },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.m, paddingHorizontal: theme.spacing.m, height: 52 },
  icon: { marginRight: theme.spacing.s },
  input: { flex: 1, fontSize: 16, color: theme.colors.textDark, fontFamily: 'Inter_500Medium' },
  
  // Notice we use the same primary color as the login screen for brand consistency
  primaryButton: { backgroundColor: theme.colors.primary, height: 56, borderRadius: theme.radius.m, justifyContent: 'center', alignItems: 'center', marginTop: theme.spacing.m, ...theme.shadows.card },
  buttonDisabled: { backgroundColor: theme.colors.border, shadowOpacity: 0 },
  buttonText: { color: theme.colors.surface, fontSize: 16 },
  secondaryAction: { marginTop: theme.spacing.xl, alignItems: 'center' },
  secondaryText: { color: theme.colors.textMuted },
  linkText: { color: theme.colors.primary },
});