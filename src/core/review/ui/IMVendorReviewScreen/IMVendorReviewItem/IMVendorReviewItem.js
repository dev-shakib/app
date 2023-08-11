import React from 'react'
import moment from 'moment'
import { Image, View, Text } from 'react-native'
import { useTheme, IconButton } from '../../../../dopebase'
import dynamicStyles from './styles'

export default function IMVendorReviewItem({ singleReview }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const now = Date.now() / 1000
  const date = moment.unix(singleReview?.createdAt?.seconds ?? now)
  return (
    <View style={styles.reviewContainer}>
      <View style={[styles.horizontalPane, styles.pad]}>
        <View style={styles.horizontalPane}>
          <Image
            source={{ uri: singleReview.authorProfilePic }}
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.authorName}>{singleReview.authorName}</Text>
            <Text style={styles.date}>{date.format('MMMM Do YYYY')}</Text>
          </View>
        </View>

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map(item => (
            <IconButton
              source={
                item <= singleReview.rating
                  ? require('../../../assets/star-filled-icon.png')
                  : require('../../../assets/star-outlined-icon.png')
              }
              width={15}
              height={15}
              onPress={() => setRating(item)}
              tintColor={theme.colors[appearance].primaryForeground}
              style={styles.starStyle}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{singleReview.text}</Text>
    </View>
  )
}
