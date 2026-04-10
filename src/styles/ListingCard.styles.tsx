import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3, // Android shadow
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 160,
  },

  favorite: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
  },

  priceTag: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  priceText: {
    color: "#fff",
    fontWeight: "bold",
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  meta: {
    fontSize: 12,
    color: "#777",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styles;
