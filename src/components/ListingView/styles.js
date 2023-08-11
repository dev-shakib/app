import { StyleSheet } from 'react-native'

const styles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]
  return new StyleSheet.create({
    title: {
      fontSize: 16,
      width: 300,
      color: colorSet.secondaryText,
      fontWeight: 'bold',
    },
    leftSubtitle: {
      flex: 2,
    },
    time: {
      color: colorSet.secondaryText,
      flex: 1,
    },
    titleContainer: { width: 200, height: 80 },
    place: {
      fontWeight: 'bold',
      color: appearance === 'dark' ? '#565656' : '#a9a9a9',
      marginBottom: 7,
    },
    price: {
      flex: 1,
      fontSize: 14,
      color: colorSet.secondaryText,
      marginBottom: 7,
      alignSelf: 'flex-end',
      textAlign: 'right',
    },
    avatarStyle: {
      height: 80,
      width: 80,
      marginRight: 10,
    },
    container: {
      backgroundColor: colorSet.primaryBackground,
      flex: 1,
      flexDirection: 'row',
      margin: 10,
      height: 80,
    },
  })
}

export default styles
