import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await axios.post('/register', {
                name,
                email,
                password,
            });
            // Registration successful
            alert('Registration successful. Please log in.');
        } catch (error) {
            // Handle errors here if needed
            alert('Registration failed');
        }
    }

    return (
        <div className="grow flex items-center justify-around">
            <div className='mb-66'>
                <h1 className="text-4xl text-center mb-5">Register</h1>
                <form className='max-w-md mx-auto' onSubmit={registerUser}>
                    <input type="text" placeholder='Name' value={name} onChange={ev => setName(ev.target.value)} required />
                    <input type="email" placeholder='Email' value={email} onChange={ev => setEmail(ev.target.value)} required />
                    <input type="password" placeholder='Password' value={password} onChange={ev => setPassword(ev.target.value)} required />
                    <button className='primary'>Register</button>
                    <div className='text-center py-2 text-gray-500 justify-center'>
                        Already have an account? <Link to={'/login'} className='underline text-blue-500'>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
