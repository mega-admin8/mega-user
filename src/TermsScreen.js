// src/TermsScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.paragraph}>
          Welcome to MegaPlay. By downloading, accessing, or using this
          application, you agree to be bound by these Terms and Conditions.
        </Text>

        <Text style={styles.sectionHeading}>1. User Obligations</Text>
        <Text style={styles.paragraph}>
          You must be at least 18 years old to use this application. You are
          responsible for maintaining the confidentiality of your account M-PIN
          and any actions taken under your account.
        </Text>

        <Text style={styles.sectionHeading}>2. Bidding & Wallet Rules</Text>
        <Text style={styles.paragraph}>
          All bids placed are final and cannot be reversed. Wallet balances
          reflect the current available points. MegaPlay reserves the right to
          modify game rates at any time with prior notice.
        </Text>

        <Text style={styles.sectionHeading}>3. Account Termination</Text>
        <Text style={styles.paragraph}>
          We reserve the right to suspend or terminate your account if we detect
          fraudulent activity, violation of these terms, or manipulation of the
          app's systems.
        </Text>

        {/* You can add more text here later! */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f5f8" },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6a0dad",
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    textAlign: "justify",
  },
});
