import { Platform } from 'react-native'
import { Dimensions, StyleSheet } from 'react-native'
const deviceWidth = Dimensions.get('window').width

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      flex: 1,
    },
    searchContainer: {
      width: Platform.OS === 'ios' ? deviceWidth : deviceWidth - 30,
      marginVertical: 4,
    },
    searchInput: {
      fontSize: 16,
      alignItems: 'center',
      color: theme.colors[appearance].primaryText,
      marginLeft: 10,
    },
  })
}
export default dynamicStyles
