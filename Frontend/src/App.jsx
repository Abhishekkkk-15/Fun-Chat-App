import React, { useEffect } from 'react'
import { Routes ,Route, Navigate} from 'react-router-dom' 
import Navbar from './components/Navbar'
import HomePage from './components/pages/HomePage.jsx'
import SignUpPage from './components/pages/SignUpPage.jsx'
import LoginPage from './components/pages/LoginPage.jsx'
import SettingsPage from './components/pages/SettingsPage.jsx'
import ProfilePage from './components/pages/ProfilePage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'

function App() {  
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore()
  const {theme} = useThemeStore()
  console.log(onlineUsers)
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return (<div className='flex items-center justify-center h-screen'> 
      <Loader className='size-10 animate-spin'/>
    </div>)
  } 
  return (
   <div data-theme={theme}>
    <Navbar/>
      <Routes>
        <Route path='/' element={ authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> :<Navigate to="/"/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>
      <Toaster/>
   </div>
  )
}

export default App