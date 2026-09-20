import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Play, Clock, Sparkles } from 'lucide-react-native';
import api from './api';
import { theme } from './theme';
import Typography from './components/Typography';

export default function GaliDesawarListScreen() {
  const navigation = useNavigation();
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActiveMarkets = async () => {
    try {
      const response = await api.get('/gali-desawar/user/markets');
      setMarkets(response.data);
    } catch (error) {
      console.error('Failed to fetch Gali Desawar markets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActiveMarkets();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActiveMarkets();
  };

  const isMarketOpen = (openTime, closeTime) => {
    if (!openTime || !closeTime) return false;

    const now = new Date();
    const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:MM"

    if (closeTime > openTime) {
      return currentTimeStr >= openTime && currentTimeStr <= closeTime;
    } else {
      return currentTimeStr >= openTime || currentTimeStr <= closeTime;
    }
  };

  const renderMarketCard = ({ item }) => {
    const open = isMarketOpen(item.open_time, item.close_time);

    return (
      <View style={styles.card}>
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Sparkles size={18} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Typography weight="700" style={styles.marketName}>
              {item.name}
            </Typography>
          </View>

          <View style={[styles.statusBadge, open ? styles.badgeOpen : styles.badgeClosed]}>
            <Typography weight="600" style={[styles.statusText, open ? styles.textOpen : styles.textClosed]}>
              {open ? 'BETTING OPEN' : 'CLOSED'}
            </Typography>
          </View>
        </View>

        {/* Result & Timing Details */}
        <View style={styles.bodyRow}>
          <View style={styles.resultBox}>
            <Typography style={styles.resultLabel}>Today's Result</Typography>
            <Typography weight="700" style={styles.resultValue}>
              {item.todays_result ? item.todays_result : '**'}
            </Typography>
          </View>

          <View style={styles.timingBox}>
            <View style={styles.timeItem}>
              <Clock size={12} color={theme.colors.textMuted} style={{ marginRight: 4 }} />
              <Typography style={styles.timeLabel}>Open: </Typography>
              <Typography weight="600" style={styles.timeValue}>{item.open_time}</Typography>
            </View>
            <View style={styles.timeItem}>
              <Clock size={12} color={theme.colors.textMuted} style={{ marginRight: 4 }} />
              <Typography style={styles.timeLabel}>Close: </Typography>
              <Typography weight="600" style={styles.timeValue}>{item.close_time}</Typography>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.playBtn, !open && styles.playBtnDisabled]}
          disabled={!open}
          onPress={() => navigation.navigate('GaliDesawarPlayScreen', { market: item })}
        >
          <Play color="#fff" size={16} style={{ marginRight: 6 }} fill="#fff" />
          <Typography weight="700" style={styles.playBtnText}>
            {open ? 'PLAY NOW' : 'MARKET CLOSED'}
          </Typography>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Typography weight="700" style={styles.headerTitle}>
          Gali Desawar Markets
        </Typography>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : markets.length === 0 ? (
        <View style={styles.emptyState}>
          <Typography style={styles.emptyText}>No active markets available right now.</Typography>
        </View>
      ) : (
        <FlatList
          data={markets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMarketCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: 22, color: theme.colors.textDark },
  listContent: { padding: theme.spacing.m, paddingBottom: 40 },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 10,
    marginBottom: 12,
  },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  marketName: { fontSize: 18, color: theme.colors.textDark, textTransform: 'uppercase' },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeOpen: { backgroundColor: '#D1FAE5' },
  badgeClosed: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 10 },
  textOpen: { color: '#059669' },
  textClosed: { color: '#DC2626' },

  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultBox: {
    backgroundColor: theme.colors.primaryLight + '40',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.m,
    alignItems: 'center',
  },
  resultLabel: { fontSize: 11, color: theme.colors.textMuted },
  resultValue: { fontSize: 22, color: theme.colors.primary, marginTop: 2 },

  timingBox: { alignItems: 'flex-end' },
  timeItem: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  timeLabel: { fontSize: 12, color: theme.colors.textMuted },
  timeValue: { fontSize: 12, color: theme.colors.textDark },

  playBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: theme.radius.m,
  },
  playBtnDisabled: { backgroundColor: theme.colors.textMuted },
  playBtnText: { color: '#fff', fontSize: 14 },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: theme.colors.textMuted, fontSize: 16 },
});