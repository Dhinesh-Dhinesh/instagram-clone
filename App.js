import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

//npms
//*StackNavigator
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//*Firebase
import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";

//configs for Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDh5kkIaAiv7vuF_ObexhSQEqOBGz6Kndc",
  authDomain: "fame-113df.firebaseapp.com",
  projectId: "fame-113df",
  storageBucket: "fame-113df.appspot.com",
  messagingSenderId: "483873648694",
  appId: "1:483873648694:web:cb30e49dea1a41f3e6e897",
  measurementId: "G-CNTDSKX8WC"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

//screens
import LandingScreen from './components/auth/landing';
import Register from './components/auth/register';
import Login from './components/auth/login';

//stack
const Stack = createStackNavigator();

//app
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
    }
  }

  componentDidMount() {

    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }

  render() {

    const {loggedIn, loaded} = this.state;
    
    if (!loaded) {
      return (
        <View style={{flex:1 , justifyContent:"center"}}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
        <Stack.Navigator inititalRouteName="Landing">
          <Stack.Screen options={{headerShown : false}} name="Landing" component={LandingScreen} />
          <Stack.Screen options={{headerShown : false}} name="Register" component={Register} />
          <Stack.Screen options={{headerShown : false}} name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
      );
    }

    return (
      <View>
        <Text>User is logged In</Text>
      </View>
    );
  }
}