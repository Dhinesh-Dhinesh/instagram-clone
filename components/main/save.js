import React,{useState} from 'react';
import {
    View,
    Image,
    TextInput,
    Button,
} from 'react-native';

//*Firebase
import firebase from 'firebase';
require("firebase/firestore");
require("firebase/firebase-storage");

export default function save(props) {
    const [caption, setCaption] = useState('');

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log("aaaaaaaaaaa " + snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadUrl) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadUrl: downloadUrl,
                caption: caption,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                props.navigation.popToTop();
            })
    }
    
    return (
        <View style={{flex:1}}>
            <Image style={{flex:1}} source={{uri : props.route.params.image}} resizeMode={'cover'}/>
            <TextInput
                pleaceholder="Write anything"
                onChangeText={(text) => setCaption(text)}
            />
            <Button title="Upload" onPress={()=> uploadImage()}/>
        </View>
    )
}
