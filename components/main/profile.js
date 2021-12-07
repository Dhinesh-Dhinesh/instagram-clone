import React,{ useState, useEffect} from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Button,
} from 'react-native';

import { connect } from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore');


function Profile(props) {
    const [userPosts , setUserPosts] = useState([]);
    const [user, setUser] = useState({});
    const [following, setFollowing] = useState(false);
    
    useEffect(()=>{
        const { currentUser , posts } = props;

        if(props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPosts(posts);
        }

        if(user == null) {
            return <View/>
        }

        else{
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })

                firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }
    },[props.route.params.uid , props.following])

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }
    
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={{fontSize:40}}>Profile</Text>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button
                                title="Following"
                                onPress={() => onUnfollow()}
                            />
                        ) : (
                            <Button
                                title="Follow"
                                onPress={() => onFollow()}
                            />
                        )}
                    </View>
                ) : (
                    <Button
                        title="Log out"
                        onPress={() => onLogout()}
                    />
                )}

            </View>

            <View style={styles.gallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: item.downloadUrl }}
                        />
                        </View>
                    )}

                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
    },
    info: {
        flex: 1,
        paddingLeft: 0,
        margin: 10,
    },
    gallery: {
        flex: 1,
        marginTop: -420
    },
    imageContainer: {
        flex: 1 / 3,
        
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        margin: 0.5,
    }
});

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps , null)(Profile);