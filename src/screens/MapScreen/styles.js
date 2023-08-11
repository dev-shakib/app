import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    mapView: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors[appearance].grey3,
    },
  })
}

export default dynamicStyles
