import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Text,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../../lib/auth-context';
import { useTheme } from '@/theme/ThemeContext';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();
  const styles = createStyles(theme);
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
      if (authError) { setError(authError); return; }
      router.replace("/navigation/(tabs)");
    } else {
      const authError = await logIn(email, password);
      if (authError) { setError(authError); return; }
      router.replace("/navigation/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* GREEN HERO */}
      <View style={styles.hero}>
        <Image
          source={require("@/assets/raft/logo-transparent.png")}
          style={styles.logo}
        />
      </View>

      {/* BOTTOM SHEET */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.handle} />

        <Text style={styles.heading}>
          {isSignUp ? "Create an account" : "Welcome back"}
        </Text>

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            placeholderTextColor={theme.subtext}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        {/* PASSWORD */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={theme.subtext}
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <Pressable onPress={() => setShowPassword(p => !p)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={theme.subtext}
            />
          </Pressable>
        </View>

        {/* ERROR */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* SUBMIT */}
        <Pressable style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isSignUp ? "Sign up" : "Log in"}
          </Text>
        </Pressable>

        {/* SWITCH MODE */}
        <Pressable onPress={() => setIsSignUp(p => !p)}>
          <Text style={styles.switchText}>
            {isSignUp
              ? "Already have an account? "
              : "Don't have an account? "}
            <Text style={styles.switchLink}>
              {isSignUp ? "Log in" : "Sign up"}
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
    },
    hero: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 40,
    },
    logo: {
      width: 256,
      height: 256,
      borderRadius: 28,
      marginBottom: 14,
    },
    appTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#fff",
      letterSpacing: 0.3,
    },
    sheet: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      flex: 1.2,
    },
    sheetContent: {
      padding: 24,
      paddingBottom: 40,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.border,
      alignSelf: "center",
      marginBottom: 20,
    },
    heading: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 20,
    },
    label: {
      fontSize: 12,
      color: theme.subtext,
      marginBottom: 5,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
      marginBottom: 14,
    },
    inputIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      paddingVertical: 11,
      fontSize: 14,
      color: theme.text,
    },
    errorText: {
      color: "#F44336",
      fontSize: 13,
      marginBottom: 10,
      textAlign: "center",
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 4,
      marginBottom: 16,
    },
    buttonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "700",
      letterSpacing: 0.4,
    },
    switchText: {
      textAlign: "center",
      fontSize: 13,
      color: theme.subtext,
    },
    switchLink: {
      color: theme.primary,
      fontWeight: "600",
    },
  });
