import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TextInput,
    StyleSheet,
} from 'react-native';

//npms
import firebase from 'firebase'

export class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.onSignIn = this.onSignIn.bind(this);
    }

    onSignIn() {
        const {email, password} = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    }

    render() {
        return (
            <View>
                <Text style={styles.login}>Login Page</Text>
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
                    onPress={()=> this.onSignIn()}  
                    title="Sign In"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    login: {
        fontSize: 30,
        textAlign: 'center',
    },
});

export default Login;