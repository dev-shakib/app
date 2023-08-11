import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      flex: 1,
    },
    mapView: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors[appearance].grey6,
    },
    filtersButton: {
      marginRight: 10,
    },
    toggleButton: {
      marginRight: 7,
    },
  })
}
export default dynamicStyles
