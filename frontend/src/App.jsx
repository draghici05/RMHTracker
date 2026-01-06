import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import './App.css'
import Login from '../pages/login/login'
import Register from '../pages/register/register'
import Attendance from '../pages/attendance/attendance'


function App() {
  const [isAuthenticated, setIsAuthetincated] = useState(false);

  function handleLogin() {
    setIsAuthetincated(true);
  }

  function handleRegister() {
    setIsAuthetincated(true);
  }

  return (
    <Router>
      <div className='app'>
        {isAuthenticated && <Menu />}
        { <div className={`content ${isAuthenticated ? 'authenticated' : ''}`}>
          <Routes>
          {!isAuthenticated ? (
            <>
              <Route path='/login' element={<Login onLogin={handleLogin} />} />
              <Route path='/register' element={<Register onRegister={handleRegister} />} />
              <Route path='/' element={<Navigate to='/login' />} />
              <Route path='/attendance' element={<Attendance />} />
            </>
          ) : (
            <Route path='/' element={<Dashboard />} />
          )}
          </Routes>
        </div> }
      </div>
    </Router>
  )
}

export default App
