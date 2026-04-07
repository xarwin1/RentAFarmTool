import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '../../../../lib/auth-context';

export default function loginScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const router = useRouter();
  const { logIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError(null);

    if (isSignUp) {
      const authError = await signUp(email, password);
      if (authError) {
        setError(authError);
        return;
      }
      router.replace("/navigation/(tabs)");
    } else {
      const authError = await logIn(email, password);
      if (authError) {
        setError(authError);
        return;
      }
      router.replace("/navigation/(tabs)");
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create an Account" : "Login"}
        </Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          left={
            <TextInput.Icon icon={({ color, size }) => (
              <Ionicons name="mail-outline" color={color} size={size} />
            )}
            />
          }
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          style={styles.input}
          left={
            <TextInput.Icon icon={({ color, size }) => (
              <Ionicons name="lock-closed-outline" color={color} size={size} />
            )}
            />
          }
        />
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleAuth}
        >
          {isSignUp ? "Sign Up" : "Log In"}
        </Button>
        <Button
          mode="text"
          style={styles.switchBtn}
          textColor="coral"
          onPress={handleSwitchMode}
        >
          {isSignUp
            ? "Already have an account? Log In"
            : "Don't have an account? Create an account"
          }
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    color: "purple",
  },
  errorText: {
    color: "#F44336",
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    backgroundColor: "coral",
  },
  switchBtn: {
    marginTop: 8,
  },
});
