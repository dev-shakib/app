import React from 'react'
import { View } from 'react-native'
import { useTheme } from '../../core/dopebase'
import MenuButton from '../MenuButton/MenuButton'
import dynamicStyles from './styles'

function DrawerContainer(props) {
  const { navigation } = props

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="LOG OUT"
          source={theme.icons.logout}
          onPress={() => {
            navigation.dispatch({ type: 'Logout' })
          }}
        />
      </View>
    </View>
  )
}

export default DrawerContainer
