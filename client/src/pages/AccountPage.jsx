import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Navigate, useParams, Link } from 'react-router-dom'; // Import Link from react-router-dom
import axios from 'axios';
import PlacesPage from './PlacesPage';

const AccountPage = () => {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams(); // Declare subpage using let instead of const
    console.log(subpage);
    if (subpage === undefined) {
        subpage = 'profile';
    }
    if (!ready) {
        return 'Loading...';
    }
    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }
    async function logout() {
        await axios.post('/logout');
        setUser(null);
        //window.location.reload()
        setRedirect("/");
    }

    function linkedClasses(type = null) {
        let classes = 'inline-flex gap-1.5 py-2 px-6 rounded-full';
        if (type === subpage) {
            classes += ' bg-primary text-white';
        }
        else {
            classes += ' bg-gray-200';
        }
        return classes;
    }
    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div>
            <nav className='w-full justify-center flex mt-8 gap-2 mb-8'>
                <Link className={linkedClasses('profile')} to={'/account'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    MY PROFILE</Link>
                <Link className={linkedClasses('bookings')} to={'/account/bookings'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    MY BOOKING</Link>
                <Link className={linkedClasses('places')} to={'/account/places'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                    </svg>
                    MY ACCOMMODATION</Link>
            </nav>
            {
                subpage === 'profile' && (
                    <div className="text-center max-w-lg mx-auto">
                        Logged in as {user.name}:({user.email})
                        <button onClick={logout} className='primary max-w-sm mt-4'>Logout</button>
                    </div>
                )
            }
            {
                subpage === 'places' && (
                    <PlacesPage />
                )
            }
        </div>
    );
}

export default AccountPage;
