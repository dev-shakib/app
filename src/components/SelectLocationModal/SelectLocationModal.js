import React, { useState } from 'react'
import { Modal, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useTheme, useTranslations, Button } from '../../core/dopebase'
import { Configuration } from '../../Configuration'
import dynamicStyles from './styles'

function SelectLocationModal(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { location } = props

  const [latitude, setLatitude] = useState(location?.latitude)
  const [longitude, setLongitude] = useState(location?.longitude)
  const [latitudeDelta, setLatitudeDelta] = useState(
    Configuration.map.delta.latitude,
  )
  const [longitudeDelta, setLongitudeDelta] = useState(
    Configuration.map.delta.longitude,
  )

  const onDone = () => {
    const { onDone } = props
    onDone &&
      onDone({
        latitude: latitude,
        longitude: longitude,
      })
  }

  const onCancel = () => {
    const { onCancel } = props
    onCancel && onCancel()
  }

  const onPress = event => {
    setLatitude(event.nativeEvent.coordinate.latitude)
    setLongitude(event.nativeEvent.coordinate.longitude)
  }

  const onRegionChange = region => {
    setLatitude(region.latitude)
    setLongitude(region.longitude)
    setLatitudeDelta(region.latitudeDelta)
    setLongitudeDelta(region.longitudeDelta)
  }

  return (
    <Modal animationType="slide" transparent={false} onRequestClose={onCancel}>
      <View style={styles.body}>
        <MapView
          ref={map => (map = map)}
          onPress={onPress}
          style={styles.mapView}
          onRegionChangeComplete={onRegionChange}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}>
          <Marker
            draggable
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            onDragEnd={onPress}
          />
        </MapView>
        <View style={[styles.bar, styles.topbar]}>
          <Button
            containerStyle={styles.rightButton}
            textStyle={styles.rightButtonText}
            onPress={onDone}
            text={localized('Done')}
          />
        </View>
      </View>
    </Modal>
  )
}

export default SelectLocationModal
