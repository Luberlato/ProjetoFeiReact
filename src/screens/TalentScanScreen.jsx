import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { getPlayers } from '../services/playerService';
import { commonStyles } from '../styles/common.styles';
import { talentScanStyles as styles } from '../styles/talentScan.styles';
import { theme } from '../styles/theme';

const TALENT_MIN_RATING = 9; // Nota a partir da qual o atleta é considerado craque
const SCAN_STEP_MS = 700; // Tempo "analisando" cada atleta

const isTalent = (player) => (Number(player.rating) || 0) >= TALENT_MIN_RATING;

export default function TalentScanScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanIndex, setScanIndex] = useState(-1); // Atleta sendo analisado
  const [foundIds, setFoundIds] = useState([]);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const whistle = useAudioPlayer(require('../../assets/apito.wav'));

  useEffect(() => {
    (async () => {
      try {
        const data = await getPlayers();
        // Ordena por nota para a busca "descer" do melhor para o pior
        setPlayers([...(data || [])].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)));
      } catch (error) {
        console.log('Erro ao carregar atletas para a busca:', error);
      } finally {
        setLoading(false);
      }
    })();
    return () => clearTimeout(timerRef.current);
  }, []);

  const blowWhistle = async () => {
    try {
      whistle.seekTo(0);
      whistle.play();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Sem áudio/vibração disponível: a busca segue normalmente
    }
  };

  // Avança a busca um atleta por vez; apita ao encontrar nota >= 9
  useEffect(() => {
    if (!scanning) return;

    if (scanIndex >= players.length) {
      setScanning(false);
      setFinished(true);
      return;
    }

    const current = players[scanIndex];
    if (current && isTalent(current)) {
      setFoundIds((ids) => [...ids, current.id]);
      blowWhistle();
    }
    timerRef.current = setTimeout(() => setScanIndex((i) => i + 1), SCAN_STEP_MS);
    return () => clearTimeout(timerRef.current);
  }, [scanning, scanIndex]);

  const startScan = () => {
    setFoundIds([]);
    setFinished(false);
    setScanIndex(0);
    setScanning(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const foundSomething = foundIds.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Busca de Craques</Text>
            <Text style={styles.subtitle}>Apita ao achar atleta nota {TALENT_MIN_RATING}+</Text>
          </View>
        </View>

        <View style={styles.scanCard}>
          <View style={[styles.scanIconBox, foundSomething && styles.scanIconBoxFound]}>
            <Ionicons
              name={foundSomething ? 'trophy' : 'search'}
              size={34}
              color={foundSomething ? theme.colors.warning : theme.colors.primary}
            />
          </View>
          <Text style={styles.scanTitle}>
            {scanning
              ? 'Analisando atletas...'
              : finished
              ? foundSomething
                ? `${foundIds.length} craque(s) encontrado(s)!`
                : `Nenhum atleta nota ${TALENT_MIN_RATING}+ no elenco`
              : 'Pronto para buscar craques'}
          </Text>
          <Text style={styles.scanHint}>
            Cada atleta é analisado em sequência e o celular apita (e vibra) quando a nota for{' '}
            {TALENT_MIN_RATING} ou mais.
          </Text>
          <TouchableOpacity
            style={[
              commonStyles.primaryButton,
              styles.scanButton,
              (scanning || players.length === 0) && { opacity: 0.5 },
            ]}
            onPress={startScan}
            disabled={scanning || players.length === 0}
            activeOpacity={0.8}
          >
            <Ionicons name="radio-outline" size={18} color={theme.colors.textWhite} />
            <Text style={[commonStyles.primaryButtonText, { marginLeft: theme.spacing.sm }]}>
              {finished ? 'Buscar novamente' : 'Iniciar busca'}
            </Text>
          </TouchableOpacity>
        </View>

        {players.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhum atleta cadastrado para analisar.</Text>
          </View>
        ) : (
          players.map((player, index) => {
            const found = foundIds.includes(player.id);
            const analyzing = scanning && index === scanIndex;
            return (
              <View
                key={player.id || index}
                style={[
                  styles.playerCard,
                  analyzing && styles.playerCardScanning,
                  found && styles.playerCardFound,
                ]}
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
                <View style={[styles.ratingTag, found && styles.ratingTagFound]}>
                  <Ionicons
                    name={found ? 'notifications' : 'star'}
                    size={12}
                    color={found ? theme.colors.textWhite : theme.colors.accentDark}
                  />
                  <Text style={[styles.ratingValue, found && styles.ratingValueFound]}>
                    {Number(player.rating || 0).toFixed(1)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
