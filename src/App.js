import { useEffect } from 'react'
import SignIn from './components/SignIn'
import SignOut from './components/SignOut'
import Dashboard from './components/Dashboard'
import ChatRoom from './components/ChatRoom'
import close from './assets/close.png'
import './App.css'

// import firebase from 'firebase/compat/app';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyDzfXBtXZoFOJu8tJIia0dWrMnQSjs3Zhg',
  authDomain: 'superchat-bc96a.firebaseapp.com',
  projectId: 'superchat-bc96a',
  storageBucket: 'superchat-bc96a.appspot.com',
  messagingSenderId: '482861915960',
  appId: '1:482861915960:web:177cdac56527860b942bcd',
  measurementId: '${config.measurementId}'
})

const auth = firebase.auth()

function App() {
  const firestore = firebase.firestore()
  const [user] = useAuthState(auth)
  const usersRef = firestore.collection('users')

  const [users] = useCollectionData(usersRef, { idField: 'id' })
  // user?
  const addUser = async () => {
    try {
      const newUser = await usersRef.doc(user && user.uid).set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        user: user && user.uid
      })
      return newUser
    } catch (error) {
      console.error('User is not defined')
    }
  }

  useEffect(() => {
    addUser()
  }, [])

  const closeBtn = () => {
    window.parent.postMessage(
      {
        dest: 'daeho',
        message: 'close',
        state: false
      },
      '*'
    )
  }
  return (
    <div className='App'>
      <header>
        <h1>Chat</h1>
        {/* <SignOut /> */}
        <img className='close-btn' src={close} onClick={() => closeBtn()} />
      </header>

      {/* <Dashboard /> */}
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

export default App
