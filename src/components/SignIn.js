import firebase from 'firebase/compat/app'

export default function SignIn() {
  const auth = firebase.auth()
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <>
      <button className='sign-in' onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p className='warning-message'>Sign in to leave a message.</p>
    </>
  )
}
