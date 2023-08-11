import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native'
import { Image } from 'expo-image'
import {
  useActionSheet,
  useTheme,
  useTranslations,
  Button,
} from '../../core/dopebase'
import { listingsAPI } from '../../core/listing/api'
import { useDispatch, useSelector } from 'react-redux'
import SavedButton from '../../components/SavedButton/SavedButton'
import { Configuration } from '../../Configuration'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

function AdminDashboardScreen(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()

  const currentUser = useSelector(state => state.auth.user)
  const favorites = useSelector(state => state.favorites.favoriteItems)

  const dispatch = useDispatch()

  const [listings, setListings] = useState([])
  const [allListings, setAllListings] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showedAll, setShowedAll] = useState(false)
  const [loading, setLoading] = useState(true)

  const { showActionSheetWithOptions } = useActionSheet()

  const listingsUnsubscribe = useRef(null)
  const willBlurSubscription = useRef(null)
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', payload =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  )

  useLayoutEffect(() => {
    const currentTheme = theme.colors[appearance]

    props.navigation.setOptions({
      title: localized('Admin Dashboard'),
      headerTintColor: currentTheme.primaryForeground,
      headerTitleStyle: { color: currentTheme.primaryText },
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  }, [])

  useEffect(() => {
    listingsUnsubscribe.current = listingsAPI.subscribeToUnapprovedListings(
      config.serverConfig.collections.listings,
      onListingsCollectionUpdate,
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

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack()

    return true
  }

  const onListingsCollectionUpdate = listingsData => {
    for (let i = 0; i < listingsData.length; i++) {
      const listing = listingsData[i]
      if (favorites[listing.id] === true) {
        listing.saved = true
      } else {
        listing.saved = false
      }
    }

    setListings(listingsData.slice(0, Configuration.home.initial_show_count))
    setAllListings(listingsData)
    setLoading(false)
    setShowedAll(listingsData.length <= Configuration.home.initial_show_count)
  }

  const onPressListingItem = item => {
    props.navigation.navigate('MyListingDetailModal', {
      item: item,
    })
  }

  const onLongPressListingItem = async item => {
    await setSelectedItem(item)
    showActionSheetWithOptions(
      {
        title: localized('Confirm'),
        options: [
          localized('Approve'),
          localized('Delete'),
          localized('Cancel'),
        ],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      onLisingItemActionDone,
    )
  }

  const onShowAll = () => {
    setShowedAll(true)
    setListings(allListings)
  }

  const onLisingItemActionDone = index => {
    if (index === 0) {
      approveListing()
    }

    if (index == 1) {
      Alert.alert(
        'Delete Listing',
        'Are you sure you want to remove this listing?',
        [
          {
            text: 'Yes',
            onPress: removeListing,
            style: 'destructive',
          },
          { text: 'No' },
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
        if (success) {
          return
        }
        alert(localized('There was an error deleting listing!'))
      },
    )
  }

  const approveListing = () => {
    listingsAPI.approveListing(
      selectedItem.id,
      config.serverConfig.collections.listings,
      ({ success }) => {
        if (success) {
          alert('Listing successfully approved!')
          return
        }
        alert('Error approving listing!')
      },
    )
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
      <TouchableOpacity
        onPress={() => onPressListingItem(item)}
        onLongPress={() => onLongPressListingItem(item)}>
        <View style={styles.listingItemContainer}>
          <Image style={styles.listingPhoto} source={{ uri: item.photo }} />
          <SavedButton
            style={styles.savedIcon}
            onPress={() => onPressSavedIcon(item)}
            item={item}
          />
          <Text style={{ ...styles.listingName, maxHeight: 40 }}>
            {item.title}
          </Text>
          <Text style={styles.listingPlace}>{item.place}</Text>
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
        onPress={() => onShowAll()}
      />
    )
  }

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.mainContainer}
        size="small"
        color={theme.colors[appearance].primaryForeground}
      />
    )
  }

  return (
    <View style={styles.mainContainer}>
      {listings.length > 0 ? (
        <ScrollView style={styles.container}>
          <Text style={[styles.title, styles.listingTitle]}>
            {'Awaiting Approval'}
          </Text>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            ListFooterComponent={showedAll ? '' : renderListingFooter}
            numColumns={2}
            data={listings}
            renderItem={renderListingItem}
            keyExtractor={item => `${item.id}`}
          />
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.noMessage}>
            {localized('There are no listings awaiting approval.')}
          </Text>
        </View>
      )}
    </View>
  )
}

export default AdminDashboardScreen
