import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'
import { useTheme, useTranslations } from '../../core/dopebase'
import { useSelector } from 'react-redux'
import { IMConversationListView } from '../../core/chat'
import dynamicStyles from './styles'
import { DelayedLoginScreen } from '../../core/onboarding'

function ConversationsScreen(props) {
  const currentUser = useSelector(state => state.auth.user)

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { navigation } = props

  useLayoutEffect(() => {
    let currentTheme = theme.colors[appearance]

    navigation.setOptions({
      headerTitle: localized('Messages'),
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
      headerTintColor: currentTheme.primaryText,
    })
  }, [])

  const onEmptyStatePress = () => {
    navigation.navigate('Categories')
  }

  const emptyStateConfig = {
    title: localized('No Messages'),
    description: localized(
      'You can contact vendors by messaging them on the listings page. Your conversations with them will show up here.',
    ),
    buttonName: localized('Browse Listings'),
    onPress: () => {
      onEmptyStatePress()
    },
  }

  if (!currentUser?.id) {
    return <DelayedLoginScreen navigation={navigation} />
  }

  return (
    <View style={styles.container}>
      <IMConversationListView
        navigation={navigation}
        emptyStateConfig={emptyStateConfig}
      />
    </View>
  )
}

export default ConversationsScreen
