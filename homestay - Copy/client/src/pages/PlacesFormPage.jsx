import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PlacesFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State variables
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]); // List of uploaded photo filenames
  const [photoLink, setPhotoLink] = useState(''); // For uploading by link
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState({
    wifi: false,
    freeParking: false,
    tv: false,
    pets: false,
    radio: false,
  });
  const [extraInfo, setExtraInfo] = useState('');
  const [checkin, setCheckIn] = useState('');
  const [checkout, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);

  // Fetch place details if editing (id exists)
  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`).then(response => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos || []); // Existing photos if any
      setDescription(data.description);
      setPerks(data.perks || {});
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkin);
      setCheckOut(data.checkout);
      setMaxGuests(data.maxGuests);
    });
  }, [id]);

  // Checkbox change handler
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPerks((prevPerks) => ({
      ...prevPerks,
      [name]: checked,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(); // For file uploads
    formData.append('title', title);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('perks', JSON.stringify(perks)); // Convert perks object to string
    formData.append('extraInfo', extraInfo);
    formData.append('checkin', checkin);
    formData.append('checkout', checkout);
    formData.append('maxGuests', maxGuests);

    // Handle existing and newly added photos
    if (id) {
      // Fetch existing photos for combining
      const existingPlace = await axios.get(`/places/${id}`);
      const existingPhotos = existingPlace.data.photos || [];
      const allPhotos = [...existingPhotos, ...addedPhotos]; // Combine arrays
      formData.append('photos', JSON.stringify(allPhotos)); // Convert to string
    } else {
      // Include all added photos for a new place
      formData.append('photos', JSON.stringify(addedPhotos));
    }

    try {
      if (id) {
        await axios.put(`/places/${id}`, formData, { withCredentials: true });
      } else {
        await axios.post('/places', formData, { withCredentials: true });
      }
      navigate('/account/places');
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Reset form after successful submission
  const resetForm = () => {
    setTitle('');
    setAddress('');
    setAddedPhotos([]);
    setPhotoLink('');
    setDescription('');
    setPerks({
      wifi: false,
      freeParking: false,
      tv: false,
      pets: false,
      radio: false,
    });
    setExtraInfo('');
    setCheckIn('');
    setCheckOut('');
    setMaxGuests(1);
  };


  const addPhotoByLink = async (e) => {
    e.preventDefault();
    try {
      const { data: filename } = await axios.post('/upload-by-link', { link: photoLink }, { withCredentials: true });
      setAddedPhotos((prevPhotos) => [...prevPhotos, filename]);
      setPhotoLink('');
    } catch (error) {
      console.error('Error uploading photo by link:', error);
    }
  };
  

  const uploadPhoto = async (ev) => {
    try {
      const files = ev.target.files;
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('photos', files[i]);
      }
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true, // Ensure cookies are sent
      });
      const { data: filenames } = response;
      setAddedPhotos(filenames); // Update state with filenames only
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };
  
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className='text-xl mt-4'>Title</h2>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h2 className='text-xl mt-4'>Address</h2>
        <input
          type='text'
          placeholder='Address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <h2 className='text-xl mt-4'>Photo</h2>
        <input
          type='text'
          placeholder='Add using a link...jpg'
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
        />
        <button type='button' onClick={addPhotoByLink}>
          Add Photo by Link
        </button>
        <div className='mt-2 w-full grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
          {addedPhotos.length > 0 &&
            addedPhotos.map((filename, index) => (
              <div className='h-32 flex' key={index}>
                <img
                  className='rounded-2xl w-full object-cover'
                  src={`http://localhost:4000/uploads/${filename}`}
                  alt={filename}
                />
              </div>
            ))}
          <label className='h-32 w-full cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-8 text-2xl text-gray-600'>
            <input
              type='file'
              multiple
              className='hidden'
              onChange={uploadPhoto}
            />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-8 h-8'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15' />
            </svg>
            Upload
          </label>
        </div>
        <h2 className='text-xl mt-4'>Description</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h2 className='text-xl mt-4'>Perks</h2>
        <div className='mt-3 grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
          {Object.entries(perks).map(([perk, isChecked]) => (
            <label key={perk} className='border p-4 flex rounded-2xl gap-3 items-center cursor-pointer'>
              <input
                type='checkbox'
                name={perk}
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span>{perk.toUpperCase()}</span>
            </label>
          ))}
        </div>
        <h2 className='text-xl mt-4'>Extra Info</h2>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
        <h2 className='text-xl mt-4'>Check In and Check Out Times, Max. Guests</h2>
        <div className='grid sm:grid-cols-3 gap-2'>
          <div>
            <h3 className='mt-2 -mb-1'>Check In Time</h3>
            <input
              type='text'
              placeholder='14:00'
              value={checkin}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <h3 className='mt-2 -mb-1'>Check Out Time</h3>
            <input
              type='text'
              placeholder='14:00'
              value={checkout}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <h3 className='mt-2 -mb-1'>Max. Guests</h3>
            <input
              type='number'
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button className='primary my-4'>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PlacesFormPage;
