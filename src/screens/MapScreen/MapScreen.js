import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { BackHandler } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useSelector } from 'react-redux'
import Geolocation from '@react-native-community/geolocation'
import { useTheme, useTranslations } from '../../core/dopebase'
import { listingsAPI } from '../../core/listing/api'
import { Configuration } from '../../Configuration'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

function MapScreen(props) {
  const { navigation, route } = props
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()

  const favorites = useSelector(state => state.favorites.favoriteItems)

  useLayoutEffect(() => {
    let currentTheme = theme.colors[appearance]

    navigation.setOptions({
      title: localized('Map View'),
      headerTintColor: currentTheme.primaryForeground,
      headerTitleStyle: { color: currentTheme.primaryText },
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  }, [])

  const item = route?.params?.item

  const [data, setData] = useState([])
  const [latitude, setLatitude] = useState(Configuration.map.origin.latitude)
  const [longitude, setLongitude] = useState(Configuration.map.origin.longitude)
  const [latitudeDelta, setLatitudeDelta] = useState(
    Configuration.map.delta.latitude,
  )
  const [longitudeDelta, setLongitudeDelta] = useState(
    Configuration.map.delta.longitude,
  )

  // Set this to false if you don't want the current user's location to be considered
  const [shouldUseOwnLocation, setShouldUseOwnLocation] = useState(true)

  const unsubscribe = useRef(null)
  const willBlurSubscription = useRef(null)
  const didFocusSubscription = useRef(
    navigation.addListener('focus', payload =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  )

  useEffect(() => {
    if (item) {
      unsubscribe.current = listingsAPI.subscribeListings(
        { categoryId: item.id },
        config.serverConfig.collections.listings,
        onListingsUpdate,
      )
    } else {
      unsubscribe.current = listingsAPI.subscribeListings(
        {},
        favorites,
        config.serverConfig.collections.listings,
        onListingsUpdate,
      )
    }

    if (shouldUseOwnLocation) {
      Geolocation.getCurrentPosition(
        position => {
          onChangeLocation(position.coords)
        },
        error => console.log(error.message),
      )
    }

    willBlurSubscription.current = navigation.addListener('blur', payload =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    )
    return () => {
      unsubscribe?.current && unsubscribe?.current()
      didFocusSubscription.current && didFocusSubscription.current()
      willBlurSubscription.current && willBlurSubscription.current()
    }
  }, [])

  const onChangeLocation = location => {
    setLongitude(location.longitude)
    setLatitude(location.latitude)
  }

  const onBackButtonPressAndroid = () => {
    navigation.goBack()

    return true
  }

  const onListingsUpdate = listingsData => {
    let max_latitude = -400,
      min_latitude = 400,
      max_longitude = -400,
      min_logitude = 400

    for (let i = 0; i < listingsData.length; i++) {
      const listing = listingsData[i]
      if (max_latitude < listing.latitude) max_latitude = listing.latitude
      if (min_latitude > listing.latitude) min_latitude = listing.latitude
      if (max_longitude < listing.longitude) max_longitude = listing.longitude
      if (min_logitude > listing.longitude) min_logitude = listing.longitude
    }

    setData(listingsData)

    if (!shouldUseOwnLocation || !latitude) {
      setLongitude((max_longitude + min_logitude) / 2)
      setLatitude((max_latitude + min_latitude) / 2)
      setLatitudeDelta(
        Math.abs((max_latitude - (max_latitude + min_latitude) / 2) * 3),
      )
      setLongitudeDelta(
        Math.abs((max_longitude - (max_longitude + min_logitude) / 2) * 3),
      )
    }
  }

  const onPress = item => {
    props.navigation.navigate('SingleListingScreen', {
      item: item,
      customLeft: true,
      headerLeft: () => <View />,
      routeName: 'Map',
    })
  }

  const markerArr = data.map((listing, index) => (
    <Marker
      key={index}
      title={listing.title}
      description={listing.description}
      onCalloutPress={() => {
        onPress(listing)
      }}
      coordinate={{
        latitude: listing.latitude,
        longitude: listing.longitude,
      }}
    />
  ))

  return (
    <MapView
      style={styles.mapView}
      showsUserLocation={true}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      }}>
      {markerArr}
    </MapView>
  )
}

export default MapScreen
