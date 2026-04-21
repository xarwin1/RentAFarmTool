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
import DateTimePicker from "@react-native-community/datetimepicker";

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { logIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (isSignUp) {
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all required fields.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setError(null);
      const authError = await signUp(email, password, name, phone, location, birthdate);
      if (authError) { setError(authError); return; }
      router.replace("/navigation/(tabs)");
    } else {
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }
      setError(null);
      const authError = await logIn(email, password);
      if (authError) { setError(authError); return; }
      router.replace("/navigation/(tabs)");
    }
  };

  const switchMode = () => {
    setIsSignUp(p => !p);
    setError(null);
    setName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setPassword("");
    setConfirmPassword("");
    setBirthdate("");
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

        {/* NAME — sign up only */}
        {isSignUp && (
          <>
            <Text style={styles.label}>Full name <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Juan Dela Cruz"
                placeholderTextColor={theme.subtext}
                style={styles.input}
              />
            </View>
          </>
        )}

        {/* EMAIL */}
        <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
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

        {/* PHONE — sign up only */}
        {isSignUp && (
          <>
            <Text style={styles.label}>Phone number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+63 912 345 6789"
                placeholderTextColor={theme.subtext}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
          </>
        )}

        {/* LOCATION — sign up only */}
        {isSignUp && (
          <>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Naic, Cavite"
                placeholderTextColor={theme.subtext}
                style={styles.input}
              />
            </View>
          </>
        )}
        {/* birthday*/}
        {isSignUp && (
          <>
            <Text style={styles.label}>Birthdate</Text>
            <Pressable
              style={styles.inputWrapper}
              onPress={() => setShowBirthdatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
              <Text style={[styles.input, { paddingVertical: 11, color: birthdate ? theme.text : theme.subtext }]}>
                {birthdate ? new Date(birthdate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) : "Select birthdate"}
              </Text>
            </Pressable>

            {showBirthdatePicker && (
              <DateTimePicker
                value={birthdate ? new Date(birthdate) : new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(event, date) => {
                  setShowBirthdatePicker(false);
                  if (date) setBirthdate(date.toISOString());
                }}
              />
            )}
          </>
        )}

        {/* PASSWORD */}
        <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
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

        {/* CONFIRM PASSWORD — sign up only */}
        {isSignUp && (
          <>
            <Text style={styles.label}>Confirm password <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor={theme.subtext}
                autoCapitalize="none"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
              />
              <Pressable onPress={() => setShowConfirmPassword(p => !p)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={theme.subtext}
                />
              </Pressable>
            </View>
          </>
        )}

        {/* ERROR */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* SUBMIT */}
        <Pressable style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isSignUp ? "Sign up" : "Log in"}
          </Text>
        </Pressable>

        {/* SWITCH MODE */}
        <Pressable onPress={switchMode}>
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
    required: {
      color: "#F44336",
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
