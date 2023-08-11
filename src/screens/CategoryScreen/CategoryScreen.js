import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native'
import { Image } from 'expo-image'
import { useTheme, useTranslations, EmptyStateView } from '../../core/dopebase'
import { listingsAPI } from '../../core/listing/api'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

function CategoryScreen(props) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()
  const { localized } = useTranslations()

  const { navigation } = props
  const [data, setData] = useState([])

  const unsubscribe = useRef(null)
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
    let currentTheme = theme.colors[appearance]

    navigation.setOptions({
      title: 'Categories',
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  }, [])

  useEffect(() => {
    unsubscribe.current = listingsAPI.subscribeListingCategories(
      config.serverConfig.collections.categories,
      onCategoriesUpdate,
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
      unsubscribe?.current && unsubscribe?.current()
      didFocusSubscription.current && didFocusSubscription.current()
      willBlurSubscription.current && willBlurSubscription.current()
    }
  }, [])

  const onBackButtonPressAndroid = () => {
    BackHandler.exitApp()
    return true
  }

  const onCategoriesUpdate = categoriesData => {
    setData(categoriesData)
  }

  const onPress = item => {
    props.navigation.navigate('ListingsList', { item: item })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo }} />
        <View style={styles.overlay} />
        <Text numberOfLines={3} style={styles.title}>
          {item.name || item.title}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const emptyStateConfig = {
    title: localized('No Category Available'),
    description: localized(
      'There are currently no categories available. All types of categories will show up here.',
    ),
  }

  const renderEmptyComponent = () => {
    return (
      <EmptyStateView
        style={styles.emptyStateView}
        emptyStateConfig={emptyStateConfig}
      />
    )
  }

  return (
    <FlatList
      style={styles.flatContainer}
      vertical
      showsVerticalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      ListEmptyComponent={renderEmptyComponent}
    />
  )
}

export default CategoryScreen
