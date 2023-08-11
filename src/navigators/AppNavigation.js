import React from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { useTheme, useTranslations } from '../core/dopebase'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import AdminDashboardScreen from '../screens/AdminDashboardScreen/AdminDashboardScreen'
import CategoryScreen from '../screens/CategoryScreen/CategoryScreen'
import SingleListingScreen from '../screens/SingleListingScreen/SingleListingScreen'
import ListingsListScreen from '../screens/ListingsListScreen/ListingsListScreen'
import MapScreen from '../screens/MapScreen/MapScreen'
import SavedListingScreen from '../screens/SavedListingScreen/SavedListingScreen'
import ConversationsScreen from '../screens/ConversationsScreen/ConversationsScreen'
import SearchScreen from '../screens/SearchScreen/SearchScreen'
import {
  LoadScreen,
  WalkthroughScreen,
  LoginScreen,
  WelcomeScreen,
  SignupScreen,
  SmsAuthenticationScreen,
  DelayedLoginScreen,
  ResetPasswordScreen,
} from '../core/onboarding'
import DrawerContainer from '../components/DrawerContainer/DrawerContainer'
import MyProfileScreen from '../components/MyProfileScreen/MyProfileScreen'
import MyListingModal from '../components/MyListingModal/MyListingModal'
import ListingProfileModal from '../components/ListingProfileModal/ListingProfileModal'
import { TabBarBuilder } from '../core/ui'
import { IMChatScreen } from '../core/chat'
import useNotificationOpenedApp from '../core/helpers/notificationOpenedApp'
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
  IMBlockedUsersScreen,
} from '../core/profile'
import { useConfig } from '../config'

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
})

const AuthStack = createStackNavigator()
const AppStack = createStackNavigator()
const Main = createStackNavigator()
// login stack
const LoginStack = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome">
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Welcome"
        component={WelcomeScreen}
      />
      <AuthStack.Screen
        options={{ headerStyle: authScreensStyles.headerStyle }}
        name="Login"
        component={LoginScreen}
      />
      <AuthStack.Screen
        options={{ headerStyle: authScreensStyles.headerStyle }}
        name="Signup"
        component={SignupScreen}
      />
      <AuthStack.Screen
        options={{ headerStyle: authScreensStyles.headerStyle }}
        name="Sms"
        component={SmsAuthenticationScreen}
      />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  )
}

const MainHomeStack = () => {
  const { theme, appearance } = useTheme()
  const currentTheme = theme.colors[appearance]

  return (
    <Main.Navigator
      screenOptions={{
        headerTintColor: currentTheme.primaryText,
        headerTitleAlign: 'center',
        headerMode: 'float',
      }}>
      <Main.Screen name="Home" component={HomeScreen} />
      <Main.Screen name="ListingsList" component={ListingsListScreen} />
      <Main.Screen name="SingleListingScreen" component={SingleListingScreen} />
      <Main.Screen name="Map" component={MapScreen} />
      <Main.Screen name="ListingProfileModal" component={ListingProfileModal} />
      <Main.Screen
        name="ListingProfileModalDetailsScreen"
        component={SingleListingScreen}
      />
    </Main.Navigator>
  )
}
const Home = createStackNavigator()
const HomeStack = () => {
  return (
    <Home.Navigator screenOptions={{ headerMode: 'float' }}>
      <Home.Screen
        options={{ headerShown: false }}
        name="Home"
        component={MainHomeStack}
      />
      <Home.Screen name="MyProfile" component={MyProfileScreen} />
      <Home.Screen name="MyListingModal" component={MyListingModal} />
      <Home.Screen name="Map" component={MapScreen} />
      <Home.Screen name="ListingProfileModal" component={ListingProfileModal} />
      <Home.Screen name="SavedListingModal" component={SavedListingScreen} />
      <Home.Screen
        name="MyListingDetailModal"
        component={SingleListingScreen}
      />
      <Home.Screen name="Contact" component={IMContactUsScreen} />
      <Home.Screen name="Settings" component={IMUserSettingsScreen} />
      <Home.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Home.Screen name="AccountDetail" component={IMEditProfileScreen} />
      <Home.Screen name="BlockedUsers" component={IMBlockedUsersScreen} />
    </Home.Navigator>
  )
}

const Collection = createStackNavigator()
const CollectionStack = () => {
  const { theme, appearance } = useTheme()
  const currentTheme = theme.colors[appearance]

  return (
    <Collection.Navigator
      screenOptions={{
        headerTintColor: currentTheme.primaryText,
        headerTitleAlign: 'center',
        headerMode: 'float',
      }}
      initialRouteName="Category">
      <Collection.Screen name="Category" component={CategoryScreen} />
      <Collection.Screen name="ListingsList" component={ListingsListScreen} />
      <Collection.Screen
        name="SingleListingScreen"
        component={SingleListingScreen}
      />
      <Collection.Screen
        name="ListingProfileModalDetailsScreen"
        component={SingleListingScreen}
      />
      <Collection.Screen
        name="ListingProfileModal"
        component={ListingProfileModal}
      />
      <Collection.Screen name="Map" component={MapScreen} />
    </Collection.Navigator>
  )
}

