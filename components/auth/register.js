import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TextInput,
} from 'react-native';

//npms
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: ''
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const auth = getAuth();
        const {email, password, name} = this.state;
        createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
            firebase.firestore().collection('users').doc(auth.currentUser.uid).set({
                name : name,
                email : email,
            });
        
            console.log(result)
        })
        .catch((err) => console.log(err));
    }

    render() {
        return (
            <View>
                <Text>Register</Text>
                <TextInput
                    placeholder="Name"
                    onChangeText={(name) => this.setState({name:name})}
                />
                <TextInput
                    placeholder="Email"
                    onChangeText={(name) => this.setState({email:name})}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(name) => this.setState({password : name})}
                />
                <Button
                    onPress={()=> this.onSignUp()}  
                    title="Sign Up"
                />
            </View>
        );
    }
}

export default Register;