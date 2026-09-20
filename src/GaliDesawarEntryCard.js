import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { theme } from './theme'; // Adjust import path

const GaliDesawarEntryCard = ({ navigation }) => {
  return (
    <TouchableOpacity 
      style={styles.gdContainer} 
      onPress={() => navigation.navigate('GaliDesawarList')}
    >
      <Text style={styles.gdTitle}>GALI DESAWAR</Text>
      <View style={styles.gdPlayButton}>
        <Text style={styles.gdPlayText}>Play Now</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gdContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    borderRadius: theme.radius.m,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.card,
  },
  gdTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
    letterSpacing: 0.5,
  },
  gdPlayButton: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.round,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  gdPlayText: {
    color: theme.colors.primary,
    fontWeight: '600',
  }
});

export default GaliDesawarEntryCard;