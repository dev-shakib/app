import { StyleSheet } from 'react-native'

const PRODUCT_ITEM_HEIGHT = 100
const PRODUCT_ITEM_OFFSET = 5

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    flatContainer: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      paddingLeft: 10,
      paddingRight: 10,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
      alignItems: 'stretch',
      justifyContent: 'center',
      margin: PRODUCT_ITEM_OFFSET,
      height: PRODUCT_ITEM_HEIGHT,
    },
    title: {
      color: 'white',
      fontSize: 17,
      textAlign: 'center',
    },
    photo: {
      height: PRODUCT_ITEM_HEIGHT,
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    emptyStateView: {
      marginTop: '60%',
    },
  })
}
export default dynamicStyles
