import { StyleSheet } from 'react-native'

const styles = (theme, appearance) =>
  StyleSheet.create({
    body: {
      width: '100%',
      height: '100%',
    },
    topbar: {
      position: 'absolute',
      backgroundColor: 'transparent',
      width: '100%',
    },
    mapView: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors[appearance].grey6,
    },

    bar: {
      height: 50,
      marginTop: Platform.OS === 'ios' ? 30 : 0,
      justifyContent: 'center',
    },
    rightButton: {
      paddingRight: 10,
      top: 0,
      right: 0,
      backgroundColor: 'transparent',
      alignSelf: 'flex-end',
      color: theme.colors[appearance].primaryForeground,
      fontWeight: 'normal',
    },
    rightButtonText: {
      color: theme.colors[appearance].primaryForeground,
      fontWeight: 'normal',
    },
  })

export default styles
