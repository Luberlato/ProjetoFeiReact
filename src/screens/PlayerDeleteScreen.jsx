import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getPlayerById, deletePlayer } from '../services/playerService';
import { playerDeleteStyles as styles } from '../styles/playerDelete.styles';
import { theme } from '../styles/theme';

const normalize = (text) => text.trim().toLowerCase();

export default function PlayerDeleteScreen({ navigation, route }) {
  const { playerId } = route.params;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPlayerById(playerId)
      .then(setPlayer)
      .finally(() => setLoading(false));
  }, [playerId]);

  // O botão só habilita quando o usuário digita o nome exato do atleta
  const canDelete = !!player && !deleting && normalize(confirmText) === normalize(player.name);

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    const success = await deletePlayer(playerId);

    if (!success) {
      setDeleting(false);
      Alert.alert('Erro', 'Não foi possível excluir o atleta. Tente novamente.');
      return;
    }

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Sem vibração disponível: segue normalmente
    }
    // Volta direto para o elenco, já que o perfil deixou de existir
    navigation.navigate('PlayerList');
  };

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
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.contentWrapper}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Excluir atleta</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.warningBox}>
          <Ionicons name="warning" size={20} color={theme.colors.danger} />
          <Text style={styles.warningText}>
            Esta ação é permanente e não pode ser desfeita. Revise o que será removido antes de
            confirmar.
          </Text>
        </View>

        <View style={styles.playerCard}>
          <Image
            source={{
              uri:
                player.photoUrl ||
                'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
            }}
            style={styles.avatar}
          />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerSubtext}>
              Camisa #{player.number} • {player.position}
            </Text>
          </View>
        </View>

        <View style={styles.lossList}>
          <Text style={styles.lossTitle}>Serão apagados:</Text>
          <Text style={styles.lossItem}>• Dados cadastrais e atributos</Text>
          <Text style={styles.lossItem}>
            • {player.matches || 0} jogo(s), {player.goals || 0} gol(s) e {player.assists || 0}{' '}
            assistência(s)
          </Text>
          <Text style={styles.lossItem}>
            • Nota {Number(player.rating || 0).toFixed(1)} e participação nos rankings
          </Text>
        </View>

        <Text style={styles.confirmLabel}>
          Digite <Text style={styles.confirmName}>{player.name}</Text> para confirmar
        </Text>
        <TextInput
          style={[styles.input, canDelete && styles.inputMatch]}
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder={player.name}
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!deleting}
        />

        <TouchableOpacity
          style={[styles.dangerButton, !canDelete && styles.disabled]}
          onPress={handleDelete}
          disabled={!canDelete}
          activeOpacity={0.8}
        >
          {deleting ? (
            <ActivityIndicator color={theme.colors.textWhite} />
          ) : (
            <>
              <Ionicons name="trash" size={18} color={theme.colors.textWhite} />
              <Text style={styles.dangerButtonText}>Excluir definitivamente</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={deleting}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
