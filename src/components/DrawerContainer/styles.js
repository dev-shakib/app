import { StyleSheet } from 'react-native'

const styles = (theme, appearance) =>
  StyleSheet.create({
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    container: {
      flex: 1,
      alignItems: 'flex-start',
      paddingHorizontal: 20,
    },
  })

export default styles