const Message = createStackNavigator()
const MessageStack = () => {
  const { theme, appearance } = useTheme()
  const currentTheme = theme.colors[appearance]

  return (
    <Message.Navigator
      screenOptions={{
        headerTintColor: currentTheme.primaryText,
        headerTitleAlign: 'center',
        headerMode: 'float',
      }}
      initialRouteName="Message">
      <Message.Screen name="Message" component={ConversationsScreen} />
    </Message.Navigator>
  )
}

const Search = createStackNavigator()
const SearchStack = () => {
  const { localized } = useTranslations()

  return (
    <Search.Navigator
      initialRouteName="Search"
      screenOptions={{ headerMode: 'float' }}>
      <Search.Screen name="Search" component={SearchScreen} />
      <Search.Screen
        options={{ headerTitle: localized('') }}
        name="SearchDetail"
        component={SingleListingScreen}
      />
      <Search.Screen
        name="ListingProfileModal"
        component={ListingProfileModal}
      />
      <Search.Screen
        name="ListingProfileModalDetailsScreen"
        component={SingleListingScreen}
      />
      <Search.Screen name="Map" component={MapScreen} />
    </Search.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const config = useConfig()
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <TabBarBuilder
          tabIcons={config.tabIcons}
          state={state}
          navigation={navigation}
        />
      )}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Categories" component={CollectionStack} />
      <Tab.Screen name="Messages" component={MessageStack} />
      <Tab.Screen name="Search" component={SearchStack} />
    </Tab.Navigator>
  )
}

const TabStack = createStackNavigator()

const MainTabStack = () => {
  return (
    <TabStack.Navigator>
      <TabStack.Screen
        options={{ headerShown: false }}
        name="TabStack"
        component={TabNavigator}
      />
    </TabStack.Navigator>
  )
}

// drawer stack
const Drawer = createDrawerNavigator()
const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      initialRouteName="Tab"
      drawerContent={({ navigation }) => {
        return <DrawerContainer navigation={navigation} />
      }}>
      <Drawer.Screen
        name="Tab"
        options={{ headerShown: false }}
        component={MainTabStack}
      />
    </Drawer.Navigator>
  )
}

const SideStack = createStackNavigator()
const MainNavigator = () => {
  return (
    <SideStack.Navigator
      initialRouteName="DrawerStack"
      transitionConfig={noTransitionConfig}>
      <SideStack.Screen
        options={{ headerShown: false }}
        name="DrawerStack"
        component={DrawerStack}
      />
    </SideStack.Navigator>
  )
}

const Stack = createStackNavigator()
const MainStackNavigator = () => {
  const { localized } = useTranslations()
  useNotificationOpenedApp()

  return (
    <Stack.Navigator
      screenOptions={{ headerMode: 'float' }}
      initialRouteName="NavStack">
      <Stack.Screen
        options={{ headerShown: false }}
        name={localized('Home')}
        component={MainNavigator}
      />
      <Stack.Screen
        options={{ headerBackTitle: localized('Messages') }}
        name="PersonalChat"
        component={IMChatScreen}
      />
    </Stack.Navigator>
  )
}

const DelayedStack = createStackNavigator()
const DelayedHomeStack = () => {
  return (
    <DelayedStack.Navigator screenOptions={{ presentation: 'modal' }}>
      <DelayedStack.Screen
        options={{
          headerShown: false,
        }}
        name="DelayedHome"
        component={MainStackNavigator}
      />
    </DelayedStack.Navigator>
  )
}

const RootStack = createStackNavigator()
const RootNavigator = () => {
  const { theme, appearance } = useTheme()
  const currentTheme = theme.colors[appearance]

  return (
    <RootStack.Navigator
      initialRouteName="LoadScreen"
      screenOptions={{ headerShown: false, animationEnabled: false }}
      headerMode="none">
      <RootStack.Screen
        options={{ headerShown: false }}
        name="LoadScreen"
        component={LoadScreen}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="Walkthrough"
        component={WalkthroughScreen}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="LoginStack"
        component={LoginStack}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="MainStack"
        component={MainStackNavigator}
      />
      <RootStack.Screen name="DelayedHome" component={DelayedHomeStack} />
      <RootStack.Screen
        options={{
          headerTintColor: currentTheme.primaryText,
          headerTitleAlign: 'center',
          animationEnabled: false,
        }}
        name="DelayedLogin"
        component={DelayedLoginScreen}
      />
    </RootStack.Navigator>
  )
}

const authScreensStyles = StyleSheet.create({
  headerStyle: {
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0, // remove shadow on Android
  },
})

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

export { RootNavigator, AppNavigator }
