import React from 'react'
import { TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { useTheme } from '../../core/dopebase'

export default function HeaderButton(props) {
  const { theme, appearance } = useTheme()
  const style = {
    tintColor: theme.colors[appearance].primaryForeground,
    width: 25,
    height: 25,
  }

  return (
    <TouchableOpacity
      style={props.customStyle}
      onPress={props.onPress}
      disabled={props.disabled}>
      {props.loading ? (
        <ActivityIndicator
          style={{ padding: 6 }}
          size={5}
          color={theme.colors[appearance].primaryForeground}
        />
      ) : (
        <Image style={[style, props.iconStyle]} source={props.icon} />
      )}
    </TouchableOpacity>
  )
}
