import { useState, useEffect, useRef } from 'react'

import ChatMessage from './ChatMessage'
import { BiMailSend } from 'react-icons/bi'

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

  // firebase
  //   .firestore()
  //   .collection('rooms')
  //   .get()
  //   .then(snapshot => snapshot.docs.map(doc => console.log(doc.data())))

  // firebase
  // .firestore()
  // .collection('events')
  // .get()
  // .then(snapshot => snapshot.docs.forEach(doc => console.log('snap shot: ',doc.data())))

  const mostRecentRoom = rooms && rooms[rooms.length - 1].id

  //   get all users in room
  const [users] = useCollectionData(
    roomsCollection
      .doc(
        // Ij7qZG4ZOGY8QTboDX2O
        mostRecentRoom
      )
      .collection('users'),
    { idField: 'id' }
  )
  //   get all messages in room
  const [msgs] = useCollectionData(
    roomsCollection
      .doc(
        // Ij7qZG4ZOGY8QTboDX2O
        mostRecentRoom
      )
      .collection('messages'),
    { idField: 'id' }
  )

  const roomsRef = roomsCollection
    .doc(
      // Ij7qZG4ZOGY8QTboDX2O
      mostRecentRoom
    )
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
          placeholder='New Message'
        />
        <button type='submit' disabled={!formValue}>
          <BiMailSend style={{ fontSize: '1.5rem' }} />
        </button>
      </form>
    </>
  )
}
