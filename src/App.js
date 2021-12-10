import { useState, useRef } from 'react'

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
var globalRoom

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className='App'>
      {/* <header>
        <h1>Chat</h1>
        <SignOut />
      </header> */}

      <Dashboard />
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <>
      <button className='sign-in' onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>
        Do not violate the community guidelines or you will be banned for life!
      </p>
    </>
  )
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className='sign-out' onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  )
}

function Dashboard() {
  const roomsRef = firestore.collection('rooms')
  const [rooms] = useCollectionData(roomsRef, { idField: 'id' })
  const [currentRoom, setRoomId] = useState('Ij7qZG4ZOGY8QTboDX2O');
  globalRoom = currentRoom

  console.log(rooms)
  return (
    <>
      {rooms &&
        rooms.map(room => {
          return room.id
        })}
      <button
        value='create room'
        onClick={() => {
          const docRef = roomsRef.doc()
          const docRef2 = roomsRef.doc()
          const roomId = docRef.id
          const msgId = docRef2.id
          setRoomId(roomId)
          // create a room document, a message collection in the room and a message 
          roomsRef.doc(roomId).collection('messages').doc(msgId).set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: ''
          })
        }}
      ></button>
    </>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const roomsRef = firestore
    .collection('rooms')
    .doc('xUnttl9tm1BDNGMa6H5B'
      //  || 'Ij7qZG4ZOGY8QTboDX2O'
       )
    .collection('messages')
  const roomsQuery = roomsRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(roomsQuery, { idField: 'id' })

  const [formValue, setFormValue] = useState('')

  const sendMessage = async e => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser

    await roomsRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })

    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main>
        {messages &&
          messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={e => setFormValue(e.target.value)}
          placeholder='say something nice'
        />

        <button type='submit' disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'
          }
        />
        <p>{text}</p>
      </div>
    </>
  )
}

export default App
