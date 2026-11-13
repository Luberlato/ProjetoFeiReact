import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getPlayerById } from '../services/playerService';
import { playerDetailStyles as styles } from '../styles/playerDetail.styles';
import { theme } from '../styles/theme';

const ATTRIBUTES = [
  { key: 'pace', label: 'Velocidade' },
  { key: 'passing', label: 'Passe' },
  { key: 'shooting', label: 'Finalização' },
  { key: 'physical', label: 'Físico' },
];

export default function PlayerDetailScreen({ navigation, route }) {
  const { playerId } = route.params;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recarrega ao voltar da edição ou do registro de scout
  useFocusEffect(
    useCallback(() => {
      getPlayerById(playerId)
        .then(setPlayer)
        .finally(() => setLoading(false));
    }, [playerId])
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyText}>Atleta não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Perfil</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                player.photoUrl ||
                'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
            }}
            style={styles.avatar}
          />
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerSubtext}>
            Camisa #{player.number} • {player.position}
          </Text>
          <Text style={styles.playerSubtext}>
            {player.age} anos • Pé {player.foot}
          </Text>
          <View style={styles.ratingTag}>
            <Ionicons name="star" size={14} color={theme.colors.accentDark} />
            <Text style={styles.ratingValue}>{Number(player.rating || 0).toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{player.matches || 0}</Text>
            <Text style={styles.summaryLabel}>Jogos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{player.goals || 0}</Text>
            <Text style={styles.summaryLabel}>Gols</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{player.assists || 0}</Text>
            <Text style={styles.summaryLabel}>Assist.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Atributos</Text>
        <View style={styles.attributesCard}>
          {ATTRIBUTES.map(({ key, label }) => {
            const value = player.stats?.[key] || 0;
            return (
              <View key={key} style={styles.attributeRow}>
                <View style={styles.attributeHeader}>
                  <Text style={styles.attributeLabel}>{label}</Text>
                  <Text style={styles.attributeValue}>{value}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${value}%` }]} />
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('MatchScout', { playerId })}
        >
          <Ionicons name="clipboard" size={18} color={theme.colors.textWhite} />
          <Text style={styles.primaryButtonText}>Registrar scout de partida</Text>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('PlayerForm', { playerId })}
          >
            <Ionicons name="create-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.secondaryButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.deleteButton]}
            onPress={() => navigation.navigate('PlayerDelete', { playerId })}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
            <Text style={[styles.secondaryButtonText, styles.deleteButtonText]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
