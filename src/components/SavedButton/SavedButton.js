import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { useTheme } from '../../core/dopebase'

export default function SavedButton(props) {
  const { theme, appearance } = useTheme()
  const { style, isSaved } = props

  return (
    <TouchableOpacity style={style} onPress={props.onPress}>
      <Image
        style={{
          width: 25,
          height: 25,
          tintColor: isSaved
            ? theme.colors[appearance].primaryForeground
            : theme.colors[appearance].primaryBackground,
        }}
        source={theme.icons.heartFilled}
      />
    </TouchableOpacity>
  )
}
