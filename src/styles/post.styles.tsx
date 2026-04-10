import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    padding: 15,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  label: {
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
  },

  imageBox: {
    width: 80,
    height: 80,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  smallText: {
    fontSize: 10,
    color: "#666",
  },

  selectBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 5,
  },

  selectText: {
    color: "#444",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  option: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },

  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  currency: {
    fontSize: 16,
    marginRight: 5,
  },

  priceInput: {
    flex: 1,
    padding: 12,
  },

  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
  },

  postBtn: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  postText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default styles;
