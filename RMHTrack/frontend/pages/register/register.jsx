import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault();
        axios
            .post(`${url}${routeLink}/register`, { email, password, name })
            .then((res) => {
                toast.success('Account created successfully!');
                sleep(500).then(() => {
                    navigate('/login');
                });
            })
            .catch((err) => {
                toast.error(err.response.data);
            });
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
                    <button type='submit'>Register</button>
                </form>

            </div>
        </div>
    )
}

export default Register;