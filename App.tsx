/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Image, Platform, Text, useColorScheme, View} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, Provider} from 'react-native-paper';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import ColorCode from './src/utility/ColorCode';
import AndroidSplashScreen from './src/screens/splash/AndroidSplashScreen';
import WelcomeScreen from './src/screens/welcome/WelcomeScreen';
import StorageUtility from './src/utility/StorageUtility';
import LoginScreen from './src/screens/login/LoginScreen';
import SignupScreen from './src/screens/signup/SignupScreen';
import LoginAsScreen from './src/screens/login_as/LoginAsScreen';
import LinearGradient from 'react-native-linear-gradient';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import height from './src/Units/height';
import width from './src/Units/width';
import Fonts from './src/utility/Fonts';
import HomeTabScreen from './src/screens/dashboard/home/HomeTabScreen';
import AssignmentTabScreen from './src/screens/dashboard/assignments/AssignmentTabScreen';
import ProfileTabScreen from './src/screens/dashboard/profile/ProfileTabScreen';
import NoticeTabScreen from './src/screens/dashboard/notice/NoticeTabScreen';
import MyProgressScreen from './src/screens/my_progress/MyProgressScreen';
import MySyllabusScreen from './src/screens/my_syllabus/MySyllabusScreen';
import UploadAssignment1Screen from './src/screens/upload_assignment1/UploadAssignment1Screen';
import UploadAssignmentListScreen from './src/screens/upload_assignment/UploadAssignmentListScreen';
import SyllabusDetailScreen from './src/screens/SylabusDetail/SyllabusDetailScreen';
import NotificationScreen from './src/screens/Notification/Notification';

const AuthNav = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <AuthNav.Navigator>
      {Platform.OS == 'android' && (
        <AuthNav.Screen
          name="Splash"
          component={AndroidSplashScreen}
          options={{headerShown: false}}
        />
      )}
      <AuthNav.Screen
        name="Waiting"
        component={WaitingScreen}
        options={{headerShown: false}}
      />
      <AuthNav.Screen
        name="Intro"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <AuthNav.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthNav.Screen
        name="Signup"
        component={SignupScreen}
        options={{headerShown: false}}
      />
      <AuthNav.Screen
        name="LoginAs"
        component={LoginAsScreen}
        options={{headerShown: false}}
      />
    </AuthNav.Navigator>
  );
};

const TMBottomNav = createBottomTabNavigator();
function TabStack() {
  return (
    <TMBottomNav.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#008A3D',
        tabBarInactiveTintColor: '#4D4D4D',
        backgroundColor: '#dad',
        // tabBarBackground:{()=> {return backgroundColor:'#dad'}},
        tabBarStyle: {
          // backgroundColor: ColorCode.white,
          height: 8 * height,
          display: 'flex',
          paddingTop: 1 * width,
          paddingBottom: 2 * width,
          borderTopLeftRadius: 5 * width,
          borderTopRightRadius: 5 * width,
        },
        tabBarLabel: ({focused, color}) => {
          return (
            <Text
              style={{
                // color: focused ? ColorCode.textBlack : ColorCode.grey888,
                color: color,
                fontSize: focused ? 3 * width : 3 * width,
                fontWeight: focused ? '500' : '500',
                fontFamily: Fonts.Medium,
              }}>
              {route.name}
            </Text>
          );
        },
        tabBarIcon: ({focused, color, size}) => {
          let icon;
          if (route.name === 'Home') {
            icon = require('./src/assets/images/tab_home.png');
          } else if (route.name === 'Assignments') {
            icon = require('./src/assets/images/tab_assignments.png');
          } else if (route.name === 'Notice') {
            icon = require('./src/assets/images/tab_notice.png');
          } else if (route.name === 'Profile') {
            icon = require('./src/assets/images/tab_profile.png');
          }
          return (
            <Image
              source={icon}
              style={{
                tintColor: color,
                width: 5 * width,
                height: 5 * width,
                resizeMode: 'contain',
                marginTop: 2,
              }}
            />
          );
        },
        tabBarBackground: () => (
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#F0FFF7', '#F0FFF7', '#FFFFFF']}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              borderTopLeftRadius: 5 * width,
              borderTopRightRadius: 5 * width,
            }}
          />
        ),
      })}>
      <TMBottomNav.Screen
        name="Home"
        component={HomeTabScreen}
        options={{headerShown: false}}
      />
      <TMBottomNav.Screen
        name="Assignments"
        component={AssignmentTabScreen}
        options={{headerShown: false}}
      />
      <TMBottomNav.Screen
        name="Notice"
        component={NoticeTabScreen}
        options={{headerShown: false}}
      />
      <TMBottomNav.Screen
        name="Profile"
        component={ProfileTabScreen}
        options={{headerShown: false}}
      />
    </TMBottomNav.Navigator>
  );
}

const WaitingScreen = ({navigation}: {navigation: any}) => {
  useEffect(() => {
    console.log(Platform.OS);

    updateScreen();
  }, []);

  const updateScreen = async () => {
    const uu = await StorageUtility.getUser();
    // const ut = await StorageUtility.getUserType();

    if (uu) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'TabStack'}],
        }),
      );
    } else {
      const intro = await StorageUtility.getShowIntro();
      if (intro == '1') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Intro'}],
          }),
        );
      }
    }
  };

  return <View style={{flex: 1}} />;
};

const MainNav = createNativeStackNavigator();
const MainStack = () => {
  return (
    <MainNav.Navigator>
      <MainNav.Screen
        name="AuthStack"
        component={AuthStack}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="TabStack"
        component={TabStack}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="AssignmentList"
        component={UploadAssignmentListScreen}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="UploadAssignment"
        component={UploadAssignment1Screen}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="MyProgress"
        component={MyProgressScreen}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="MySyllabus"
        component={MySyllabusScreen}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="SyllabusDetail"
        component={SyllabusDetailScreen}
        options={{headerShown: false}}
      />
      <MainNav.Screen
        name="Notification"
        component={NotificationScreen}
        options={{headerShown: false}}
      />
    </MainNav.Navigator>
  );
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const getTheme = () => ({
    ...DefaultTheme,
    dark: isDarkMode,
    colors: {
      ...DefaultTheme.colors,
      primary: ColorCode.primary, //'#0285FB',
      accent: ColorCode.accent, //'#0285FB',
      error: ColorCode.red, //'#ED1C24',
    },
  });

  return (
    <Provider theme={getTheme()}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
