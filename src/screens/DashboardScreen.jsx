import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPlayers } from '../services/playerService';
import { dashboardStyles as styles } from '../styles/dashboard.styles';
import { theme } from '../styles/theme';

export default function DashboardScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await getPlayers();
      setPlayers(data || []);
    } catch (error) {
      console.log('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  };

  // Cálculos dinâmicos a partir do banco de dados
  const totalPlayers = players.length;
  const avgRating = totalPlayers > 0
    ? (players.reduce((acc, p) => acc + (Number(p.rating) || 0), 0) / totalPlayers).toFixed(1)
    : '0.0';
  const totalGoals = players.reduce((acc, p) => acc + (Number(p.goals) || 0), 0);
  const totalAssists = players.reduce((acc, p) => acc + (Number(p.assists) || 0), 0);

  // Top 3 atletas com maior nota
  const topPlayers = [...players]
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    .slice(0, 3);

  const getRankBadgeColor = (index) => {
    if (index === 0) return theme.colors.badgeGold;
    if (index === 1) return theme.colors.badgeSilver;
    return theme.colors.badgeBronze;
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      <View style={styles.contentWrapper}>
        {/* Barra Superior com Saudação e Logout */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingTitle}>Painel Geral</Text>
            <Text style={styles.greetingSubtitle}>Resumo de rendimento da equipe</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>

        {/* Grade de Métricas Principais */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Atletas</Text>
              <View style={[styles.metricIconBox, { backgroundColor: theme.colors.primarySoft }]}>
                <Ionicons name="people" size={16} color={theme.colors.primary} />
              </View>
            </View>
            <Text style={styles.metricValue}>{totalPlayers}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Nota Média</Text>
              <View style={[styles.metricIconBox, { backgroundColor: theme.colors.accentLight }]}>
                <Ionicons name="star" size={16} color={theme.colors.accentDark} />
              </View>
            </View>
            <Text style={styles.metricValue}>{avgRating}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Gols Totais</Text>
              <View style={[styles.metricIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="football" size={16} color="#D97706" />
              </View>
            </View>
            <Text style={styles.metricValue}>{totalGoals}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Assistências</Text>
              <View style={[styles.metricIconBox, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="flash" size={16} color="#9333EA" />
              </View>
            </View>
            <Text style={styles.metricValue}>{totalAssists}</Text>
          </View>
        </View>

        {/* Atalho para a busca de craques (apito + vibração) */}
        <TouchableOpacity
          style={styles.drawShortcut}
          onPress={() => navigation.navigate('TalentScan')}
          activeOpacity={0.8}
        >
          <View style={styles.drawShortcutIcon}>
            <Ionicons name="megaphone-outline" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>Busca de Craques</Text>
            <Text style={styles.playerSubtext}>O celular apita ao achar atleta nota 9+</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>

        {/* Destaques do Elenco (Top 3) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Destaques do Elenco</Text>
          <TouchableOpacity
            style={styles.sectionBadge}
            onPress={() => navigation.navigate('PlayerList')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionBadgeText}>Ver elenco</Text>
          </TouchableOpacity>
        </View>

        {topPlayers.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhum atleta cadastrado no banco ainda.</Text>
          </View>
        ) : (
          topPlayers.map((player, index) => (
            <View key={player.id || index} style={styles.topPlayerCard}>
              <View style={[styles.rankBadge, { backgroundColor: getRankBadgeColor(index) }]}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>

              <Image
                source={{
                  uri:
                    player.photoUrl ||
                    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
                }}
                style={styles.playerAvatar}
              />

              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerSubtext}>
                  Camisa #{player.number} • {player.position}
                </Text>
              </View>

              <View style={styles.ratingTag}>
                <Ionicons name="star" size={12} color={theme.colors.accentDark} />
                <Text style={styles.ratingValue}>
                  {Number(player.rating || 0).toFixed(1)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
