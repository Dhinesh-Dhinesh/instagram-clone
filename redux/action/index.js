import {
    USER_STATE_CHANGE,
    USER_POST_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    USERS_LIKES_STATE_CHANGE,
    CLEAR_DATA
} from '../constants/index';

import firebase from 'firebase';
require('firebase/firestore');

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

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
            dispatch({
                type: USER_POST_STATE_CHANGE,
                posts : posts
            })
        })
    })
}

export function fetchUserFollowing(){
    return ((dispatch) => {
        firebase.firestore()
        .collection('following')
        .doc(firebase.auth().currentUser.uid)
        .collection('userFollowing')
        .onSnapshot((snapShot) => {
            let following = snapShot.docs.map((doc) => {
                const id = doc.id;
                return id;
            })
            dispatch({
                type: USER_FOLLOWING_STATE_CHANGE,
                following : following
            })
        })
    })
}

export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;

                        dispatch({ type: USERS_DATA_STATE_CHANGE, user : user });
                    }
                    else {
                        console.log('does not exist')
                    }
                })
                if(getPosts){
                    dispatch(fetchUsersFollowingPosts(uid));
                }
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                const uid = snapshot.query._.C_.path.segments[1]
                const user = getState().usersState.users.find(el => el.uid === uid);


                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data, user }
                })

                for(let i = 0; i< posts.length; i++){
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                }
                dispatch({ type: USERS_POSTS_STATE_CHANGE, posts : posts, uid : uid })

            })
    })
}

export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                const postId = snapshot.ZE.path.segments[3];

                let currentUserLike = false;
                if(snapshot.exists){
                    currentUserLike = true;
                }

                dispatch({ type: USERS_LIKES_STATE_CHANGE, postId : postId, currentUserLike : currentUserLike })
            })
    })
}