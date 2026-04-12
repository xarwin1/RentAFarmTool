import React from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createSettingItemStyles from "@/styles/settingItems.styles";
import { useTheme } from "@/theme/ThemeContext";

type Props = {
  icon: string;
  label: string;
  onPress?: () => void;
  rightText?: string;
  showArrow?: boolean;
  type?: "default" | "toggle";
  value?: boolean;
  onValueChange?: (val: boolean) => void;
};

export default function SettingItem({
  icon,
  label,
  onPress,
  rightText,
  showArrow = true,
  type = "default",
  value = false,
  onValueChange,
}: Props) {
  const { theme } = useTheme();
  const styles = createSettingItemStyles(theme);
  const isToggle = type === "toggle";

  return (
    <Pressable
      onPress={!isToggle ? onPress : undefined}
      style={styles.container}
    >
      {/* LEFT */}
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={20} color={theme.subtext} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      {/* RIGHT */}
      <View style={styles.right}>
        {isToggle ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={value ? "#fff" : theme.card}
          />
        ) : (
          <>
            {rightText && <Text style={styles.rightText}>{rightText}</Text>}
            {showArrow && (
              <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
            )}
          </>
        )}
      </View>
    </Pressable>
  );
}
