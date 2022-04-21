import { setUid } from 'app/mainSlice';
import { FirebaseApp } from 'firebase/app';
import * as Auth from 'firebase/auth';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as S from './styles'

const ADMIN_EMAIL = 'admin@gmail.com'

const auth = () => Auth

export const Login = ({ fb }: { fb: FirebaseApp }) => {
  const authFB = auth().getAuth(fb)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const dispatch = useDispatch()

  const onSend = async () => {
    try {
      const res = await auth().signInWithEmailAndPassword(authFB, email, pass)
      if (res.user.email !== ADMIN_EMAIL) throw new Error('error')
      dispatch(setUid(res.user.uid))
    } catch (e) {
      alert('Incorrect email or password')
    }
  }

  return (
    <div style={S.WRAPPER}>
      <div>
        <input
          placeholder='Email'
          style={S.INPUT}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={S.INPUT2}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type='password'
          placeholder='Password'
        />
        <button style={S.BUTTON} onClick={onSend} >Login</button>
      </div>
    </div>
  );
}