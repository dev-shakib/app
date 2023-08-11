import React from 'react'
import { TouchableOpacity, Image, Text } from 'react-native'
import styles from './styles'

export default function FooterButton(props) {
  const { title, onPress, disabled, footerTitleStyle, iconSource, iconStyle } =
    props

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.footerContainer]}>
      {iconSource && <Image style={iconStyle} source={iconSource} />}
      <Text style={[styles.footerTitle, footerTitleStyle]}> {title}</Text>
    </TouchableOpacity>
  )
}
