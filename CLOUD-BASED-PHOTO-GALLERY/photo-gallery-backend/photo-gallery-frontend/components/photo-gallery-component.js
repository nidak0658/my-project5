import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/photos/user123'); // Replace with dynamic user ID
        setPhotos(response.data);
      } catch (err) {
        console.error('Error fetching photos:', err);
      }
    };

    fetchPhotos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/photos/${id}`);
      setPhotos(photos.filter(photo => photo._id !== id));
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  return (
    <div>
      {photos.map(photo => (
        <div key={photo._id}>
          <img src={photo.url} alt={photo.description} width="200" />
          <p>{photo.description}</p>
          <button onClick={() => handleDelete(photo._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
