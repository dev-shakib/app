import React from 'react'
import { Animated, Image } from 'react-native'

export default function FacePileCircleItem(props) {
  const { imageStyle, circleSize, face, offset, dynamicStyle } = props
  const innerCircleSize = circleSize * 2
  const marginRight = circleSize * offset

  return (
    <Animated.View style={{ marginRight: -marginRight }}>
      <Image
        style={[
          dynamicStyle.facePileCircleImage,
          {
            width: innerCircleSize,
            height: innerCircleSize,
            borderRadius: circleSize,
          },
          imageStyle,
        ]}
        source={{ uri: face.profilePictureURL }}
      />
    </Animated.View>
  )
}
