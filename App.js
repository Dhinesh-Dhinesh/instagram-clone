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
import  firebase from 'firebase'

//*Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers/index';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

//*configs for Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDh5kkIaAiv7vuF_ObexhSQEqOBGz6Kndc",
  authDomain: "fame-113df.firebaseapp.com",
  projectId: "fame-113df",
  storageBucket: "fame-113df.appspot.com",
  messagingSenderId: "483873648694",
  appId: "1:483873648694:web:cb30e49dea1a41f3e6e897",
  measurementId: "G-CNTDSKX8WC"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

//*screens
import LandingScreen from './components/auth/landing';
import Register from './components/auth/register';
import Login from './components/auth/login';
import MainScreen from './components/main';
import Add from './components/main/add';
import Save from './components/main/save';

//*stack
const Stack = createStackNavigator();

//!app
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
    }
  }

  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
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
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator inititalRouteName="Landing">
            <Stack.Screen options={{ headerShown: false }} name="Main" component={MainScreen} />
            <Stack.Screen name="Add" component={Add} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={Save} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>  
    );
  }
}