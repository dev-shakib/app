import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { Image } from 'expo-image'
import { useDispatch, useSelector } from 'react-redux'
import StarRating from 'react-native-star-rating'
import { useTheme, useTranslations } from '../../core/dopebase'
import SavedButton from '../SavedButton/SavedButton'
import { listingsAPI } from '../../core/listing/api'
import { getUserByID } from '../../core/users'
import ProfileImageCard from '../ProfileImageCard/ProfileImageCard'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

function ListingProfileModal(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const userID = props.route.params.userID

  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  const favorites = useSelector(state => state.favorites.favoriteItems)
  const currentUser = useSelector(state => state.auth.user)

  const dispatch = useDispatch()

  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', payload =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  )
  const listingsUnsubscribe = useRef(null)
  const unsubscribe = useRef(null)
  const reviewsUnsubscribe = useRef(null)
  const willBlurSubscription = useRef(null)

  useLayoutEffect(() => {
    const currentTheme = theme.colors[appearance]
    props.navigation.setOptions({
      title: localized('Profile'),
      headerTintColor: currentTheme.primaryForeground,
      headerTitleStyle: { color: currentTheme.primaryText },
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  }, [])

  const onGetUserError = async () => {
    await setLoading(false)
    alert(
      '0ops! an error occured  while loading profile. This user profile may be incomplete.',
    )
    props.navigation.goBack()
  }

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack()

    return true
  }

  const onListingsUpdate = listingsData => {
    setListings(listingsData)
  }

  const onPressListingItem = item => {
    props.navigation.navigate('ListingProfileModalDetailsScreen', {
      item,
    })

    return
  }

  const onPressSavedIcon = item => {
    listingsAPI.saveUnsaveListing(item, currentUser?.id, favorites, dispatch)
  }

  const renderListingItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => onPressListingItem(item)}>
        <View style={styles.listingItemContainer}>
          <Image style={styles.listingPhoto} source={{ uri: item.photo }} />
          <SavedButton
            style={styles.savedIcon}
            onPress={() => onPressSavedIcon(item)}
            item={item}
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

  useEffect(() => {
    ;(async () => {
      const user = await getUserByID(userID)
      if (user) {
        setUser(user)
        setLoading(false)
      } else {
        onGetUserError()
      }
    })()

    listingsUnsubscribe.current = listingsAPI.subscribeListings(
      { userId: userID },
      favorites,
      config.serverConfig.collections.listings,
      onListingsUpdate,
    )
    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    )
    return () => {
      listingsUnsubscribe?.current && listingsUnsubscribe?.current()
      unsubscribe?.current && unsubscribe?.current()
      reviewsUnsubscribe?.current && reviewsUnsubscribe?.current()
      didFocusSubscription.current && didFocusSubscription.current()
      willBlurSubscription.current && willBlurSubscription.current()
    }
  }, [])

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color={theme.colors[appearance].primaryForeground}
      />
    )
  }

  if (!loading && !user) {
    return null
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.profileCardContainer}>
          <ProfileImageCard disabled={true} user={user} />
        </View>
        <View style={styles.profileItemContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.profileInfo}>{'Profile Info'}</Text>
            <View style={styles.profileInfoContainer}>
              <View style={styles.profileInfoTitleContainer}>
                <Text style={styles.profileInfoTitle}>{'Phone Number :'}</Text>
              </View>
              <View style={styles.profileInfoValueContainer}>
                <Text style={styles.profileInfoValue}>
                  {user.phoneNumber ? user.phoneNumber : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.gridContainer}>
            <Text style={styles.myListings}>{'Listings'}</Text>
            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={listings}
              renderItem={item => renderListingItem(item)}
              keyExtractor={item => `${item.id}`}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

ListingProfileModal.propTypes = {
  user: PropTypes.object,
  onModal: PropTypes.func,
  isProfileModalVisible: PropTypes.bool,
  presentationStyle: PropTypes.string,
}

export default ListingProfileModal
