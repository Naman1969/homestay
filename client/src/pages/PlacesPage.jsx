import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PlacesFormPage from './PlacesFormPage';
import AccountPage from './AccountPage';

const PlacesPage = () => {
  const { action } = useParams(); 
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/places')
      .then(({ data }) => {
        setPlaces(data);
      })
      .catch(error => {
        console.error('Error fetching places:', error);
      });
  }, [action]);

  return (
    <div>
      
      {action !== 'new' && (
        <div className='text-center'>
          <p>List of all added places</p>
          <Link to='/account/places/new' className='inline-flex gap-1.5 bg-primary text-white px-6 py-3 rounded-full'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Add new place
          </Link>
        </div>
      )}
      {action === 'new' && (
        <PlacesFormPage />
      )}
      <div className='mt-4'>
        {places.length > 0 && places.map((place) => (
          <Link to={'/account/places/' + place._id} key={place._id} className='flex gap-4 cursor-pointer bg-gray-200 p-4 rounded-2xl'>
            <div className='flex w-32 h-32 bg-gray-300 grow shrink-0'>
              {place.photos && place.photos.length > 0 && (
                <img className='object-cover' src={`http://localhost:4000/uploads/${place.photos[0]}`} alt='Place' />
              )}
            </div>
            <div className='grow-0 shrink'>
              <h2 className='text-xl'>{place.title}</h2>
              <p className='text-sm mt-2'>{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlacesPage;
