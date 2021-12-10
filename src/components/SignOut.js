import firebase from 'firebase/compat/app'

export default function SignOut() {
  const auth = firebase.auth()

  return (
    auth.currentUser && (
      <button className='sign-out' onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  )
}
