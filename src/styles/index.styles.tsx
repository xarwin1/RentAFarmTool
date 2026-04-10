import { StyleSheet } from 'react-native';

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
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    padding: 8,
    height: 1,
    marginBottom: 5,
    alignItems: 'center',
  },
  main: {
    flex: 12,
    // backgroundColor: "white",
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
  },

  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  notification: {
    width: 40,
    height: 40,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    color: '#4caf50',
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,

    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4caf50',
    color: '#ffffff',

    paddingHorizontal: 2,

    fontSize: 9,
    lineHeight: 14,

    textAlign: "center",
  }, headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  appTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
  },

});



export default styles;
