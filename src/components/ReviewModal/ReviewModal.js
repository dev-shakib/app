import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  View,
} from 'react-native'
import StarRating from 'react-native-star-rating'
import { useSelector } from 'react-redux'
import { useTheme, useTranslations, Button } from '../../core/dopebase'
import { reviewAPI } from '../../core/listing/api'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

function ReviewModal(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()

  const currentUser = useSelector(state => state.auth.user)

  const { listing, onCancel } = props

  const [content, setContent] = useState('')
  const [starCount, setStarCount] = useState(5)

  const onPostReview = () => {
    if (!content) {
      alert(localized('Please enter a review before submitting.'))
      return
    }

    const { onDone } = props

    reviewAPI.postReview(
      currentUser,
      listing,
      starCount,
      content,
      config.serverConfig.collections.reviews,
      config.serverConfig.collections.listings,
      ({ success }) => {
        if (success) {
          onDone()
          return
        }
        alert(error)
      },
    )
  }

  const onCancelModal = () => {
    onCancel && onCancel()
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      onRequestClose={onCancelModal}>
      <KeyboardAvoidingView behavior={'height'} style={styles.body}>
        <View style={styles.bar}>
          <Text style={styles.titleBar}>{localized('Add Review')}</Text>
          <Button
            containerStyle={{ ...styles.rightButton, paddingRight: 10 }}
            textStyle={styles.rightButtonText}
            onPress={onCancelModal}
            text={localized('Cancel')}></Button>
        </View>
        <View style={styles.bodyContainer}>
          <StarRating
            containerStyle={styles.starRatingContainer}
            disabled={false}
            maxStars={5}
            starSize={25}
            starStyle={styles.starStyle}
            selectedStar={rating => setStarCount(rating)}
            emptyStar={theme.icons.starNoFilled}
            halfStarColor={theme.colors[appearance].primaryForeground}
            fullStar={theme.icons.starFilled}
            rating={starCount}
          />
          <TextInput
            multiline={true}
            style={styles.input}
            onChangeText={text => setContent(text)}
            value={content}
            placeholder={localized('Start typing')}
            placeholderTextColor={theme.colors[appearance].grey6}
            underlineColorAndroid="transparent"
          />
          <Button
            containerStyle={styles.btnContainer}
            textStyle={styles.btnText}
            onPress={() => onPostReview()}
            text={localized('Add review')}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default ReviewModal
