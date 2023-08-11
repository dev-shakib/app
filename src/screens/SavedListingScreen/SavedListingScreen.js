import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
} from 'react-native'
import StarRating from 'react-native-star-rating'
import { Image } from 'expo-image'
import { listingsAPI } from '../../core/listing/api'
import { useDispatch, useSelector } from 'react-redux'
import {
  useTheme,
  useTranslations,
  ActivityIndicator,
  EmptyStateView,
} from '../../core/dopebase'
import SavedButton from '../../components/SavedButton/SavedButton'
import dynamicStyles from './styles'
import { setFavoriteItems } from '../../core/favorites/redux'
import { useConfig } from '../../config'

function SavedListingScreen(props) {
  const { navigation } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()

  const dispatch = useDispatch()
  const favorites = useSelector(state => state.favorites.favoriteItems)
  const currentUser = useSelector(state => state.auth.user)

  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(false)

  const didFocusSubscription = useRef(
    navigation.addListener('focus', payload =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  )
  const listingsUnsubscribe = useRef(null)
  const willBlurSubscription = useRef(null)
  const savedListingsUnsubscribe = useRef(null)

  useLayoutEffect(() => {
    let currentTheme = theme.colors[appearance]

    navigation.setOptions({
      title: localized('Saved Listings'),
      headerTintColor: currentTheme.primaryForeground,
      headerTitleStyle: { color: currentTheme.primaryText },
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  }, [])

  useLayoutEffect(() => {
    if (!favorites) {
      return
    }
    if (listingsUnsubscribe?.current) {
      listingsUnsubscribe?.current()
    }
    listingsUnsubscribe.current = listingsAPI.subscribeListings(
      {},
      favorites,
      config.serverConfig.collections.listings,
      onListingsUpdate,
    )
  }, [currentUser?.id])

  useEffect(() => {
    savedListingsUnsubscribe.current = listingsAPI.subscribeSavedListings(
      currentUser?.id,
      onSavedListingsUpdate,
      null,
      config.serverConfig.collections.savedListings,
    )

    willBlurSubscription.current = navigation.addListener('blur', payload =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    )

    return () => {
      listingsUnsubscribe?.current && listingsUnsubscribe.current()
      savedListingsUnsubscribe?.current && savedListingsUnsubscribe.current()
      didFocusSubscription.current && didFocusSubscription.current()
      willBlurSubscription.current && willBlurSubscription.current()
    }
  }, [])

  const onBackButtonPressAndroid = () => {
    navigation.goBack()

    return true
  }

  const onSavedListingsUpdate = savedListingdata => {
    dispatch(setFavoriteItems(savedListingdata))
    setLoading(false)
  }

  const onListingsUpdate = listingsData => {
    setListings(listingsData)
    setLoading(false)
  }

  const onPressListingItem = item => {
    navigation.navigate('MyListingDetailModal', { item })
  }

  const onPressSavedIcon = item => {
    listingsAPI.saveUnsaveListing(
      item,
      currentUser?.id,
      favorites,
      config.serverConfig.collections.savedListings,
      dispatch,
    )
  }

  const renderListingItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => onPressListingItem(item)}>
        <View style={styles.listingItemContainer}>
          <Image style={styles.listingPhoto} source={{ uri: item.photo }} />
          <SavedButton
            style={styles.savedIcon}
            onPress={() => onPressSavedIcon(item)}
            isSaved={favorites && favorites[item.id] === true}
          />
          <Text numberOfLines={1} style={styles.listingName}>
            {item.title}
          </Text>
          <Text style={styles.listingPlace}>{item.place}</Text>
          <StarRating
            containerStyle={styles.starRatingContainer}
            maxStars={5}
            starSize={15}
            disabled={true}
            starStyle={styles.starStyle}
            emptyStar={theme.icons.starNoFilled}
            fullStar={theme.icons.starFilled}
            halfStarColor={theme.colors[appearance].primaryForeground}
            rating={item.starCount}
          />
        </View>
      </TouchableOpacity>
    )
  }

  const onEmptyStatePress = () => {
    props.navigation.navigate('Home')
  }

  const emptyStateConfig = {
    title: localized('No Listings'),
    description: localized(
      'You did not save any listings yet. Tap the heart icon to favorite a listing and they will show up here.',
    ),
    callToAction: localized('Save Listings'),
    onPress: onEmptyStatePress,
  }

  return (
    <View style={styles.container}>
      {(!favorites || !listings) && <ActivityIndicator />}
      {favorites && listings && (
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={item => `${item.id}`}
        />
      )}
      {listings && listings.length == 0 && (
        <View style={styles.emptyViewContainer}>
          <EmptyStateView emptyStateConfig={emptyStateConfig} />
        </View>
      )}
    </View>
  )
}

export default SavedListingScreen
