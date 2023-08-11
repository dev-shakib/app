import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native'
import { firebase } from '../../core/api/firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import { Image } from 'expo-image'
import StarRating from 'react-native-star-rating'
import {
  useTheme,
  useTranslations,
  useActionSheet,
  EmptyStateView,
} from '../../core/dopebase'
import SavedButton from '../SavedButton/SavedButton'
import PostModal from '../PostModal/PostModal'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

function MyListingModal(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()

  const favorites = useSelector(state => state.favorites.favoriteItems)
  const currentUser = useSelector(state => state.auth.user)

  const dispatch = useDispatch()
  const { navigation, route } = props
  const [listings, setListings] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [postModalVisible, setPostModalVisible] = useState(false)
  const [categories, setCategories] = useState([])

  const listingItemActionSheet = useRef(null)
  const categoriesUnsubscribe = useRef(null)
  const listingsUnsubscribe = useRef(null)
  const willBlurSubscription = useRef(null)

  const { showActionSheetWithOptions } = useActionSheet()

  useLayoutEffect(() => {
    let currentTheme = theme.colors[appearance]

    navigation.setOptions({
      title: localized('My Listings'),
      headerTintColor: currentTheme.primaryForeground,
      headerTitleStyle: { color: currentTheme.primaryText },
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  })

  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', payload =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  )

  const listingsRef = useRef(
    firebase.firestore().collection(config.serverConfig.collections.listings),
  )
  const categoriesRef = useRef(
    firebase.firestore().collection(config.serverConfig.collections.categories),
  )

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack()

    return true
  }

  const onCategoriesCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const category = doc.data()
      data.push({ ...category, id: doc.id })
    })
    setCategories(data)
  }

  const onListingsCollectionUpdate = querySnapshot => {
    const data = listings || []
    querySnapshot.forEach(doc => {
      const listing = doc.data()
      data.push({ ...listing, id: doc.id })
    })

    setListings(data)
  }

  const onPressListingItem = item => {
    props.navigation.navigate('MyListingDetailModal', { item })
  }

  const onLongPressListingItem = async item => {
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

  const onLisingItemActionDone = index => {
    if (index == 0) {
      setPostModalVisible(true)
    }

    if (index == 1) {
      Alert.alert(
        localized('Delete listing?'),
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
    firebase
      .firestore()
      .collection(config.serverConfig.collections.listings)
      .doc(selectedItem.id)
      .delete()
      .then(function () {
        const realEstateSavedQuery = firebase
          .firestore()
          .collection(config.serverConfig.collections.savedListings)
          .where('listingID', '==', selectedItem.id)
        realEstateSavedQuery.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete()
          })
        })
      })
      .catch(function (error) {
        console.log('Error deleting listing: ', error)
        alert(
          localized(
            'Oops! an error while deleting listing. Please try again later.',
          ),
        )
      })
  }

  const onPostCancel = () => {
    setPostModalVisible(false)
  }

  const onPressSavedIcon = item => {
    firebaseListing.saveUnsaveListing(
      item,
      currentUser?.id,
      favorites,
      config.serverConfig.collections.savedListings,
      dispatch,
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
    if (favorites && currentUser?.id) {
      listingsUnsubscribe.current = listingsRef.current
        .where('authorID', '==', currentUser?.id)
        .where('isApproved', '==', true)
        .onSnapshot(onListingsCollectionUpdate)
    }
  }, [favorites, currentUser])

  useEffect(() => {
    categoriesUnsubscribe.current = categoriesRef.current.onSnapshot(
      onCategoriesCollectionUpdate,
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
      didFocusSubscription.current && didFocusSubscription.current()
      willBlurSubscription.current && willBlurSubscription.current()
    }
  }, [])

  const onEmptyStatePress = () => {
    navigation.navigate('Home')
  }

  const emptyStateConfig = {
    title: localized('No Listings'),
    description: localized(
      'You did not add any listings yet. Add some listings and they will show up here.',
    ),
    callToAction: localized('Add Listing'),
    onPress: onEmptyStatePress,
  }

  return (
    <View style={styles.container}>
      {listings && listings.length > 0 && (
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item, index) => `${item?.id || index}`}
        />
      )}

      {listings && listings.length == 0 && (
        <View style={styles.emptyViewContainer}>
          <EmptyStateView emptyStateConfig={emptyStateConfig} />
        </View>
      )}

      {postModalVisible && (
        <PostModal
          selectedItem={selectedItem}
          categories={categories}
          onCancel={onPostCancel}
        />
      )}
    </View>
  )
}

export default MyListingModal
