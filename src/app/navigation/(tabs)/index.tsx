import { View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { Text } from 'react-native-paper';
export default function Index() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Test</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "coral",
    borderRadius: 8,
    textAlign: "center",
  },
  header: {
    fontSize: 48
  },
});
