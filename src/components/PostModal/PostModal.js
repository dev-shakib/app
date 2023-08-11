import React, { useState, useRef, useEffect } from 'react'
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'
import Geolocation from '@react-native-community/geolocation'
import ModalSelector from 'react-native-modal-selector'
import { Image } from 'expo-image'
import { Configuration } from '../../Configuration'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Location from 'expo-location'
import FilterViewModal from '../FilterViewModal/FilterViewModal'
import SelectLocationModal from '../SelectLocationModal/SelectLocationModal'
import {
  useActionSheet,
  useTheme,
  useTranslations,
  ActivityIndicator,
  Button,
} from '../../core/dopebase'
import { storageAPI } from '../../core/media'
import { listingsAPI } from '../../core/listing/api'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

function PostModal(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()

  const { selectedItem, categories } = props
  const defaultState = {
    category: { name: localized('Select...') },
    title: '',
    description: '',
    location: {
      latitude: Configuration.map.origin.latitude,
      longitude: Configuration.map.origin.longitude,
    },
    localPhotos: [],
    photoUrls: [],
    price: '$1000',
    textInputValue: '',
    filter: {},
    filterValue: localized('Select...'),
    address: 'Checking...',
  }

  // if (categories.length > 0) category = categories[0];
  if (selectedItem) {
    const { title, latitude, longitude, photos, filters, place } = selectedItem

    defaultState.category = categories.find(
      category => selectedItem.categoryID === category.id,
    )
    defaultState.title = title
    defaultState.description = selectedItem.description
    defaultState.location = {
      latitude,
      longitude,
    }
    defaultState.localPhotos = photos
    defaultState.photoUrls = photos
    defaultState.price = selectedItem.price
    defaultState.filter = filters
    defaultState.address = place
  }

  const currentUser = useSelector(state => state.auth.user)

  const [category, setCategory] = useState(defaultState.category)
  const [description, setDescription] = useState(defaultState.description)
  const [title, setTitle] = useState(defaultState.title)
  const [location, setLocation] = useState(defaultState.location)
  const [localPhotos, setLocalPhotos] = useState(defaultState.localPhotos)
  const [photoUrls, setPhotoUrls] = useState(defaultState.photoUrls)
  const [price, setPrice] = useState(defaultState.price)
  const [textInputValue, setTextInputValue] = useState(
    defaultState.textInputValue,
  )
  const [filter, setFilter] = useState(defaultState.filter)
  const [filterValue, setFilterValue] = useState(defaultState.filterValue)
  const [address, setAddress] = useState(defaultState.address)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [locationModalVisible, setLocationModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const { showActionSheetWithOptions } = useActionSheet()

  const selectLocation = () => {
    setLocationModalVisible(true)
  }

  const onChangeLocation = async location => {
    try {
      if (!selectedItem) {
        let json = await Location.reverseGeocodeAsync(location)

        const choosenIndex = Math.floor(json.length * 0.8)
        const formatted_address = `${json[choosenIndex].city}, ${json[choosenIndex].region}.`

        setAddress(formatted_address)
      }
    } catch (error) {
      console.log(error)
      setAddress('Unknown')
    }
  }

  const setFilterString = value => {
    let newFilterValue = ''
    Object.keys(value).forEach(function (key) {
      if (value[key] != 'Any' && value[key] != 'All') {
        newFilterValue += ' ' + value[key]
      }
    })

    if (newFilterValue == '') {
      if (Object.keys(value).length > 0) {
        newFilterValue = 'Any'
      } else {
        newFilterValue = localized('Select...')
      }
    }

    setFilterValue(newFilterValue)
  }

  const onSelectLocationDone = newLocation => {
    setLocation(newLocation)
    setLocationModalVisible(false)
    onChangeLocation(newLocation)
  }

  const onSelectLocationCancel = () => {
    setLocationModalVisible(false)
  }

  const selectFilter = () => {
    if (!category.id) {
      alert(localized('You must choose a category first.'))
    } else {
      setFilterModalVisible(true)
    }
  }

  const onSelectFilterCancel = () => {
    setFilterModalVisible(false)
  }

  const onSelectFilterDone = newFilter => {
    setFilter(newFilter)
    setFilterModalVisible(false)
    setFilterString(newFilter)
  }

  const onPressAddPhotoBtn = () => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: localized('Select a photo'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        alert(response.error)
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        setLocalPhotos([...localPhotos, response])
      }
    })
  }

  const onCancel = () => {
    props.onCancel()
  }

  const onPost = () => {
    if (!title) {
      alert(localized('Title was not provided.'))
      return
    }
    if (!description) {
      alert(localized('Description was not set.'))
      return
    }
    if (!price) {
      alert(localized('Price is empty.'))
      return
    }
    if (localPhotos.length == 0) {
      alert(localized('Please choose at least one photo.'))
      return
    }

    if (Object.keys(filter).length == 0) {
      alert(localized('Please set the filters.'))
      return
    }
    setLoading(true)

    let photoUrls = []

    if (props.selectedItem) {
      photoUrls = [...props.selectedItem.photos]
    }

    const uploadPromiseArray = []
    localPhotos.forEach(file => {
      if (!file?.uri.startsWith('https://')) {
        uploadPromiseArray.push(
          new Promise((resolve, reject) => {
            storageAPI.processAndUploadMediaFile(file).then(response => {
              if (response.downloadURL) {
                photoUrls.push(response.downloadURL)
              }
              resolve()
            })
          }),
        )
      }
    })

    Promise.all(uploadPromiseArray)
      .then(values => {
        const newLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
        }
        const uploadObject = {
          isApproved: !config.isApprovalProcessEnabled,
          authorID: currentUser?.id,
          author: currentUser,
          categoryID: category?.id,
          description: description,
          latitude: location.latitude,
          longitude: location.longitude,
          filters: filter,
          title: title,
          price: price,
          place: address || 'San Francisco, CA',
          photo: photoUrls.length > 0 ? photoUrls[0] : null,
          photos: photoUrls,
          photoURLs: photoUrls,
        }
        listingsAPI.postListing(
          props.selectedItem,
          uploadObject,
          photoUrls,
          newLocation,
          config.serverConfig.collections.listings,
          ({ success }) => {
            if (success) {
              setLoading(false)
              onCancel()
            } else {
              alert(error)
            }
          },
        )
      })
      .catch(reason => {
        console.log(reason)
      })
  }

  const showActionSheet = async index => {
    await setSelectedPhotoIndex(index)
    showActionSheetWithOptions(
      {
        title: localized('Confirm to delete?'),
        options: [localized('Confirm'), localized('Cancel')],
        cancelButtonIndex: 1,
      },
      onActionDone,
    )
  }

  const onActionDone = index => {
    if (index == 0) {
      var array = [...localPhotos]
      array.splice(selectedPhotoIndex, 1)
      setLocalPhotos(array)
    }
  }

  useEffect(() => {
    setFilterString(filter)
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords)
        onChangeLocation(position.coords)
      },
      error => console.log(error.message),
    )
  }, [])

  var categoryData = categories.map((category, index) => ({
    key: category.id,
    label: category.name,
  }))
  categoryData.unshift({ key: 'section', label: 'Category', section: true })

  const photos = localPhotos.map((photo, index) => (
    <TouchableOpacity
      key={index.toString()}
      onPress={() => {
        showActionSheet(index)
      }}>
      <Image style={styles.photo} source={{ uri: photo?.uri }} />
    </TouchableOpacity>
  ))
  return (
    <Modal
      transparent
      presentationStyle="fullScreen"
      visible={props.isVisible}
      animationType="slide"
      onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors[appearance].primaryBackground,
        }}>
        <View style={[styles.bar, styles.navBarContainer]}>
          <Text style={styles.titleBar}>{localized('Add Listing')}</Text>
          <Button
            containerStyle={styles.rightButton}
            textStyle={styles.rightButtonText}
            onPress={onCancel}
            text={'Cancel'}
          />
        </View>
        <ScrollView style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{localized('Title')}</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={text => setTitle(text)}
              placeholder="Start typing"
              placeholderTextColor={theme.colors[appearance].grey6}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{localized('Description')}</Text>
            <TextInput
              multiline={true}
              numberOfLines={2}
              style={styles.input}
              onChangeText={text => setDescription(text)}
              value={description}
              placeholder="Start typing"
              placeholderTextColor={theme.colors[appearance].grey6}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.title}>{localized('Price')}</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={price}
                onChangeText={text => setPrice(text)}
                placeholderTextColor={theme.colors[appearance].grey6}
                underlineColorAndroid="transparent"
              />
            </View>
            <ModalSelector
              touchableActiveOpacity={0.9}
              data={categoryData}
              sectionTextStyle={styles.sectionTextStyle}
              optionTextStyle={styles.optionTextStyle}
              optionContainerStyle={styles.optionContainerStyle}
              cancelContainerStyle={styles.cancelContainerStyle}
              cancelTextStyle={styles.cancelTextStyle}
              selectedItemTextStyle={styles.selectedItemTextStyle}
              backdropPressToClose={true}
              cancelText={localized('Cancel')}
              initValue={category.name}
              onChange={option => {
                setCategory({ id: option.key, name: option.label })
                setFilterValue(
                  category.id === option.key
                    ? filterValue
                    : localized('Select...'),
                )
                setFilter(category.id === option.key ? filter : {})
              }}>
              <View style={styles.row}>
                <Text style={styles.title}>{localized('Category')}</Text>
                <Text style={styles.value}>{category.name}</Text>
              </View>
            </ModalSelector>
            <TouchableOpacity onPress={selectFilter}>
              <View style={styles.row}>
                <Text style={styles.title}>{localized('Filters')}</Text>
                <Text style={styles.value}>{filterValue}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={selectLocation}>
              <View style={styles.row}>
                <Text style={styles.title}>{localized('Location')}</Text>
                <View style={styles.location}>
                  <Text style={styles.value}>{address}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.addPhotoTitle}>{localized('Add Photos')}</Text>
            <ScrollView style={styles.photoList} horizontal={true}>
              {photos}
              <TouchableOpacity onPress={onPressAddPhotoBtn}>
                <View style={[styles.addButton, styles.photo]}>
                  <Icon name="camera" size={30} color="white" />
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
          {filterModalVisible && (
            <FilterViewModal
              value={filter}
              onCancel={onSelectFilterCancel}
              onDone={onSelectFilterDone}
              category={category}
            />
          )}
          {locationModalVisible && (
            <SelectLocationModal
              location={location}
              onCancel={onSelectLocationCancel}
              onDone={onSelectLocationDone}
            />
          )}
        </ScrollView>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button
            containerStyle={styles.addButtonContainer}
            onPress={onPost}
            textStyle={styles.addButtonText}
            text={localized('Add Listing')}
          />
        )}
      </View>
    </Modal>
  )
}

export default PostModal
