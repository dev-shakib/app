import React, { useState, useEffect } from 'react'
import { FlatList, View } from 'react-native'
import { useTheme } from '../../dopebase'
import ThreadItem from './ThreadItem'
import TypingIndicator from './TypingIndicator'
import dynamicStyles from './styles'

function MessageThread(props) {
  const {
    messages,
    user,
    onChatMediaPress,
    onSenderProfilePicturePress,
    onMessageLongPress,
    channelItem,
    onListEndReached,
    onChatUserItemPress,
  } = props
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [isParticipantTyping, setIsParticipantTyping] = useState(false)

  useEffect(() => {
    if (channelItem?.typingUsers) {
      getUsersTyping()
    }
  }, [channelItem])

  const getUsersTyping = () => {
    const userID = user.id || user.userID
    const typingUsers = channelItem.typingUsers?.filter(
      typingUser => typingUser.isTyping && typingUser.userID !== userID,
    )

    const { lastTypingDate } = channelItem
    const currentTime = Math.floor(new Date().getTime() / 1000)
    console.log('typingUsers', typingUsers)
    console.log('lastTypingDate', currentTime - lastTypingDate)
    if (typingUsers?.length > 0 && currentTime - lastTypingDate <= 300) {
      // if anyone has been typing in the last 3 seconds
      setIsParticipantTyping(true)
    } else {
      setIsParticipantTyping(false)
    }
  }

  const renderListHeaderComponent = () => {
    return (
      isParticipantTyping && (
        <View style={[styles.receiveItemContainer]}>
          <View style={styles.indicatorContainer}>
            <View style={styles.typingIndicatorContainer}>
              <TypingIndicator
                containerStyle={styles.indicatorDotContainer}
                dotRadius={5}
              />
            </View>
            <View style={styles.typingIndicatorContentSupport} />
            <View style={styles.typingIndicatorSupport} />
          </View>
        </View>
      )
    )
  }

  const renderChatItem = ({ item, index }) => {
    const isRecentItem = 0 === index
    return (
      <ThreadItem
        item={item}
        key={'chatitem' + (item.id || index)}
        user={{ ...user, userID: user.id }}
        onChatMediaPress={onChatMediaPress}
        onSenderProfilePicturePress={onSenderProfilePicturePress}
        onMessageLongPress={onMessageLongPress}
        isRecentItem={isRecentItem}
        onChatUserItemPress={onChatUserItemPress}
      />
    )
  }

  return (
    <FlatList
      inverted={true}
      vertical={true}
      style={styles.messageThreadContainer}
      showsVerticalScrollIndicator={false}
      data={messages}
      renderItem={renderChatItem}
      contentContainerStyle={styles.messageContentThreadContainer}
      removeClippedSubviews={true}
      ListHeaderComponent={() => renderListHeaderComponent()}
      keyboardShouldPersistTaps={'never'}
      onEndReached={onListEndReached}
      onEndReachedThreshold={0.3}
    />
  )
}

export default MessageThread
