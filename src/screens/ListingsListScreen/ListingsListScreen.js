import React, { useState, useEffect, useRef } from 'react'
import { FlatList, View, BackHandler } from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import { useTheme, useTranslations, ActivityIndicator } from '../../core/dopebase'
import { listingsAPI } from '../../core/listing/api'
import HeaderButton from '../../components/HeaderButton/HeaderButton'
import { Configuration } from '../../Configuration'
import MapView, { Marker } from 'react-native-maps'
import FilterViewModal from '../../components/FilterViewModal/FilterViewModal'
import dynamicStyles from './styles'
import { useSelector } from 'react-redux'
import ListingView from '../../components/ListingView/ListingView'
import { IMAdMobBanner } from '../../core/ads/google'
import { useConfig } from '../../config'

function ListingsListScreen(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const { navigation, route } = props

  const favorites = useSelector(state => state.favorites.favoriteItems)

  const item = route.params.item

  const [category, setCategory] = useState(item)
  const [filter, setFilter] = useState({})
  const [listings, setListings] = useState([])
  const [filteredListing, setFilteredListing] = useState([])
  const [mapMode, setMapMode] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [latitude, setLatitude] = useState(Configuration.map.origin.latitude)
  const [longitude, setLongitude] = useState(Configuration.map.origin.longitude)
  const [latitudeDelta, setLatitudeDelta] = useState(
    Configuration.map.delta.latitude,
  )
  const [longitudeDelta, setLongitudeDelta] = useState(
    Configuration.map.delta.longitude,
  )
  const [shouldUseOwnLocation, setShouldUseOwnLocation] = useState(false) // Set this to true to show the user's location
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', payload =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  )
  const willBlurSubscription = useRef(null)
  const unsubscribe = useRef(null)

  useEffect(() => {
    let currentTheme = theme.colors[appearance]

    navigation.setOptions({
      title:
        typeof route.params == 'undefined' ||
        typeof route.params.item == 'undefined'
          ? localized('Listings')
          : route.params.item.name || route.params.item.title,
      headerTintColor: currentTheme.primaryForeground,
      headerTitleStyle: { color: currentTheme.primaryText },
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <HeaderButton
            customStyle={styles.toggleButton}
            style={{
              tintColor: theme.colors[appearance].primaryForeground,
            }}
            icon={mapMode ? theme.icons.list : theme.icons.map}
            onPress={() => {
              onChangeMode()
            }}
          />
          <HeaderButton
            customStyle={styles.filtersButton}
            style={{
              tintColor: theme.colors[appearance].primaryForeground,
            }}
            icon={theme.icons.filters}
            onPress={() => onSelectFilter()}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  }, [mapMode])

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack()

    return true
  }

  const onChangeLocation = location => {
    setLatitude(location.latitude)
    setLongitude(location.longitude)
  }

  const onSelectFilter = () => {
    setFilterModalVisible(true)
  }

  const onSelectFilterCancel = () => {
    setFilterModalVisible(false)
  }

  useEffect(() => {
    let tempListings = []
    for (let i = 0; i < listings.length; i++) {
      let listing = listings[i]
      let matched = true
      filter &&
        Object.keys(filter).forEach(function (key) {
          if (
            filter[key] != 'Any' &&
            filter[key] != 'All' &&
            listing.filters[key] != filter[key]
          ) {
            matched = false
          }
        })

      listing.matched = matched
    }

    tempListings = listings.filter(listing => listing.matched)

    setFilteredListing(tempListings)
  }, [filter, listings])

  const onSelectFilterDone = newfilter => {
    setFilter(newfilter)
    setFilterModalVisible(false)
  }

  const onChangeMode = () => {
    const newMode = !mapMode
    setMapMode(newMode)
  }

  const onListingsUpdate = listingsData => {
    let max_latitude = -400,
      min_latitude = 400,
      max_longitude = -400,
      min_logitude = 400

    const filter = filter

    for (let i = 0; i < listingsData.length; i++) {
      let matched = true
      filter &&
        Object.keys(filter).forEach(function (key) {
          if (
            filter[key] != 'Any' &&
            filter[key] != 'All' &&
            listing.filters[key] != filter[key]
          ) {
            matched = false
          }
        })

      console.log('matched=' + matched)

      if (!matched) return

      let listing = listingsData[i]
      if (max_latitude < listing.latitude) max_latitude = listing.latitude
      if (min_latitude > listing.latitude) min_latitude = listing.latitude
      if (max_longitude < listing.longitude) max_longitude = listing.longitude
      if (min_logitude > listing.longitude) min_logitude = listing.longitude
    }

    console.log(min_latitude)
    console.log(max_latitude)
    console.log(min_logitude)
    console.log(max_longitude)
    if (!shouldUseOwnLocation || !latitude) {
      const deltaLong = Math.min(
        Math.abs(((max_longitude - min_logitude) / 2) * 3),
        400,
      )
      const deltaLat = Math.min(
        Math.abs(((max_longitude - min_logitude) / 2) * 3),
        400,
      )

      setLongitudeDelta(deltaLong)
      setLatitudeDelta(deltaLat)
      setListings(listingsData)
      setLatitude((max_latitude + min_latitude) / 2)
      setLongitude((max_longitude + min_logitude) / 2)
    } else {
      setListings(listingsData)
    }
  }

  const onListingPress = item => {
    props.navigation.navigate('SingleListingScreen', {
      item: item,
      customLeft: true,
      routeName: 'ListingsList',
    })
  }
  useEffect(() => {
    unsubscribe.current = listingsAPI.subscribeListings(
      { categoryId: category.id },
      favorites,
      config.serverConfig.collections.listings,
      onListingsUpdate,
    )

    if (shouldUseOwnLocation) {
      Geolocation.getCurrentPosition(
        position => {
          onChangeLocation(position.coords)
        },
        error => console.log(error.message),
      )
    }

    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      payload =>
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

  const onPress = item => {
    props.navigation.navigate('SingleListingScreen', {
      item: item,
      customLeft: true,
      headerLeft: () => <View />,
      routeName: 'Map',
    })
  }

  const markerArr = () => {
    return listings.map(listing => (
      <Marker
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
  }

  const renderListing = ({ item, index }) => {
    return (
      <>
        <ListingView listing={item} onPress={() => onListingPress(item)} />
        {config.adMobConfig && (index + 1) % 3 == 0 && (
          <IMAdMobBanner
            onAdFailedToLoad={error => console.log(error)}
            onAdLoaded={() => console.log('Ad loaded successfully')}
          />
        )}
      </>
    )
  }

  return (
    <View style={styles.container}>
      {!listings && <ActivityIndicator />}
      {mapMode && listings && (
        <MapView
          style={styles.mapView}
          showsUserLocation={shouldUseOwnLocation}
          region={{
            latitude: latitude,
            longitude: longitude,
          }}>
          {markerArr()}
        </MapView>
      )}
      {!mapMode && listings && (
        <FlatList
          data={filteredListing}
          renderItem={renderListing}
          keyExtractor={item => `${item.id}`}
          initialNumToRender={5}
          refreshing={false}
        />
      )}
      {filterModalVisible && (
        <FilterViewModal
          value={filter}
          onCancel={onSelectFilterCancel}
          onDone={onSelectFilterDone}
          category={category}
        />
      )}
    </View>
  )
}

export default ListingsListScreen
