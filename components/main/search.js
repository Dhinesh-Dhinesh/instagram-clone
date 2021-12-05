import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
} from 'react-native'

import firebase from 'firebase';
require('firebase/firestore');

export default function SearchScreen(props) {
    const [users, setUsers] = useState([]);

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUsers(users);
            })
    }

    return (
        <View style={{ marginTop: 30 }}>
            <Text>Search</Text>
            <TextInput placeholder="Search"
                style={{ borderWidth: 2, height: 50, width: "90%", marginLeft: 15, marginTop: 15 }}
                onChangeText={(text) => fetchUsers(text)} />
            <Text style={{ fontSize: 30 }}>Users</Text>
            <View style={{ marginLeft: 20 }}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={users}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        onPress={() => props.navigation.navigate('Profile', { uid: item.id })}
                        
                        >
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
}
