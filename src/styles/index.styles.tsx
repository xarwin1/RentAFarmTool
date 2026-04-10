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
  },
  main: {
    flex: 12,
    // backgroundColor: "white",
    padding: 15,
    paddingTop: 0,
  },

  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignSelf: 'flex-start',
  },
  notification: {
    alignItems: 'flex-end',
  },
  notificationIcon: {
    position: 'relative',
    top: -4,
    right: -4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#3a8e22',
    color: '#ffffff',
  },
  headingText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  listings: {
    backgroundColor: '#3a8e22',
    borderRadius: 10,
    height: 'auto',
    width: 'auto',
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  listingImg: {
    width: '40%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,

  },
  listingDescription: {
    flex: 1,
    margin: 5,
    //backgroundColor: 'white',
  },
  listingHeading: {
    color: "white",
    fontSize: 36,
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  listingDescText: {
    padding: 5,
  },
});



export default styles;
