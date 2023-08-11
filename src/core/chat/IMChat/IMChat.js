import React, { useState, useRef, useEffect, useCallback } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import {
  useTheme,
  useTranslations,
  ActivityIndicator,
  TouchableIcon,
  MediaViewerModal,
  KeyboardAvoidingView,
} from '../../dopebase'
import DialogInput from 'react-native-dialog-input'
import { useChatChannels } from '../api/firebase/useChatChannels'
import BottomInput from './BottomInput'
import MessageThread from './MessageThread'
import dynamicStyles from './styles'
import { EU } from '../../mentions/IMRichTextInput/EditorUtils'

const reactionIcons = ['like', 'love', 'laugh', 'surprised', 'cry', 'angry']

const assets = {
  surprised: require('../assets/wow.png'),
  laugh: require('../assets/crylaugh.png'),
  cry: require('../assets/crying.png'),
  like: require('../assets/blue-like.png'),
  love: require('../assets/red-heart.png'),
  angry: require('../assets/anger.png'),
}

function IMChat(props) {
  const {
    onSendInput,
    onAudioRecordSend,
    messages,
    inputValue,
    onChangeTextInput,
    user,
    loading,
    inReplyToItem,
    onAddMediaPress,
    mediaItemURLs,
    isMediaViewerOpen,
    selectedMediaIndex,
    onChatMediaPress,
    onMediaClose,
    onChangeName,
    onAddDocPress,
    isRenameDialogVisible,
    showRenameDialog,
    onViewMembers,
    onLeave,
    onDeleteGroup,
    onSenderProfilePicturePress,
    onReplyActionPress,
    onReplyingToDismiss,
    onDeleteThreadItem,
    channelItem,
    onListEndReached,
    isInputClear,
    setIsInputClear,
    onChatUserItemPress,
    onReaction,
  } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const { updateTypingUsers } = useChatChannels()

  const [channel] = useState({})
  const [temporaryInReplyToItem, setTemporaryInReplyToItem] = useState(null)
  const [threadItemActionSheet, setThreadItemActionSheet] = useState({})
  const [isReactionsContainerVisible, setIsReactionsContainerVisible] =
    useState(false)

  // const photoUploadDialogRef = useRef()

  const hasPreviouslyMarkedTyping = useRef(false)
  const staleUserTyping = useRef(null)
  const textInputRef = useRef(null)

  const CANCEL = localized('Cancel')
  const REPLY = localized('Reply')
  const DELETE = localized('Delete')

  const mediaThreadItemSheetOptions = [
    CANCEL,
  ]

  const inBoundThreadItemSheetOptions = [
    REPLY,
  ]
  const outBoundThreadItemSheetOptions = [
    REPLY,
    DELETE,
  ]

  useEffect(() => {
    return () => {
      handleIsUserTyping('')
    }
  }, [])

  const handleIsUserTyping = inputValue => {
    clearTimeout(staleUserTyping.current)
    const userID = user.id
    const typingUsers = channelItem?.typingUsers || []
    const typingUsersCopy = [...typingUsers]
    const notTypingUser = {
      userID,
      isTyping: false,
    }
    const typingUser = {
      userID,
      isTyping: true,
    }
    let typingUserIndex = -1

    typingUserIndex = typingUsers.findIndex(
      existingTypingUser => existingTypingUser.userID === userID,
    )

    if (inputValue?.length > 0) {
      if (typingUserIndex > -1) {
        typingUsersCopy[typingUserIndex] = typingUser
      } else {
        typingUsersCopy.push(typingUser)
      }

      const channelID = channelItem?.channelID || channelItem?.id

      !hasPreviouslyMarkedTyping.current &&
        updateTypingUsers(channelID, typingUsersCopy)
      hasPreviouslyMarkedTyping.current = true
      return
    }

    if (inputValue?.length === 0) {
      if (typingUserIndex > -1) {
        typingUsersCopy[typingUserIndex] = notTypingUser
      } else {
        typingUsersCopy.push(notTypingUser)
      }

      const channelID = channelItem?.channelID || channelItem?.id

      hasPreviouslyMarkedTyping.current &&
        updateTypingUsers(channelID, typingUsersCopy)
      hasPreviouslyMarkedTyping.current = false
      return
    }
  }

  const handleStaleUserTyping = () => {
    staleUserTyping.current = setTimeout(() => {
      handleIsUserTyping('')
    }, 2000)
  }

  const onChangeText = useCallback(
    ({ displayText, text }) => {
      const mentions = EU.findMentions(text)
      onChangeTextInput({
        content: text,
        mentions,
      })
      handleIsUserTyping(displayText)
      handleStaleUserTyping()
    },
    [handleIsUserTyping, handleStaleUserTyping, onChangeTextInput],
  )

  const onAudioRecordDone = useCallback(
    item => {
      onAudioRecordSend(item)
    },
    [onAudioRecordSend],
  )

  const onSend = useCallback(() => {
    textInputRef.current.clear()
    onSendInput()
    handleIsUserTyping('')
  }, [onSendInput, handleIsUserTyping])

  const onMessageLongPress = useCallback(
    (threadItem, isMedia, reactionsPosition) => {
      setTemporaryInReplyToItem(threadItem)
      setIsReactionsContainerVisible(true)

      if (isMedia) {
        setThreadItemActionSheet({
          options: mediaThreadItemSheetOptions,
          reactionsPosition: reactionsPosition,
        })
      } else if (user.id === threadItem?.senderID) {
        setThreadItemActionSheet({
          inBound: false,
          options: outBoundThreadItemSheetOptions,
          reactionsPosition: reactionsPosition,
        })
      } else {
        setThreadItemActionSheet({
          inBound: true,
          options: inBoundThreadItemSheetOptions,
          reactionsPosition: reactionsPosition,
        })
      }
    },
    [setThreadItemActionSheet, setTemporaryInReplyToItem, user.id],
  )

  const onReplyPress = useCallback(
    index => {
      if (index === 0) {
        onReplyActionPress && onReplyActionPress(temporaryInReplyToItem)
      }
    },
    [onReplyActionPress, temporaryInReplyToItem],
  )

  const handleInBoundThreadItemActionSheet = useCallback(
    index => {
      if (index === inBoundThreadItemSheetOptions.indexOf(REPLY)) {
        return onReplyPress(index)
      }
    },
    [onReplyPress],
  )

  const handleOutBoundThreadItemActionSheet = useCallback(
    index => {
      if (index === outBoundThreadItemSheetOptions.indexOf(REPLY)) {
        return onReplyPress(index)
      }


      if (index === outBoundThreadItemSheetOptions.indexOf(DELETE)) {
        return onDeleteThreadItem && onDeleteThreadItem(temporaryInReplyToItem)
      }
    },
    [onDeleteThreadItem, onReplyPress],
  )


  const onThreadItemActionSheetDone = useCallback(
    index => {
      if (threadItemActionSheet.inBound !== undefined) {
        if (threadItemActionSheet.inBound) {
          handleInBoundThreadItemActionSheet(index)
        } else {
          handleOutBoundThreadItemActionSheet(index)
        }
      }
    },
    [threadItemActionSheet.inBound, handleInBoundThreadItemActionSheet],
  )


  const onReactionPress = async reaction => {
    // this was a reaction on the reactions tray, coming after a long press + one tap

    setIsReactionsContainerVisible(false)
    onReaction(reaction, temporaryInReplyToItem)
  }

  const renderReactionButtonIcon = (src, tappedIcon, index) => {
    return (
      <TouchableIcon
        key={index + 'icon'}
        containerStyle={styles.reactionIconContainer}
        iconSource={src}
        imageStyle={styles.reactionIcon}
        onPress={() => onReactionPress(tappedIcon)}
      />
    )
  }

  const renderReactionsContainer = () => {
    if (isReactionsContainerVisible) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setIsReactionsContainerVisible(false)
          }}
          style={styles.threadReactionContainer}>
          <View
            style={[
              styles.reactionContainer,
              { top: threadItemActionSheet?.reactionsPosition },
            ]}>
            {reactionIcons.map((icon, index) =>
              renderReactionButtonIcon(assets[icon], icon, index),
            )}
          </View>
        </TouchableOpacity>
      )
    }
    return null
  }

  const renderThreadItemActionSheet = () => {
    return (
      <View
        style={[
          styles.threadItemActionSheetContainer,
          styles.bottomContentContainer,
        ]}>
        {threadItemActionSheet?.options?.map((item, index) => {
          return (
            <TouchableOpacity
              key={item + index}
              onPress={() => {
                onThreadItemActionSheetDone(index)
                setIsReactionsContainerVisible(false)
              }}>
              <Text style={styles.threadItemActionSheetOptionsText}>
                {item}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.personalChatContainer}>
      <KeyboardAvoidingView style={styles.personalChatContainer}>
        <>
          <MessageThread
            messages={messages}
            user={user}
            onChatMediaPress={onChatMediaPress}
            onSenderProfilePicturePress={onSenderProfilePicturePress}
            onMessageLongPress={onMessageLongPress}
            channelItem={channelItem}
            onListEndReached={onListEndReached}
            onChatUserItemPress={onChatUserItemPress}
          />
          {renderReactionsContainer()}
          {!isReactionsContainerVisible && (
            <BottomInput
              textInputRef={textInputRef}
              value={inputValue}
              onAudioRecordDone={onAudioRecordDone}
              onChangeText={onChangeText}
              onSend={onSend}
              trackInteractive={true}
              onAddMediaPress={onAddMediaPress}
              onAddDocPress={onAddDocPress}
              inReplyToItem={inReplyToItem}
              onReplyingToDismiss={onReplyingToDismiss}
              participants={channelItem?.participants}
              clearInput={isInputClear}
              setClearInput={setIsInputClear}
              onChatUserItemPress={onChatUserItemPress}
            />
          )}
          {isReactionsContainerVisible && renderThreadItemActionSheet()}
        </>
      </KeyboardAvoidingView>
      <DialogInput
        isDialogVisible={isRenameDialogVisible}
        title={localized('Change Name')}
        hintInput={channel.name}
        textInputProps={{ selectTextOnFocus: true }}
        submitText={localized('OK')}
        submitInput={onChangeName}
        closeDialog={() => {
          showRenameDialog(false)
        }}
      />
      <MediaViewerModal
        mediaItems={mediaItemURLs}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />
      {loading && <ActivityIndicator />}
    </SafeAreaView>
  )
}

export default IMChat
