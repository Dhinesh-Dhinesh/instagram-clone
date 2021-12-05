import { USER_STATE_CHANGE , USER_POST_STATE_CHANGE} from '../constants/index';

import firebase from 'firebase';
require('firebase/firestore');

export function fetchUser(){
    return ((dispatch) => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapShot) => {
            if(snapShot.exists){
                dispatch({
                    type: USER_STATE_CHANGE,
                    currentUser: snapShot.data()    
                })
            }
            else {
                console.log("Dose not exist");
            }
        })
    })
}

export function fetchUserPosts(){
    return ((dispatch) => {
        firebase.firestore().collection('posts')
        .doc(firebase.auth().currentUser.uid)
        .collection('userPosts')
        .orderBy("creation" , "asc")
        .get()
        .then((snapShot) => {
            let posts = snapShot.docs.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id , ...data }
            })
            console.log(posts);
            dispatch({
                type: USER_POST_STATE_CHANGE,
                posts : posts
            })
        })
    })
}