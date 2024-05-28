import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} =useContext(UserContext);
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post('/login', { email, password });
      setUser(data);
      //alert('Logged in!');\
      setRedirect(true);
    } catch (e) {
      alert('Wrong email or password');
      setRedirect(false);
    }
  }
  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <div className="grow flex items-center justify-around">
      <div className='mb-66'>
        <h1 className="text-4xl text-center mb-5">Login</h1>
        <form className='max-w-md mx-auto' onSubmit={handleLoginSubmit}>
          <input type="email" placeholder='please enter your email' value={email} onChange={ev => setEmail(ev.target.value)} />
          <input type="password" placeholder='please enter the password' value={password} onChange={ev => setPassword(ev.target.value)} />
          <button className='primary'>Login</button>
          <div className='text-center py-2 text-gray-500 justify-center'>
            Don't have an account yet?
            <Link to={'/register'} className='underline text-blue-500'>Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
