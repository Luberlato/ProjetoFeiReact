import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPlayerById, addPlayer, updatePlayer } from '../services/playerService';
import { playerFormStyles as styles } from '../styles/playerForm.styles';
import { theme } from '../styles/theme';

const POSITIONS = ['Goleiro', 'Defensor', 'Meio-Campo', 'Atacante'];
const FEET = ['Destro', 'Canhoto', 'Ambidestro'];
const ATTRIBUTES = [
  { key: 'pace', label: 'Velocidade' },
  { key: 'passing', label: 'Passe' },
  { key: 'shooting', label: 'Finalização' },
  { key: 'physical', label: 'Físico' },
];

const EMPTY_FORM = {
  name: '',
  number: '',
  age: '',
  position: 'Meio-Campo',
  foot: 'Destro',
  photoUrl: '',
  pace: '70',
  passing: '70',
  shooting: '70',
  physical: '70',
};

export default function PlayerFormScreen({ navigation, route }) {
  const playerId = route.params?.playerId;
  const isEditing = !!playerId;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    getPlayerById(playerId)
      .then((player) => {
        if (!player) return;
        setForm({
          name: player.name || '',
          number: String(player.number ?? ''),
          age: String(player.age ?? ''),
          position: player.position || 'Meio-Campo',
          foot: player.foot || 'Destro',
          photoUrl: player.photoUrl || '',
          pace: String(player.stats?.pace ?? 70),
          passing: String(player.stats?.passing ?? 70),
          shooting: String(player.stats?.shooting ?? 70),
          physical: String(player.stats?.physical ?? 70),
        });
      })
      .finally(() => setLoading(false));
  }, [playerId, isEditing]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Informe o nome do atleta.';
    const number = Number(form.number);
    if (!form.number.trim() || !Number.isInteger(number) || number < 1 || number > 99) {
      next.number = 'Camisa de 1 a 99.';
    }
    const age = Number(form.age);
    if (!form.age.trim() || !Number.isInteger(age) || age < 10 || age > 60) {
      next.age = 'Idade de 10 a 60.';
    }
    ATTRIBUTES.forEach(({ key }) => {
      const value = Number(form[key]);
      if (form[key].trim() === '' || Number.isNaN(value) || value < 0 || value > 100) {
        next[key] = '0 a 100.';
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Vibration.vibrate(100);
      return;
    }

    setSaving(true);
    try {
      let ok = true;
      if (isEditing) {
        ok = await updatePlayer(playerId, {
          name: form.name.trim(),
          number: Number(form.number),
          age: Number(form.age),
          position: form.position,
          foot: form.foot,
          photoUrl: form.photoUrl.trim(),
          stats: {
            pace: Number(form.pace),
            passing: Number(form.passing),
            shooting: Number(form.shooting),
            physical: Number(form.physical),
          },
        });
      } else {
        await addPlayer({ ...form, name: form.name.trim(), photoUrl: form.photoUrl.trim() });
      }

      if (!ok) {
        Alert.alert('Erro', 'Não foi possível salvar as alterações.');
        return;
      }
      Vibration.vibrate(50);
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderField = (key, label, props = {}, first = false) => (
    <View style={props.style}>
      <Text style={[styles.inputLabel, first && styles.inputFirstLabel]}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] && styles.inputError]}
        value={form[key]}
        onChangeText={(text) => setField(key, text)}
        placeholderTextColor={theme.colors.textMuted}
        {...props}
      />
      {!!errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const renderChips = (label, options, key) => (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.chipsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.chip, form[key] === option && styles.chipActive]}
            onPress={() => setField(key, option)}
          >
            <Text style={[styles.chipText, form[key] === option && styles.chipTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? 'Editar atleta' : 'Novo atleta'}</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dados do atleta</Text>
          {renderField('name', 'Nome', { placeholder: 'Ex.: Lucas Silva' }, true)}

          <View style={styles.row}>
            {renderField('number', 'Camisa', {
              placeholder: '10',
              keyboardType: 'number-pad',
              maxLength: 2,
              style: styles.rowItem,
            })}
            {renderField('age', 'Idade', {
              placeholder: '22',
              keyboardType: 'number-pad',
              maxLength: 2,
              style: styles.rowItem,
            })}
          </View>

          {renderChips('Posição', POSITIONS, 'position')}
          {renderChips('Pé dominante', FEET, 'foot')}
          {renderField('photoUrl', 'URL da foto (opcional)', {
            placeholder: 'https://...',
            autoCapitalize: 'none',
            keyboardType: 'url',
          })}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Atributos (0 a 100)</Text>
          <View style={styles.row}>
            {renderField('pace', ATTRIBUTES[0].label, {
              keyboardType: 'number-pad',
              maxLength: 3,
              style: styles.rowItem,
            }, true)}
            {renderField('passing', ATTRIBUTES[1].label, {
              keyboardType: 'number-pad',
              maxLength: 3,
              style: styles.rowItem,
            }, true)}
          </View>
          <View style={styles.row}>
            {renderField('shooting', ATTRIBUTES[2].label, {
              keyboardType: 'number-pad',
              maxLength: 3,
              style: styles.rowItem,
            })}
            {renderField('physical', ATTRIBUTES[3].label, {
              keyboardType: 'number-pad',
              maxLength: 3,
              style: styles.rowItem,
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={theme.colors.textWhite} />
          ) : (
            <>
              <Ionicons name="checkmark" size={18} color={theme.colors.textWhite} />
              <Text style={styles.primaryButtonText}>
                {isEditing ? 'Salvar alterações' : 'Cadastrar atleta'}
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
