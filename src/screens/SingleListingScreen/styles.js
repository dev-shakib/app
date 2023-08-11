import { StyleSheet, Dimensions } from 'react-native'

const width = Dimensions.get('window').width

const PRODUCT_ITEM_HEIGHT = 100
const PRODUCT_ITEM_OFFSET = 5

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    headerIconContainer: {
      marginRight: 10,
      height: '100%',
      width: 30,
    },
    headerIcon: {
      tintColor: theme.colors[appearance].primaryForeground,
      height: 24,
      width: 24,
    },
    container: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      flex: 1,
    },
    title: {
      fontWeight: 'bold',
      color: theme.colors[appearance].primaryText,
      fontSize: 25,
      padding: 10,
    },
    reviewTitle: {
      paddingTop: 0,
    },
    description: {
      padding: 10,
      color: theme.colors[appearance].secondaryText,
    },
    photoItem: {
      backgroundColor: theme.colors[appearance].grey6,
      height: 250,
      width: '100%',
    },
    paginationContainer: {
      flex: 1,
      position: 'absolute',
      alignSelf: 'center',
      paddingVertical: 8,
      marginTop: 220,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 0,
    },
    mapView: {
      width: '100%',
      height: 200,
    },
    loadingMap: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    extra: {
      padding: 30,
      paddingTop: 10,
      paddingBottom: 0,
      marginBottom: 30,
    },
    extraRow: {
      flexDirection: 'row',
      paddingBottom: 10,
    },
    extraKey: {
      flex: 2,
      color: theme.colors[appearance].primaryText,
      fontWeight: 'bold',
    },
    extraValue: {
      flex: 1,
      color: '#bcbfc7',
    },
    reviewItem: {
      padding: 10,
      paddingHorizontal: 15,
      width: width,
    },
    info: {
      flexDirection: 'row',
    },
    userPhoto: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    detail: {
      paddingLeft: 10,
      flex: 1,
    },
    username: {
      color: theme.colors[appearance].primaryText,
      fontWeight: 'bold',
    },
    reviewTime: {
      color: '#bcbfc7',
      fontSize: 12,
    },
    starRatingContainer: {
      padding: 10,
    },
    starStyle: {
      tintColor: theme.colors[appearance].primaryForeground,
    },
    reviewContent: {
      color: theme.colors[appearance].primaryText,
      marginTop: 10,
    },
  })
}
export default dynamicStyles
