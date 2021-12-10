import { useState, useRef } from 'react'

import ChatMessage from './ChatMessage'

import firebase from 'firebase/compat/app'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export default function ChatRoom({ rooms }) {
  const firestore = firebase.firestore()
  const auth = firebase.auth()
  const dummy = useRef()
  const roomsCollection = firestore.collection('rooms')
  const { uid, photoURL } = auth.currentUser



  let roomIds = useCollectionData(roomsCollection, { idField: 'id' })[0]

console.log(roomIds)

//   get all users in room
  const [users] = useCollectionData(
    roomsCollection.doc('dHakAIFWpGRNaOKNg2bb').collection('users'),
    { idField: 'id' }
  )

//   get all messages in room
  const [msgs] = useCollectionData(
    roomsCollection.doc('dHakAIFWpGRNaOKNg2bb').collection('messages'),
    { idField: 'id' }
  )

  console.log(users, msgs)

  const roomsRef = roomsCollection
    .doc('dHakAIFWpGRNaOKNg2bb')
    .collection('messages')

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
