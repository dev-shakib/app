import { Dimensions, StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const WINDOW_WIDTH = Dimensions.get('window').width
  const WINDOW_HEIGHT = Dimensions.get('window').height
  const SCREEN_WIDTH =
    WINDOW_WIDTH < WINDOW_HEIGHT ? WINDOW_WIDTH : WINDOW_HEIGHT
  const itemIconSize = 26
  const itemNavigationIconSize = 23
  const numColumns = 2

  return StyleSheet.create({
    cardContainer: {
      flex: 1,
    },
    cardImageContainer: {
      flex: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardImage: {
      height: 130,
      width: 130,
      borderRadius: 65,
    },
    gridContainer: {
      padding: 15,
      marginTop: 10,
    },
    cardNameContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardName: {
      color: theme.colors[appearance].primaryBackground,
      fontSize: 19,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    profileCardContainer: {
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileItemContainer: {
      marginTop: 6,
    },
    itemContainer: {
      flexDirection: 'row',
      height: 54,
      width: '85%',
      alignSelf: 'center',
      marginBottom: 10,
    },
    itemIconContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemIcon: {
      height: itemIconSize,
      width: itemIconSize,
    },
    itemTitleContainer: {
      flex: 6,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    itemTitle: {
      color: theme.colors[appearance].primaryForeground,
      fontSize: 17,
      paddingLeft: 20,
    },
    itemNavigationIconContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightButton: {
      marginRight: 10,
      color: theme.colors[appearance].primaryForeground,
    },
    itemNavigationIcon: {
      height: itemNavigationIconSize,
      width: itemNavigationIconSize,
      tintColor: theme.colors[appearance].grey6,
    },
    detailContainer: {
      backgroundColor: theme.colors[appearance].grey61,
      padding: 20,
      marginTop: 25,
    },
    profileInfo: {
      padding: 5,
      color: '#333333',
      fontSize: 14,
    },
    myListings: {
      paddingTop: 5,
      paddingBottom: 20,
      fontWeight: '500',
      color: '#333333',
      fontSize: 17,
    },
    profileInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 5,
      width: '100%',
    },
    profileInfoTitleContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    profileInfoTitle: {
      color: '#595959',
      fontSize: 12,
      padding: 5,
    },
    profileInfoValueContainer: {
      flex: 2,
      justifyContent: 'center',
    },
    profileInfoValue: {
      color: '#737373',
      fontSize: 12,
      padding: 5,
    },
    footerButtonContainer: {
      flex: 2,
      justifyContent: 'flex-start',
      marginTop: 8,
    },

    blank: {
      flex: 0.5,
    },
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
