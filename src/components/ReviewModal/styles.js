import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    bodyContainer: {
      alignSelf: 'center',
      width: '95%',
      height: '86%',
      paddingBottom: 16,
    },
    input: {
      flex: 1,
      width: '100%',
      fontSize: 19,
      textAlignVertical: 'top',
      lineHeight: 26,
      color: theme.colors[appearance].primaryText,
      paddingBottom: 10,
    },
    starRatingContainer: {
      width: 90,
      marginVertical: 12,
    },
    starStyle: {
      tintColor: theme.colors[appearance].primaryForeground,
    },
    btnContainer: {
      width: '100%',
      height: 60,
      justifyContent: 'center',
      backgroundColor: theme.colors[appearance].primaryForeground,
      borderRadius: 4,
    },
    btnText: {
      color: theme.colors[appearance].primaryBackground,
      fontSize: 16,
    },
    bar: {
      height: 50,
      marginTop: Platform.OS === 'ios' ? 30 : 0,
      justifyContent: 'center',
    },
    titleBar: {
      position: 'absolute',
      textAlign: 'center',
      width: '100%',
      fontWeight: 'bold',
      fontSize: 20,
      color: theme.colors[appearance].primaryText,
    },
    rightButton: {
      top: 0,
      right: 0,
      backgroundColor: 'transparent',
      alignSelf: 'flex-end',
    },
    rightButtonText: {
      color: theme.colors[appearance].primaryForeground,
      fontWeight: 'normal',
    },
  })
}
export default dynamicStyles
