import React from 'react'
import { ActivityIndicator, FlatList, Animated, View } from 'react-native'
import { useTheme } from '../../dopebase'
import IMMentionListItem from '../IMMentionListItem'
import dynamicStyles from './styles'

export default function IMMentionList(props) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const renderSuggestionsRow = ({ item, index }) => {
    return (
      <IMMentionListItem
        key={index.toString()}
        onSuggestionTap={props.onSuggestionTap}
        item={item}
        editorStyles={props.editorStyles}
      />
    )
  }

  const renderEmptyList = () => {
    if (list.length === 0) {
      return null
    }
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator />
      </View>
    )
  }

  const { keyword, isTrackingStarted } = props
  const withoutAtKeyword = keyword.toLowerCase().substr(1, keyword.length)
  const list = props.list
  const suggestions =
    withoutAtKeyword !== ''
      ? list.filter(user => user.name.toLowerCase().includes(withoutAtKeyword))
      : list
  if (!isTrackingStarted) {
    return null
  }

  return (
    <Animated.View
      style={[
        styles.usersMentionContainer,
        props.containerStyle,
        // props.editorStyles.mentionsListWrapper,
      ]}>
      <FlatList
        style={styles.usersMentionScrollContainer}
        keyboardShouldPersistTaps={'always'}
        horizontal={false}
        ListEmptyComponent={renderEmptyList()}
        enableEmptySections={true}
        data={suggestions}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={rowData => {
          return renderSuggestionsRow(rowData)
        }}
      />
    </Animated.View>
  )
}
