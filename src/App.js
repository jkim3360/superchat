import SignIn from './components/SignIn'
import SignOut from './components/SignOut'
import Dashboard from './components/Dashboard'
import ChatRoom from './components/ChatRoom'
import './App.css'

// import firebase from 'firebase/compat/app';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'

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
  const [user] = useAuthState(auth)

  return (
    <div className='App'>
      <header>
        <h1>Chat</h1>
        <SignOut />
      </header>

      <Dashboard />
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

export default App
