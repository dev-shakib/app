import React, { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IMUserProfileComponent } from '../../core/profile'
import { logout, setUserData } from '../../core/onboarding/redux/auth'
import { useTheme, useTranslations } from '../../core/dopebase'
import { useConfig } from '../../config'
import { useAuth } from '../../core/onboarding/hooks/useAuth'

function MyProfileScreen(props) {
  const { navigation } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const config = useConfig()
  const authManager = useAuth()

  const currentUser = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  const onLogout = () => {
    authManager?.logout(currentUser)
    dispatch(logout())
    navigation.navigate('LoginStack')
  }

  const onUpdateUser = newUser => {
    dispatch(setUserData({ user: newUser }))
  }

  useLayoutEffect(() => {
    const currentTheme = theme.colors[appearance]
    navigation.setOptions({
      title: localized('My Profile'),
      headerTintColor: currentTheme.primaryForeground,
      headerTitleStyle: { color: currentTheme.primaryText },
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
        borderBottomColor: currentTheme.hairline,
      },
    })
  })

  var menuItems = [
    {
      title: localized('My Listings'),
      tintColor: '#baa3f3',
      icon: theme.icons.list,
      onPress: () => navigation.navigate('MyListingModal'),
    },
    {
      title: localized('My Favorites'),
      tintColor: '#df9292',
      icon: theme.icons.wishlistFilled,
      onPress: () => navigation.navigate('SavedListingModal'),
    },
    {
      title: localized('Account Details'),
      icon: theme.icons.accountDetail,
      tintColor: '#6b7be8',
      onPress: () =>
        navigation.navigate('AccountDetail', {
          form: config.editProfileFields,
          screenTitle: localized('Edit Profile'),
        }),
    },
    {
      title: localized('Settings'),
      icon: theme.icons.settings,
      tintColor: '#a6a4b1',
      onPress: () =>
        navigation.navigate('Settings', {
          form: config.userSettingsFields,
          screenTitle: localized('Settings'),
        }),
    },
    {
      title: localized('Contact Us'),
      icon: theme.icons.contactUs,
      tintColor: '#9ee19f',
      onPress: () =>
        navigation.navigate('Contact', {
          form: config.contactUsFields,
          screenTitle: localized('Contact us'),
        }),
    },
    {
      title: localized('Blocked Users'),
      icon: theme.icons.blockedUser,
      tintColor: '#9a91c4',
      onPress: () =>
        navigation.navigate('BlockedUsers', {
          screenTitle: localized('BlockedUsers'),
        }),
    },
  ]

  if (currentUser?.isAdmin) {
    menuItems.push({
      title: localized('Admin Dashboard'),
      tintColor: '#8aced8',
      icon: theme.icons.checklist,
      onPress: () => navigation.navigate('AdminDashboard'),
    })
  }

  return (
    <IMUserProfileComponent
      user={currentUser}
      onUpdateUser={user => onUpdateUser(user)}
      onLogout={() => onLogout()}
      menuItems={menuItems}
    />
  )
}

export default MyProfileScreen
