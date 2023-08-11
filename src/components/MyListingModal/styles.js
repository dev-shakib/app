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
    rightButton: {
      marginRight: 10,
      color: theme.colors[appearance].primaryForeground,
    },
    starRatingContainer: {
      width: 90,
      marginTop: 10,
    },
    starStyle: {
      tintColor: theme.colors[appearance].primaryForeground,
    },
    emptyViewContainer: {
      marginTop: '35%',
      flex: 1,
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
      color: theme.colors[appearance].primaryForeground,
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
