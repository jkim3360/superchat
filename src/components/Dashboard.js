import firebase from 'firebase/compat/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export default function Dashboard() {
  const firestore = firebase.firestore()
  const auth = firebase.auth()
  const roomsRef = firestore.collection('rooms')
  const [rooms] = useCollectionData(roomsRef, { idField: 'id' })
  //   const [currentRoom, setRoomId] = useState('Ij7qZG4ZOGY8QTboDX2O')
  const [user] = useAuthState(auth)

  return (
    <>
      {rooms &&
        rooms.map(room => {
          return room.id
        })}
      <button
        value='create room'
        onClick={async () => {
          const docRef = await roomsRef.add({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            users: [user.uid]
          })
          const docRef2 = await roomsRef.doc()
          const roomId = docRef.id
          const msgId = docRef2.id
          //   setRoomId(roomId)

          // create a users collection and store users
          await roomsRef.doc(roomId).collection('users').doc(user.uid).set({
            user: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL
          })

          // create a room document, a message collection in the room and a message
          await roomsRef.doc(roomId).collection('messages').doc(msgId).set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
        }}
      ></button>
    </>
  )
}
