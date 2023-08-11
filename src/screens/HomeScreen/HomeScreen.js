import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native'
import StarRating from 'react-native-star-rating'
import { Image } from 'expo-image'
import * as Location from 'expo-location'
import {
  useActionSheet,
  useTheme,
  useTranslations,
  ActivityIndicator,
  Button,
} from '../../core/dopebase'
import { listingsAPI } from '../../core/listing/api'
import { useSelector, useDispatch } from 'react-redux'
import HeaderButton from '../../components/HeaderButton/HeaderButton'
import PostModal from '../../components/PostModal/PostModal'
import SavedButton from '../../components/SavedButton/SavedButton'
import { setFavoriteItems } from '../../core/favorites/redux'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

function HomeScreen(props) {
  const { navigation } = props
  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.auth.user)
  const favorites = useSelector(state => state.favorites.favoriteItems)

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const [categories, setCategories] = useState([])
  const [listings, setListings] = useState(null)
  const [allListings, setAllListings] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showedAll, setShowedAll] = useState(false)
  const [postModalVisible, setPostModalVisible] = useState(false)

  const { showActionSheetWithOptions } = useActionSheet()

  const categoriesUnsubscribe = useRef(null)
  const savedListingsUnsubscribe = useRef(null)
  const listingsUnsubscribe = useRef(null)
  const willBlurSubscription = useRef(null)
  const didFocusSubscription = useRef(
    navigation.addListener('focus', payload =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  )

  useLayoutEffect(() => {
    Location.requestForegroundPermissionsAsync()

    let currentTheme = theme.colors[appearance]

    navigation.setOptions({
      title: localized('Home'),
      headerLeft: () => {
        return (
          <TouchableOpacity
            onPress={() => {
              if (!currentUser?.id) {
                navigation.navigate('DelayedLogin')
                return
              }
              navigation.navigate('MyProfile')
            }}>
            {currentUser?.profilePictureURL ? (
              <Image
                style={styles.userPhoto}
                contentFit={'cover'}
                source={{ uri: currentUser?.profilePictureURL }}
              />
            ) : (
              <Image
                style={styles.userPhoto}
                contentFit={'cover'}
                source={theme.icons.userAvatar}
              />
            )}
          </TouchableOpacity>
        )
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <HeaderButton
            customStyle={styles.composeButton}
            icon={theme.icons.compose}
            onPress={() => {
              if (!currentUser?.id) {
                navigation.navigate('DelayedLogin')
                return
              }
              onPressPost()
            }}
          />
          <HeaderButton
            customStyle={styles.mapButton}
            icon={theme.icons.map}
            onPress={() => {
              navigation.navigate('Map')
            }}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  }, [currentUser])

  const onBackButtonPressAndroid = () => {
    BackHandler.exitApp()
    return true
  }

  const onCategoriesUpdate = categoriesData => {
    console.log(categoriesData)
    setCategories(categoriesData)
  }

  const onListingsUpdate = listingsData => {
    const homeListingsLimit = 4
    setListings(listingsData.slice(0, homeListingsLimit))
    setAllListings(listingsData)
    setShowedAll(listingsData.length <= homeListingsLimit)
  }

  const onSavedListingsUpdate = savedListingdata => {
    dispatch(setFavoriteItems(savedListingdata))
    savedListingsUnsubscribe?.current && savedListingsUnsubscribe?.current()
  }

  const onPressPost = () => {
    setSelectedItem(null)
    setPostModalVisible(true)
  }

  const onPostCancel = () => {
    setPostModalVisible(false)
  }

  const onPressCategoryItem = item => {
    navigation.navigate('ListingsList', { item: item })
  }

  const onPressListingItem = item => {
    navigation.navigate('SingleListingScreen', {
      item: item,
      customLeft: true,
      routeName: 'Home',
    })
  }

  const onLongPressListingItem = async item => {
    if (!currentUser?.id) {
      navigation.navigate('DelayedLogin')
      return
    }
    if (item.authorID === currentUser?.id) {
      await setSelectedItem(item)
      showActionSheetWithOptions(
        {
          title: localized('Confirm'),
          options: [
            localized('Edit Listing'),
            localized('Remove Listing'),
            localized('Cancel'),
          ],
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
        },
        onLisingItemActionDone,
      )
    }
  }

  const onShowAll = () => {
    navigation.navigate('ListingsList', {
      item: {
        id: config.homeConfig.mainCategoryID,
        name: config.homeConfig.mainCategoryName,
      },
    })
  }

  const onPressSavedIcon = item => {
    if (!currentUser?.id) {
      navigation.navigate('DelayedLogin')
      return
    }
    listingsAPI.saveUnsaveListing(
      item,
      currentUser?.id,
      favorites,
      config.serverConfig.collections.savedListings,
      dispatch,
    )
  }

  const onLisingItemActionDone = index => {
    if (index == 0) {
      setPostModalVisible(true)
      console.log(index)
    }

    if (index == 1) {
      Alert.alert(
        localized('Delete Listing'),
        localized('Are you sure you want to remove this listing?'),
        [
          {
            text: localized('Yes'),
            onPress: removeListing,
            style: 'destructive',
          },
          { text: localized('No') },
        ],
        { cancelable: false },
      )
    }
  }

  const removeListing = () => {
    listingsAPI.removeListing(
      selectedItem.id,
      config.serverConfig.collections.listings,
      config.serverConfig.collections.savedListings,
      ({ success }) => {
        if (!success) {
          alert(
            localized(
              'There was an error deleting the listing. Please try again',
            ),
          )
        }
      },
    )
  }

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPressCategoryItem(item)}>
      <View style={styles.categoryItemContainer}>
        <Image style={styles.categoryItemPhoto} source={{ uri: item.photo }} />
        <Text style={styles.categoryItemTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderCategorySeparator = () => {
    return (
      <View
        style={{
          width: 10,
          height: '100%',
        }}
      />
    )
  }

  const renderListingItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressListingItem(item)}
        onLongPress={() => onLongPressListingItem(item)}>
        <View style={styles.listingItemContainer}>
          <Image style={styles.listingPhoto} source={{ uri: item.photo }} />
          <SavedButton
            style={styles.savedIcon}
            onPress={() => onPressSavedIcon(item)}
            isSaved={
              favorites && currentUser?.id && favorites[item.id] === true
            }
          />
          <Text style={{ ...styles.listingName, maxHeight: 40 }}>
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

  const renderListingFooter = () => {
    return (
      <Button
        containerStyle={styles.showAllButtonContainer}
        textStyle={styles.showAllButtonText}
        text={localized('Show all') + ' ' + allListings.length}
        onPress={() => onShowAll()}></Button>
    )
  }

  useEffect(() => {
    listingsUnsubscribe.current = listingsAPI.subscribeListings(
      { categoryId: config.homeConfig.mainCategoryID },
      favorites,
      config.serverConfig.collections.listings,
      onListingsUpdate,
    )
  }, [favorites])

  useEffect(() => {
    categoriesUnsubscribe.current = listingsAPI.subscribeListingCategories(
      config.serverConfig.collections.categories,
      onCategoriesUpdate,
    )

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
      categoriesUnsubscribe?.current && categoriesUnsubscribe?.current()
      listingsUnsubscribe?.current && listingsUnsubscribe?.current()
      savedListingsUnsubscribe?.current && savedListingsUnsubscribe?.current()
      didFocusSubscription.current && didFocusSubscription.current()
      willBlurSubscription.current && willBlurSubscription.current()
    }
  }, [])

  if (favorites === null || listings === null) {
    return <ActivityIndicator />
  }

  const renderListHeader = () => {
    return (
      <>
        <Text style={styles.title}>{localized('Categories')}</Text>
        <View style={styles.categories}>
          <FlatList
            horizontal={true}
            initialNumToRender={4}
            ItemSeparatorComponent={() => renderCategorySeparator()}
            data={categories}
            showsHorizontalScrollIndicator={false}
            renderItem={item => renderCategoryItem(item)}
            keyExtractor={item => `${item.id}`}
          />
        </View>
        <Text style={[styles.title, styles.listingTitle]}>
          {config.homeConfig.mainCategoryName}
        </Text>
      </>
    )
  }

  return (
    <>
      <FlatList
        style={styles.container}
        vertical
        showsVerticalScrollIndicator={false}
        ListFooterComponent={!showedAll ? renderListingFooter : ''}
        numColumns={2}
        data={listings}
        renderItem={renderListingItem}
        ListHeaderComponent={renderListHeader}
        keyExtractor={item => `${item.id}`}
      />

      {postModalVisible && (
        <PostModal
          selectedItem={selectedItem}
          categories={categories}
          onCancel={onPostCancel}
        />
      )}
    </>
  )
}

export default HomeScreen
