import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";

const tabs = [
  { name: "home", label: "Home", icon: "home" },
  { name: "messages", label: "Messages", icon: "mail" },
  { name: "post", label: "Post", icon: "add", isFab: true },
  { name: "rentals", label: "Rentals", icon: "receipt" },
  { name: "profile", label: "Profile", icon: "person-circle-outline" },
];

export default function NavBar({ state, descriptors, navigation }) {
  const { theme, darkMode } = useTheme();
  const styles = createStyles(theme, darkMode);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[index].key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(state.routes[index].name);
            }
          };

          if (tab.isFab) {
            return (
              <View key={tab.name} style={styles.fabWrapper}>
                <Pressable style={styles.fab} onPress={onPress}>
                  <Ionicons name="add" size={30} color="#fff" />
                </Pressable>
              </View>
            );
          }

          return (
            <Pressable
              key={tab.name}
              style={styles.tab}
              onPress={onPress}
            >
              <Ionicons
                name={tab.icon as any}
                size={22}
                color={isFocused ? "#fff" : darkMode ? "rgba(255,255,255,0.4)" : theme.border}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (theme: any, darkMode: boolean) =>
  StyleSheet.create({
    wrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    container: {
      flexDirection: "row",
      backgroundColor: theme.primary,
      height: 64,
      alignItems: "center",
      justifyContent: "space-around",
      paddingHorizontal: 8,
      paddingBottom: 8,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
    },
    label: {
      fontSize: 10,
      color: darkMode ? "rgba(255,255,255,0.4)" : theme.border,
    },
    labelActive: {
      color: "#fff",
    },
    fabWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: -28,
    },
    fab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 4,
      borderColor: theme.background,
    },
  });
