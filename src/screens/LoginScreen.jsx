import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginUser, registerUser } from '../services/authService';
import { loginStyles as styles } from '../styles/login.styles';
import { theme } from '../styles/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    const result = isRegistering 
      ? await registerUser(email.trim(), password)
      : await loginUser(email.trim(), password);

    setLoading(false);

    if (result.success) {
      if (isRegistering) {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Agora clique em Entrar.');
        setIsRegistering(false);
      } else {
        navigation.replace('Dashboard');
      }
    } else {
      Alert.alert('Aviso', result.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="football-outline" size={40} color={theme.colors.primary} />
            </View>
            <Text style={styles.appTitle}>ScoutApp</Text>
            <Text style={styles.appSubtitle}>
              Avaliação de atletas e análise de rendimento esportivo
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={[styles.inputLabel, styles.inputFirstLabel]}>E-mail institucional / técnico</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="treinador@clube.com"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={18} 
                  color={theme.colors.textMuted} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textWhite} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isRegistering ? 'Cadastrar' : 'Entrar'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton} 
              onPress={() => setIsRegistering(!isRegistering)}
            >
              <Text style={styles.switchButtonText}>
                {isRegistering 
                  ? 'Já possui uma conta? Entrar' 
                  : 'Não tem conta? Cadastre-se'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
