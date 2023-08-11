import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
      paddingLeft: 10,
      paddingRight: 10,
    },
    container: {
      justifyContent: 'center',
      height: 65,
      alignItems: 'center',
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#e6e6e6',
    },
    title: {
      flex: 2,
      textAlign: 'left',
      alignItems: 'center',
      color: theme.colors[appearance].primaryText,
      fontSize: 17,
    },
    value: {
      textAlign: 'right',
      color: theme.colors[appearance].secondaryText,
    },

    bar: {
      height: 60,
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
    },
    optionTextStyle: {
      color: theme.colors[appearance].secondaryText,
      fontSize: 16,
    },
    selectedItemTextStyle: {
      fontSize: 18,
      color: '#3293fe',
      fontWeight: 'bold',
    },
    optionContainerStyle: {
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    cancelContainerStyle: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      borderRadius: 10,
    },
    sectionTextStyle: {
      fontSize: 21,
      color: theme.colors[appearance].primaryText,
      fontWeight: 'bold',
    },
    cancelTextStyle: {
      fontSize: 21,
      color: theme.colors[appearance].primaryForeground,
    },
  })
}
export default dynamicStyles
