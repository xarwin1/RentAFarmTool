import { Text, View, StyleSheet } from "react-native";
import { Link } from 'expo-router';

export default function Add() {
  return (
    <View style={styles.container}>
      <Text>Homepage test dev part 2</Text>
      <Link style={styles.button} href="/navigation/screens/loginScreen">Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "coral",
    borderRadius: 8,
    textAlign: "center",
  }
});
