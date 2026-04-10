import { StyleSheet } from "react-native";

const msgStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  chatContent: {
    flex: 1,
  },

  name: {
    fontWeight: "600",
    fontSize: 19,
  },

  listing: {
    fontSize: 15,
    color: "#666",
  },

  message: {
    fontSize: 17,
    color: "#444",
  },

  rightSection: {
    alignItems: "flex-end",
    gap: 4,
  },

  time: {
    fontSize: 14,
    color: "#888",
  },

  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 11,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
  },

  separator: {
    height: 10,
    backgroundColor: "#eee",
  },
});

export default msgStyles;
