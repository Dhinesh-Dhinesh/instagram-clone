import { USER_STATE_CHANGE } from '../constants/index';

import firebase from 'firebase/compat/app';

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