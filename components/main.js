import React, { Component } from 'react'
import {
    View,
    Text,
} from 'react-native';


//*Firebase
import firebase from 'firebase';

//* Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser , fetchUserPosts } from '../redux/action/index';

//*BottomTabNavigator
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

//*Screens
import Feed from './main/feed';
import Profile from './main/profile';
import SearchScreen from './main/search';

const EmptyScreen = () => {
    return null;
}

//*Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//!--
export class MainScreen extends Component {
    
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }
    
    render() {
        const {currentUser} = this.props;
        
        if(currentUser == undefined) {
            return (
                <View></View>
            );
        }

        return (
            <Tab.Navigator initialRouteName='Feed' labeled={false}>
                <Tab.Screen name="Feed" component={Feed} 
                options={{
                    tabBarIcon: ({ color , size = 26 }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    )
                }}
                />
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size = 26}) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={size} />
                        ),
                }} />
                <Tab.Screen name="MainAdd" component={EmptyScreen}
                listeners={({ navigation }) => ({
                    tabPress: e => {
                        e.preventDefault();
                        navigation.navigate('Add');
                    }
                })}
                options={{
                    tabBarIcon: ({ color , size = 26 }) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={size} />
                    )
                }}
                />
                <Tab.Screen name="Profile" component={Profile}
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                }})}
                options={{
                    tabBarIcon: ({ color , size = 26 }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    )
                }}
                />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser , fetchUserPosts}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
