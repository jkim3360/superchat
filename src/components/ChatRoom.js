import { useState, useRef } from 'react'

import ChatMessage from './ChatMessage'

import firebase from 'firebase/compat/app'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export default function ChatRoom() {
  const firestore = firebase.firestore()
  const auth = firebase.auth()
  const { uid, photoURL } = auth.currentUser
  const roomsCollection = firestore.collection('rooms')
  const dummy = useRef()
  //   sort by most recent being last
  const [rooms] = useCollectionData(roomsCollection.orderBy('createdAt'), {
    idField: 'id'
  })
  const mostRecentRoom = rooms && rooms[rooms.length - 1].id
  console.log(mostRecentRoom)
  //   get all users in room
  const [users] = useCollectionData(
    roomsCollection.doc(mostRecentRoom).collection('users'),
    { idField: 'id' }
  )
  //   get all messages in room
  const [msgs] = useCollectionData(
    roomsCollection.doc(mostRecentRoom).collection('messages'),
    { idField: 'id' }
  )

  console.log(users, msgs, mostRecentRoom)

  const roomsRef = roomsCollection.doc(mostRecentRoom).collection('messages')
  const roomsQuery = roomsRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(roomsQuery, { idField: 'id' })
  const [formValue, setFormValue] = useState('')

  const sendMessage = async e => {
    e.preventDefault()

    await roomsRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
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
