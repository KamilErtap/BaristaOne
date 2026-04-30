import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Ad, email ve şifre zorunludur.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await authApi.register(form);
      await login(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.brand}>☕ BaristaOne</Text>
        <Text style={styles.title}>Kayıt Ol</Text>
        <Text style={styles.subtitle}>
          Yeni hesap oluştur ve masadan sipariş vermeye başla.
        </Text>

        <View style={styles.form}>
          <AppInput
            label="Ad Soyad"
            placeholder="Adın"
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            autoCapitalize="words"
          />

          <AppInput
            label="Email"
            placeholder="email@example.com"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
          />

          <AppInput
            label="Şifre"
            placeholder="Şifren"
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AppButton
            title="Kayıt Ol"
            onPress={handleRegister}
            loading={submitting}
          />

          <AppButton
            title="Zaten hesabın var mı? Giriş yap"
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: '#8b5e3c',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2937',
  },
  subtitle: {
    marginTop: 8,
    color: '#64748b',
    lineHeight: 21,
  },
  form: {
    marginTop: 22,
    gap: 12,
  },
  error: {
    color: '#dc2626',
    fontWeight: '700',
  },
});