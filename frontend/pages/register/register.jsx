import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PARTICIPANT');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                'http://localhost:3000/api/auth/register',
                {
                    name, email, password, role
                }, { withCredentials: true }
            );
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className='register-page'>
            <div className='register-container'>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <div className='form-group'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password:</label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='role'>Role:</label>
                        <select
                            type='text'
                            id='role'
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="PARTICIPANT">Participant</option>
                            <option value="EO">Event Organizer</option>
                        </select>
                    </div>
                    <button type='submit' className='submit-btn'>Register</button>
                </form>
                <a href='/login' className='login-link'>Already have an account? Login</a>
            </div>
        </div>
    )
}

export default Register;