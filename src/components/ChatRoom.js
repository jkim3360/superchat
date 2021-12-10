import { useState, useRef } from 'react'

import ChatMessage from './ChatMessage'

import firebase from 'firebase/compat/app'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export default function ChatRoom() {
    const firestore = firebase.firestore()
    const auth = firebase.auth()
    const dummy = useRef()
    const roomsRef = firestore
      .collection('rooms')
      .doc(
        '48BiKt8bOStJS6SM8CvL'
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
  