import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getPlayers } from '../services/playerService';
import { playerListStyles as styles } from '../styles/playerList.styles';
import { theme } from '../styles/theme';

const POSITIONS = ['Todos', 'Goleiro', 'Defensor', 'Meio-Campo', 'Atacante'];

export default function PlayerListScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('Todos');

  // Recarrega ao voltar de outras telas (ex.: após excluir um atleta)
  useFocusEffect(
    useCallback(() => {
      getPlayers()
        .then((data) => setPlayers(data || []))
        .finally(() => setLoading(false));
    }, [])
  );

  const term = search.trim().toLowerCase();
  const filteredPlayers = players.filter(
    (p) =>
      (position === 'Todos' || p.position === position) &&
      ((p.name || '').toLowerCase().includes(term) || String(p.number).includes(term))
  );

  if (loading) {
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
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.contentWrapper}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Elenco</Text>
          <TouchableOpacity
            style={[styles.iconButton, styles.addButton]}
            onPress={() => navigation.navigate('PlayerForm')}
          >
            <Ionicons name="add" size={22} color={theme.colors.textWhite} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou camisa"
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filtersRow}>
          {POSITIONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.filterChip, position === item && styles.filterChipActive]}
              onPress={() => setPosition(item)}
            >
              <Text style={[styles.filterText, position === item && styles.filterTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredPlayers.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhum atleta encontrado.</Text>
          </View>
        ) : (
          filteredPlayers.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={styles.playerCard}
              onPress={() => navigation.navigate('PlayerDetail', { playerId: player.id })}
            >
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
                <Text style={styles.ratingValue}>{Number(player.rating || 0).toFixed(1)}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}
