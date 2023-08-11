import { Dimensions, StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const WINDOW_WIDTH = Dimensions.get('window').width
  const WINDOW_HEIGHT = Dimensions.get('window').height
  const SCREEN_WIDTH =
    WINDOW_WIDTH < WINDOW_HEIGHT ? WINDOW_WIDTH : WINDOW_HEIGHT

  const numColumns = 2

  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      flex: 1,
      padding: 15,
    },
    title: {
      fontWeight: 'bold',
      color: theme.colors[appearance].primaryText,
      fontSize: 20,
      marginBottom: 15,
    },
    listingTitle: {
      marginTop: 10,
      marginBottom: 10,
    },
    categories: {
      marginBottom: 7,
    },
    categoryItemContainer: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      paddingBottom: 10,
    },
    categoryItemPhoto: {
      height: 60,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      width: 110,
    },
    categoryItemTitle: {
      fontWeight: 'bold',
      color: appearance === 'dark' ? '#e9e9e9' : '#161616',
      margin: 10,
    },
    userPhoto: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginLeft: 10,
    },
    mapButton: {
      marginRight: 13,
      marginLeft: 7,
    },
    composeButton: {},
    starStyle: {
      tintColor: theme.colors[appearance].primaryForeground,
    },
    starRatingContainer: {
      width: 90,
      marginTop: 10,
    },
    listings: {
      marginTop: 15,
      width: '100%',
      flex: 1,
    },
    showAllButtonContainer: {
      borderWidth: 1,
      borderRadius: 5,
      height: 50,
      width: '100%',
      marginBottom: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.colors[appearance].primaryForeground,
    },
    showAllButtonText: {
      textAlign: 'center',
      color: theme.colors[appearance].primaryBackground,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 14,
      fontWeight: 'bold',
    },
    listingItemContainer: {
      justifyContent: 'center',
      marginBottom: 30,
      marginRight: 15,
      width: (SCREEN_WIDTH - 15 * 3) / numColumns,
    },
    photo: {
      // position: "absolute",
    },
    listingPhoto: {
      width: (SCREEN_WIDTH - 15 * 3) / numColumns,
      height: 130,
    },
    savedIcon: {
      position: 'absolute',
      top: 5,
      left: (SCREEN_WIDTH - 15 * 3) / numColumns - 15 - 25,
      width: 25,
      height: 25,
    },
    listingName: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.colors[appearance].grey9,
      marginTop: 5,
    },
    listingPlace: {
      color: theme.colors[appearance].secondaryText,
      marginTop: 5,
    },
  })
}
export default dynamicStyles
