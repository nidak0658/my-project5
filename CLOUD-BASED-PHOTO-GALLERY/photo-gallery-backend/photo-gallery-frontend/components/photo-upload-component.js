import React, { useState } from 'react';
import axios from 'axios';

const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);
    formData.append('userId', 'user123'); // Replace with dynamic user ID

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      console.log('Uploaded:', response.data);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleUpload}>Upload Photo</button>
    </div>
  );
};

export default PhotoUpload;
