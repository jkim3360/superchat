import { useState } from 'react'

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
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className='App'>
      <header className='App-header'></header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return <button onClick={signInWithGoogle}>Sign in with Google</button>
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, { idField: 'id' })

  const [formValue, setFormValue] = useState('')

  const sendMessage = async e => {
    e.preventDefault()

    const { uid, photoUrl } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      // photoUrl: photoUrl ? photoUrl : ''
    })

    setFormValue('')
  }

  return (
    <>
      <div>
        {messages &&
          messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)} />
        <button></button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoUrl } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoUrl} />
      <p>{text}</p>
    </div>
  )
}

export default App
