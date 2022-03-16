import React from 'react'
import { initializeApp } from 'firebase/app'
import { useSelector } from 'react-redux';
import './App.css'
import { Login } from './pages/login/login';
import { Main } from './pages/main/main';
import { main } from './selectors';

const firebaseConfig = {
  apiKey: "AIzaSyDE1Q6OfX4sKGMB6yd7FO-gobUmpZLhztk",
  authDomain: "happysneeze---app.firebaseapp.com",
  projectId: "happysneeze---app",
  storageBucket: "happysneeze---app.appspot.com",
  messagingSenderId: "85449359186",
  appId: "1:85449359186:web:d7db19ff804f86a8bd048b",
  measurementId: "G-C5K2HKJKSD"
}

const fb = initializeApp(firebaseConfig)

export default function App() {
  document.title = 'Happy Sneeze Admin'

  const uid: string | null = useSelector(main.uid)
  return (
    <>
      {uid ? <Main fb={fb}  /> : <Login fb={fb} />}
    </>
  );
}