import React, { Component } from 'react'
import {
    View,
    Text,
} from 'react-native';


//* Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/action/index';

//*BottomTabNavigator
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

//*Screens
import Feed from './main/feed';
import Profile from './main/profile';

const EmptyScreen = () => {
    return null;
}

//*Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//!--
export class MainScreen extends Component {
    
    componentDidMount() {
        this.props.fetchUser();
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
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
